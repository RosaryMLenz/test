import { NextResponse, NextRequest } from "next/server";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function GET() {
    const session = await checkAdminSession();

    if (!session.authorized || !session.user?.email) {
        return NextResponse.json(
            { error: session.message ?? "Unauthorized" },
            { status: session.status ?? 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { email: true },
    });

    if (!user) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ email: user.email });
}


export async function PUT(req: NextRequest) {
    const session = await checkAdminSession();

    if (!session.authorized || !session.user?.email) {
        return NextResponse.json(
            { message: session.message ?? "Unauthorized" },
            { status: session.status ?? 401 }
        );
    }

    try {
        const body = await req.json();
        const { email, password } = body;

        const updateData: { email?: string; password?: string } = {};

        if (email) updateData.email = email;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }


        await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        });

        return NextResponse.json({ message: "Account updated" }, { status: 200 });
    } catch (error) {
        console.error("PUT /api/admin/account error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}