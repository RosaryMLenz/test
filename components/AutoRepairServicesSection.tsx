"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Languages, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const services = [
    {
        titleEn: "Oil change",
        titleEs: "Cambio de aceite",
        descriptionEn: "Fresh oil. Smoother performance.",
        descriptionEs: "Aceite nuevo. Mejor rendimiento.",
        link: "/services/oil-change-service/oil-change",
        image: "/redesign/generated/service-oil-cutout.png",
    },
    {
        titleEn: "Brakes",
        titleEs: "Frenos",
        descriptionEn: "Safe stops. Total confidence.",
        descriptionEs: "Frenado seguro. Confianza total.",
        link: "/services/brakes/brakes",
        image: "/redesign/generated/service-brakes-cutout.png",
    },
    {
        titleEn: "Diagnostics",
        titleEs: "Diagnóstico",
        descriptionEn: "Pinpoint issues. Clear answers.",
        descriptionEs: "Detectamos problemas. Damos respuestas claras.",
        link: "/services/auto-repair-services/car-diagnostic-test",
        image: "/redesign/generated/service-diagnostics-cutout.png",
    },
    {
        titleEn: "A/C service",
        titleEs: "Servicio de A/C",
        descriptionEn: "Cool air. Every time.",
        descriptionEs: "Aire fresco. Siempre.",
        link: "/services/air-conditioning/air-conditioning-service",
        image: "/redesign/generated/service-ac-cutout.png",
    },
];

export default function AutoRepairServicesSection() {
    const { language } = useLanguage();

    const trustItems = [
        { icon: Languages, en: "Bilingual service", es: "Servicio bilingüe" },
        { icon: ShieldCheck, en: "Warranty-backed work", es: "Trabajo con garantía" },
        { icon: Clock3, en: "Mon–Fri 9–6", es: "Lun–Vie 9–6" },
    ];

    return (
        <section id="services" className="border-y border-[#cbd2cb] bg-[#f7f4ec]">
            <div className="mx-auto max-w-[92rem] px-5 py-8 sm:px-8 lg:px-12">
                <div className="grid overflow-hidden rounded-xl border border-[#b9c4bc] sm:grid-cols-3">
                    {trustItems.map(({ icon: Icon, en, es }, index) => (
                        <div key={en} className={`flex min-h-20 items-center justify-center gap-3 px-5 py-4 ${index > 0 ? "border-t border-[#cbd2cb] sm:border-l sm:border-t-0" : ""}`}>
                            <Icon className="text-[#17643f]" size={25} aria-hidden="true" />
                            <span className="text-sm font-black uppercase tracking-[0.12em] text-[#111915]">
                                {language === "en" ? en : es}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pb-16 pt-20 sm:pb-24 sm:pt-28">
                    <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                        <div>
                            <div className="rf-kicker">{language === "en" ? "What we do" : "Lo que hacemos"}</div>
                            <h2 className="mt-5 font-display text-6xl uppercase leading-none tracking-[-0.03em] text-[#101713] sm:text-7xl">
                                {language === "en" ? "Popular services" : "Servicios populares"}
                            </h2>
                            <p className="mt-4 text-lg text-[#4b554e]">
                                {language === "en" ? "Everyday maintenance and repairs, explained clearly." : "Mantenimiento y reparaciones explicados con claridad."}
                            </p>
                        </div>
                        <Link href="/services" className="inline-flex items-center gap-2 font-bold text-[#17643f] hover:underline">
                            {language === "en" ? "View all services" : "Ver todos los servicios"}
                            <ArrowRight size={19} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-11 sm:gap-5 xl:grid-cols-4">
                        {services.map((service) => (
                            <Link
                                key={service.titleEn}
                                href={service.link}
                                className="group overflow-hidden rounded-xl border border-[#b9c4bc] bg-[#fbf9f3] transition duration-200 hover:-translate-y-1 hover:border-[#17643f] hover:shadow-[0_18px_45px_rgba(16,23,19,0.08)] sm:rounded-2xl"
                            >
                                <div className="relative aspect-square overflow-hidden bg-[#f7f4ec]">
                                    <Image
                                        src={service.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                        className="object-contain p-4 drop-shadow-[0_14px_18px_rgba(16,23,19,0.15)] transition duration-300 group-hover:scale-[1.025] sm:p-8"
                                    />
                                </div>
                                <div className="flex items-end justify-between gap-2 border-t border-[#d3d9d4] p-3 sm:gap-4 sm:p-6">
                                    <div>
                                        <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-[#101713] sm:text-2xl">
                                            {language === "en" ? service.titleEn : service.titleEs}
                                        </h3>
                                        <p className="mt-1 hidden text-sm text-[#59635c] sm:block">
                                            {language === "en" ? service.descriptionEn : service.descriptionEs}
                                        </p>
                                    </div>
                                    <ArrowRight className="hidden shrink-0 text-[#17643f] transition-transform group-hover:translate-x-1 sm:block" size={23} aria-hidden="true" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
