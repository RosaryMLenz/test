import { PrismaClient } from "@/lib/generated/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json({ message: "If your email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
        where: { email },
        data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await resend.emails.send({
        from: "Rainforest Automotive <noreply@rainforestautomotive.work>",
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    return NextResponse.json({ message: "If your email exists, a reset link has been sent." });
}
