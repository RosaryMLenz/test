"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
    const { language } = useLanguage();

    return (
        <div className="min-h-[80vh] bg-white dark:bg-black text-black dark:text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-green-600 dark:text-green-400">
                    {language === "en" ? "Cv Joints Driveshafts" : "Cv Joints Driveshafts"}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {language === "en"
                        ? "More information coming soon about our cv joints driveshafts services."
                        : "Próximamente más información sobre nuestros servicios de cv joints driveshafts."}
                </p>
            </div>
        </div>
    );
}
