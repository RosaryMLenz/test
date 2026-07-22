import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { allocateRepairOrderNumber } from "@/lib/repairOrderNumber";

export async function POST() {
    try {
        const session = await checkAdminSession();

        if (!session.authorized) {
            return NextResponse.json({ error: session.message }, { status: session.status });
        }

        const repairOrderNumber = await allocateRepairOrderNumber();
        return NextResponse.json({ repairOrderNumber }, { status: 201 });
    } catch (error) {
        console.error("POST /api/inspections/repair-order failed:", error);
        return NextResponse.json({ error: "Failed to assign a repair order number" }, { status: 500 });
    }
}
