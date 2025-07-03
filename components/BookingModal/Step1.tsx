import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step1({ formData, setFormData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 1: Your Information</h2>
            <input
                type="text"
                placeholder="Your Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 w-full rounded mb-2"
            />
            <input
                type="tel"
                placeholder="Your Phone Number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border p-2 w-full rounded"
            />
        </div>
    );
}