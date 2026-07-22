/* Fixed BookingModal.tsx with consistent totalSteps, clean hasCarProblems computation, removed unused onNext, added ARIA for accessibility, cleanup on modal close, loader on submit, and optional enhancements for clarity */

"use client";

import { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step3CarProblems from './Step3CarProblems';
import Step4 from './Step4';
import Step5 from './Step5';
import Done from './Done';
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { BookingFormData } from "@/types/BookingFormData";
import { X } from "lucide-react";

interface BookingModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

function createInitialFormData(): BookingFormData {
    return {
        name: "",
        email: "",
        phone: "",
        reason: "",
        make: "",
        year: "",
        model: "",
        trim: "",
        problemDescription: "",
        date: "",
        time: "",
        additionalDetails: "",
        acceptTerms: false,
        enableNotifications: false,
        dropOffOrWait: "",
        website: "",
        formStartedAt: Date.now().toString(),
    };
}

export default function BookingModal({ isOpen, onCloseAction }: BookingModalProps) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<BookingFormData>(createInitialFormData);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { language, toggleLanguage } = useLanguage();

    const hasCarProblems = formData.reason?.split(", ").includes("Car Problems");
    const totalSteps = hasCarProblems ? 7 : 6;

    const validateStep1 = (): boolean => {
        const name = formData.name.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(language === "en" ? "Please enter a valid email address." : "Por favor ingresa un correo electrónico válido.");
            return false;
        }

        const validCharsRegex = /^[0-9+\s\-().]+$/;
        if (!validCharsRegex.test(phone)) {
            toast.error(language === "en" ? "Phone number contains invalid characters." : "El número de teléfono contiene caracteres no válidos.");
            return false;
        }

        const digitCount = phone.replace(/\D/g, '').length;
        if (digitCount < 10) {
            toast.error(language === "en" ? "Please enter a valid phone number with at least 10 digits." : "Por favor ingresa un número de teléfono con al menos 10 dígitos.");
            return false;
        }

        if (!name || !email || !phone) {
            toast.error(language === "en" ? "Please fill out all required fields before continuing." : "Por favor completa todos los campos requeridos antes de continuar.");
            return false;
        }

        return true;
    };

    const validateStep2 = (): boolean => {
        if (!formData.reason) {
            toast.error(language === "en" ? "Please select a reason for your visit." : "Por favor selecciona un motivo para tu visita.");
            return false;
        }
        return true;
    };

    const validateStep3 = (): boolean => {
        if (!formData.make?.trim() || !formData.year?.trim() || !formData.model?.trim() || !formData.trim?.trim() || !formData.dropOffOrWait) {
            toast.error(language === "en" ? "Please fill in all vehicle details and select an option before continuing." : "Por favor completa todos los detalles del vehículo y selecciona una opción antes de continuar.");
            return false;
        }
        if (!/^\d{4}$/.test(formData.year.trim())) {
            toast.error(language === "en" ? "Please enter a valid 4-digit year." : "Por favor ingresa un año válido de 4 dígitos.");
            return false;
        }
        return true;
    };

    const validateStep4 = (): boolean => {
        if (!formData.date || !formData.time) {
            toast.error(language === "en" ? "Please select a date and time before continuing." : "Por favor selecciona una fecha y hora antes de continuar.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 0 && !validateStep1()) return;
        if (currentStep === 1 && !validateStep2()) return;
        if (currentStep === 2 && hasCarProblems && !formData.problemDescription?.trim()) {
            toast.error(language === "en" ? "Please select at least one car problem before continuing." : "Por favor selecciona al menos un problema del vehículo antes de continuar.");
            return;
        }
        if ((currentStep === 2 && !hasCarProblems) || (currentStep === 3 && hasCarProblems)) {
            if (!validateStep3()) return;
        }
        if ((currentStep === 3 && !hasCarProblems) || (currentStep === 4 && hasCarProblems)) {
            if (!validateStep4()) return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleCancel = () => {
        onCloseAction();
        resetForm();
    };

    const resetForm = () => {
        setCurrentStep(0);
        setFormData(createInitialFormData());
    };

    const handleSubmit = async () => {
        if (!formData.acceptTerms) {
            toast.error(language === "en" ? "Please accept the terms of service before submitting." : "Por favor acepta los términos de servicio antes de enviar.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(language === "en" ? "Your appointment has been submitted!" : "¡Tu cita ha sido enviada!");
                setCurrentStep(totalSteps - 1);
            } else {
                const data = await response.json();
                toast.error(data.message || (language === "en" ? "Submission failed." : "Error al enviar."));
            }
        } catch (error) {
            console.error(error);
            toast.error(language === "en" ? "An error occurred while submitting your booking." : "Ocurrió un error al enviar tu cita.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
            return;
        }

        setFormData((prev) => ({
            ...prev,
            website: "",
            formStartedAt: Date.now().toString(),
        }));
    }, [isOpen]);

    // Adjust currentStep if hasCarProblems changes after Step 1
    useEffect(() => {
        if (currentStep > 1) {
            setCurrentStep(2);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasCarProblems]);

    const progressPercent = (currentStep / (totalSteps - 1)) * 100;
    const barColor = '#17643f';
    const commonProps = { formData, setFormData };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step1 {...commonProps} />;
            case 1: return <Step2 {...commonProps} />;
            case 2: return hasCarProblems ? <Step3CarProblems {...commonProps} /> : <Step3 {...commonProps} />;
            case 3: return hasCarProblems ? <Step3 {...commonProps} /> : <Step4 {...commonProps} />;
            case 4: return hasCarProblems ? <Step4 {...commonProps} /> : <Step5 {...commonProps} />;
            case 5: return hasCarProblems ? <Step5 {...commonProps} /> : <Done />;
            case 6: return <Done />;
            default: return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#07110e]/75 p-3 backdrop-blur-sm sm:items-center sm:p-6"
        >
            <div
                className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#9fb0a3] bg-[#f7f4ec] p-4 text-[#111915] shadow-2xl sm:max-h-[calc(100svh-3rem)] sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="booking-modal-title" className="sr-only">
                    {language === "en" ? "Book an appointment" : "Reservar una cita"}
                </h2>
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded bg-[#d8dfd9]">
                    <div className="h-full transition-all duration-300 rounded" style={{ width: `${progressPercent}%`, backgroundColor: barColor }}></div>
                </div>

                <div className="mb-2 flex justify-end gap-2">
                    <button onClick={toggleLanguage} className="rounded border border-[#17643f] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#17643f] transition hover:bg-[#e5ece6]">
                        {language === "en" ? "ES" : "EN"}
                    </button>
                    <button onClick={handleCancel} className="grid h-8 w-8 place-items-center rounded border border-[#b8c3ba] text-[#445048] transition hover:border-[#17643f] hover:text-[#17643f]" aria-label={language === "en" ? "Close booking form" : "Cerrar formulario"}>
                        <X size={17} />
                    </button>
                </div>

                {renderStep()}

                <div className="sr-only" aria-hidden="true">
                    <label htmlFor="booking-website">Website</label>
                    <input
                        id="booking-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(event) =>
                            setFormData((prev) => ({ ...prev, website: event.target.value }))
                        }
                    />
                </div>

                {currentStep < totalSteps - 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={handleBack} disabled={currentStep === 0} className={`rounded px-4 py-2 text-sm font-bold transition ${currentStep === 0 ? 'cursor-not-allowed bg-[#e1e4e1] text-[#9aa29c]' : 'border border-[#aeb9b0] bg-transparent text-[#38443c] hover:bg-[#e5ece6]'}`}>
                            ← {language === "en" ? "Back" : "Atrás"}
                        </button>

                        <div className="flex gap-2">
                            <button onClick={handleCancel} className="rounded px-3 py-2 text-sm font-bold text-[#6a3838] transition hover:bg-[#f2e7e4] sm:px-4">
                                {language === "en" ? "Cancel" : "Cancelar"}
                            </button>
                            <button
                                onClick={currentStep === totalSteps - 2 ? handleSubmit : handleNext}
                                className="rounded bg-[#17643f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0f4d30] disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (language === "en" ? "Submitting..." : "Enviando...") : currentStep === totalSteps - 2 ? (language === "en" ? 'Submit' : 'Enviar') : (language === "en" ? 'Continue' : 'Continuar')}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 border-t border-[#d4dbd5] pt-4 text-center text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#667169]">
                    <span>{language === "en" ? "Website by " : "Sitio web por "}</span>
                    <a
                        href="https://frank-hernandez.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#17643f] underline decoration-[#17643f]/35 underline-offset-4 transition hover:decoration-[#17643f]"
                    >
                        frank-hernandez.com
                    </a>
                </div>

            </div>
        </div>
    );
}
