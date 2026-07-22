"use client";

import Link from "next/link";
import { Languages, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
    const { language } = useLanguage();

    const principles = [
        {
            icon: MessageCircle,
            titleEn: "Explain it clearly",
            titleEs: "Explicarlo claramente",
            bodyEn: "We make space for questions and explain the options before work begins.",
            bodyEs: "Damos espacio para preguntas y explicamos las opciones antes de comenzar." ,
        },
        {
            icon: ShieldCheck,
            titleEn: "Stand behind the work",
            titleEs: "Respaldar el trabajo",
            bodyEn: "Applicable warranty coverage is reviewed with you up front.",
            bodyEs: "Revisamos contigo la cobertura de garantía aplicable desde el principio.",
        },
        {
            icon: Languages,
            titleEn: "Serve our community",
            titleEs: "Servir a la comunidad",
            bodyEn: "Our team is ready to help in English or Spanish.",
            bodyEs: "Nuestro equipo está listo para ayudarte en inglés o español.",
        },
    ];

    return (
        <div className="bg-[#f7f4ec]">
            <section className="border-b border-[#cbd2cb]">
                <div className="mx-auto grid max-w-[92rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:px-12">
                    <div>
                        <div className="rf-kicker">{language === "en" ? "About Rainforest21" : "Sobre Rainforest21"}</div>
                        <h1 className="mt-7 font-display text-7xl uppercase leading-[0.88] tracking-[-0.035em] text-[#101713] sm:text-8xl lg:text-9xl">
                            {language === "en" ? "Good work starts with trust." : "El buen trabajo empieza con confianza."}
                        </h1>
                    </div>
                    <p className="max-w-xl text-xl leading-9 text-[#465149]">
                        {language === "en"
                            ? "Rainforest21 Automotive helps Las Vegas drivers maintain and repair their vehicles with straightforward communication and a practical approach."
                            : "Rainforest21 Automotive ayuda a los conductores de Las Vegas a mantener y reparar sus vehículos con comunicación clara y un enfoque práctico."}
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="grid gap-5 md:grid-cols-3">
                    {principles.map(({ icon: Icon, titleEn, titleEs, bodyEn, bodyEs }) => (
                        <article key={titleEn} className="rounded-2xl border border-[#b9c4bc] bg-[#fbf9f3] p-8">
                            <Icon className="text-[#17643f]" size={39} strokeWidth={1.5} aria-hidden="true" />
                            <h2 className="mt-9 font-display text-3xl uppercase tracking-wide text-[#101713]">
                                {language === "en" ? titleEn : titleEs}
                            </h2>
                            <p className="mt-4 leading-7 text-[#4d5750]">{language === "en" ? bodyEn : bodyEs}</p>
                        </article>
                    ))}
                </div>

                <div className="mt-20 grid overflow-hidden rounded-[2rem] border border-[#9fb0a3] bg-[#e7ede7] lg:grid-cols-[0.75fr_1.25fr]">
                    <div className="flex items-center justify-center bg-[#17643f] p-12 text-[#f7f4ec]">
                        <MapPin size={115} strokeWidth={1.1} aria-hidden="true" />
                    </div>
                    <div className="p-8 sm:p-12">
                        <div className="rf-kicker">{language === "en" ? "Your local shop" : "Tu taller local"}</div>
                        <h2 className="mt-5 font-display text-5xl uppercase leading-none text-[#101713] sm:text-6xl">
                            3280 Wynn Rd, Unit 4
                        </h2>
                        <p className="mt-5 text-lg text-[#4a554d]">Las Vegas, NV 89102</p>
                        <Link href="/contact" className="rf-button rf-button-primary mt-8">
                            {language === "en" ? "Plan your visit" : "Planifica tu visita"}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
