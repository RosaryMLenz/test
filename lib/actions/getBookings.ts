// lib/actions/getBookings.ts

import { prisma } from "@/lib/prisma";
import { Booking } from "@/types/BookingFormData"; // Confirm your Booking type aligns with your Prisma model

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
