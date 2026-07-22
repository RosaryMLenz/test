"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/BookingModal/BookingModal";
import { useLanguage } from "@/context/LanguageContext";

export default function BookingPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();
    const { language } = useLanguage();

    const closeBooking = () => {
        setIsModalOpen(false);
        router.push("/");
    };

    return (
        <div className="grid min-h-[70svh] place-items-center bg-[#e7ede7] px-5 py-20 text-center">
            <div>
                <div className="rf-kicker">{language === "en" ? "Book service" : "Reservar servicio"}</div>
                <h1 className="mt-6 font-display text-6xl uppercase text-[#101713] sm:text-7xl">
                    {language === "en" ? "Let’s get you scheduled." : "Agendemos tu cita."}
                </h1>
                <button type="button" onClick={() => setIsModalOpen(true)} className="rf-button rf-button-primary mt-8">
                    {language === "en" ? "Open booking form" : "Abrir formulario"}
                </button>
            </div>
            <BookingModal isOpen={isModalOpen} onCloseAction={closeBooking} />
        </div>
    );
}
