import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step3CarProblems({ formData, setFormData }: StepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 3: Describe the Car Problems</h2>
            <textarea
                placeholder="Describe the issues you're experiencing..."
                value={formData.problemDescription || ''}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                className="border p-2 w-full rounded mb-2 h-24"
            />
        </div>
    );
}