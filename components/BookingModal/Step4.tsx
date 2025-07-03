import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step4({ formData, setFormData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 4: Preferred Appointment</h2>
            <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border p-2 w-full rounded mb-2"
            />
            <input
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border p-2 w-full rounded"
            />
        </div>
    );
}