"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import BookingModal from '@/components/BookingModal/BookingModal';
import DiscountSection from "@/components/DiscountSection";
import AutoRepairServicesSection from "@/components/AutoRepairServicesSection";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Hero onBookClick={() => setIsModalOpen(true)} />
            <DiscountSection />
            <AutoRepairServicesSection />
            {/* other sections */}

            <BookingModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
            />
        </>
    );
}