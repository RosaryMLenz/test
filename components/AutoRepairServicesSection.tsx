// components/AutoRepairServicesSection.tsx

"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
    Droplet,
    Wind,
    CircleDot,
    Circle,
    Snowflake,
    Car,
} from "lucide-react";

const services = [
    {
        titleEn: "Oil Change",
        titleEs: "Cambio de Aceite",
        descriptionEn:
            "Regularly changing your oil and filter will help the engine work its best.",
        descriptionEs:
            "Cambiar regularmente el aceite y el filtro ayudará a que el motor funcione de la mejor manera.",
        linkLabelEn: "Oil Change Services",
        linkLabelEs: "Servicios de Cambio de Aceite",
        link: "/services/oil-change",
        icon: Droplet,
    },
    {
        titleEn: "Exhaust & Mufflers",
        titleEs: "Escape y Silenciadores",
        descriptionEn:
            "Mufflers do more than keep your car quiet. Since 1972, we've been the muffler experts.",
        descriptionEs:
            "Los silenciadores hacen más que mantener tu coche silencioso. Desde 1972, somos expertos en silenciadores.",
        linkLabelEn: "Exhaust & Muffler Services",
        linkLabelEs: "Servicios de Escape y Silenciadores",
        link: "/services/exhaust-mufflers",
        icon: Wind,
    },
    {
        titleEn: "Brakes",
        titleEs: "Frenos",
        descriptionEn:
            "Brake maintenance is crucial to keeping your vehicle operating safely.",
        descriptionEs:
            "El mantenimiento de los frenos es crucial para mantener la seguridad de tu vehículo.",
        linkLabelEn: "Brake Repair Services",
        linkLabelEs: "Servicios de Reparación de Frenos",
        link: "/services/brakes",
        icon: CircleDot,
    },
    {
        titleEn: "Tires & Wheels",
        titleEs: "Llantas y Ruedas",
        descriptionEn:
            "Regularly inspect and service your tires to prevent a blowout, a flat, or a costly accident.",
        descriptionEs:
            "Inspecciona y da servicio regularmente a tus llantas para prevenir reventones, ponchaduras o accidentes costosos.",
        linkLabelEn: "Tire & Wheel Services",
        linkLabelEs: "Servicios de Llantas y Ruedas",
        link: "/services/tires-wheels",
        icon: Circle,
    },
    {
        titleEn: "A/C",
        titleEs: "Aire Acondicionado",
        descriptionEn:
            "Keep your car cool and increase your gas mileage with regular AC checks.",
        descriptionEs:
            "Mantén tu coche fresco y mejora el rendimiento de combustible con revisiones regulares del aire acondicionado.",
        linkLabelEn: "A/C Repair Services",
        linkLabelEs: "Servicios de Reparación de A/C",
        link: "/services/ac-repair",
        icon: Snowflake,
    },
    {
        titleEn: "Steering & Suspension",
        titleEs: "Dirección y Suspensión",
        descriptionEn:
            "Your car’s steering and suspension work together to keep your ride smooth and handling precise.",
        descriptionEs:
            "La dirección y suspensión de tu coche trabajan juntas para mantener un manejo suave y preciso.",
        linkLabelEn: "Steering & Suspension Services",
        linkLabelEs: "Servicios de Dirección y Suspensión",
        link: "/services/steering-suspension",
        icon: Car,
    },
];

export default function AutoRepairServicesSection() {
    const router = useRouter();
    const { language } = useLanguage();

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
                {language === "en" ? "Auto Repair Services" : "Servicios de Reparación Automotriz"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.titleEn}
                        className={cn(
                            "bg-white dark:bg-neutral-900 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer flex items-start gap-4"
                        )}
                        onClick={() => router.push(service.link)}
                    >
                        <div className="flex-shrink-0 p-2 rounded-full bg-green-100 dark:bg-green-800">
                            <service.icon
                                size={28}
                                className="text-green-700 dark:text-green-200"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1 text-green-800 dark:text-green-200">
                                {language === "en" ? service.titleEn : service.titleEs}
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                {language === "en" ? service.descriptionEn : service.descriptionEs}
                            </p>
                            <span className="text-green-600 dark:text-green-400 font-medium underline">
                {language === "en" ? service.linkLabelEn : service.linkLabelEs}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
