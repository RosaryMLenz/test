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

interface BookingModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export default function BookingModal({ isOpen, onCloseAction }: BookingModalProps) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<BookingFormData>({
        name: "",
        email: "",
        phone: "",
        reason: "",
        vehicle: "",
        year: "",
        problemDescription: "",
        date: "",
        time: "",
        additionalDetails: "",
        acceptTerms: false,
        enableNotifications: false,
        dropOffOrWait: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { language, toggleLanguage } = useLanguage();

    const totalSteps = 6; // Now consistent with Done being step 6

    const hasCarProblems = formData.reason?.split(", ").includes("Car Problems");

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
        if (!formData.vehicle?.trim() || !formData.year?.trim() || !formData.dropOffOrWait) {
            toast.error(language === "en" ? "Please fill in vehicle details and select an option before continuing." : "Por favor completa los detalles del vehículo y selecciona una opción antes de continuar.");
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
        setFormData({
            name: "",
            email: "",
            phone: "",
            reason: "",
            vehicle: "",
            year: "",
            problemDescription: "",
            date: "",
            time: "",
            additionalDetails: "",
            acceptTerms: false,
            enableNotifications: false,
            dropOffOrWait: "",
        });
    };

    const handleSubmit = async () => {
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
        if (!isOpen) resetForm();
    }, [isOpen]);

    const progressPercent = (currentStep / (totalSteps - 1)) * 100;
    const barColor = currentStep === totalSteps - 1 ? '#22c55e' : '#3b82f6';
    const commonProps = { formData, setFormData };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step1 {...commonProps} />;
            case 1: return <Step2 {...commonProps} />;
            case 2: return hasCarProblems ? <Step3CarProblems {...commonProps} /> : <Step3 {...commonProps} />;
            case 3: return hasCarProblems ? <Step3 {...commonProps} /> : <Step4 {...commonProps} />;
            case 4: return hasCarProblems ? <Step4 {...commonProps} /> : <Step5 {...commonProps} />;
            case 5: return <Done />;
            default: return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="fixed inset-0 dark:bg-black bg-white bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 relative shadow-lg dark:bg-neutral-900"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded mb-4 overflow-hidden">
                    <div className="h-full transition-all duration-300 rounded" style={{ width: `${progressPercent}%`, backgroundColor: barColor }}></div>
                </div>

                <div className="flex justify-end mb-2">
                    <button onClick={toggleLanguage} className="border border-green-500 dark:border-green-400 px-2 py-1 rounded text-xs hover:bg-green-500 dark:hover:bg-green-400 hover:text-white dark:hover:text-black transition-colors">
                        {language === "en" ? "ES" : "EN"}
                    </button>
                </div>

                {renderStep()}

                {currentStep < totalSteps - 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={handleBack} disabled={currentStep === 0} className={`px-4 py-2 rounded transition ${currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200'}`}>
                            ← {language === "en" ? "Back" : "Atrás"}
                        </button>

                        <div className="flex gap-2">
                            <button onClick={handleCancel} className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-neutral-800 transition">
                                {language === "en" ? "Cancel" : "Cancelar"}
                            </button>
                            <button
                                onClick={currentStep === totalSteps - 2 ? handleSubmit : handleNext}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (language === "en" ? "Submitting..." : "Enviando...") : currentStep === totalSteps - 2 ? (language === "en" ? 'Submit' : 'Enviar') : (language === "en" ? 'Continue' : 'Continuar')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
