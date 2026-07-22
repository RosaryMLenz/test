"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle2,
    ChevronRight,
    ChevronsUpDown,
    ClipboardCheck,
    Download,
    FileCheck2,
    Gauge,
    Loader2,
    Mail,
    Minus,
    Printer,
    Save,
    Send,
    ShieldCheck,
    TriangleAlert,
    UserRound,
    Wrench,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createInspectionItems, INSPECTION_CATEGORIES } from "@/lib/inspectionChecklist";
import { downloadInspectionPdf, printInspectionPdf, shareInspectionPdf } from "@/lib/inspectionPdf";
import { hasMeaningfulInspectionContent } from "@/lib/inspectionValidation";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/BookingFormData";
import type {
    InspectionItem,
    InspectionItemStatus,
    InspectionStatus,
    OverallRating,
    VehicleInspection,
    VehicleInspectionPayload,
} from "@/types/VehicleInspection";
import { toast } from "sonner";

type MakeOption = { make_display: string };
type ModelOption = { model_name: string };

function formatPhoneNumber(value: string) {
    const enteredDigits = value.replace(/\D/g, "");
    const digits = (enteredDigits.length > 10 && enteredDigits.startsWith("1")
        ? enteredDigits.slice(1)
        : enteredDigits
    ).slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function bookingPrimaryLabel(booking: Booking) {
    return [booking.name, booking.make, booking.model, booking.year].filter(Boolean).join(" | ");
}

function bookingSecondaryLabel(booking: Booking) {
    return [booking.date, booking.time, booking.trim, booking.email, booking.phone].filter(Boolean).join(" | ");
}

function bookingSearchValue(booking: Booking) {
    return [
        booking.id,
        booking.name,
        booking.email,
        booking.phone,
        booking.make,
        booking.model,
        booking.year,
        booking.trim,
        booking.date,
        booking.time,
        booking.reason,
        booking.problemDescription,
        booking.additionalDetails,
        booking.dropOffOrWait,
    ].filter(Boolean).join(" ");
}

const STATUS_OPTIONS: Array<{
    value: InspectionItemStatus;
    label: string;
    shortLabel: string;
    icon: typeof Check;
    activeClass: string;
}> = [
    { value: "pass", label: "Pass", shortLabel: "Pass", icon: Check, activeClass: "border-emerald-600 bg-emerald-600 text-white" },
    { value: "attention", label: "Needs attention", shortLabel: "Attention", icon: AlertCircle, activeClass: "border-amber-500 bg-amber-500 text-white" },
    { value: "urgent", label: "Urgent", shortLabel: "Urgent", icon: TriangleAlert, activeClass: "border-red-600 bg-red-600 text-white" },
    { value: "na", label: "Not applicable", shortLabel: "N/A", icon: Minus, activeClass: "border-slate-500 bg-slate-500 text-white" },
];

function localDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function emptyInspection(technicianName: string): VehicleInspectionPayload {
    return {
        bookingId: null,
        status: "draft",
        inspectionDate: localDateString(),
        technicianName,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        year: "",
        make: "",
        model: "",
        trim: "",
        vin: "",
        licensePlate: "",
        mileage: "",
        fuelLevel: "",
        repairOrderNumber: "",
        customerConcern: "",
        roadTestNotes: "",
        mechanicSummary: "",
        recommendations: "",
        overallRating: "good",
        items: createInspectionItems(),
        certified: false,
    };
}

function normalizeInspection(value: VehicleInspection): VehicleInspection {
    return {
        ...value,
        bookingId: value.bookingId ?? null,
        customerEmail: value.customerEmail ?? "",
        customerPhone: formatPhoneNumber(value.customerPhone ?? ""),
        trim: value.trim ?? "",
        licensePlate: value.licensePlate ?? "",
        mileage: value.mileage ?? "",
        fuelLevel: value.fuelLevel ?? "",
        repairOrderNumber: value.repairOrderNumber ?? "",
        customerConcern: value.customerConcern ?? "",
        roadTestNotes: value.roadTestNotes ?? "",
        mechanicSummary: value.mechanicSummary ?? "",
        recommendations: value.recommendations ?? "",
        items: Array.isArray(value.items) ? value.items : createInspectionItems(),
    };
}

function ratingForItems(items: InspectionItem[]): OverallRating {
    if (items.some((item) => item.status === "urgent")) return "urgent";
    if (items.some((item) => item.status === "attention")) return "attention";
    return "good";
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
    return (
        <Label htmlFor={htmlFor} className="mb-2 text-xs font-bold uppercase tracking-[0.11em] text-slate-600 dark:text-slate-300">
            {children}
            {required && <span className="text-red-600">*</span>}
        </Label>
    );
}

interface InspectionFormProps {
    defaultTechnician: string;
    inspectionId?: string;
}

export default function InspectionForm({ defaultTechnician, inspectionId }: InspectionFormProps) {
    const router = useRouter();
    const [form, setForm] = useState<VehicleInspectionPayload>(() => emptyInspection(defaultTechnician));
    const [savedInspection, setSavedInspection] = useState<VehicleInspection | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [makes, setMakes] = useState<MakeOption[]>([]);
    const [models, setModels] = useState<ModelOption[]>([]);
    const [loading, setLoading] = useState(Boolean(inspectionId));
    const [saving, setSaving] = useState<InspectionStatus | null>(null);
    const [dirty, setDirty] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [repairOrderLoading, setRepairOrderLoading] = useState(!inspectionId);

    useEffect(() => {
        let cancelled = false;

        const loadSetup = async () => {
            const [bookingResponse, makeResponse] = await Promise.all([
                fetch("/api/bookings"),
                fetch("/api/vehicles?type=makes"),
            ]);

            if (cancelled) return;
            if (bookingResponse.ok) {
                const data = await bookingResponse.json();
                setBookings(data.bookings ?? []);
            }
            if (makeResponse.ok) {
                const data = await makeResponse.json();
                setMakes(data.data ?? []);
            }
        };

        void loadSetup().catch((error) => console.error("Failed to load inspection setup:", error));
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (inspectionId) return;
        let cancelled = false;

        const allocateRepairOrder = async () => {
            try {
                const response = await fetch("/api/inspections/repair-order", { method: "POST" });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to assign repair order number");

                if (!cancelled) {
                    setForm((current) => ({ ...current, repairOrderNumber: data.repairOrderNumber }));
                }
            } catch {
                if (!cancelled) toast.error("The repair order number will be assigned when this inspection is saved.");
            } finally {
                if (!cancelled) setRepairOrderLoading(false);
            }
        };

        void allocateRepairOrder();
        return () => { cancelled = true; };
    }, [inspectionId]);

    useEffect(() => {
        if (!inspectionId) return;
        let cancelled = false;

        const loadInspection = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/inspections/${inspectionId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to load inspection");
                if (!cancelled) {
                    const inspection = normalizeInspection(data.inspection);
                    setForm(inspection);
                    setSavedInspection(inspection);
                    setDirty(false);
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load inspection");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void loadInspection();
        return () => { cancelled = true; };
    }, [inspectionId]);

    useEffect(() => {
        if (!form.make || !form.year) {
            setModels([]);
            return;
        }

        let cancelled = false;
        const query = new URLSearchParams({ type: "models", make: form.make, year: form.year });
        void fetch(`/api/vehicles?${query.toString()}`)
            .then((response) => response.ok ? response.json() : { data: [] })
            .then((data) => { if (!cancelled) setModels(data.data ?? []); })
            .catch(() => { if (!cancelled) setModels([]); });
        return () => { cancelled = true; };
    }, [form.make, form.year]);

    const counts = useMemo(
        () => form.items.reduce(
            (result, item) => ({ ...result, [item.status]: result[item.status] + 1 }),
            { pass: 0, attention: 0, urgent: 0, na: 0, uninspected: 0 },
        ),
        [form.items],
    );
    const inspectedCount = form.items.length - counts.uninspected;
    const progress = Math.round((inspectedCount / form.items.length) * 100);
    const selectedBooking = useMemo(
        () => bookings.find((booking) => booking.id === form.bookingId) ?? null,
        [bookings, form.bookingId],
    );

    const setField = <K extends keyof VehicleInspectionPayload>(field: K, value: VehicleInspectionPayload[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
        setDirty(true);
    };

    const updateItems = (updater: (items: InspectionItem[]) => InspectionItem[]) => {
        setForm((current) => {
            const items = updater(current.items);
            return { ...current, items, overallRating: ratingForItems(items) };
        });
        setDirty(true);
    };

    const updateItem = (id: string, changes: Partial<InspectionItem>) => {
        updateItems((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
    };

    const passRemainingCategoryItems = (category: string) => {
        updateItems((items) => items.map((item) =>
            item.category === category && item.status === "uninspected"
                ? { ...item, status: "pass" }
                : item,
        ));
        toast.success(`${category} marked complete`);
    };

    const importBooking = (bookingId: string) => {
        const booking = bookings.find((item) => item.id === bookingId);
        if (!booking) {
            setField("bookingId", null);
            return;
        }

        setForm((current) => ({
            ...current,
            bookingId: booking.id,
            customerName: booking.name,
            customerEmail: booking.email,
            customerPhone: formatPhoneNumber(booking.phone),
            year: booking.year ?? "",
            make: booking.make ?? "",
            model: booking.model ?? "",
            trim: booking.trim ?? "",
            customerConcern: [booking.reason, booking.problemDescription, booking.additionalDetails].filter(Boolean).join(" — "),
        }));
        setDirty(true);
        toast.success("Appointment details imported");
    };

    const validateForSave = (status: InspectionStatus) => {
        if (status === "draft") {
            if (!hasMeaningfulInspectionContent(form)) {
                toast.error("Enter at least one customer, vehicle, or inspection detail before saving a draft.");
                return false;
            }
            return true;
        }

        const missing = [
            [form.customerName, "customer name"],
            [form.inspectionDate, "inspection date"],
            [form.technicianName, "technician name"],
            [form.year, "vehicle year"],
            [form.make, "vehicle make"],
            [form.model, "vehicle model"],
            [form.vin, "VIN"],
        ].filter(([value]) => !String(value).trim());

        if (missing.length) {
            toast.error(`Add the ${missing[0][1]} before saving.`);
            return false;
        }

        if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(form.vin.trim().toUpperCase())) {
            toast.error("Enter a valid 17-character VIN (I, O and Q are not used).");
            return false;
        }

        if (counts.uninspected > 0) {
            toast.error(`${counts.uninspected} checkpoints still need a condition or N/A.`);
            document.getElementById("inspection-checklist")?.scrollIntoView({ behavior: "smooth" });
            return false;
        }

        if (!form.certified) {
            toast.error("Technician certification is required to complete the inspection.");
            document.getElementById("inspection-signoff")?.scrollIntoView({ behavior: "smooth" });
            return false;
        }

        return true;
    };

    const saveInspection = async (status: InspectionStatus) => {
        if (!validateForSave(status)) return null;
        setSaving(status);

        try {
            const currentId = savedInspection?.id ?? inspectionId;
            const response = await fetch(currentId ? `/api/inspections/${currentId}` : "/api/inspections", {
                method: currentId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, status, vin: form.vin.trim().toUpperCase() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save inspection");

            const inspection = normalizeInspection(data.inspection);
            setForm(inspection);
            setSavedInspection(inspection);
            setDirty(false);
            toast.success(status === "completed" ? "Inspection completed and saved" : "Inspection draft saved");

            if (!currentId) router.replace(`/admin/inspections/${inspection.id}`);
            return inspection;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save inspection");
            return null;
        } finally {
            setSaving(null);
        }
    };

    const handleShare = async () => {
        if (!savedInspection || dirty) return;
        try {
            const shared = await shareInspectionPdf(savedInspection);
            if (!shared) {
                downloadInspectionPdf(savedInspection);
                toast.info("PDF downloaded. Attach it to your email or message to the customer.");
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            toast.error("Could not open sharing. The PDF can still be downloaded.");
        }
    };

    if (loading) {
        return (
            <AdminShell title="Vehicle Inspection" description="Loading inspection record" eyebrow="Workshop">
                <div className="grid animate-pulse gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="h-[740px] rounded-2xl bg-slate-200/80 dark:bg-neutral-800" />
                    <div className="h-[420px] rounded-2xl bg-slate-200/80 dark:bg-neutral-800" />
                </div>
            </AdminShell>
        );
    }

    const reportReady = Boolean(savedInspection && !dirty);
    const vehicleTitle = [form.year, form.make, form.model].filter(Boolean).join(" ");

    return (
        <AdminShell
            title={savedInspection ? savedInspection.inspectionNumber : "New Vehicle Inspection"}
            description={vehicleTitle || "Document vehicle condition and customer recommendations"}
            eyebrow="Workshop / Digital inspection"
            actions={(
                <Button variant="outline" className="rounded-xl" asChild>
                    <Link href="/admin/inspections"><ArrowLeft className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Records</span></Link>
                </Button>
            )}
        >
            <datalist id="vehicle-makes">
                {makes.map((make) => <option key={make.make_display} value={make.make_display} />)}
            </datalist>
            <datalist id="vehicle-models">
                {models.map((model) => <option key={model.model_name} value={model.model_name} />)}
            </datalist>

            <div className="mb-5 overflow-hidden rounded-2xl border border-[#cddbd1] bg-[#eaf2ec] shadow-sm dark:border-emerald-950 dark:bg-emerald-950/30">
                <div className="grid items-center gap-5 px-5 py-5 md:grid-cols-[1fr_auto] md:px-7">
                    <div className="flex items-start gap-4">
                        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17643f] text-white sm:flex">
                            <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-[#17643f] px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.11em] text-white">
                                    {repairOrderLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                                    {form.repairOrderNumber
                                        ? `Repair order ${form.repairOrderNumber}`
                                        : repairOrderLoading
                                            ? "Assigning repair order"
                                            : "Repair order assigned when saved"}
                                </span>
                            </div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white md:text-2xl">
                                    {vehicleTitle || "Start with the vehicle details"}
                                </h2>
                                {savedInspection && (
                                    <span className={cn(
                                        "rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]",
                                        form.status === "completed" ? "bg-emerald-700 text-white" : "bg-white text-slate-600",
                                    )}>
                                        {form.status}
                                    </span>
                                )}
                            </div>
                            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Work from top to bottom, record anything the customer should know, then certify the report for download, print, or sharing.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl bg-white"
                            disabled={!reportReady}
                            onClick={() => savedInspection && downloadInspectionPdf(savedInspection)}
                        >
                            <Download className="mr-2 h-4 w-4" /> PDF
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl bg-white"
                            disabled={!reportReady}
                            onClick={() => savedInspection && printInspectionPdf(savedInspection)}
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl bg-white"
                            disabled={!reportReady}
                            onClick={handleShare}
                        >
                            <Send className="mr-2 h-4 w-4" /> Share
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="space-y-5">
                    <section id="vehicle-details" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-neutral-800 md:px-6">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#17643f] dark:bg-emerald-950"><UserRound className="h-4 w-4" /></div>
                            <div>
                                <h2 className="font-bold text-slate-950 dark:text-white">Customer & vehicle</h2>
                                <p className="text-xs text-slate-500">Import an appointment or enter the details manually</p>
                            </div>
                        </div>
                        <div className="space-y-6 p-5 md:p-6">
                            <div className="rounded-xl border border-dashed border-[#94b5a1] bg-[#f4f8f5] p-4 dark:bg-emerald-950/20">
                                <FieldLabel htmlFor="booking-picker">Import appointment</FieldLabel>
                                <Popover open={bookingOpen} onOpenChange={setBookingOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="booking-picker"
                                            type="button"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={bookingOpen}
                                            className="h-auto min-h-11 w-full justify-between rounded-lg bg-white px-3 py-2 text-left font-normal dark:bg-neutral-900"
                                        >
                                            <span className={cn("min-w-0 truncate text-sm", !selectedBooking && "text-slate-500")}>
                                                {selectedBooking ? bookingPrimaryLabel(selectedBooking) : "Search appointments by customer or vehicle"}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0">
                                        <Command>
                                            <CommandInput id="booking-search" placeholder="Search name, car, phone, email, date…" />
                                            <CommandList className="max-h-80">
                                                <CommandEmpty>No matching appointments found.</CommandEmpty>
                                                <CommandGroup heading="Appointments">
                                                    <CommandItem
                                                        value="enter without appointment manual no booking"
                                                        onSelect={() => {
                                                            importBooking("");
                                                            setBookingOpen(false);
                                                        }}
                                                        className="gap-3 px-3 py-2.5"
                                                    >
                                                        <Check className={cn("h-4 w-4 shrink-0", form.bookingId ? "opacity-0" : "opacity-100")} />
                                                        <span>Enter without an appointment</span>
                                                    </CommandItem>
                                                    {bookings.map((booking) => (
                                                        <CommandItem
                                                            key={booking.id}
                                                            value={bookingSearchValue(booking)}
                                                            onSelect={() => {
                                                                importBooking(booking.id);
                                                                setBookingOpen(false);
                                                            }}
                                                            className="items-start gap-3 px-3 py-2.5"
                                                        >
                                                            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", form.bookingId === booking.id ? "opacity-100" : "opacity-0")} />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{bookingPrimaryLabel(booking)}</p>
                                                                {bookingSecondaryLabel(booking) && <p className="mt-0.5 truncate text-xs text-slate-500">{bookingSecondaryLabel(booking)}</p>}
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <p className="mt-2 text-xs text-slate-500">Search by customer, vehicle, contact information, appointment date, or service details.</p>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#17643f]">Customer</p>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div><FieldLabel htmlFor="customerName" required>Name</FieldLabel><Input id="customerName" className="h-11 rounded-lg" value={form.customerName} onChange={(event) => setField("customerName", event.target.value)} placeholder="Customer name" /></div>
                                    <div><FieldLabel htmlFor="customerPhone">Phone</FieldLabel><Input id="customerPhone" type="tel" inputMode="tel" autoComplete="tel" maxLength={14} className="h-11 rounded-lg" value={form.customerPhone} onChange={(event) => setField("customerPhone", formatPhoneNumber(event.target.value))} placeholder="(702) 555-0100" /></div>
                                    <div><FieldLabel htmlFor="customerEmail">Email</FieldLabel><Input id="customerEmail" type="email" className="h-11 rounded-lg" value={form.customerEmail} onChange={(event) => setField("customerEmail", event.target.value)} placeholder="customer@email.com" /></div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#17643f]">Vehicle</p>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div><FieldLabel htmlFor="year" required>Year</FieldLabel><Input id="year" inputMode="numeric" className="h-11 rounded-lg" value={form.year} onChange={(event) => setField("year", event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2022" /></div>
                                    <div><FieldLabel htmlFor="make" required>Make</FieldLabel><Input id="make" list="vehicle-makes" className="h-11 rounded-lg" value={form.make} onChange={(event) => setField("make", event.target.value)} placeholder="Select or type" /></div>
                                    <div><FieldLabel htmlFor="model" required>Model</FieldLabel><Input id="model" list="vehicle-models" className="h-11 rounded-lg" value={form.model} onChange={(event) => setField("model", event.target.value)} placeholder="Select or type" /></div>
                                    <div><FieldLabel htmlFor="trim">Trim</FieldLabel><Input id="trim" className="h-11 rounded-lg" value={form.trim} onChange={(event) => setField("trim", event.target.value)} placeholder="SE, Sport…" /></div>
                                </div>
                                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="md:col-span-2"><FieldLabel htmlFor="vin" required>VIN (17 characters)</FieldLabel><Input id="vin" className="h-11 rounded-lg font-mono uppercase tracking-[0.08em]" maxLength={17} value={form.vin} onChange={(event) => setField("vin", event.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ""))} placeholder="1HGCM82633A004352" /></div>
                                    <div><FieldLabel htmlFor="licensePlate">License plate</FieldLabel><Input id="licensePlate" className="h-11 rounded-lg uppercase" value={form.licensePlate} onChange={(event) => setField("licensePlate", event.target.value.toUpperCase())} placeholder="NV plate" /></div>
                                    <div><FieldLabel htmlFor="mileage">Mileage</FieldLabel><Input id="mileage" inputMode="numeric" className="h-11 rounded-lg" value={form.mileage} onChange={(event) => setField("mileage", event.target.value.replace(/[^\d,]/g, ""))} placeholder="85,420" /></div>
                                    <div><FieldLabel htmlFor="fuelLevel">Fuel level</FieldLabel><select id="fuelLevel" className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900" value={form.fuelLevel} onChange={(event) => setField("fuelLevel", event.target.value)}><option value="">Select</option><option>Empty</option><option>1/4 tank</option><option>1/2 tank</option><option>3/4 tank</option><option>Full</option></select></div>
                                    <div><FieldLabel htmlFor="inspectionDate" required>Inspection date</FieldLabel><Input id="inspectionDate" type="date" className="h-11 rounded-lg" value={form.inspectionDate} onChange={(event) => setField("inspectionDate", event.target.value)} /></div>
                                    <div><FieldLabel htmlFor="technicianName" required>Technician</FieldLabel><Input id="technicianName" className="h-11 rounded-lg" value={form.technicianName} onChange={(event) => setField("technicianName", event.target.value)} placeholder="Technician name" /></div>
                                </div>
                            </div>

                            <div><FieldLabel htmlFor="customerConcern">Customer concern / reason for visit</FieldLabel><Textarea id="customerConcern" className="min-h-24 rounded-xl" value={form.customerConcern} onChange={(event) => setField("customerConcern", event.target.value)} placeholder="What did the customer ask us to inspect? Include symptoms, sounds, and when they occur." /></div>
                        </div>
                    </section>

                    <section id="inspection-checklist" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-neutral-800 md:flex-row md:items-center md:justify-between md:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#17643f] dark:bg-emerald-950"><Wrench className="h-4 w-4" /></div>
                                <div><h2 className="font-bold text-slate-950 dark:text-white">Inspection checklist</h2><p className="text-xs text-slate-500">Choose a condition for every checkpoint and add measurements or observations</p></div>
                            </div>
                            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-neutral-800 dark:text-slate-300">{inspectedCount} of {form.items.length} checked</div>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {INSPECTION_CATEGORIES.map((category) => {
                                const categoryItems = form.items.filter((item) => item.category === category.name);
                                const remaining = categoryItems.filter((item) => item.status === "uninspected").length;
                                return (
                                    <div key={category.name} className="p-5 md:p-6">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                            <div><h3 className="font-bold text-slate-900 dark:text-white">{category.name}</h3><p className="text-xs text-slate-500">{category.description}</p></div>
                                            {remaining > 0 && <Button type="button" variant="outline" size="sm" className="rounded-lg border-emerald-200 text-[#17643f] hover:bg-emerald-50" onClick={() => passRemainingCategoryItems(category.name)}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Pass remaining ({remaining})</Button>}
                                        </div>
                                        <div className="space-y-3">
                                            {categoryItems.map((item) => (
                                                <div key={item.id} className={cn("rounded-xl border p-3 transition-colors md:p-4", item.status === "urgent" ? "border-red-200 bg-red-50/60 dark:border-red-950 dark:bg-red-950/20" : item.status === "attention" ? "border-amber-200 bg-amber-50/60 dark:border-amber-950 dark:bg-amber-950/20" : "border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900")}>
                                                    <div className="grid gap-3 lg:grid-cols-[minmax(180px,1fr)_auto] lg:items-center">
                                                        <div className="flex items-center gap-2.5"><span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.status === "pass" ? "bg-emerald-500" : item.status === "attention" ? "bg-amber-500" : item.status === "urgent" ? "bg-red-600" : item.status === "na" ? "bg-slate-500" : "border-2 border-slate-300")} /><span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</span></div>
                                                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label={`${item.label} condition`}>
                                                            {STATUS_OPTIONS.map((option) => {
                                                                const Icon = option.icon;
                                                                const active = item.status === option.value;
                                                                return <button key={option.value} type="button" title={option.label} aria-pressed={active} onClick={() => updateItem(item.id, { status: option.value })} className={cn("flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition", active ? option.activeClass : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300")}><Icon className="h-3.5 w-3.5" /><span>{option.shortLabel}</span></button>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    <Input value={item.notes} onChange={(event) => updateItem(item.id, { notes: event.target.value })} className="mt-3 h-9 rounded-lg border-dashed bg-white/80 text-xs shadow-none dark:bg-neutral-900" placeholder="Optional note or measurement (example: 5/32 tread, 6 mm pads)" aria-label={`${item.label} notes`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section id="inspection-notes" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-neutral-800 md:px-6"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#17643f] dark:bg-emerald-950"><FileCheck2 className="h-4 w-4" /></div><div><h2 className="font-bold text-slate-950 dark:text-white">Findings & recommendations</h2><p className="text-xs text-slate-500">Write this section in clear customer-friendly language</p></div></div>
                        <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-2">
                            <div className="lg:col-span-2"><FieldLabel htmlFor="mechanicSummary">Overall inspection summary</FieldLabel><Textarea id="mechanicSummary" className="min-h-28 rounded-xl" value={form.mechanicSummary} onChange={(event) => setField("mechanicSummary", event.target.value)} placeholder="Summarize the vehicle's overall condition and the most important findings." /></div>
                            <div><FieldLabel htmlFor="recommendations">Recommended service</FieldLabel><Textarea id="recommendations" className="min-h-32 rounded-xl" value={form.recommendations} onChange={(event) => setField("recommendations", event.target.value)} placeholder="List recommended work in priority order, including anything that should be addressed today." /></div>
                            <div><FieldLabel htmlFor="roadTestNotes">Road test notes</FieldLabel><Textarea id="roadTestNotes" className="min-h-32 rounded-xl" value={form.roadTestNotes} onChange={(event) => setField("roadTestNotes", event.target.value)} placeholder="Record noises, vibration, braking, steering, shifting, warning lights, or drivability observations." /></div>
                        </div>
                    </section>

                    <section id="inspection-signoff" className="scroll-mt-24 rounded-2xl border border-[#a8c9b3] bg-[#edf5ef] p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 md:p-6">
                        <div className="flex items-start gap-4">
                            <Checkbox id="certified" checked={form.certified} onCheckedChange={(checked) => setField("certified", checked === true)} className="mt-1 h-5 w-5 border-[#17643f] data-[state=checked]:bg-[#17643f]" />
                            <div><Label htmlFor="certified" className="cursor-pointer text-sm font-bold text-slate-950 dark:text-white">Technician certification</Label><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">I certify that I personally inspected the checkpoints recorded above and that this report accurately reflects the visible vehicle condition at the time of inspection.</p><p className="mt-3 text-sm font-semibold text-[#17643f]">Signed electronically by {form.technicianName || "the assigned technician"}</p></div>
                        </div>
                    </section>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-24">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="bg-[#14261c] px-5 py-5 text-white">
                            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Inspection progress</span><Gauge className="h-5 w-5 text-emerald-300" /></div>
                            <div className="flex items-end justify-between"><span className="text-3xl font-black">{progress}%</span><span className="pb-1 text-xs text-emerald-100">{counts.uninspected ? `${counts.uninspected} remaining` : "All checked"}</span></div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#63a77e] transition-[width]" style={{ width: `${progress}%` }} /></div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/40"><div className="text-xl font-black text-emerald-700 dark:text-emerald-300">{counts.pass}</div><div className="text-[0.68rem] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Passed</div></div>
                                <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40"><div className="text-xl font-black text-amber-700 dark:text-amber-300">{counts.attention}</div><div className="text-[0.68rem] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">Attention</div></div>
                                <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/40"><div className="text-xl font-black text-red-700 dark:text-red-300">{counts.urgent}</div><div className="text-[0.68rem] font-bold uppercase tracking-wide text-red-700 dark:text-red-400">Urgent</div></div>
                                <div className="rounded-xl bg-slate-100 p-3 dark:bg-neutral-800"><div className="text-xl font-black text-slate-600 dark:text-slate-300">{counts.na}</div><div className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">N/A</div></div>
                            </div>

                            <div className="my-5 border-t border-slate-100 dark:border-neutral-800" />
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Overall condition</p>
                            <div className={cn("flex items-center gap-3 rounded-xl border p-3", form.overallRating === "urgent" ? "border-red-200 bg-red-50 text-red-800" : form.overallRating === "attention" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800")}>
                                {form.overallRating === "urgent" ? <TriangleAlert className="h-5 w-5" /> : form.overallRating === "attention" ? <AlertCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                                <div><p className="text-sm font-bold capitalize">{form.overallRating === "good" ? "Good" : form.overallRating}</p><p className="text-[0.7rem] opacity-75">Calculated from checkpoint results</p></div>
                            </div>

                            {dirty && savedInspection && <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">Changes have not been saved. Save again before creating the customer report.</p>}

                            <div className="mt-5 space-y-2">
                                {form.status !== "completed" && (
                                    <Button type="button" variant="outline" className="h-11 w-full rounded-xl" disabled={Boolean(saving)} onClick={() => saveInspection("draft")}>
                                        {saving === "draft" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save draft
                                    </Button>
                                )}
                                <Button type="button" className="h-12 w-full rounded-xl bg-[#17643f] text-white hover:bg-[#0f4d30]" disabled={Boolean(saving)} onClick={() => saveInspection("completed")}>
                                    {saving === "completed" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}{form.status === "completed" ? "Save completed inspection" : "Complete inspection"}
                                </Button>
                                {form.status !== "completed" && <p className="px-1 text-center text-xs leading-5 text-slate-500">A draft can be saved after entering any customer, vehicle, or inspection detail. Required fields are checked only when completing the inspection.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Jump to</p>
                        {[{ href: "#vehicle-details", label: "Customer & vehicle" }, { href: "#inspection-checklist", label: "Inspection checklist" }, { href: "#inspection-notes", label: "Recommendations" }, { href: "#inspection-signoff", label: "Technician sign-off" }].map((link) => <a key={link.href} href={link.href} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#17643f] dark:text-slate-300 dark:hover:bg-neutral-800"><span>{link.label}</span><ChevronRight className="h-3.5 w-3.5" /></a>)}
                    </div>

                    {reportReady && savedInspection && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-950 dark:bg-emerald-950/30">
                            <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div><p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Customer report ready</p><p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-300">Download it, print it, or use Share to send the PDF through Mail, Messages, or another supported app.</p></div></div>
                            {savedInspection.customerEmail && <a className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-800 underline underline-offset-4" href={`mailto:${encodeURIComponent(savedInspection.customerEmail)}?subject=${encodeURIComponent(`${savedInspection.inspectionNumber} vehicle inspection`)}&body=${encodeURIComponent(`Hi ${savedInspection.customerName},\n\nAttached is the inspection report for your ${savedInspection.year} ${savedInspection.make} ${savedInspection.model}.\n\nRainforest21 Automotive`)}`}><Mail className="h-3.5 w-3.5" />Open customer email</a>}
                        </div>
                    )}
                </aside>
            </div>
        </AdminShell>
    );
}
