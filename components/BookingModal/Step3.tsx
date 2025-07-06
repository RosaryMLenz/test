
import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "./BookingModal";
import { cn } from "@/lib/utils";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const options = [
    {
        key: "Drop off my vehicle",
        description: "Leave your car with us for the day.",
    },
    {
        key: "Wait at the shop",
        description: "Available.",
    },
];

export default function Step3({ formData, setFormData }: StepProps) {
    const handleOptionSelect = (option: string) => {
        setFormData((prev) => ({
            ...prev,
            dropOffOrWait: option,
        }));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                    Step 3: Vehicle Details
                </h2>

                <input
                    type="text"
                    placeholder="Vehicle Make and Model"
                    value={formData.vehicle || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            vehicle: e.target.value,
                        }))
                    }
                    className="border p-2 w-full rounded mb-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Year"
                    value={formData.year || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            year: e.target.value,
                        }))
                    }
                    className="border p-2 w-full rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                />

                <div className="mt-4">
                    {options.map(({ key, description }) => {
                        const isSelected = formData.dropOffOrWait === key;
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOptionSelect(key)}
                                onKeyDown={(e) => e.key === "Enter" && handleOptionSelect(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none mt-2",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="ml-1 flex flex-col">
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
