// types/BookingFormData.ts

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    reason: string;
    make: string; // New
    year: string;
    model: string; // New
    trim: string; // New
    problemDescription: string;
    date: string;
    time: string;
    additionalDetails: string;
    acceptTerms: boolean;
    enableNotifications: boolean;
    dropOffOrWait: string;
    vehicle?: string; // Optional, can compute as `${make} ${model}` if needed
}

export interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    reason?: string | null;
    vehicle?: string | null;
    year?: string | null;
    problemDescription?: string | null;
    date?: string | null;
    time?: string | null;
    additionalDetails?: string | null;
    acceptTerms: boolean;
    enableNotifications: boolean;
    dropOffOrWait?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
