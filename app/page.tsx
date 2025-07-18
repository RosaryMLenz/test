"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import BookingModal from '@/components/BookingModal/BookingModal';
import DiscountSection from "@/components/DiscountSection";
import AutoRepairServicesSection from "@/components/AutoRepairServicesSection";
import WarrantySection from "@/components/WarrantySection";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenBookingModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseBookingModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Hero onBookClick={handleOpenBookingModal} />
            <DiscountSection onBookClick={handleOpenBookingModal} />
            <AutoRepairServicesSection />
            <WarrantySection />
            {/* other sections */}

            <BookingModal
                isOpen={isModalOpen}
                onCloseAction={handleCloseBookingModal}
            />
        </>
    );
}
