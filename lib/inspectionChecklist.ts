import type { InspectionItem } from "@/types/VehicleInspection";

export const INSPECTION_CATEGORIES = [
    {
        name: "Safety & road test",
        description: "Driver controls and vehicle behavior",
        items: [
            ["warning-lights", "Dash warning lights"],
            ["horn", "Horn"],
            ["seat-belts", "Seat belts"],
            ["parking-brake", "Parking brake"],
            ["wipers-washers", "Wipers & washers"],
            ["road-test", "Road test / drivability"],
        ],
    },
    {
        name: "Under hood",
        description: "Fluids, battery, belts and hoses",
        items: [
            ["engine-oil", "Engine oil level / condition"],
            ["coolant", "Coolant level / condition"],
            ["brake-fluid", "Brake fluid"],
            ["power-steering", "Power steering fluid"],
            ["transmission-fluid", "Transmission fluid"],
            ["battery", "Battery & charging system"],
            ["belts", "Drive belts"],
            ["hoses", "Cooling hoses"],
        ],
    },
    {
        name: "Tires & brakes",
        description: "Stopping performance and tire condition",
        items: [
            ["tire-fl", "Left front tire — tread / pressure"],
            ["tire-fr", "Right front tire — tread / pressure"],
            ["tire-rl", "Left rear tire — tread / pressure"],
            ["tire-rr", "Right rear tire — tread / pressure"],
            ["front-brakes", "Front brake pads / rotors"],
            ["rear-brakes", "Rear brake pads / rotors"],
            ["spare-tire", "Spare tire / inflator kit"],
        ],
    },
    {
        name: "Under vehicle",
        description: "Chassis, drivetrain and visible leaks",
        items: [
            ["steering", "Steering components"],
            ["suspension", "Suspension / ball joints"],
            ["shocks-struts", "Shocks & struts"],
            ["cv-axles", "CV boots / axles"],
            ["exhaust", "Exhaust system"],
            ["fluid-leaks", "Fluid leaks"],
            ["drivetrain", "Drivetrain / mounts"],
        ],
    },
    {
        name: "Exterior & interior",
        description: "Lighting, visibility and comfort systems",
        items: [
            ["headlights", "Headlights / high beams"],
            ["signal-lights", "Brake, turn & hazard lights"],
            ["glass-mirrors", "Glass & mirrors"],
            ["body", "Body / exterior condition"],
            ["hvac", "Heating & air conditioning"],
            ["cabin-filter", "Cabin air filter"],
            ["engine-filter", "Engine air filter"],
        ],
    },
] as const;

export function createInspectionItems(): InspectionItem[] {
    return INSPECTION_CATEGORIES.flatMap((category) =>
        category.items.map(([id, label]) => ({
            id,
            category: category.name,
            label,
            status: "uninspected" as const,
            notes: "",
        })),
    );
}
