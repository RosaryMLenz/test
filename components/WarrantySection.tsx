"use client";

import { Info, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WarrantySection() {
    const { language } = useLanguage();

    return (
        <section className="border-y border-[#cbd2cb] bg-[#e7ede7]">
            <div className="mx-auto grid max-w-[92rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-12">
                <div>
                    <div className="rf-kicker">{language === "en" ? "Peace of mind" : "Tranquilidad"}</div>
                    <h2 className="mt-6 max-w-4xl font-display text-6xl uppercase leading-[0.92] tracking-[-0.03em] text-[#101713] sm:text-7xl lg:text-8xl">
                        {language === "en" ? "Work backed by clear warranty coverage." : "Trabajo respaldado por una garantía clara."}
                    </h2>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-[#475149]">
                        {language === "en"
                            ? "Warranty terms depend on the service and parts used. We review the applicable coverage before work begins."
                            : "Los términos dependen del servicio y las piezas utilizadas. Revisamos la cobertura aplicable antes de comenzar."}
                    </p>
                </div>

                <div className="rounded-[2rem] border border-[#9fb0a3] bg-[#f7f4ec] p-8 sm:p-12">
                    <ShieldCheck className="text-[#17643f]" size={94} strokeWidth={1.35} aria-hidden="true" />
                    <h3 className="mt-8 font-display text-3xl uppercase tracking-wide text-[#101713]">
                        {language === "en" ? "Upfront & transparent" : "Claro y transparente"}
                    </h3>
                    <div className="mt-5 flex gap-3 border-t border-[#cbd2cb] pt-5 text-[#4c574f]">
                        <Info className="mt-0.5 shrink-0 text-[#17643f]" size={20} aria-hidden="true" />
                        <p className="leading-7">
                            {language === "en"
                                ? "Ask our team which parts-and-labor coverage applies to your repair."
                                : "Pregunta a nuestro equipo qué cobertura de piezas y mano de obra aplica a tu reparación."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
