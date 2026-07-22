"use client";

import Link from "next/link";
import { Globe2, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <footer className="bg-[#07110e] text-[#dce4de]">
            <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                <div className="grid gap-12 border-b border-[#314239] pb-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.65fr_1fr_0.65fr]">
                    <div>
                        <BrandLogo inverted />
                        <p className="mt-7 max-w-sm text-lg leading-8 text-[#b9c5bd]">
                            {language === "en"
                                ? "Straightforward auto repair and maintenance in Las Vegas."
                                : "Reparación y mantenimiento automotriz sin complicaciones en Las Vegas."}
                        </p>
                    </div>

                    <div>
                        <div className="rf-footer-heading">{language === "en" ? "Explore" : "Explorar"}</div>
                        <nav className="mt-5 flex flex-col gap-4" aria-label="Footer navigation">
                            <Link href="/services" className="rf-footer-link">{language === "en" ? "Services" : "Servicios"}</Link>
                            <Link href="/about" className="rf-footer-link">{language === "en" ? "About" : "Nosotros"}</Link>
                            <Link href="/contact" className="rf-footer-link">{language === "en" ? "Contact" : "Contacto"}</Link>
                            <Link href="/privacy" className="rf-footer-link">{language === "en" ? "Privacy" : "Privacidad"}</Link>
                        </nav>
                    </div>

                    <div>
                        <div className="rf-footer-heading">{language === "en" ? "Contact" : "Contacto"}</div>
                        <div className="mt-5 space-y-5 text-[#c4cec7]">
                            <a href="tel:+17027627573" className="flex gap-3 hover:text-white"><Phone className="shrink-0 text-[#4b9a6d]" size={21} />702-762-7573</a>
                            <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#4b9a6d]" size={21} /><span>3280 Wynn Rd, Unit 4<br />Las Vegas, NV 89102</span></div>
                            <button type="button" onClick={toggleLanguage} className="flex gap-3 text-left hover:text-white"><Globe2 className="shrink-0 text-[#4b9a6d]" size={21} />{language === "en" ? "English / Español" : "Español / English"}</button>
                        </div>
                    </div>

                    <div>
                        <div className="rf-footer-heading">{language === "en" ? "Follow us" : "Síguenos"}</div>
                        <a
                            href="https://www.instagram.com/rainforest21automotive"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="mt-5 grid h-12 w-12 place-items-center rounded-lg border border-[#42614f] text-white transition hover:border-[#63a77e] hover:text-[#63a77e]"
                        >
                            <span className="text-sm font-black tracking-wider">IG</span>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-8 text-sm text-[#849188] sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} Rainforest21 Automotive. {language === "en" ? "All rights reserved." : "Todos los derechos reservados."}</span>
                    <span>rainforest21automotive.com</span>
                </div>
            </div>
        </footer>
    );
}
