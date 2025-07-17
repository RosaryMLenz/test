import { prisma } from "@/lib/prisma";
import { Booking } from "@/lib/generated/prisma"; // 👈 This matches your `output` config

export async function getBookings(): Promise<Booking[]> {
    try {
        return await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}
