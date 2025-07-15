import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from '@/types/BookingFormData';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

export default function Step1({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '').slice(0, 10);
        const parts = [];
        if (numbers.length > 3) {
            parts.push(numbers.slice(0, 3));
            if (numbers.length > 6) {
                parts.push(numbers.slice(3, 6));
                parts.push(numbers.slice(6));
            } else {
                parts.push(numbers.slice(3));
            }
        } else {
            parts.push(numbers);
        }
        return parts.join('-');
    };

    const translations = {
        title: language === "en" ? "Contact Information" : "Información de Contacto",
        subtitle: language === "en"
            ? "Start by providing your details so we can confirm your booking."
            : "Comienza proporcionando tus datos para confirmar tu cita.",
        name: language === "en" ? "Name *" : "Nombre *",
        email: language === "en" ? "Email Address *" : "Correo Electrónico *",
        phone: language === "en" ? "Phone Number *" : "Número de Teléfono *",
        phoneHelper: language === "en"
            ? "By providing your phone number, you agree to receive SMS updates regarding your appointment. Message and data rates may apply. Reply STOP to opt out."
            : "Al proporcionar tu número de teléfono, aceptas recibir actualizaciones por SMS sobre tu cita. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para darte de baja.",
        placeholderName: language === "en" ? "John Doe" : "Juan Pérez",
        placeholderEmail: language === "en" ? "you@example.com" : "tu@ejemplo.com",
        placeholderPhone: "111-111-1111"
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    {translations.title}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    {translations.subtitle}
                </p>

                <div className="my-8">
                    <div className="mb-4 flex flex-col space-y-4">
                        <LabelInputContainer>
                            <Label htmlFor="name">{translations.name}</Label>
                            <Input
                                id="name"
                                placeholder={translations.placeholderName}
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="email">{translations.email}</Label>
                            <Input
                                id="email"
                                placeholder={translations.placeholderEmail}
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="phone">{translations.phone}</Label>
                            <Input
                                id="phone"
                                placeholder={translations.placeholderPhone}
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => {
                                    const formatted = formatPhoneNumber(e.target.value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        phone: formatted,
                                    }));
                                }}
                                required
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {translations.phoneHelper}
                            </p>
                        </LabelInputContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
);