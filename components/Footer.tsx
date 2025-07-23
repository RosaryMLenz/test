"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
    const { language } = useLanguage();

    return (
        <footer className="bg-white text-black dark:bg-black dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 mt-8 transition-colors">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo and Description */}
                <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">
                        Rainforest Automotive
                    </h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                        {language === "en"
                            ? "Reliable mechanic services in Las Vegas, NV. We keep your vehicle running smoothly with honest, affordable care."
                            : "Servicios mecánicos confiables en Las Vegas, NV. Mantenemos su vehículo en óptimas condiciones con un servicio honesto y asequible."}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
                        {language === "en" ? "Quick Links" : "Enlaces Rápidos"}
                    </h3>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link href="/" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                {language === "en" ? "Home" : "Inicio"}
                            </Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                {language === "en" ? "Services" : "Servicios"}
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                {language === "en" ? "Contact" : "Contacto"}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
                        {language === "en" ? "Contact Us" : "Contáctenos"}
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-400">
                        <li>Las Vegas, NV</li>
                        <li>
                            <a
                                href="tel:+1-702-762-7573"
                                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                            >
                                +1-702-762-7573
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:office@rainforest21automotive.com"
                                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                            >
                                office@rainforest21automotive.com
                            </a>
                        </li>
                    </ul>

                    {/* Socials */}
                    <div className="flex space-x-4 mt-4">
                        <a
                            href="https://www.facebook.com/yourhandle"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                            FB
                        </a>
                        <a
                            href="https://www.instagram.com/rainforest21automotive"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                            IG
                        </a>
                        <a
                            href="https://www.tiktok.com/@rainforest21.auto"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                            TK
                        </a>
                    </div>

                </div>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 mt-8 py-4 text-center text-xs text-gray-600 dark:text-gray-500 transition-colors">
                © {new Date().getFullYear()} Rainforest Automotive. {language === "en" ? "All rights reserved." : "Todos los derechos reservados."}
            </div>
        </footer>
    );
};

export default Footer;