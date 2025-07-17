import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "@/types/BookingFormData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step3DropOff({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

    const options = [
        {
            key: "Drop off my vehicle",
            labelEn: "Drop off my vehicle",
            labelEs: "Dejar mi vehículo",
            descriptionEn: "Leave your car with us for the day.",
            descriptionEs: "Deja tu coche con nosotros durante el día.",
        },
        {
            key: "Wait at the shop",
            labelEn: "Wait at the shop",
            labelEs: "Esperar en el taller",
            descriptionEn: "Available.",
            descriptionEs: "Disponible.",
        },
    ];

    const handleOptionSelect = (option: string) => {
        setFormData((prev) => ({
            ...prev,
            dropOffOrWait: option,
        }));
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded bg-white dark:bg-neutral-900 p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                {language === "en"
                    ? "Vehicle Details & Drop Off or Wait"
                    : "Detalles del Vehículo y Dejar o Esperar"}
            </h2>

            {/* Vehicle Make and Model */}
            <div className="mb-4">
                <label
                    htmlFor="vehicle"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {language === "en"
                        ? "Vehicle Make and Model"
                        : "Marca y Modelo del Vehículo"}{" "}
                    *
                </label>
                <input
                    type="text"
                    id="vehicle"
                    placeholder={language === "en" ? "Toyota Camry" : "Toyota Camry"}
                    value={formData.make || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            vehicle: e.target.value,
                        }))
                    }
                    className="w-full border p-2 rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                    required
                />
            </div>

            {/* Year */}
            <div className="mb-4">
                <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {language === "en" ? "Year" : "Año"} *
                </label>
                <input
                    type="text"
                    id="year"
                    placeholder="2019"
                    value={formData.year || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            year: e.target.value,
                        }))
                    }
                    className="w-full border p-2 rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                    required
                />
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                {language === "en"
                    ? "Please select if you will drop off your vehicle or wait at the shop."
                    : "Por favor selecciona si dejarás tu vehículo o esperarás en el taller."}
            </p>

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
                            "p-3 border rounded-lg cursor-pointer mb-2 transition",
                            isSelected
                                ? "bg-blue-100 border-blue-500 dark:bg-blue-900"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        )}
                    >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {language === "en" ? labelEn : labelEs}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {language === "en" ? descriptionEn : descriptionEs}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
