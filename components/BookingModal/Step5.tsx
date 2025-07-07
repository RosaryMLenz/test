
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
        <div>
            <h2 className="text-xl font-semibold mb-2">
                {language === "en" ? "Step 5: Review Your Booking" : "Paso 5: Revisa Tu Reserva"}
            </h2>
            <p><strong>{language === "en" ? "Name:" : "Nombre:"}</strong> {formData.name}</p>
            <p><strong>{language === "en" ? "Phone:" : "Teléfono:"}</strong> {formData.phone}</p>
            <p><strong>{language === "en" ? "Reason:" : "Motivo:"}</strong> {formData.reason}</p>
            {formData.reason?.split(", ").includes('Car Problems') && (
                <p><strong>{language === "en" ? "Problem Description:" : "Descripción del Problema:"}</strong> {formData.problemDescription}</p>
            )}
            <p><strong>{language === "en" ? "Vehicle:" : "Vehículo:"}</strong> {formData.vehicle}</p>
            <p><strong>{language === "en" ? "Year:" : "Año:"}</strong> {formData.year}</p>
            <p><strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {formData.date}</p>
            <p><strong>{language === "en" ? "Time:" : "Hora:"}</strong> {formData.time}</p>
        </div>
    );
}
