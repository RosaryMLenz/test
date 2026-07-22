"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/BrandLogo";

const links = [
    { href: "/services", labelEn: "Services", labelEs: "Servicios" },
    { href: "/about", labelEn: "About", labelEs: "Nosotros" },
    { href: "/contact", labelEn: "Contact", labelEs: "Contacto" },
];

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const { language, toggleLanguage } = useLanguage();

    return (
        <header className="border-b border-[#cbd2cb] bg-[#f7f4ec]/95 text-[#111915] backdrop-blur-md">
            <div className="mx-auto flex h-[5.25rem] max-w-[92rem] items-center justify-between px-5 sm:px-8 lg:px-12">
                <BrandLogo />

                <nav className="hidden items-center gap-8 lg:flex" aria-label={language === "en" ? "Main navigation" : "Navegación principal"}>
                    {links.map((link) => {
                        const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rf-nav-link ${active ? "text-[#17643f]" : "text-[#111915]"}`}
                            >
                                {language === "en" ? link.labelEn : link.labelEs}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="rf-nav-link px-2 text-[#111915]"
                        aria-label={language === "en" ? "Cambiar a español" : "Switch to English"}
                    >
                        <span className={language === "en" ? "text-[#17643f]" : ""}>EN</span>
                        <span className="px-1 text-[#7b857e]">/</span>
                        <span className={language === "es" ? "text-[#17643f]" : ""}>ES</span>
                    </button>
                    <a href="tel:+17027627573" className="rf-button rf-button-secondary min-h-12 px-5">
                        <Phone size={17} aria-hidden="true" />
                        {language === "en" ? "Call" : "Llamar"}
                    </a>
                    <Link href="/booking" className="rf-button rf-button-primary min-h-12 px-7">
                        {language === "en" ? "Book service" : "Reservar servicio"}
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={language === "en" ? "Toggle navigation" : "Abrir navegación"}
                    className="grid h-12 w-12 place-items-center rounded-md border border-[#b8c2ba] text-[#164e34] lg:hidden"
                >
                    {menuOpen ? <X size={25} /> : <Menu size={27} />}
                </button>
            </div>

            {menuOpen && (
                <nav id="mobile-navigation" className="border-t border-[#d7ddd8] bg-[#f7f4ec] px-5 py-5 lg:hidden" aria-label="Mobile navigation">
                    <div className="mx-auto flex max-w-[92rem] flex-col">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-[#d7ddd8] py-4 font-display text-2xl uppercase tracking-wide text-[#111915]"
                            >
                                {language === "en" ? link.labelEn : link.labelEs}
                            </Link>
                        ))}
                        <button type="button" onClick={toggleLanguage} className="rf-nav-link mt-5 w-fit py-2 text-[#17643f]">
                            {language === "en" ? "Ver en español" : "View in English"}
                        </button>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <a href="tel:+17027627573" className="rf-button rf-button-secondary">
                                <Phone size={17} aria-hidden="true" />
                                {language === "en" ? "Call" : "Llamar"}
                            </a>
                            <Link href="/booking" onClick={() => setMenuOpen(false)} className="rf-button rf-button-primary flex-1">
                                {language === "en" ? "Book service" : "Reservar"}
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
