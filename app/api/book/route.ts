import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getPrisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { isBookingSlotConflictError, publicBookingSchema } from "@/lib/bookingValidation";
import {
    enforceRateLimits,
    getClientIp,
    normalizeEmailIdentifier,
    validateHumanSubmission,
} from "@/lib/requestProtection";

function tooManyRequestsResponse(message: string, retryAfterSeconds: number) {
    return NextResponse.json(
        { message },
        {
            status: 429,
            headers: {
                "Retry-After": String(retryAfterSeconds),
            },
        },
    );
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { bookingData, protection } = publicBookingSchema.parse(body);

        const humanSubmission = validateHumanSubmission(protection, {
            minFillMs: 1500,
        });
        if (!humanSubmission.ok) {
            return NextResponse.json(
                { message: humanSubmission.message },
                { status: humanSubmission.status },
            );
        }

        const rateLimitResult = await enforceRateLimits([
            {
                scope: "booking",
                bucket: "ip",
                identifier: getClientIp(req),
                limit: 5,
                windowMs: 1000 * 60 * 15,
                blockMs: 1000 * 60 * 30,
            },
            {
                scope: "booking",
                bucket: "email",
                identifier: normalizeEmailIdentifier(bookingData.email),
                limit: 3,
                windowMs: 1000 * 60 * 60,
                blockMs: 1000 * 60 * 60,
            },
        ]);
        if (rateLimitResult) {
            return tooManyRequestsResponse(
                "Too many booking attempts. Please wait before trying again.",
                rateLimitResult.retryAfterSeconds,
            );
        }

        const prisma = getPrisma();
        await prisma.booking.create({
            data: {
                ...bookingData,
            },
        });

        let message = 'Booking received and confirmation email sent.';

        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);

                await resend.emails.send({
                    from: 'Rainforest Automotive <onboarding@resend.dev>',
                    to: bookingData.email,
                    subject: 'Booking Confirmation - Rainforest Automotive',
                    html: `
                        <h2>Booking Confirmation</h2>
                        <p>Thank you for booking with Rainforest Automotive. Here are your details:</p>
                        <ul>
                            <li><strong>Name:</strong> ${bookingData.name}</li>
                            <li><strong>Email:</strong> ${bookingData.email}</li>
                            <li><strong>Phone:</strong> ${bookingData.phone}</li>
                            <li><strong>Reason:</strong> ${bookingData.reason || 'N/A'}</li>
                            <li><strong>Make:</strong> ${bookingData.make || 'N/A'}</li>
                            <li><strong>Year:</strong> ${bookingData.year || 'N/A'}</li>
                            <li><strong>Model:</strong> ${bookingData.model || 'N/A'}</li>
                            <li><strong>Trim:</strong> ${bookingData.trim || 'N/A'}</li>
                            <li><strong>Problem Description:</strong> ${bookingData.problemDescription || 'N/A'}</li>
                            <li><strong>Date:</strong> ${bookingData.date || 'N/A'}</li>
                            <li><strong>Time:</strong> ${bookingData.time || 'N/A'}</li>
                            <li><strong>Additional Details:</strong> ${bookingData.additionalDetails || 'N/A'}</li>
                            <li><strong>Drop Off or Wait:</strong> ${bookingData.dropOffOrWait || 'N/A'}</li>
                        </ul>
                        <p>We look forward to servicing your vehicle!</p>
                    `,
                });

                if (process.env.ADMIN_NOTIFICATION_EMAIL) {
                    await resend.emails.send({
                        from: 'Rainforest Automotive <onboarding@resend.dev>',
                        to: process.env.ADMIN_NOTIFICATION_EMAIL,
                        subject: 'New Booking Notification - Rainforest Automotive',
                        html: `
                            <h2>New Booking Received.</h2>
                            <p>A new booking has been made. Here are the details:</p>
                            <ul>
                                <li><strong>Name:</strong> ${bookingData.name}</li>
                                <li><strong>Email:</strong> ${bookingData.email}</li>
                                <li><strong>Phone:</strong> ${bookingData.phone}</li>
                                <li><strong>Reason:</strong> ${bookingData.reason || 'N/A'}</li>
                                <li><strong>Make:</strong> ${bookingData.make || 'N/A'}</li>
                                <li><strong>Year:</strong> ${bookingData.year || 'N/A'}</li>
                                <li><strong>Model:</strong> ${bookingData.model || 'N/A'}</li>
                                <li><strong>Trim:</strong> ${bookingData.trim || 'N/A'}</li>
                                <li><strong>Problem Description:</strong> ${bookingData.problemDescription || 'N/A'}</li>
                                <li><strong>Date:</strong> ${bookingData.date || 'N/A'}</li>
                                <li><strong>Time:</strong> ${bookingData.time || 'N/A'}</li>
                                <li><strong>Additional Details:</strong> ${bookingData.additionalDetails || 'N/A'}</li>
                                <li><strong>Drop Off or Wait:</strong> ${bookingData.dropOffOrWait || 'N/A'}</li>
                            </ul>
                        `,
                    });
                }
            } catch (emailError) {
                console.error("Booking saved but confirmation email failed:", emailError);
                message = "Booking received, but we could not send the confirmation email.";
            }
        } else {
            message = "Booking received, but email notifications are not configured.";
        }

        return NextResponse.json(
            { message },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error in booking route:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation failed', errors: error.issues },
                { status: 400 }
            );
        }

        if (isBookingSlotConflictError(error)) {
            return NextResponse.json(
                { message: "Selected date and time are already booked. Please choose another slot." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: 'Internal server error.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await checkAdminSession();
        if (!session.authorized) {
            return NextResponse.json(
                { error: session.message },
                { status: session.status }
            );
        }

        const prisma = getPrisma();
        const bookings = await prisma.booking.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            bookings,
            count: bookings.length
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
