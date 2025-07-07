"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Done() {
    const router = useRouter();
    const { language } = useLanguage();

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold mb-2 text-green-600">
                {language === "en" ? "Booking Complete!" : "¡Reserva Completa!"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                {language === "en"
                    ? "Thank you for booking with us. We look forward to servicing your vehicle."
                    : "Gracias por reservar con nosotros. Esperamos poder atender tu vehículo."}
            </p>
            <button
                onClick={() => {
                    console.log("Done clicked, navigating home...");
                    router.push("/");
                    window.location.href = "/";
                }}
                className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
                {language === "en" ? "Done" : "Listo"}
            </button>
        </div>
    );
}
