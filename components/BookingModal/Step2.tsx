
import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "./BookingModal";
import { Car, Droplet, Wrench, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const servicesTop = [
    { key: "Car Problems", description: "Describe issues", icon: AlertCircle },
];

const servicesOther = [
    { key: "Oil Change", description: "Oil, Filter, Lube", icon: Droplet },
    { key: "AC Service", description: "Cooling system check", icon: Car },
    { key: "Brakes", description: "Check pads, rotors", icon: AlertCircle },
    { key: "Engine Diagnostics", description: "Full engine scan", icon: Car },
    { key: "Tire Rotation", description: "Balance and alignment", icon: Circle },
    { key: "Battery Check", description: "Test and inspect battery", icon: Car },
    { key: "Transmission Check", description: "Fluid and diagnostics", icon: Wrench },
    { key: "Suspension Check", description: "Shocks, struts", icon: Car },
    { key: "Fluid Check", description: "All essential fluids", icon: Car },
    { key: "Light Inspection", description: "Headlights, signals", icon: Car },
    { key: "Exhaust Check", description: "Emissions and leaks", icon: Car },
    { key: "Cooling System", description: "Radiator and hoses", icon: Car },
];

export default function Step2({ formData, setFormData }: StepProps) {
    const toggleService = (service: string) => {
        const currentServices = formData.reason?.split(", ").filter(Boolean) || [];
        const isSelected = currentServices.includes(service);

        const updatedServices = isSelected
            ? currentServices.filter((s) => s !== service)
            : [...currentServices, service];

        setFormData((prev) => ({
            ...prev,
            reason: updatedServices.join(", "),
        }));
    };

    const selectedServices = formData.reason?.split(", ").filter(Boolean) || [];

    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Step 2: Select Services
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    You may select multiple services you need for your vehicle.
                </p>

                <div className="my-6 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                    {/* Car Problems pinned at top */}
                    {servicesTop.map(({ key, description, icon: Icon }) => {
                        const isSelected = selectedServices.includes(key);
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleService(key)}
                                onKeyDown={(e) => e.key === "Enter" && toggleService(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-blue-600">
                                    <Icon size={28} />
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {key}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-300 dark:border-neutral-700 my-6" />

                    {/* Other services */}
                    {servicesOther.map(({ key, description, icon: Icon }) => {
                        const isSelected = selectedServices.includes(key);
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleService(key)}
                                onKeyDown={(e) => e.key === "Enter" && toggleService(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-blue-600">
                                    <Icon size={28} />
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {key}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
