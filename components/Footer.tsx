'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-300 border-t border-gray-800 mt-8">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo and Description */}
                <div>
                    <h2 className="text-xl font-bold text-white">Rainforest Automotive</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Reliable mechanic services in Miami, FL. We keep your vehicle running
                        smoothly with honest, affordable care.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                        Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link href="/" className="hover:text-green-400 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-green-400 transition">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/discounts" className="hover:text-green-400 transition">
                                Discounts
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-400 transition">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                        Contact Us
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>Miami, FL</li>
                        <li>
                            <a href="tel:+17028349385" className="hover:text-green-400 transition">
                                +1 (702) 834-9385
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:info@rainforestautomotive.work"
                                className="hover:text-green-400 transition"
                            >
                                info@rainforestautomotive.work
                            </a>
                        </li>
                    </ul>
                    {/* Socials Placeholder */}
                    <div className="flex space-x-4 mt-4">
                        <a href="#" aria-label="Facebook" className="hover:text-green-400 transition">
                            FB
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-green-400 transition">
                            IG
                        </a>
                        <a href="#" aria-label="WhatsApp" className="hover:text-green-400 transition">
                            WA
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 py-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Rainforest Automotive. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;