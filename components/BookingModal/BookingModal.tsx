"use client";

import { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step3CarProblems from './Step3CarProblems';
import Step4 from './Step4';
import Step5 from './Step5';
import Done from './Done';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    reason?: string;
    vehicle?: string;
    year?: string;
    problemDescription?: string;
    date?: string;
    time?: string;
    photos?: FileList;
    additionalDetails?: string;
    acceptTerms: boolean;
    enableNotifications: boolean;
    dropOffOrWait: string;

}

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

    const [showAlert, setShowAlert] = useState(false);

    const totalSteps = 5;

    const validateStep1 = (): boolean => {
        const name = formData.name.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        const validCharsRegex = /^[0-9+\s\-().]+$/;
        if (!validCharsRegex.test(phone)) {
            toast.error("Phone number contains invalid characters. Use only numbers, spaces, +, -, (, ).");
            return false;
        }

        const digitCount = phone.replace(/\D/g, '').length;
        if (digitCount < 10) {
            toast.error("Please enter a valid phone number with at least 10 digits.");
            return false;
        }

        if (!name || !email || !phone) {
            toast.error("Please fill out all required fields before continuing.");
            return false;
        }

        return true;
    };

    const validateStep2 = (): boolean => {
        if (!formData.reason) {
            toast.error("Please select a reason for your visit.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 0 && !validateStep1()) return;
        if (currentStep === 1 && !validateStep2()) return;

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleCancel = () => {
        onCloseAction();
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

    const handleSubmit = () => {
        console.log('Submitting booking:', formData);
        toast.success("Your appointment has been submitted!");
        setCurrentStep(totalSteps);
    };

    const progressPercent = (currentStep / totalSteps) * 100;
    const barColor = currentStep === totalSteps - 1 ? '#22c55e' : '#3b82f6';
    const commonProps = { formData, setFormData, onNext: handleNext };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step1 {...commonProps} />;
            case 1: return <Step2 {...commonProps} />;
            case 2:
                const hasCarProblems = formData.reason?.split(", ").includes("Car Problems");
                return hasCarProblems ? <Step3CarProblems {...commonProps} /> : <Step3 {...commonProps} />;
            case 3: return <Step4 {...commonProps} />;
            case 4: return <Step5 {...commonProps} />;
            case 5: return <Done />;
            default: return null;
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                <div
                    className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 relative shadow-lg dark:bg-neutral-900"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded mb-4 overflow-hidden">
                        <div
                            className="h-full transition-all duration-300 rounded"
                            style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    {renderStep()}

                    {/* Navigation Buttons */}
                    {currentStep < 5 && (
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 rounded transition ${
                                    currentStep === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200'
                                }`}
                            >
                                ← Back
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-neutral-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    {currentStep === totalSteps - 1 ? 'Submit' : 'Continue'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alert Dialog (optional for additional messaging) */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-black dark:text-white">Attention</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
                            Please fill in all required fields correctly before proceeding.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
