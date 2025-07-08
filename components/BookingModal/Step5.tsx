import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from "@/types/BookingFormData";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step5({ formData }: StepProps) {
    const { language } = useLanguage();

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded bg-white dark:bg-neutral-900 p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                {language === "en" ? "Step 5: Review Your Booking" : "Paso 5: Revisa Tu Reserva"}
            </h2>

            <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <p><strong>{language === "en" ? "Name:" : "Nombre:"}</strong> {formData.name || "-"}</p>
                <p><strong>{language === "en" ? "Phone:" : "Teléfono:"}</strong> {formData.phone || "-"}</p>
                <p><strong>{language === "en" ? "Reason:" : "Motivo:"}</strong> {formData.reason || "-"}</p>
                {formData.reason?.split(", ").includes('Car Problems') && (
                    <p><strong>{language === "en" ? "Problem Description:" : "Descripción del Problema:"}</strong> {formData.problemDescription || "-"}</p>
                )}
                <p><strong>{language === "en" ? "Vehicle:" : "Vehículo:"}</strong> {formData.vehicle || "-"}</p>
                <p><strong>{language === "en" ? "Year:" : "Año:"}</strong> {formData.year || "-"}</p>
                <p><strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {formData.date || "-"}</p>
                <p><strong>{language === "en" ? "Time:" : "Hora:"}</strong> {formData.time || "-"}</p>
                {formData.additionalDetails && (
                    <p><strong>{language === "en" ? "Additional Details:" : "Detalles Adicionales:"}</strong> {formData.additionalDetails}</p>
                )}
            </div>
        </div>
    );
}
