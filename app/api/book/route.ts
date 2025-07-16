import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@/lib/generated/prisma';
import { Resend } from 'resend';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const bookingSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    reason: z.string().optional(),
    make: z.string().optional(),
    year: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    problemDescription: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    additionalDetails: z.string().optional(),
    acceptTerms: z.boolean(),
    enableNotifications: z.boolean(),
    dropOffOrWait: z.string().optional(),
});

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json();
        const bookingData = bookingSchema.parse(body);

        console.log("📥 Booking data received:", bookingData);

        // ✅ Prevent double-booking
        if (bookingData.date && bookingData.time) {
            const existingBooking = await prisma.booking.findFirst({
                where: {
                    date: bookingData.date,
                    time: bookingData.time,
                },
            });

            if (existingBooking) {
                console.log("⚠️ Slot already booked:", bookingData.date, bookingData.time);
                return NextResponse.json(
                    { message: "Selected date and time are already booked. Please choose another slot." },
                    { status: 409 }
                );
            }
        }

        // ✅ Save booking (Prisma auto-populates createdAt in UTC)
        await prisma.booking.create({
            data: {
                ...bookingData,
            },
        });

        console.log("✅ Booking saved in database.");

        // ✅ Send confirmation email to user
        const userEmailResponse = await resend.emails.send({
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

        console.log("✅ User confirmation email response:", userEmailResponse);

        // Optional: Send notification to admin if needed
        if (process.env.ADMIN_NOTIFICATION_EMAIL) {
            const adminEmailResponse = await resend.emails.send({
                from: 'Rainforest Automotive <onboarding@resend.dev>',
                to: process.env.ADMIN_NOTIFICATION_EMAIL,
                subject: 'New Booking Notification - Rainforest Automotive',
                html: `
                    <h2>New Booking Received</h2>
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
            console.log("✅ Admin notification email response:", adminEmailResponse);
        }

        return NextResponse.json(
            { message: 'Booking received and confirmation email sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error in booking route:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation failed', errors: error.errors },
                { status: 400 }
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
        // Check if user is authenticated and is admin
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has admin role
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (user?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

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