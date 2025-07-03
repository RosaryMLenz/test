"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import BookingModal from '@/components/BookingModal/BookingModal';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Hero onBookClick={() => setIsModalOpen(true)} />
            {/* other sections */}

            <BookingModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
            />
        </>
    );
}