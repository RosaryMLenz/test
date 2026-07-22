import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { enforceRateLimits, getClientIp } from "@/lib/requestProtection";

const resetPasswordSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/i),
    password: z.string().min(12).max(128),
});

export async function POST(req: Request) {
    try {
        const { token, password } = resetPasswordSchema.parse(await req.json());

        const rateLimit = await enforceRateLimits([
            {
                scope: "reset-password",
                bucket: "ip",
                identifier: getClientIp(req),
                limit: 10,
                windowMs: 1000 * 60 * 15,
                blockMs: 1000 * 60 * 30,
            },
            {
                scope: "reset-password",
                bucket: "token",
                identifier: token,
                limit: 5,
                windowMs: 1000 * 60 * 15,
                blockMs: 1000 * 60 * 30,
            },
        ]);

        if (rateLimit) {
            return NextResponse.json(
                { error: "Too many reset attempts. Please wait before trying again." },
                { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
            );
        }

        const storedToken = crypto.createHash("sha256").update(token).digest("hex");

        const prisma = getPrisma();
        const user = await prisma.user.findFirst({
            where: {
                resetToken: storedToken,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Use a valid reset link and a password of at least 12 characters." },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
