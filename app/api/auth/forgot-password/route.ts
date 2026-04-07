import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
    enforceRateLimits,
    getClientIp,
    normalizeEmailIdentifier,
    validateHumanSubmission,
} from "@/lib/requestProtection";

const forgotPasswordSchema = z.object({
    email: z.string().trim().email(),
    website: z.string().trim().max(0).optional().default(""),
    formStartedAt: z.union([z.string(), z.number()]).optional(),
});

function tooManyRequestsResponse(message: string, retryAfterSeconds: number) {
    return NextResponse.json(
        { error: message },
        {
            status: 429,
            headers: {
                "Retry-After": String(retryAfterSeconds),
            },
        },
    );
}

export async function POST(req: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json(
                { error: "Password reset email service is not configured" },
                { status: 500 },
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const body = await req.json();
        const { email, website, formStartedAt } = forgotPasswordSchema.parse(body);

        const humanSubmission = validateHumanSubmission(
            { website, formStartedAt },
            { minFillMs: 1000 },
        );
        if (!humanSubmission.ok) {
            return NextResponse.json(
                { error: humanSubmission.message },
                { status: humanSubmission.status },
            );
        }

        const rateLimitResult = await enforceRateLimits([
            {
                scope: "forgot-password",
                bucket: "ip",
                identifier: getClientIp(req),
                limit: 5,
                windowMs: 1000 * 60 * 15,
                blockMs: 1000 * 60 * 30,
            },
            {
                scope: "forgot-password",
                bucket: "email",
                identifier: normalizeEmailIdentifier(email),
                limit: 3,
                windowMs: 1000 * 60 * 60,
                blockMs: 1000 * 60 * 60,
            },
        ]);
        if (rateLimitResult) {
            return tooManyRequestsResponse(
                "Too many reset requests. Please wait before trying again.",
                rateLimitResult.retryAfterSeconds,
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({
                message: "If your email exists, a reset link has been sent.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry: expiry },
        });

        const baseUrl =
            process.env.NEXTAUTH_URL?.replace(/\/$/, "") ??
            new URL(req.url).origin;
        const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

        await resend.emails.send({
            from: "Rainforest Automotive <noreply@rainforestautomotive.work>",
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
        });

        return NextResponse.json({
            message: "If your email exists, a reset link has been sent.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Please enter a valid email address." },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
