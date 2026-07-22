import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { inspectionPayloadSchema } from "@/lib/inspectionValidation";
import { getPrisma } from "@/lib/prisma";
import { allocateRepairOrderNumber } from "@/lib/repairOrderNumber";

async function requireAdmin() {
    const session = await checkAdminSession();

    if (!session.authorized) {
        return NextResponse.json({ error: session.message }, { status: session.status });
    }

    return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const response = await requireAdmin();
        if (response) return response;

        const { id } = await params;
        const prisma = getPrisma();
        const inspection = await prisma.vehicleInspection.findUnique({ where: { id } });

        if (!inspection) {
            return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
        }

        return NextResponse.json({ inspection });
    } catch (error) {
        console.error("GET /api/inspections/[id] failed:", error);
        return NextResponse.json({ error: "Failed to load inspection" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const response = await requireAdmin();
        if (response) return response;

        const { id } = await params;
        const data = inspectionPayloadSchema.parse(await request.json());
        const prisma = getPrisma();
        const repairOrderNumber = data.repairOrderNumber || await allocateRepairOrderNumber();
        const inspection = await prisma.vehicleInspection.update({
            where: { id },
            data: { ...data, repairOrderNumber },
        });

        return NextResponse.json({ inspection });
    } catch (error) {
        console.error("PUT /api/inspections/[id] failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message ?? "Inspection details are invalid", details: error.issues },
                { status: 400 },
            );
        }

        if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2025") {
            return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const response = await requireAdmin();
        if (response) return response;

        const { id } = await params;
        const prisma = getPrisma();
        await prisma.vehicleInspection.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/inspections/[id] failed:", error);
        return NextResponse.json({ error: "Failed to delete inspection" }, { status: 500 });
    }
}
