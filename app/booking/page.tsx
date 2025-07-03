'use client';

import { useState } from 'react';
import BookingModal from '@/components/BookingModal/BookingModal';

export default function BookingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex justify-center items-center h-screen">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Book Appointment
            </button>

            <BookingModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
            />
        </div>
    );
}