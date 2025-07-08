import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "@/types/BookingFormData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const options = [
    {
        key: "Drop off my vehicle",
        labelEn: "Drop off my vehicle",
        labelEs: "Dejar mi vehículo",
        descriptionEn: "Leave your car with us for the day.",
        descriptionEs: "Deja tu coche con nosotros durante el día."
    },
    {
        key: "Wait at the shop",
        labelEn: "Wait at the shop",
        labelEs: "Esperar en el taller",
        descriptionEn: "Available.",
        descriptionEs: "Disponible."
    },
];

export default function Step3({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

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
                    {language === "en" ? "Step 3: Vehicle Details" : "Paso 3: Detalles del Vehículo"}
                </h2>

                <input
                    type="text"
                    placeholder={language === "en" ? "Vehicle Make and Model" : "Marca y Modelo del Vehículo"}
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
                    placeholder={language === "en" ? "Year" : "Año"}
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
                    {options.map(({ key, labelEn, labelEs, descriptionEn, descriptionEs }) => {
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
                                        {language === "en" ? labelEn : labelEs}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "en" ? descriptionEn : descriptionEs}
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
