import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { inspectionPayloadSchema } from "@/lib/inspectionValidation";
import { getPrisma } from "@/lib/prisma";
import { allocateRepairOrderNumber } from "@/lib/repairOrderNumber";

function errorCode(error: unknown) {
    if (!error || typeof error !== "object" || !("code" in error)) return undefined;
    return (error as { code?: string }).code;
}

async function requireAdmin() {
    const session = await checkAdminSession();

    if (!session.authorized) {
        return {
            session,
            response: NextResponse.json({ error: session.message }, { status: session.status }),
        };
    }

    return { session, response: null };
}

export async function GET() {
    try {
        const { response } = await requireAdmin();
        if (response) return response;

        const prisma = getPrisma();
        const inspections = await prisma.vehicleInspection.findMany({
            orderBy: { updatedAt: "desc" },
            take: 250,
        });

        return NextResponse.json({ inspections, count: inspections.length });
    } catch (error) {
        console.error("GET /api/inspections failed:", error);
        return NextResponse.json({ error: "Failed to load inspections" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { response } = await requireAdmin();
        if (response) return response;

        const data = inspectionPayloadSchema.parse(await request.json());
        const prisma = getPrisma();
        const repairOrderNumber = data.repairOrderNumber || await allocateRepairOrderNumber();
        const inspectionYear = /^\d{4}-\d{2}-\d{2}$/.test(data.inspectionDate)
            ? data.inspectionDate.slice(0, 4)
            : String(new Date().getFullYear());
        const prefix = `RF21-${inspectionYear}-`;
        const existingCount = await prisma.vehicleInspection.count({
            where: { inspectionNumber: { startsWith: prefix } },
        });

        for (let offset = 1; offset <= 10; offset += 1) {
            const inspectionNumber = `${prefix}${String(existingCount + offset).padStart(4, "0")}`;

            try {
                const inspection = await prisma.vehicleInspection.create({
                    data: { ...data, repairOrderNumber, inspectionNumber },
                });

                return NextResponse.json({ inspection }, { status: 201 });
            } catch (error) {
                if (errorCode(error) !== "P2002") throw error;
            }
        }

        return NextResponse.json({ error: "Could not assign an inspection number" }, { status: 409 });
    } catch (error) {
        console.error("POST /api/inspections failed:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message ?? "Inspection details are invalid", details: error.issues },
                { status: 400 },
            );
        }

        return NextResponse.json({ error: "Failed to save inspection" }, { status: 500 });
    }
}
