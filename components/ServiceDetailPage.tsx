"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceDetailPageProps {
    eyebrowEn: string;
    eyebrowEs: string;
    titleEn: string;
    titleEs: string;
    introEn: string;
    introEs: string;
    image: string;
    altEn: string;
    altEs: string;
    includesEn: string[];
    includesEs: string[];
    signsEn: string[];
    signsEs: string[];
}

export default function ServiceDetailPage(props: ServiceDetailPageProps) {
    const { language } = useLanguage();
    const includes = language === "en" ? props.includesEn : props.includesEs;
    const signs = language === "en" ? props.signsEn : props.signsEs;
    const isGeneratedCutout = props.image.startsWith("/redesign/generated/");

    return (
        <div className="bg-[#f7f4ec]">
            <section className="border-b border-[#cbd2cb]">
                <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-12 lg:py-24">
                    <div>
                        <div className="mb-8">
                            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#17643f] hover:underline">
                                <ArrowLeft size={18} />
                                {language === "en" ? "All services" : "Todos los servicios"}
                            </Link>
                        </div>
                        <div className="rf-kicker">{language === "en" ? props.eyebrowEn : props.eyebrowEs}</div>
                        <h1 className="mt-6 break-words font-display text-[clamp(3.25rem,13vw,6.7rem)] uppercase leading-[0.88] tracking-[-0.035em] text-[#101713]">
                            {language === "en" ? props.titleEn : props.titleEs}
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-[#465149] sm:text-xl sm:leading-9">
                            {language === "en" ? props.introEn : props.introEs}
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link href="/booking" className="rf-button rf-button-primary">{language === "en" ? "Book service" : "Reservar servicio"}</Link>
                            <a href="tel:+17027627573" className="rf-button rf-button-secondary"><Phone size={18} />702-762-7573</a>
                        </div>
                    </div>

                    <div className={isGeneratedCutout
                        ? "relative aspect-square sm:aspect-[4/3]"
                        : "relative aspect-square overflow-hidden rounded-2xl border border-[#b9c4bc] bg-[#fbf9f3] sm:aspect-[4/3] sm:rounded-[2rem]"
                    }>
                        <Image
                            src={props.image}
                            alt={language === "en" ? props.altEn : props.altEs}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 52vw"
                            className={isGeneratedCutout
                                ? "object-contain p-2 drop-shadow-[0_22px_24px_rgba(16,23,19,0.18)] sm:p-6"
                                : "object-cover"
                            }
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-[92rem] gap-4 px-5 py-14 sm:gap-8 sm:px-8 sm:py-24 lg:grid-cols-2 lg:px-12 lg:py-28">
                <div className="rounded-xl border border-[#b9c4bc] bg-[#fbf9f3] p-6 sm:rounded-2xl sm:p-10">
                    <h2 className="font-display text-3xl uppercase tracking-wide text-[#101713] sm:text-4xl">
                        {language === "en" ? "What we check" : "Lo que revisamos"}
                    </h2>
                    <ul className="mt-5 space-y-3 sm:mt-7 sm:space-y-4">
                        {includes.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#465149]"><CheckCircle2 className="mt-0.5 shrink-0 text-[#17643f]" size={21} />{item}</li>)}
                    </ul>
                </div>
                <div className="rounded-xl border border-[#b9c4bc] bg-[#e7ede7] p-6 sm:rounded-2xl sm:p-10">
                    <h2 className="font-display text-3xl uppercase tracking-wide text-[#101713] sm:text-4xl">
                        {language === "en" ? "When to schedule" : "Cuándo programarlo"}
                    </h2>
                    <ul className="mt-5 space-y-3 sm:mt-7 sm:space-y-4">
                        {signs.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#465149]"><CheckCircle2 className="mt-0.5 shrink-0 text-[#17643f]" size={21} />{item}</li>)}
                    </ul>
                </div>
            </section>
        </div>
    );
}
