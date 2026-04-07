import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from "@/types/BookingFormData";
import { useLanguage } from "@/context/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step5({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded bg-white dark:bg-neutral-900 p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                {language === "en" ? "Review Your Booking" : "Revisa Tu Reserva"}
            </h2>

            <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <p><strong>{language === "en" ? "Name:" : "Nombre:"}</strong> {formData.name || "-"}</p>
                <p><strong>{language === "en" ? "Email:" : "Correo:"}</strong> {formData.email || "-"}</p>
                <p><strong>{language === "en" ? "Phone:" : "Teléfono:"}</strong> {formData.phone || "-"}</p>
                <p><strong>{language === "en" ? "Reason:" : "Motivo:"}</strong> {formData.reason || "-"}</p>
                {formData.reason?.split(", ").includes('Car Problems') && (
                    <p><strong>{language === "en" ? "Problem Description:" : "Descripción del Problema:"}</strong> {formData.problemDescription || "-"}</p>
                )}
                <p><strong>{language === "en" ? "Make:" : "Marca:"}</strong> {formData.make || "-"}</p>
                <p><strong>{language === "en" ? "Year:" : "Año:"}</strong> {formData.year || "-"}</p>
                <p><strong>{language === "en" ? "Model:" : "Modelo:"}</strong> {formData.model || "-"}</p>
                <p><strong>{language === "en" ? "Trim:" : "Trim:"}</strong> {formData.trim || "-"}</p>
                <p><strong>{language === "en" ? "Drop Off or Wait:" : "Dejar o Esperar:"}</strong> {formData.dropOffOrWait || "-"}</p>
                <p><strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {formData.date || "-"}</p>
                <p><strong>{language === "en" ? "Time:" : "Hora:"}</strong> {formData.time || "-"}</p>
                {formData.additionalDetails && (
                    <p><strong>{language === "en" ? "Additional Details:" : "Detalles Adicionales:"}</strong> {formData.additionalDetails}</p>
                )}
            </div>

            <div className="mt-6 rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                                ...prev,
                                acceptTerms: checked === true,
                            }))
                        }
                        aria-describedby="acceptTermsDescription"
                        className="mt-1"
                    />
                    <label
                        htmlFor="acceptTerms"
                        className="text-sm font-medium leading-relaxed text-neutral-800 dark:text-neutral-200"
                    >
                        {language === "en"
                            ? "I agree to the terms of service."
                            : "Acepto los términos de servicio."}
                    </label>
                </div>
                <p
                    id="acceptTermsDescription"
                    className="mt-2 pl-7 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                >
                    {language === "en"
                        ? "Please review your booking details before submitting."
                        : "Por favor revisa los detalles de tu cita antes de enviarla."}
                </p>
            </div>
        </div>
    );
}
