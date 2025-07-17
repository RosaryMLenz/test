// types/BookingFormData.ts

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    reason?: string | null;
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
}

export interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    reason?: string | null;
    make: string; // New
    year: string;
    model: string; // New
    trim: string; // New
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
