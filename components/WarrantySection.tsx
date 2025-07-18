"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function WarrantySection() {
    const { language } = useLanguage();

    return (
        <section className="relative bg-white text-black dark:bg-black dark:text-white flex items-center justify-center min-h-[85vh] px-4 sm:px-8 transition-colors">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/60 to-white dark:from-green-900/20 dark:to-black z-0" />

            {/* Content container */}
            <div className="relative z-10 max-w-4xl w-full text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    {language === "en" ? "Our Warranty" : "Nuestra Garantía"}
                </h2>

                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-10">
                    {language === "en"
                        ? "Rainforest21 Automotive proudly offers dependable service backed by warranties for your peace of mind."
                        : "Rainforest21 Automotive se enorgullece en ofrecer un servicio confiable respaldado por garantías para tu tranquilidad."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <ul className="text-left text-base sm:text-lg space-y-4 max-w-xl mx-auto">
                    <li>
                        ✅ <strong>{language === "en" ? "Federal Catalytic Converters" : "Catalizadores Federales"}:</strong>{" "}
                        {language === "en" ? "5-year warranty" : "5 años de garantía"}
                    </li>
                    <li>
                        ✅ <strong>{language === "en" ? "New Parts" : "Partes Nuevas"}:</strong>{" "}
                        {language === "en" ? "2-year warranty" : "2 años de garantía"}
                    </li>
                    <li>
                        ✅ <strong>{language === "en" ? "Rebuilt Parts" : "Partes Reconstruidas"}:</strong>{" "}
                        {language === "en" ? "1-year warranty" : "1 año de garantía"}
                    </li>
                    <li>
                        ✅ <strong>{language === "en" ? "Engines & Transmissions" : "Motores y Transmisiones"}:</strong>{" "}
                        {language === "en" ? "3-month warranty" : "3 meses de garantía"}
                    </li>
                    <li>
                        ✅ <strong>{language === "en" ? "Labor" : "Mano de Obra"}:</strong>{" "}
                        {language === "en" ? "3-month warranty" : "3 meses de garantía"}
                    </li>
                    <li className="text-red-600 dark:text-red-400 font-semibold">
                        ⚠️ {language === "en"
                        ? "No warranty if the customer brings their own part."
                        : "⚠️ No hay garantía si el cliente trae su propia parte."}
                    </li>
                </ul>
                </div>

                <div className="mt-10 p-6 border border-green-500 dark:border-green-700 rounded-xl bg-green-50 dark:bg-green-900/30">
                    <h3 className="text-xl font-semibold mb-2">
                        {language === "en" ? "Need Help Understanding Your Warranty?" : "¿Necesitas ayuda con tu garantía?"}
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">
                        {language === "en"
                            ? "Call us at +1-702-762-7573 and we’ll be happy to explain your specific coverage and service benefits."
                            : "Llámanos al +1-702-762-7573 y con gusto te explicaremos tu cobertura y beneficios específicos."}
                    </p>
                </div>
            </div>
        </section>
    );
}
