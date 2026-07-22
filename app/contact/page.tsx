"use client";

import { Clock3, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { language } = useLanguage();

    return (
        <div className="bg-[#f7f4ec]">
            <section className="border-b border-[#cbd2cb]">
                <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                    <div className="rf-kicker">{language === "en" ? "Visit the shop" : "Visita el taller"}</div>
                    <h1 className="mt-7 max-w-5xl font-display text-7xl uppercase leading-[0.88] tracking-[-0.035em] text-[#101713] sm:text-8xl lg:text-9xl">
                        {language === "en" ? "Local service in Las Vegas." : "Servicio local en Las Vegas."}
                    </h1>
                </div>
            </section>

            <section className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
                <div>
                    <div className="divide-y divide-[#cbd2cb] border-y border-[#cbd2cb]">
                        <div className="flex gap-4 py-6">
                            <MapPin className="mt-0.5 shrink-0 text-[#17643f]" />
                            <span className="text-lg leading-7">3280 Wynn Rd, Unit 4<br />Las Vegas, NV 89102</span>
                        </div>
                        <a href="tel:+17027627573" className="flex gap-4 py-6 text-lg hover:text-[#17643f]"><Phone className="shrink-0 text-[#17643f]" />702-762-7573</a>
                        <a href="mailto:office@rainforest21automotive.com" className="flex gap-4 py-6 break-all text-lg hover:text-[#17643f]"><Mail className="shrink-0 text-[#17643f]" />office@rainforest21automotive.com</a>
                        <div className="flex gap-4 py-6 text-lg leading-8"><Clock3 className="mt-1 shrink-0 text-[#17643f]" /><span>{language === "en" ? "Monday–Friday · 9:00 AM–6:00 PM" : "Lunes–viernes · 9:00 AM–6:00 PM"}<br />{language === "en" ? "Saturday · 9:00 AM–12:00 PM" : "Sábado · 9:00 AM–12:00 PM"}</span></div>
                    </div>
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=3280+Wynn+Rd+Unit+4+Las+Vegas+NV+89102"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rf-button rf-button-primary mt-8 w-full sm:w-auto"
                    >
                        <Navigation size={19} aria-hidden="true" />
                        {language === "en" ? "Get directions" : "Cómo llegar"}
                    </a>
                </div>

                <div className="relative min-h-[33rem] overflow-hidden rounded-[2rem] border border-[#b9c4bc] bg-[#e7ede7] shadow-[0_18px_55px_rgba(16,23,19,0.08)]" role="img" aria-label={language === "en" ? "Stylized location map for Rainforest21 Automotive" : "Mapa de ubicación de Rainforest21 Automotive"}>
                    <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#aab7ad_1px,transparent_1px),linear-gradient(90deg,#aab7ad_1px,transparent_1px)] [background-size:72px_72px]" />
                    <div className="absolute -left-10 top-[18%] h-9 w-[120%] rotate-[8deg] bg-white/85" />
                    <div className="absolute left-[28%] top-[-8%] h-[120%] w-8 -rotate-[13deg] bg-white/80" />
                    <div className="absolute right-[18%] top-0 h-full w-6 rotate-[3deg] bg-white/70" />
                    <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[10px] border-[#17643f] bg-[#f7f4ec] text-[#17643f] shadow-xl">
                        <MapPin size={54} strokeWidth={1.6} aria-hidden="true" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-[#a8b7aa] bg-[#f7f4ec]/95 p-4 text-center text-sm font-bold text-[#26342b] shadow-lg sm:left-1/2 sm:right-auto sm:w-max sm:-translate-x-1/2">
                        3280 Wynn Rd, Unit 4 · Las Vegas
                    </div>
                </div>
            </section>
        </div>
    );
}
