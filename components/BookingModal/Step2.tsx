
import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "./BookingModal";
import { Car, Droplet, Wrench, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const servicesTop = [
    { key: "Car Problems", descriptionEn: "Describe issues", descriptionEs: "Describe los problemas", icon: AlertCircle },
];

const servicesOther = [
    { key: "Oil Change", descriptionEn: "Oil, Filter, Lube", descriptionEs: "Aceite, Filtro, Lubricación", icon: Droplet },
    { key: "AC Service", descriptionEn: "Cooling system check", descriptionEs: "Revisión del sistema de aire", icon: Car },
    { key: "Brakes", descriptionEn: "Check pads, rotors", descriptionEs: "Revisar pastillas, rotores", icon: AlertCircle },
    { key: "Engine Diagnostics", descriptionEn: "Full engine scan", descriptionEs: "Escaneo completo del motor", icon: Car },
    { key: "Tire Rotation", descriptionEn: "Balance and alignment", descriptionEs: "Balanceo y alineación", icon: Circle },
    { key: "Battery Check", descriptionEn: "Test and inspect battery", descriptionEs: "Probar e inspeccionar batería", icon: Car },
    { key: "Transmission Check", descriptionEn: "Fluid and diagnostics", descriptionEs: "Fluidos y diagnóstico", icon: Wrench },
    { key: "Suspension Check", descriptionEn: "Shocks, struts", descriptionEs: "Amortiguadores, puntales", icon: Car },
    { key: "Fluid Check", descriptionEn: "All essential fluids", descriptionEs: "Todos los fluidos esenciales", icon: Car },
    { key: "Light Inspection", descriptionEn: "Headlights, signals", descriptionEs: "Luces delanteras, señales", icon: Car },
    { key: "Exhaust Check", descriptionEn: "Emissions and leaks", descriptionEs: "Emisiones y fugas", icon: Car },
    { key: "Cooling System", descriptionEn: "Radiator and hoses", descriptionEs: "Radiador y mangueras", icon: Car },
];

export default function Step2({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

    const toggleService = (service: string) => {
        const currentServices = formData.reason?.split(", ").filter(Boolean) || [];
        const isSelected = currentServices.includes(service);

        const updatedServices = isSelected
            ? currentServices.filter((s) => s !== service)
            : [...currentServices, service];

        setFormData((prev) => ({
            ...prev,
            reason: updatedServices.join(", "),
        }));
    };

    const selectedServices = formData.reason?.split(", ").filter(Boolean) || [];

    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    {language === "en" ? "Step 2: Select Services" : "Paso 2: Selecciona Servicios"}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    {language === "en"
                        ? "You may select multiple services you need for your vehicle."
                        : "Puedes seleccionar múltiples servicios que necesitas para tu vehículo."}
                </p>

                <div className="my-6 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                    {/* Car Problems pinned at top */}
                    {servicesTop.map(({ key, descriptionEn, descriptionEs, icon: Icon }) => {
                        const isSelected = selectedServices.includes(key);
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleService(key)}
                                onKeyDown={(e) => e.key === "Enter" && toggleService(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-blue-600">
                                    <Icon size={28} />
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {key}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "en" ? descriptionEn : descriptionEs}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-300 dark:border-neutral-700 my-6" />

                    {/* Other services */}
                    {servicesOther.map(({ key, descriptionEn, descriptionEs, icon: Icon }) => {
                        const isSelected = selectedServices.includes(key);
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleService(key)}
                                onKeyDown={(e) => e.key === "Enter" && toggleService(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-blue-600">
                                    <Icon size={28} />
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {key}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === "en" ? descriptionEn : descriptionEs}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
