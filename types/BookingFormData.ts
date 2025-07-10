// types/Booking.ts

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
}
