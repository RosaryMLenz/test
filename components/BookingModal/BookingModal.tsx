'use client';

import { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step3CarProblems from './Step3CarProblems';
import Step4 from './Step4';
import Step4CarProblems from './Step4CarProblems';
import Step5 from './Step5';
import Done from './Done';

export interface BookingFormData {
    name?: string;
    phone?: string;
    reason?: string;
    vehicle?: string;
    year?: string;
    problemDescription?: string;
    date?: string;
    time?: string;
    photos?: FileList;
    additionalDetails?: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export default function BookingModal({ isOpen, onCloseAction }: BookingModalProps) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<BookingFormData>({});
    const totalSteps = 5;

    const handleNext = () => {
        if (currentStep === 1 && !formData.reason) {
            alert('Please select a reason for your visit.');
            return;
        }
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
        setFormData({});
    };

    const handleSubmit = () => {
        console.log('Submitting booking:', formData);
        setCurrentStep(totalSteps);
    };

    const progressPercent = (currentStep / totalSteps) * 100;
    const barColor = currentStep === totalSteps - 1 ? '#22c55e' : '#3b82f6';
    const commonProps = { formData, setFormData };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step1 {...commonProps} />;
            case 1: return <Step2 {...commonProps} />;
            case 2: return formData.reason === 'Car problems' ? <Step3CarProblems {...commonProps} /> : <Step3 {...commonProps} />;
            case 3: return formData.reason === 'Car problems' ? <Step4CarProblems {...commonProps} /> : <Step4 {...commonProps} />;
            case 4: return <Step5 {...commonProps} />;
            case 5: return <Done />;
            default: return null;
        }
    };

    // ✅ Scroll lock while modal is open
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
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCancel}
        >
            <div
                className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 relative shadow-lg"
                onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside
            >
                {/* Close Button */}
                <button
                    onClick={handleCancel}
                    aria-label="Close"
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition text-xl"
                >
                    &times;
                </button>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2 rounded mb-4 overflow-hidden">
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
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                        >
                            ← Back
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-50 transition"
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
    );
}