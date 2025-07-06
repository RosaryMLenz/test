import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step5({ formData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 5: Review Your Booking</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Reason:</strong> {formData.reason}</p>
            {formData.reason?.split(", ").includes('Car Problems') && (
                <p><strong>Problem Description:</strong> {formData.problemDescription}</p>
            )}
            <p><strong>Vehicle:</strong> {formData.vehicle}</p>
            <p><strong>Year:</strong> {formData.year}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Time:</strong> {formData.time}</p>
        </div>
    );
}