import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { z } from "zod";
import { adminBookingUpdateSchema, isBookingSlotConflictError } from "@/lib/bookingValidation";

async function requireAdmin() {
    const session = await checkAdminSession();

    if (!session.authorized) {
        return NextResponse.json(
            { error: session.message },
            { status: session.status }
        );
    }

    return null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = await requireAdmin();
        if (unauthorized) {
            return unauthorized;
        }

        const { id } = await params;

        const prisma = getPrisma();
        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ booking });
    } catch (error) {
        console.error("GET /api/bookings/[id] failed:", error);
        return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = await requireAdmin();
        if (unauthorized) {
            return unauthorized;
        }

        const { id } = await params;

        const body = await req.json();
        const data = adminBookingUpdateSchema.parse(body);
        const prisma = getPrisma();
        const updated = await prisma.booking.update({
            where: { id },
            data,
        });

        return NextResponse.json({ booking: updated });
    } catch (error) {
        console.error("PUT /api/bookings/[id] failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 },
            );
        }

        if (isBookingSlotConflictError(error)) {
            return NextResponse.json(
                { error: "Selected date and time are already booked." },
                { status: 409 },
            );
        }

        if (
            error instanceof Error &&
            "code" in error &&
            (error as Error & { code?: string }).code === "P2025"
        ) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = await requireAdmin();
        if (unauthorized) {
            return unauthorized;
        }

        const { id } = await params;

        const prisma = getPrisma();
        await prisma.booking.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/bookings/[id] failed:", error);
        return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
}
