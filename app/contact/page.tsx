"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { language } = useLanguage();

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            {/* Embedded Map */}
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                    src="https://www.google.com/maps?q=3280+Wynn+Rd+Unit+4+Las+Vegas+NV+89102&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Contact Information */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    {language === "en" ? "Contact Rainforest21 Automotive" : "Contactar a Rainforest21 Automotive"}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
                    {language === "en"
                        ? "We’re here to help with your vehicle needs. Reach out to us by phone, email, or visit our shop in Las Vegas."
                        : "Estamos aquí para ayudar con las necesidades de su vehículo. Contáctenos por teléfono, correo electrónico o visítenos en nuestro taller en Las Vegas."}
                </p>

                <div className="flex flex-col items-center space-y-2">
                    <a href="tel:+1-702-762-7573" className="text-green-600 dark:text-green-400 hover:underline text-lg font-medium">
                        +1-702-762-7573
                    </a>
                    <a href="mailto:office@rainforest21automotive.com" className="text-green-600 dark:text-green-400 hover:underline text-lg font-medium">
                        office@rainforest21automotive.com
                    </a>
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium text-center">
                        3280 Wynn Rd, Unit 4<br />
                        Las Vegas, NV 89102<br />
                        United States
                    </p>
                </div>

                <a
                    href="https://www.google.com/maps/dir/?api=1&destination=3280+Wynn+Rd+Unit+4+Las+Vegas+NV+89102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    {language === "en" ? "Get Directions" : "Obtener Direcciones"}
                </a>
            </div>

            {/* Additional details beneficial for a mechanic shop */}
            <div className="max-w-xl mx-auto text-center space-y-3 text-gray-700 dark:text-gray-300">
                <p>{language === "en" ? "Open Monday - Friday from 9:00 AM to 6:00 PM." : "Abierto de lunes a viernes de 9:00 AM a 6:00 PM."}</p>
                <p>{language === "en" ? "Open Saturday from 9:00 AM to 12:00 PM." : "Sábado de 9:00 AM a 12:00 PM."}</p>
                <p>{language === "en" ? "Walk-ins welcome, or book your appointment online." : "Se aceptan visitas sin cita, o reserve su cita en línea."}</p>
                <p>{language === "en" ? "We offer free diagnostics with any repair service." : "Ofrecemos diagnóstico gratuito con cualquier servicio de reparación."}</p>
            </div>
        </section>
    );
}
