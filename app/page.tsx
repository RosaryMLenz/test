"use client";

import { useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    ClipboardCheck,
    Languages,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    SearchCheck,
    ShieldCheck,
} from "lucide-react";
import Hero from "@/components/Hero";
import BookingModal from "@/components/BookingModal/BookingModal";
import AutoRepairServicesSection from "@/components/AutoRepairServicesSection";
import WarrantySection from "@/components/WarrantySection";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { language } = useLanguage();

    const values = [
        {
            icon: MessageCircle,
            en: "Clear communication",
            es: "Comunicación clara",
            detailEn: "We explain the issue, your options, and the next step before work begins.",
            detailEs: "Explicamos el problema, tus opciones y el siguiente paso antes de comenzar.",
        },
        {
            icon: Languages,
            en: "Bilingual service",
            es: "Servicio bilingüe",
            detailEn: "Proudly serving our community in both English and Spanish.",
            detailEs: "Atendemos con orgullo a nuestra comunidad en inglés y español.",
        },
        {
            icon: ShieldCheck,
            en: "Warranty-backed work",
            es: "Trabajo con garantía",
            detailEn: "Applicable parts-and-labor coverage is reviewed with you up front.",
            detailEs: "Revisamos contigo la cobertura aplicable de piezas y mano de obra.",
        },
        {
            icon: MapPin,
            en: "Local Las Vegas shop",
            es: "Taller local en Las Vegas",
            detailEn: "Conveniently located on Wynn Road, minutes from central Las Vegas.",
            detailEs: "Ubicados en Wynn Road, a pocos minutos del centro de Las Vegas.",
        },
    ];

    const process = [
        {
            icon: CalendarDays,
            en: "Schedule",
            es: "Agenda",
            detailEn: "Book online or give us a call.",
            detailEs: "Reserva en línea o llámanos.",
        },
        {
            icon: SearchCheck,
            en: "We check",
            es: "Revisamos",
            detailEn: "We inspect the vehicle and explain what we find.",
            detailEs: "Inspeccionamos el vehículo y explicamos lo que encontramos.",
        },
        {
            icon: ClipboardCheck,
            en: "You decide",
            es: "Tú decides",
            detailEn: "Approve the plan before work begins.",
            detailEs: "Aprueba el plan antes de comenzar el trabajo.",
        },
    ];

    return (
        <>
            <Hero onBookClick={() => setIsModalOpen(true)} />
            <AutoRepairServicesSection />

            <section className="bg-[#f7f4ec]">
                <div className="mx-auto grid max-w-[92rem] gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12">
                    <div>
                        <div className="rf-kicker">{language === "en" ? "Why Rainforest21" : "Por qué Rainforest21"}</div>
                        <h2 className="mt-6 font-display text-6xl uppercase leading-[0.9] tracking-[-0.03em] text-[#101713] sm:text-7xl lg:text-8xl">
                            {language === "en" ? "Auto care without the runaround." : "Servicio sin complicaciones."}
                        </h2>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-[#48524b]">
                            {language === "en"
                                ? "Clear explanations, dependable work, and a team that respects your time."
                                : "Explicaciones claras, trabajo confiable y un equipo que respeta tu tiempo."}
                        </p>
                    </div>

                    <div className="border-t border-[#b7c2b9]">
                        {values.map(({ icon: Icon, en, es, detailEn, detailEs }) => (
                            <div key={en} className="grid gap-4 border-b border-[#b7c2b9] py-7 sm:grid-cols-[4rem_1fr] sm:items-start">
                                <div className="grid h-14 w-14 place-items-center rounded-full border border-[#8fa295] text-[#17643f]">
                                    <Icon size={27} strokeWidth={1.7} aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl uppercase tracking-wide text-[#17643f]">
                                        {language === "en" ? en : es}
                                    </h3>
                                    <p className="mt-2 max-w-xl leading-7 text-[#4d5750]">
                                        {language === "en" ? detailEn : detailEs}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-[#cbd2cb] bg-[#fbf9f3]">
                <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                    <div className="rf-kicker">{language === "en" ? "What to expect" : "Qué esperar"}</div>
                    <h2 className="mt-6 max-w-4xl font-display text-6xl uppercase leading-[0.9] tracking-[-0.03em] text-[#101713] sm:text-7xl lg:text-8xl">
                        {language === "en" ? "Service without the guesswork." : "Servicio sin incertidumbre."}
                    </h2>

                    <div className="mt-16 grid gap-8 lg:grid-cols-3">
                        {process.map(({ icon: Icon, en, es, detailEn, detailEs }, index) => (
                            <div key={en} className="relative border-t border-[#9daf9f] pt-8">
                                <div className="flex items-center gap-5">
                                    <span className="font-display text-7xl leading-none text-[#17643f]">0{index + 1}</span>
                                    <span className="grid h-16 w-16 place-items-center rounded-xl border border-[#92a596] text-[#17643f]">
                                        <Icon size={30} strokeWidth={1.6} aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-7 font-display text-3xl uppercase tracking-wide text-[#101713]">
                                    {language === "en" ? en : es}
                                </h3>
                                <p className="mt-3 max-w-sm text-lg leading-7 text-[#4e5851]">
                                    {language === "en" ? detailEn : detailEs}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden bg-[#06432f] text-[#f7f4ec]">
                <div className="mx-auto grid max-w-[92rem] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.65fr] lg:items-end lg:px-12">
                    <div>
                        <div className="rf-kicker rf-kicker-light">{language === "en" ? "Not sure what your car needs?" : "¿No sabes qué necesita tu auto?"}</div>
                        <h2 className="mt-7 max-w-4xl font-display text-6xl uppercase leading-[0.9] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
                            {language === "en" ? "Start with what you’re noticing." : "Empieza por lo que estás notando."}
                        </h2>
                        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d4e1d7]">
                            {language === "en"
                                ? "Tell us about the sound, warning light, vibration, or performance issue. We’ll help you choose the right next step."
                                : "Cuéntanos sobre el ruido, la luz de advertencia, la vibración o el problema de rendimiento. Te ayudaremos con el siguiente paso."}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-stretch">
                        <button type="button" onClick={() => setIsModalOpen(true)} className="rf-button bg-[#f7f4ec] text-[#0d563b] hover:bg-white">
                            {language === "en" ? "Book a diagnostic" : "Reservar diagnóstico"}
                        </button>
                        <a href="tel:+17027627573" className="rf-button border border-[#f7f4ec] text-[#f7f4ec] hover:bg-white/10">
                            <Phone size={19} aria-hidden="true" />
                            {language === "en" ? "Call the shop" : "Llamar al taller"}
                        </a>
                    </div>
                </div>
            </section>

            <WarrantySection />

            <section className="bg-[#f7f4ec]">
                <div className="mx-auto grid max-w-[92rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:px-12">
                    <div>
                        <div className="rf-kicker">{language === "en" ? "Visit the shop" : "Visita el taller"}</div>
                        <h2 className="mt-6 font-display text-6xl uppercase leading-[0.9] tracking-[-0.03em] text-[#101713] sm:text-7xl">
                            {language === "en" ? "Local service in Las Vegas." : "Servicio local en Las Vegas."}
                        </h2>
                        <div className="mt-10 divide-y divide-[#cbd2cb] border-y border-[#cbd2cb] text-[#354038]">
                            <div className="flex gap-4 py-5"><MapPin className="shrink-0 text-[#17643f]" /><span>3280 Wynn Rd, Unit 4<br />Las Vegas, NV 89102</span></div>
                            <a href="tel:+17027627573" className="flex gap-4 py-5 hover:text-[#17643f]"><Phone className="shrink-0 text-[#17643f]" /><span>702-762-7573</span></a>
                            <a href="mailto:office@rainforest21automotive.com" className="flex items-center gap-4 py-5 break-all hover:text-[#17643f]"><Mail className="shrink-0 text-[#17643f]" /><span>office@rainforest21automotive.com</span></a>
                        </div>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=3280+Wynn+Rd+Unit+4+Las+Vegas+NV+89102"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rf-button rf-button-primary mt-7 w-full sm:w-auto"
                        >
                            {language === "en" ? "Get directions" : "Cómo llegar"}
                            <ArrowRight size={19} aria-hidden="true" />
                        </a>
                    </div>

                    <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-[#b8c3ba] bg-[#e7ede7]">
                        <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(#aab7ad_1px,transparent_1px),linear-gradient(90deg,#aab7ad_1px,transparent_1px)] [background-size:64px_64px]" />
                        <div className="absolute left-[17%] top-0 h-full w-7 rotate-[17deg] bg-white/75" />
                        <div className="absolute left-0 top-[58%] h-8 w-full -rotate-[4deg] bg-white/85" />
                        <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[9px] border-[#17643f] bg-[#f7f4ec] text-[#17643f] shadow-xl">
                            <MapPin size={46} strokeWidth={1.7} aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </section>

            <BookingModal isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
        </>
    );
}
