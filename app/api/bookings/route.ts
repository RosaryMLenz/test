import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ message: 'Date is required.' }, { status: 400 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { date },
            select: { time: true },
        });

        const bookedTimes = bookings.map((b) => b.time);

        return NextResponse.json({ bookedTimes }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching booked times.' }, { status: 500 });
    }
}
