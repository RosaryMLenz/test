export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    reason?: string;
    vehicle?: string;
    year?: string;
    problemDescription?: string;
    date?: string;
    time?: string;
    photos?: FileList;
    additionalDetails?: string;
    acceptTerms: boolean;
    enableNotifications: boolean;
    dropOffOrWait: string;
}