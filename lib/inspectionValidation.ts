import { z } from "zod";

const optionalText = z.string().trim().max(4000).optional().default("");
const optionalShortText = (max: number) => z.string().trim().max(max).optional().default("");
const emailSchema = z.string().email("Enter a valid customer email.");

type MeaningfulInspectionContent = {
    bookingId?: string | null;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    year?: string;
    make?: string;
    model?: string;
    trim?: string;
    vin?: string;
    licensePlate?: string;
    mileage?: string;
    fuelLevel?: string;
    customerConcern?: string;
    roadTestNotes?: string;
    mechanicSummary?: string;
    recommendations?: string;
    items?: Array<{ status: string; notes?: string }>;
};

export function hasMeaningfulInspectionContent(data: MeaningfulInspectionContent) {
    if (data.bookingId) return true;

    const textFields = [
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.year,
        data.make,
        data.model,
        data.trim,
        data.vin,
        data.licensePlate,
        data.mileage,
        data.fuelLevel,
        data.customerConcern,
        data.roadTestNotes,
        data.mechanicSummary,
        data.recommendations,
    ];

    if (textFields.some((value) => value?.trim())) return true;

    return Boolean(data.items?.some((item) => item.status !== "uninspected" || item.notes?.trim()));
}

const inspectionItemSchema = z.object({
    id: z.string().trim().min(1).max(100),
    category: z.string().trim().min(1).max(100),
    label: z.string().trim().min(1).max(160),
    status: z.enum(["uninspected", "pass", "attention", "urgent", "na"]),
    notes: z.string().trim().max(500).default(""),
});

export const inspectionPayloadSchema = z.object({
    bookingId: z.string().trim().min(1).nullable().optional().default(null),
    status: z.enum(["draft", "completed"]),
    inspectionDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]),
    technicianName: optionalShortText(120),
    customerName: optionalShortText(160),
    customerEmail: optionalShortText(254),
    customerPhone: optionalShortText(40),
    year: z.string().trim().regex(/^\d{0,4}$/, "Vehicle year must contain up to 4 digits.").optional().default(""),
    make: optionalShortText(80),
    model: optionalShortText(100),
    trim: optionalShortText(100),
    vin: z.string().trim().toUpperCase().regex(/^[A-HJ-NPR-Z0-9]{0,17}$/, "VIN contains an invalid character.").optional().default(""),
    licensePlate: optionalShortText(20),
    mileage: optionalShortText(20),
    fuelLevel: optionalShortText(20),
    repairOrderNumber: optionalShortText(50),
    customerConcern: optionalText,
    roadTestNotes: optionalText,
    mechanicSummary: optionalText,
    recommendations: optionalText,
    overallRating: z.enum(["good", "attention", "urgent"]),
    items: z.array(inspectionItemSchema).min(1).max(100),
    certified: z.boolean(),
}).superRefine((data, context) => {
    if (data.status === "draft") {
        if (!hasMeaningfulInspectionContent(data)) {
            context.addIssue({
                code: "custom",
                path: ["status"],
                message: "Enter at least one customer, vehicle, or inspection detail before saving a draft.",
            });
        }
        return;
    }

    const requiredFields: Array<[string, string, keyof typeof data]> = [
        [data.customerName, "Customer name is required to complete the inspection.", "customerName"],
        [data.inspectionDate, "Inspection date is required to complete the inspection.", "inspectionDate"],
        [data.technicianName, "Technician name is required to complete the inspection.", "technicianName"],
        [data.year, "Vehicle year is required to complete the inspection.", "year"],
        [data.make, "Vehicle make is required to complete the inspection.", "make"],
        [data.model, "Vehicle model is required to complete the inspection.", "model"],
        [data.vin, "VIN is required to complete the inspection.", "vin"],
    ];

    requiredFields.forEach(([value, message, path]) => {
        if (!value.trim()) context.addIssue({ code: "custom", path: [path], message });
    });

    if (data.year && !/^\d{2,4}$/.test(data.year)) {
        context.addIssue({ code: "custom", path: ["year"], message: "Enter a valid vehicle year." });
    }

    if (data.vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(data.vin)) {
        context.addIssue({ code: "custom", path: ["vin"], message: "VIN must contain 17 valid characters." });
    }

    if (data.customerEmail && !emailSchema.safeParse(data.customerEmail).success) {
        context.addIssue({ code: "custom", path: ["customerEmail"], message: "Enter a valid customer email." });
    }

    if (!data.certified) {
        context.addIssue({ code: "custom", path: ["certified"], message: "Certification is required to complete the inspection." });
    }

    if (data.items.some((item) => item.status === "uninspected")) {
        context.addIssue({ code: "custom", path: ["items"], message: "Every checkpoint must be inspected or marked N/A." });
    }
});

export type ValidInspectionPayload = z.infer<typeof inspectionPayloadSchema>;
