import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step3({ formData, setFormData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 3: Vehicle Details</h2>
            <input
                type="text"
                placeholder="Vehicle Make and Model"
                value={formData.vehicle || ''}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                className="border p-2 w-full rounded mb-2"
            />
            <input
                type="text"
                placeholder="Year"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="border p-2 w-full rounded"
            />
        </div>
    );
}