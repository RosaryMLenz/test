export type InspectionItemStatus = "uninspected" | "pass" | "attention" | "urgent" | "na";
export type InspectionStatus = "draft" | "completed";
export type OverallRating = "good" | "attention" | "urgent";

export interface InspectionItem {
    id: string;
    category: string;
    label: string;
    status: InspectionItemStatus;
    notes: string;
}

export interface VehicleInspectionPayload {
    bookingId: string | null;
    status: InspectionStatus;
    inspectionDate: string;
    technicianName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    year: string;
    make: string;
    model: string;
    trim: string;
    vin: string;
    licensePlate: string;
    mileage: string;
    fuelLevel: string;
    repairOrderNumber: string;
    customerConcern: string;
    roadTestNotes: string;
    mechanicSummary: string;
    recommendations: string;
    overallRating: OverallRating;
    items: InspectionItem[];
    certified: boolean;
}

export interface VehicleInspection extends VehicleInspectionPayload {
    id: string;
    inspectionNumber: string;
    createdAt: string;
    updatedAt: string;
}
