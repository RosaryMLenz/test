'use client';

import React from 'react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative bg-black text-white flex items-center justify-center min-h-[80vh] px-6 sm:px-8">
            {/* Background Image Overlay (optional, can be replaced with Tailwind bg) */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('/mechanic-hero.jpg')" }} // replace with your image in /public
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90"></div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl text-center">
                <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                    Reliable Mechanic Services in Miami
                </h1>
                <p className="text-gray-300 mb-6 text-lg sm:text-xl">
                    Book your oil change, brake repair, or diagnostics with Rainforest Automotive
                    today for honest, fast, and affordable care.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/booking"
                        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded transition"
                    >
                        Book Appointment
                    </Link>
                    <a
                        href="tel:+17028349385"
                        className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold px-6 py-3 rounded transition"
                    >
                        Call Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;