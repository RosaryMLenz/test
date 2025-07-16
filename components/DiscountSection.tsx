import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const slides = [
    "/discount-slides/slide1.jpg",
    "/discount-slides/slide2.jpg",
    "/discount-slides/slide3.jpg",
    "/discount-slides/slide4.jpg",
    "/discount-slides/slide5.jpg",
    "/discount-slides/slide6.jpg",
    "/discount-slides/slide7.jpg",
    "/discount-slides/slide8.jpg",
    "/discount-slides/slide9.jpg",
    "/discount-slides/slide10.jpg"
];

const INTERVAL_MS = 5000;

interface DiscountSectionProps {
    onBookClick: () => void;
}

export default function DiscountSection({ onBookClick }: DiscountSectionProps) {
    const { language } = useLanguage();
    const [current, setCurrent] = useState(0);

    const totalPairs = Math.ceil(slides.length / 2);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % totalPairs);
        }, INTERVAL_MS);
        return () => clearInterval(interval);
    }, [totalPairs]);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + totalPairs) % totalPairs);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % totalPairs);
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 dark:text-green-300 mb-4">
                {language === "en" ? "July Special: 15% Off Oil Changes!" : "¡Especial de Julio: 15% de Descuento en Cambios de Aceite!"}
            </h2>
            <p className="text-center text-green-600 dark:text-green-300 mb-8 max-w-xl mx-auto">
                {language === "en"
                    ? "Book your oil change before July 31 to save 15% on your next service with Rainforest Automotive."
                    : "Reserve su cambio de aceite antes del 31 de julio para ahorrar 15% en su próximo servicio con Rainforest Automotive."}
            </p>

            {/* Slideshow */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg max-w-6xl mx-auto w-full">
                <div className="flex transition-transform duration-700 ease-in-out w-full"
                     style={{ transform: `translateX(-${current * 100}%)` }}>
                    {Array.from({ length: totalPairs }).map((_, idx) => {
                        const [first, second] = [slides[idx * 2], slides[idx * 2 + 1]];
                        return (
                            <div key={idx} className="flex-shrink-0 w-full flex flex-col md:flex-row gap-2 md:gap-4">
                                <div className="relative w-full md:w-1/2 aspect-video md:aspect-video">
                                    {first && (
                                        <Image
                                            src={first}
                                            alt={language === "en" ? `Slide ${idx * 2 + 1}` : `Diapositiva ${idx * 2 + 1}`}
                                            fill
                                            className="object-cover object-center"
                                            priority={idx === current}
                                        />
                                    )}
                                </div>
                                {second && (
                                    <div className="relative w-full md:w-1/2 aspect-video md:aspect-video">
                                        <Image
                                            src={second}
                                            alt={language === "en" ? `Slide ${idx * 2 + 2}` : `Diapositiva ${idx * 2 + 2}`}
                                            fill
                                            className="object-cover object-center"
                                            priority={idx === current}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
                    aria-label={language === "en" ? "Previous Slide" : "Diapositiva Anterior"}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
                    aria-label={language === "en" ? "Next Slide" : "Siguiente Diapositiva"}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={onBookClick}
                    className="px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                >
                    {language === "en" ? "Book Now and Save" : "Reserve Ahora y Ahorre"}
                </button>
            </div>
        </section>
    );
}