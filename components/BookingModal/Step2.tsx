import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step2({ formData, setFormData }: StepProps ) {
    const reasons = ['Maintenance', 'Inspection', 'Tire rotation', 'Car problems'];
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Step 2: Reason for Visit</h2>
            <div className="space-y-2">
                {reasons.map(reason => (
                    <label key={reason} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="reason"
                            value={reason}
                            checked={formData.reason === reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                        <span>{reason}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}