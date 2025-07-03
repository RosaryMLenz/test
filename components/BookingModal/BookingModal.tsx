'use client';

import { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step3CarProblems from './Step3CarProblems';
import Step4 from './Step4';
import Step4CarProblems from './Step4CarProblems';
import Step5 from './Step5';
import Done from './Done';

/* Define the structure of your form data for strong type safety */
export interface BookingFormData{
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

    const totalSteps = 5; // 0-based steps, 5 steps before Done

    const handleNext = () => {
        // Step 2 validation (reason required)
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
        setCurrentStep(totalSteps); // move to Done screen
    };

    const progressPercent = (currentStep / totalSteps) * 100;

    const commonProps = { formData, setFormData };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <Step1 {...commonProps} />;
            case 1:
                return <Step2 {...commonProps} />;
            case 2:
                return formData.reason === 'Car problems' ? (
                    <Step3CarProblems {...commonProps} />
                ) : (
                    <Step3 {...commonProps} />
                );
            case 3:
                return formData.reason === 'Car problems' ? (
                    <Step4CarProblems {...commonProps} />
                ) : (
                    <Step4 {...commonProps} />
                );
            case 4:
                return <Step5 {...commonProps} />;
            case 5:
                return <Done />;
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-4 relative shadow-lg">

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2 rounded mb-4 overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                {/* Step Content */}
                {renderStep()}

                {/* Navigation Buttons */}
                {currentStep < 5 && (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`text-blue-600 flex items-center ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            ← Back
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="text-red-600 hover:underline"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
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