import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BookingFormData } from "@/types/BookingFormData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";

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

async function fetchVehicleOptions<T>(url: string, signal: AbortSignal): Promise<T[]> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Vehicle data request failed with status ${response.status}`);
    }

    const payload = await response.json() as { data?: unknown };
    if (!Array.isArray(payload.data)) {
        throw new Error("Vehicle data response was invalid");
    }

    return payload.data as T[];
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
    return Array.from(new Map(items.map((item) => [getKey(item), item])).values());
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
    const [loadingYears, setLoadingYears] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingTrims, setLoadingTrims] = useState(false);
    const [errorMakes, setErrorMakes] = useState(false);
    const [errorYears, setErrorYears] = useState(false);
    const [errorModels, setErrorModels] = useState(false);
    const [errorTrims, setErrorTrims] = useState(false);

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

    const notListedLabel = language === "en" ? "Other / not listed" : "Otro / no aparece";
    const notSureLabel = language === "en" ? "Not sure" : "No estoy seguro";
    const popoverClassName = "z-[120] w-[var(--radix-popover-trigger-width)] p-0";

    useEffect(() => {
        const controller = new AbortController();

        fetchVehicleOptions<Make>("/api/vehicles?type=makes", controller.signal)
            .then((data) => {
                setMakes(uniqueBy(data, (make) => make.make_display).sort((a, b) => a.make_display.localeCompare(b.make_display)));
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("Unable to load vehicle makes", error);
                setMakes([]);
                setErrorMakes(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingMakes(false);
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!formData.make) return;

        const controller = new AbortController();
        fetchVehicleOptions<Year>(`/api/vehicles?type=years&make=${encodeURIComponent(formData.make)}`, controller.signal)
            .then((data) => {
                setYears(uniqueBy(data, (year) => String(year.year)).sort((a, b) => b.year - a.year));
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("Unable to load vehicle years", error);
                setErrorYears(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingYears(false);
            });

        return () => controller.abort();
    }, [formData.make]);

    useEffect(() => {
        if (!formData.make || !formData.year) return;

        const controller = new AbortController();
        fetchVehicleOptions<Model>(
            `/api/vehicles?type=models&make=${encodeURIComponent(formData.make)}&year=${encodeURIComponent(formData.year)}`,
            controller.signal,
        )
            .then((data) => {
                setModels(uniqueBy(data, (model) => model.model_name).sort((a, b) => a.model_name.localeCompare(b.model_name)));
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("Unable to load vehicle models", error);
                setErrorModels(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingModels(false);
            });

        return () => controller.abort();
    }, [formData.make, formData.year]);

    useEffect(() => {
        if (!formData.make || !formData.year || !formData.model || formData.model === notListedLabel) return;

        const controller = new AbortController();
        fetchVehicleOptions<Trim>(
            `/api/vehicles?type=trims&make=${encodeURIComponent(formData.make)}&year=${encodeURIComponent(formData.year)}&model=${encodeURIComponent(formData.model)}`,
            controller.signal,
        )
            .then((data) => {
                setTrims(uniqueBy(data, (trim) => trim.model_trim).sort((a, b) => a.model_trim.localeCompare(b.model_trim)));
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("Unable to load vehicle trims", error);
                setErrorTrims(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingTrims(false);
            });

        return () => controller.abort();
    }, [formData.make, formData.model, formData.year, notListedLabel]);

    const loadMessage = language === "en" ? "Loading..." : "Cargando...";
    const errorMessage = language === "en"
        ? "We could not load this list. Please try again."
        : "No pudimos cargar esta lista. Inténtalo de nuevo.";

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded bg-white p-6 dark:bg-neutral-900">
            <h2 className="mb-4 text-xl font-bold text-neutral-800 dark:text-neutral-200">
                {language === "en"
                    ? "Vehicle Details & Drop Off or Wait"
                    : "Detalles del Vehículo y Dejar o Esperar"}
            </h2>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "en" ? "Make *" : "Marca *"}
                </label>
                <Popover open={openMake} onOpenChange={setOpenMake}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-label={language === "en" ? "Vehicle make" : "Marca del vehículo"}
                            aria-expanded={openMake}
                            className="w-full justify-between"
                        >
                            {formData.make || (language === "en" ? "Select make..." : "Selecciona marca...")}
                            {loadingMakes
                                ? <LoaderCircle className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" />
                                : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popoverClassName} align="start">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search make..." : "Buscar marca..."} />
                            {loadingMakes ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm"><LoaderCircle className="h-4 w-4 animate-spin" />{loadMessage}</div>
                            ) : errorMakes ? (
                                <div className="px-4 py-6 text-center text-sm text-red-600">{errorMessage}</div>
                            ) : (
                                <>
                                    <CommandEmpty>{language === "en" ? "No make found." : "No se encontró marca."}</CommandEmpty>
                                    <CommandList className="max-h-60 overflow-y-auto">
                                        <CommandGroup>
                                            {makes.map((make) => (
                                                <CommandItem
                                                    key={make.make_id}
                                                    value={make.make_display}
                                                    onSelect={() => {
                                                        setYears([]);
                                                        setModels([]);
                                                        setTrims([]);
                                                        setErrorYears(false);
                                                        setErrorModels(false);
                                                        setErrorTrims(false);
                                                        setLoadingYears(true);
                                                        setLoadingModels(false);
                                                        setLoadingTrims(false);
                                                        setFormData((prev) => ({ ...prev, make: make.make_display, year: "", model: "", trim: "" }));
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

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "en" ? "Year *" : "Año *"}
                </label>
                <Popover open={openYear} onOpenChange={setOpenYear}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-label={language === "en" ? "Vehicle year" : "Año del vehículo"}
                            aria-expanded={openYear}
                            className="w-full justify-between"
                            disabled={!formData.make}
                        >
                            {formData.year || (language === "en" ? "Select year..." : "Selecciona año...")}
                            {loadingYears
                                ? <LoaderCircle className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" />
                                : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popoverClassName} align="start">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search year..." : "Buscar año..."} />
                            {loadingYears ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm"><LoaderCircle className="h-4 w-4 animate-spin" />{loadMessage}</div>
                            ) : errorYears ? (
                                <div className="px-4 py-6 text-center text-sm text-red-600">{errorMessage}</div>
                            ) : (
                                <>
                                    <CommandEmpty>{language === "en" ? "No year found." : "No se encontró año."}</CommandEmpty>
                                    <CommandList className="max-h-60 overflow-y-auto">
                                        <CommandGroup>
                                            {years.map((yearObj) => {
                                                const year = String(yearObj.year);
                                                return (
                                                    <CommandItem
                                                        key={year}
                                                        value={year}
                                                        onSelect={() => {
                                                            setModels([]);
                                                            setTrims([]);
                                                            setErrorModels(false);
                                                            setErrorTrims(false);
                                                            setLoadingModels(true);
                                                            setLoadingTrims(false);
                                                            setFormData((prev) => ({ ...prev, year, model: "", trim: "" }));
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
                                </>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "en" ? "Model *" : "Modelo *"}
                </label>
                <Popover open={openModel} onOpenChange={setOpenModel}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-label={language === "en" ? "Vehicle model" : "Modelo del vehículo"}
                            aria-expanded={openModel}
                            className="w-full justify-between"
                            disabled={!formData.year}
                        >
                            {formData.model || (language === "en" ? "Select model..." : "Selecciona modelo...")}
                            {loadingModels
                                ? <LoaderCircle className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" />
                                : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popoverClassName} align="start">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search model..." : "Buscar modelo..."} />
                            {loadingModels ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm"><LoaderCircle className="h-4 w-4 animate-spin" />{loadMessage}</div>
                            ) : (
                                <>
                                    {errorModels && <div className="px-4 py-3 text-center text-sm text-red-600">{errorMessage}</div>}
                                    <CommandEmpty>{language === "en" ? "Choose ‘Other / not listed’." : "Elige ‘Otro / no aparece’."}</CommandEmpty>
                                    <CommandList className="max-h-60 overflow-y-auto">
                                        <CommandGroup>
                                            {models.map((model) => (
                                                <CommandItem
                                                    key={model.model_name}
                                                    value={model.model_name}
                                                    onSelect={() => {
                                                        setTrims([]);
                                                        setErrorTrims(false);
                                                        setLoadingTrims(true);
                                                        setFormData((prev) => ({ ...prev, model: model.model_name, trim: "" }));
                                                        setOpenModel(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", formData.model === model.model_name ? "opacity-100" : "opacity-0")} />
                                                    {model.model_name}
                                                </CommandItem>
                                            ))}
                                            <CommandItem
                                                value={notListedLabel}
                                                onSelect={() => {
                                                    setTrims([]);
                                                    setErrorTrims(false);
                                                    setLoadingTrims(false);
                                                    setFormData((prev) => ({ ...prev, model: notListedLabel, trim: notSureLabel }));
                                                    setOpenModel(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", formData.model === notListedLabel ? "opacity-100" : "opacity-0")} />
                                                {notListedLabel}
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "en" ? "Trim (optional)" : "Versión (opcional)"}
                </label>
                <Popover open={openTrim} onOpenChange={setOpenTrim}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-label={language === "en" ? "Vehicle trim optional" : "Versión del vehículo opcional"}
                            aria-expanded={openTrim}
                            className="w-full justify-between"
                            disabled={!formData.model}
                        >
                            {formData.trim || (language === "en" ? "Select trim or skip..." : "Selecciona versión u omite...")}
                            {loadingTrims
                                ? <LoaderCircle className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" />
                                : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popoverClassName} align="start">
                        <Command>
                            <CommandInput placeholder={language === "en" ? "Search trim..." : "Buscar versión..."} />
                            {loadingTrims ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm"><LoaderCircle className="h-4 w-4 animate-spin" />{loadMessage}</div>
                            ) : (
                                <>
                                    {errorTrims && <div className="px-4 py-3 text-center text-sm text-red-600">{errorMessage}</div>}
                                    <CommandEmpty>{language === "en" ? "Select ‘Not sure’ to continue." : "Selecciona ‘No estoy seguro’ para continuar."}</CommandEmpty>
                                    <CommandList className="max-h-60 overflow-y-auto">
                                        <CommandGroup>
                                            <CommandItem
                                                value={notSureLabel}
                                                onSelect={() => {
                                                    setFormData((prev) => ({ ...prev, trim: notSureLabel }));
                                                    setOpenTrim(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", formData.trim === notSureLabel ? "opacity-100" : "opacity-0")} />
                                                {notSureLabel}
                                            </CommandItem>
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
                                </>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
                {language === "en"
                    ? "Please select if you will drop off your vehicle or wait at the shop."
                    : "Por favor selecciona si dejarás tu vehículo o esperarás en el taller."}
            </p>

            {options.map(({ key, labelEn, labelEs, descriptionEn, descriptionEs }) => {
                const isSelected = formData.dropOffOrWait === key;
                return (
                    <button
                        type="button"
                        key={key}
                        onClick={() => setFormData((prev) => ({ ...prev, dropOffOrWait: key }))}
                        className={cn(
                            "mb-2 w-full rounded-lg border p-3 text-left transition",
                            isSelected
                                ? "border-[#17643f] bg-[#e5ece6]"
                                : "border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                        )}
                    >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {language === "en" ? labelEn : labelEs}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {language === "en" ? descriptionEn : descriptionEs}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
