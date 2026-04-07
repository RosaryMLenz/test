import { z } from "zod";

const BOOKING_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const BOOKING_TIME_PATTERN = /^\d{1,2}:\d{2} [AP]M$/;

const optionalTrimmedText = z.preprocess(
    (value) => {
        if (typeof value !== "string") {
            return value;
        }

        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().optional(),
);

const optionalBookingDate = z.preprocess(
    (value) => {
        if (typeof value !== "string") {
            return value;
        }

        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().regex(BOOKING_DATE_PATTERN).optional(),
);

const optionalBookingTime = z.preprocess(
    (value) => {
        if (typeof value !== "string") {
            return value;
        }

        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().regex(BOOKING_TIME_PATTERN).optional(),
);

export const publicBookingSchema = z
    .object({
        name: z.string().trim().min(1),
        email: z.string().trim().email(),
        phone: z.string().trim().min(10),
        reason: optionalTrimmedText,
        make: optionalTrimmedText,
        year: optionalTrimmedText,
        model: optionalTrimmedText,
        trim: optionalTrimmedText,
        problemDescription: optionalTrimmedText,
        date: z.string().trim().regex(BOOKING_DATE_PATTERN),
        time: z.string().trim().regex(BOOKING_TIME_PATTERN),
        additionalDetails: optionalTrimmedText,
        acceptTerms: z.boolean().refine((value) => value, {
            message: "Terms must be accepted.",
        }),
        enableNotifications: z.boolean(),
        dropOffOrWait: optionalTrimmedText,
        website: z.string().trim().max(0).optional().default(""),
        formStartedAt: z.union([z.string(), z.number()]).optional(),
    })
    .transform(({ website, formStartedAt, ...bookingData }) => ({
        bookingData,
        protection: {
            website,
            formStartedAt,
        },
    }));

export const adminBookingUpdateSchema = z.object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().min(10).optional(),
    reason: optionalTrimmedText,
    make: optionalTrimmedText,
    year: optionalTrimmedText,
    model: optionalTrimmedText,
    trim: optionalTrimmedText,
    problemDescription: optionalTrimmedText,
    date: optionalBookingDate,
    time: optionalBookingTime,
    additionalDetails: optionalTrimmedText,
    acceptTerms: z.boolean().optional(),
    enableNotifications: z.boolean().optional(),
    dropOffOrWait: optionalTrimmedText,
});

export function isBookingSlotConflictError(error: unknown): boolean {
    if (!error || typeof error !== "object" || !("code" in error)) {
        return false;
    }

    const knownError = error as { code?: string; meta?: { target?: unknown } };
    if (knownError.code !== "P2002") {
        return false;
    }

    const target = knownError.meta?.target;

    if (Array.isArray(target)) {
        return target.includes("date") && target.includes("time");
    }

    if (typeof target === "string") {
        return target.includes("Booking_date_time_key");
    }

    return false;
}
