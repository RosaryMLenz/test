import { getPrisma } from "@/lib/prisma";

export async function allocateRepairOrderNumber() {
    const prisma = getPrisma();
    const rows = await prisma.$queryRaw<Array<{ sequenceValue: bigint }>>`
        SELECT nextval('vehicle_repair_order_number_seq') AS "sequenceValue"
    `;
    const sequenceValue = rows[0]?.sequenceValue;

    if (sequenceValue === undefined) {
        throw new Error("Could not allocate a repair order number.");
    }

    const year = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
    }).format(new Date());

    return `RO-${year}-${sequenceValue.toString().padStart(5, "0")}`;
}
