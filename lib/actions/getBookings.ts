import { getPrisma } from "@/lib/prisma";
import type { Booking } from "@/lib/generated/prisma/client";

export async function getBookings(): Promise<Booking[]> {
    try {
        const prisma = getPrisma();
        return await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}
