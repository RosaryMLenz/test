import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (date) {
            // Public access: Fetch only booked times for the specific date
            const bookings = await prisma.booking.findMany({
                where: { date },
                select: { time: true },
            });

            const bookedTimes = bookings.map((b) => b.time).filter((t) => t);

            return NextResponse.json({ bookedTimes });
        } else {
            // Admin access: Fetch all bookings
            const auth = await checkAdminSession();

            if (!auth.authorized) {
                return NextResponse.json(
                    { error: auth.message },
                    { status: auth.status },
                );
            }

            const bookings = await prisma.booking.findMany({
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json({
                bookings,
                count: bookings.length,
            });
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
