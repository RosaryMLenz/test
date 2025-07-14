import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
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

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        const updated = await prisma.booking.update({
            where: { id: params.id },
            data,
        });

        return NextResponse.json({ booking: updated });
    } catch (error) {
        console.error("PUT /api/bookings/[id] failed:", error);
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.booking.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/bookings/[id] failed:", error);
        return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
}
