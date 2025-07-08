"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface HeroProps {
    onBookClick: () => void;
}

const Hero = ({ onBookClick }: HeroProps) => {
    const { language } = useLanguage();

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative bg-white text-black dark:bg-black dark:text-white flex items-center justify-center min-h-[80vh] px-6 sm:px-8 transition-colors duration-300"
        >
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('/mechanic-hero.jpg')" }}
                aria-hidden="true"
            ></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/90 dark:from-black/80 dark:to-black/90 transition-colors"></div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="text-3xl sm:text-5xl font-bold mb-4"
                >
                    {language === "en"
                        ? "Reliable Mechanic Services in Las Vegas"
                        : "Servicios de mecánica confiables en Las Vegas"}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                    className="text-neutral-700 dark:text-neutral-300 mb-6 text-lg sm:text-xl"
                >
                    {language === "en"
                        ? "Book your oil change, brake repair, or diagnostics with Rainforest Automotive today for honest, fast, and affordable care."
                        : "Agenda tu cambio de aceite, reparación de frenos o diagnóstico con Rainforest Automotive hoy mismo para un servicio honesto, rápido y asequible."}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <button
                        onClick={onBookClick}
                        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded transition-colors duration-300"
                    >
                        {language === "en" ? "Book Appointment" : "Reservar Cita"}
                    </button>
                    <a
                        href="tel:+17028349385"
                        className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold px-6 py-3 rounded transition-colors duration-300"
                    >
                        {language === "en" ? "Call Now" : "Llamar Ahora"}
                    </a>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Hero;
