import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step4CarProblems({ formData, setFormData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 4: Additional Details</h2>
            <p className="text-gray-700 mb-2">
                Please provide any additional details about the car problem, noises, or relevant information.
            </p>
            <textarea
                placeholder="Additional details (optional)"
                value={formData.additionalDetails || ''}
                onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                className="border p-2 w-full rounded mb-2 h-24"
            />
        </div>
    );
}