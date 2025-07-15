import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { BookingFormData } from "@/types/BookingFormData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

interface Make {
    make_id: string;
    make_display: string;
}

interface Year {
    year: number;
}

interface Model {
    model_name: string;
}

interface Trim {
    model_trim: string;
}

export default function Step3({ formData, setFormData }: StepProps) {
    const { language } = useLanguage();
    const [makes, setMakes] = useState<Make[]>([]);
    const [years, setYears] = useState<Year[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [trims, setTrims] = useState<Trim[]>([]);
    const [openMake, setOpenMake] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [openTrim, setOpenTrim] = useState(false);
    const [loadingMakes, setLoadingMakes] = useState(true);
    const [errorMakes, setErrorMakes] = useState<string | null>(null);

    const options = [
        {
            key: "Drop off my vehicle",
            labelEn: "Drop off my vehicle",
            labelEs: "Dejar mi vehículo",
            descriptionEn: "Leave your car with us for the day.",
            descriptionEs: "Deja tu coche con nosotros durante el día.",
        },
        {
            key: "Wait at the shop",
            labelEn: "Wait at the shop",
            labelEs: "Esperar en el taller",
            descriptionEn: "Available.",
            descriptionEs: "Disponible.",
        },
    ];

    const handleOptionSelect = (option: string) => {
        setFormData((prev) => ({
            ...prev,
            dropOffOrWait: option,
        }));
    };

    // Fetch makes on mount
    useEffect(() => {
        setLoadingMakes(true);
        setErrorMakes(null);
        fetch('/api/vehicles?type=makes')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json() as Promise<{ data: Make[] }>;
            })
            .then(data => {
                if (!data || !Array.isArray(data.data)) {
                    throw new Error('Invalid data format');
                }
                const uniqueMakes = data.data.reduce((acc: Make[], current: Make) => {
                    if (!acc.find((m) => m.make_id === current.make_id)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                setMakes(uniqueMakes);
            })
            .catch(err => {
                setErrorMakes(err.message);
                setMakes([]);
            })
            .finally(() => setLoadingMakes(false));
    }, []);

    // Fetch years when make changes
    useEffect(() => {
        if (formData.make) {
            fetch(`/api/vehicles?type=years&make=${encodeURIComponent(formData.make)}`)
                .then(res => res.json() as Promise<{ data: Year[] }>)
                .then(data => {
                    const uniqueYears = data.data.reduce((acc: Year[], current: Year) => {
                        if (!acc.find((y) => y.year === current.year)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    uniqueYears.sort((a, b) => b.year - a.year); // Sort descending
                    setYears(uniqueYears);
                })
                .catch(() => setYears([]));
            setFormData((prev) => ({ ...prev, year: '', model: '', trim: '' })); // Reset dependents
        }
    }, [formData.make, setFormData]);

    // Fetch models when year changes
    useEffect(() => {
        if (formData.make && formData.year) {
            fetch(`/api/vehicles?type=models&make=${encodeURIComponent(formData.make)}&year=${formData.year}`)
                .then(res => res.json() as Promise<{ data: Model[] }>)
                .then(data => {
                    const uniqueModels = data.data.reduce((acc: Model[], current: Model) => {
                        if (!acc.find((m) => m.model_name === current.model_name)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    setModels(uniqueModels);
                })
                .catch(() => setModels([]));
            setFormData((prev) => ({ ...prev, model: '', trim: '' })); // Reset dependents
        }
    }, [formData.make, formData.year, setFormData]);

    // Fetch trims when model changes
    useEffect(() => {
        if (formData.make && formData.year && formData.model) {
            fetch(`/api/vehicles?type=trims&make=${encodeURIComponent(formData.make)}&year=${formData.year}&model=${encodeURIComponent(formData.model)}`)
                .then(res => res.json() as Promise<{ data: Trim[] }>)
                .then(data => {
                    const uniqueTrims = data.data.reduce((acc: Trim[], current: Trim) => {
                        if (!acc.find((t) => t.model_trim === current.model_trim)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    setTrims(uniqueTrims);
                })
                .catch(() => setTrims([]));
            setFormData((prev) => ({ ...prev, trim: '' })); // Reset trim
        }
    }, [formData.make, formData.year, formData.model, setFormData]);

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded bg-white dark:bg-neutral-900 p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                {language === "en"
                    ? "Vehicle Details & Drop Off or Wait"
                    : "Detalles del Vehículo y Dejar o Esperar"}
            </h2>

            {/* Make Combobox */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "en" ? "Make *" : "Marca *"}
                </label>
                <Popover open={openMake} onOpenChange={setOpenMake}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openMake}
                            className="w-full justify-between"
                        >
                            {formData.make || (language === "en" ? "Select make..." : "Selecciona marca...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search make..." : "Buscar marca..."} />
                            {loadingMakes ? (
                                <div className="py-6 text-center text-sm">Loading...</div>
                            ) : errorMakes ? (
                                <div className="py-6 text-center text-sm text-red-500">{errorMakes}</div>
                            ) : (
                                <>
                                    <CommandEmpty>{language === "en" ? "No make found." : "No se encontró marca."}</CommandEmpty>
                                    <CommandList className="overflow-y-auto max-h-60">
                                        <CommandGroup>
                                            {makes.map((make) => (
                                                <CommandItem
                                                    key={make.make_id}
                                                    value={make.make_display}
                                                    onSelect={() => {
                                                        setFormData((prev) => ({ ...prev, make: make.make_display }));
                                                        setOpenMake(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", formData.make === make.make_display ? "opacity-100" : "opacity-0")} />
                                                    {make.make_display}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Year Combobox */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "en" ? "Year *" : "Año *"}
                </label>
                <Popover open={openYear} onOpenChange={setOpenYear}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openYear}
                            className="w-full justify-between"
                            disabled={!formData.make}
                        >
                            {formData.year || (language === "en" ? "Select year..." : "Selecciona año...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search year..." : "Buscar año..."} />
                            <CommandEmpty>{language === "en" ? "No year found." : "No se encontró año."}</CommandEmpty>
                            <CommandList className="overflow-y-auto max-h-60">
                                <CommandGroup>
                                    {years.map((yearObj) => {
                                        const year = yearObj.year.toString();
                                        return (
                                            <CommandItem
                                                key={year}
                                                value={year}
                                                onSelect={() => {
                                                    setFormData((prev) => ({ ...prev, year: year }));
                                                    setOpenYear(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", formData.year === year ? "opacity-100" : "opacity-0")} />
                                                {year}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Model Combobox */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "en" ? "Model *" : "Modelo *"}
                </label>
                <Popover open={openModel} onOpenChange={setOpenModel}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openModel}
                            className="w-full justify-between"
                            disabled={!formData.year}
                        >
                            {formData.model || (language === "en" ? "Select model..." : "Selecciona modelo...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search model..." : "Buscar modelo..."} />
                            <CommandEmpty>{language === "en" ? "No model found." : "No se encontró modelo."}</CommandEmpty>
                            <CommandList className="overflow-y-auto max-h-60">
                                <CommandGroup>
                                    {models.map((model) => (
                                        <CommandItem
                                            key={model.model_name}
                                            value={model.model_name}
                                            onSelect={() => {
                                                setFormData((prev) => ({ ...prev, model: model.model_name }));
                                                setOpenModel(false);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", formData.model === model.model_name ? "opacity-100" : "opacity-0")} />
                                            {model.model_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Trim Combobox */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "en" ? "Trim *" : "Trim *"}
                </label>
                <Popover open={openTrim} onOpenChange={setOpenTrim}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTrim}
                            className="w-full justify-between"
                            disabled={!formData.model}
                        >
                            {formData.trim || (language === "en" ? "Select trim..." : "Selecciona trim...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search trim..." : "Buscar trim..."} />
                            <CommandEmpty>{language === "en" ? "No trim found." : "No se encontró trim."}</CommandEmpty>
                            <CommandList className="overflow-y-auto max-h-60">
                                <CommandGroup>
                                    {trims.map((trim) => (
                                        <CommandItem
                                            key={trim.model_trim}
                                            value={trim.model_trim}
                                            onSelect={() => {
                                                setFormData((prev) => ({ ...prev, trim: trim.model_trim }));
                                                setOpenTrim(false);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", formData.trim === trim.model_trim ? "opacity-100" : "opacity-0")} />
                                            {trim.model_trim}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                {language === "en"
                    ? "Please select if you will drop off your vehicle or wait at the shop."
                    : "Por favor selecciona si dejarás tu vehículo o esperarás en el taller."}
            </p>

            {options.map(({ key, labelEn, labelEs, descriptionEn, descriptionEs }) => {
                const isSelected = formData.dropOffOrWait === key;
                return (
                    <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOptionSelect(key)}
                        onKeyDown={(e) => e.key === "Enter" && handleOptionSelect(key)}
                        className={cn(
                            "p-3 border rounded-lg cursor-pointer mb-2 transition",
                            isSelected
                                ? "bg-blue-100 border-blue-600 dark:bg-blue-900 dark:border-blue-500"
                                : "hover:bg-gray-100 dark:hover:bg-neutral-800 border-gray-300 dark:border-neutral-700"
                        )}
                    >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {language === "en" ? labelEn : labelEs}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {language === "en" ? descriptionEn : descriptionEs}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}