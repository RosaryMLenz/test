"use client";

import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
    onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
    const { language } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-[#f7f4ec]">
            <div className="absolute inset-0 lg:hidden" aria-hidden="true">
                <Image
                    src="/redesign/hero-engine.jpg"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 1px"
                    className="object-cover object-center opacity-[0.14]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4ec]/85 via-[#f7f4ec]/90 to-[#f7f4ec]" />
            </div>
            <div className="relative mx-auto grid min-h-[calc(100svh-5.25rem)] max-w-[100rem] lg:grid-cols-[0.88fr_1.12fr]">
                <div className="flex items-center px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-20 xl:px-20">
                    <div className="max-w-[43rem]">
                        <div className="rf-kicker">
                            {language === "en" ? "Las Vegas auto repair" : "Reparación automotriz en Las Vegas"}
                        </div>
                        <h1 className="mt-7 font-display text-[clamp(3.8rem,15vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.035em] text-[#101713]">
                            {language === "en" ? (
                                <>Honest repairs.<br />Clear answers.</>
                            ) : (
                                <>Reparaciones honestas.<br />Respuestas claras.</>
                            )}
                        </h1>
                        <p className="mt-8 max-w-xl text-lg leading-8 text-[#3f4942] sm:text-xl">
                            {language === "en"
                                ? "Dependable auto care with straightforward communication from start to finish."
                                : "Servicio automotriz confiable con comunicación clara de principio a fin."}
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <button type="button" onClick={onBookClick} className="rf-button rf-button-primary">
                                {language === "en" ? "Book an appointment" : "Reservar una cita"}
                            </button>
                            <a href="tel:+17027627573" className="rf-button rf-button-secondary">
                                <Phone size={19} aria-hidden="true" />
                                {language === "en" ? "Call 702-762-7573" : "Llamar 702-762-7573"}
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-3 border-t border-[#cbd2cb] pt-6 text-sm text-[#303a33] sm:text-base">
                            <MapPin className="text-[#17643f]" size={22} aria-hidden="true" />
                            <span>3280 Wynn Rd, Unit 4 · Las Vegas</span>
                        </div>
                    </div>
                </div>

                <div className="relative hidden min-h-full overflow-hidden rounded-bl-[5rem] rounded-tl-[5rem] lg:block">
                    <Image
                        src="/redesign/hero-engine.jpg"
                        alt={language === "en" ? "Clean modern vehicle engine bay" : "Compartimento de motor moderno y limpio"}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        className="object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
            </div>
        </section>
    );
}
