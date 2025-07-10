import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export async function GET() {
    try {
        const auth = await checkAdminSession();

        if (!auth.authorized) {
            return NextResponse.json(
                { error: auth.message },
                { status: auth.status }
            );
        }

        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            bookings,
            count: bookings.length,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
