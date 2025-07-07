import React, { Dispatch, SetStateAction } from "react";
import { BookingFormData } from "@/types/BookingFormData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const issues = [
    { key: "Vehicle won't start", es: "El vehículo no arranca" },
    { key: "Warning light turned on", es: "Se encendió una luz de advertencia" },
    { key: "I hear a strange noise", es: "Escucho un ruido extraño" },
    { key: "The car smells weird", es: "El coche huele raro" },
    { key: "I see smoke", es: "Veo humo" },
    { key: "I see a leak", es: "Veo una fuga" },
    { key: "Other", es: "Otro" },
];

export default function Step3CarProblems({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();

    const toggleIssue = (issue: string) => {
        const currentIssues = formData.problemDescription?.split(", ").filter(Boolean) || [];
        const isSelected = currentIssues.includes(issue);

        const updatedIssues = isSelected
            ? currentIssues.filter((i) => i !== issue)
            : [...currentIssues, issue];

        setFormData((prev) => ({
            ...prev,
            problemDescription: updatedIssues.join(", "),
        }));
    };

    const selectedIssues = formData.problemDescription?.split(", ").filter(Boolean) || [];

    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    {language === "en" ? "Step 3: Describe Car Problems" : "Paso 3: Describe los Problemas del Coche"}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    {language === "en"
                        ? "Select all issues you are experiencing with your vehicle."
                        : "Selecciona todos los problemas que estás experimentando con tu vehículo."}
                </p>

                <div className="my-6 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                    {issues.map(({ key, es }) => {
                        const isSelected = selectedIssues.includes(key);
                        return (
                            <div
                                key={key}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleIssue(key)}
                                onKeyDown={(e) => e.key === "Enter" && toggleIssue(key)}
                                className={cn(
                                    "flex items-center rounded-lg border p-3 cursor-pointer transition select-none",
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                                        : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="ml-1 flex flex-col">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {language === "en" ? key : es}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Optional additional notes */}
                <div className="mt-4">
                    <label
                        htmlFor="additionalDetails"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {language === "en" ? "Additional Details (optional)" : "Detalles Adicionales (opcional)"}
                    </label>
                    <textarea
                        id="additionalDetails"
                        placeholder={language === "en" ? "Describe any additional details you're experiencing..." : "Describe cualquier detalle adicional que estés experimentando..."}
                        value={formData.additionalDetails || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                additionalDetails: e.target.value,
                            }))
                        }
                        className="border rounded w-full p-2 h-24 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white transition"
                    />
                </div>
            </div>
        </div>
    );
}
