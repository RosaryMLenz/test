"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    Download,
    FileText,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { downloadInspectionPdf, shareInspectionPdf } from "@/lib/inspectionPdf";
import { cn } from "@/lib/utils";
import type { InspectionItem, VehicleInspection } from "@/types/VehicleInspection";
import { toast } from "sonner";

type Filter = "all" | "completed" | "draft";

function formatDate(value: string) {
    if (!value) return "Date pending";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function customerLabel(inspection: VehicleInspection) {
    return inspection.customerName || inspection.customerEmail || inspection.customerPhone || "Customer details pending";
}

function vehicleLabel(inspection: VehicleInspection) {
    return [inspection.year, inspection.make, inspection.model].filter(Boolean).join(" ") || "Vehicle details pending";
}

function itemCounts(items: InspectionItem[]) {
    return items.reduce(
        (counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }),
        { pass: 0, attention: 0, urgent: 0, na: 0, uninspected: 0 },
    );
}

export default function InspectionHistory() {
    const [inspections, setInspections] = useState<VehicleInspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [deleteInspection, setDeleteInspection] = useState<VehicleInspection | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setLoadError("");
            try {
                const response = await fetch("/api/inspections");
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to load inspections");
                if (!cancelled) setInspections(data.inspections ?? []);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to load inspections";
                if (!cancelled) setLoadError(message);
                toast.error(message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        void load();
        return () => { cancelled = true; };
    }, [loadAttempt]);

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return inspections.filter((inspection) => {
            if (filter !== "all" && inspection.status !== filter) return false;
            if (!normalizedQuery) return true;
            return [
                inspection.inspectionNumber,
                inspection.customerName,
                inspection.customerEmail,
                inspection.customerPhone,
                inspection.repairOrderNumber,
                inspection.vin,
                inspection.licensePlate,
                inspection.year,
                inspection.make,
                inspection.model,
            ].some((value) => value?.toLowerCase().includes(normalizedQuery));
        });
    }, [filter, inspections, query]);

    const completedCount = inspections.filter((inspection) => inspection.status === "completed").length;
    const urgentCount = inspections.filter((inspection) => inspection.items.some((item) => item.status === "urgent")).length;

    const handleDelete = async () => {
        if (!deleteInspection) return;
        setDeleting(true);
        try {
            const response = await fetch(`/api/inspections/${deleteInspection.id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete inspection");
            setInspections((current) => current.filter((item) => item.id !== deleteInspection.id));
            setDeleteInspection(null);
            toast.success("Inspection deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete inspection");
        } finally {
            setDeleting(false);
        }
    };

    const handleShare = async (inspection: VehicleInspection) => {
        try {
            const shared = await shareInspectionPdf(inspection);
            if (!shared) {
                downloadInspectionPdf(inspection);
                toast.info("PDF downloaded. Attach it to an email or message to the customer.");
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            toast.error("Could not open sharing");
        }
    };

    return (
        <AdminShell
            title="Inspection Records"
            description="Find past reports, continue drafts, and resend customer PDFs"
            eyebrow="Workshop / Vehicle inspections"
            actions={(
                <Button className="rounded-xl bg-[#17643f] hover:bg-[#0f4d30]" asChild>
                    <Link href="/admin/inspections/new"><Plus className="mr-2 h-4 w-4" /><span className="hidden sm:inline">New inspection</span><span className="sm:hidden">New</span></Link>
                </Button>
            )}
        >
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Total records</p><ClipboardCheck className="h-5 w-5 text-[#17643f]" /></div>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{inspections.length}</p>
                    <p className="mt-1 text-xs text-slate-500">Saved inspection reports</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Completed</p><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{completedCount}</p>
                    <p className="mt-1 text-xs text-slate-500">Ready to share with customers</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Urgent findings</p><AlertTriangle className="h-5 w-5 text-red-600" /></div>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{urgentCount}</p>
                    <p className="mt-1 text-xs text-slate-500">Reports containing urgent items</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between md:p-5">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 rounded-xl pl-10" placeholder="Search customer, vehicle, VIN, plate, or report #" />
                    </div>
                    <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-neutral-800">
                        {(["all", "completed", "draft"] as const).map((value) => (
                            <button key={value} type="button" onClick={() => setFilter(value)} className={cn("rounded-lg px-3 py-2 text-xs font-bold capitalize transition", filter === value ? "bg-white text-slate-950 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}>{value}</button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#17643f]" /></div>
                ) : loadError ? (
                    <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40"><AlertTriangle className="h-6 w-6" /></div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Inspection records could not be loaded</h2>
                        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{loadError}. Retry the request, and contact the administrator if the problem continues.</p>
                        <Button type="button" variant="outline" className="mt-5 rounded-xl" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Retry</Button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#17643f] dark:bg-emerald-950"><FileText className="h-6 w-6" /></div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">{inspections.length ? "No matching inspections" : "No inspection reports yet"}</h2>
                        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{inspections.length ? "Try a different search or status filter." : "Create the first digital vehicle inspection and it will appear here for future access."}</p>
                        {!inspections.length && <Button className="mt-5 rounded-xl bg-[#17643f]" asChild><Link href="/admin/inspections/new"><Plus className="mr-2 h-4 w-4" />Start an inspection</Link></Button>}
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[960px] text-left">
                                <thead className="bg-slate-50/80 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-slate-500 dark:bg-neutral-800/60"><tr><th className="px-5 py-3.5">Report</th><th className="px-5 py-3.5">Customer</th><th className="px-5 py-3.5">Vehicle</th><th className="px-5 py-3.5">Findings</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                    {filtered.map((inspection) => {
                                        const counts = itemCounts(inspection.items);
                                        return (
                                            <tr key={inspection.id} className="transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/50">
                                                <td className="px-5 py-4"><Link href={`/admin/inspections/${inspection.id}`} className="font-bold text-[#17643f] hover:underline">{inspection.inspectionNumber}</Link><p className="mt-1 text-xs text-slate-500">{formatDate(inspection.inspectionDate)}</p></td>
                                                <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-900 dark:text-white">{customerLabel(inspection)}</p><p className="mt-1 text-xs text-slate-500">{inspection.customerPhone || inspection.customerEmail || "No contact recorded"}</p></td>
                                                <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-900 dark:text-white">{vehicleLabel(inspection)}</p><p className="mt-1 font-mono text-[0.68rem] text-slate-500">{inspection.vin ? `VIN …${inspection.vin.slice(-6)}` : "VIN pending"}</p></td>
                                                <td className="px-5 py-4"><div className="flex items-center gap-2"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[0.68rem] font-bold text-emerald-700">{counts.pass} pass</span>{counts.attention > 0 && <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.68rem] font-bold text-amber-700">{counts.attention} attention</span>}{counts.urgent > 0 && <span className="rounded-full bg-red-50 px-2 py-1 text-[0.68rem] font-bold text-red-700">{counts.urgent} urgent</span>}</div></td>
                                                <td className="px-5 py-4"><span className={cn("inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em]", inspection.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-slate-300")}>{inspection.status}</span></td>
                                                <td className="px-5 py-4"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" title="Download PDF" onClick={() => downloadInspectionPdf(inspection)}><Download className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" title="Share PDF" onClick={() => handleShare(inspection)}><Send className="h-4 w-4" /></Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href={`/admin/inspections/${inspection.id}`}>Open / edit report</Link></DropdownMenuItem><DropdownMenuItem onClick={() => downloadInspectionPdf(inspection)}>Download PDF</DropdownMenuItem><DropdownMenuItem className="text-red-600" onClick={() => setDeleteInspection(inspection)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-neutral-800 md:hidden">
                            {filtered.map((inspection) => {
                                const counts = itemCounts(inspection.items);
                                return (
                                    <div key={inspection.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3"><div><Link href={`/admin/inspections/${inspection.id}`} className="text-sm font-bold text-[#17643f]">{inspection.inspectionNumber}</Link><p className="mt-1 text-xs text-slate-500">{formatDate(inspection.inspectionDate)}</p></div><span className={cn("rounded-full px-2 py-1 text-[0.65rem] font-bold uppercase", inspection.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600")}>{inspection.status}</span></div>
                                        <p className="mt-3 font-bold text-slate-950 dark:text-white">{customerLabel(inspection)}</p><p className="text-sm text-slate-600 dark:text-slate-300">{vehicleLabel(inspection)}</p>
                                        <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[0.68rem] font-bold text-emerald-700">{counts.pass} pass</span>{counts.attention > 0 && <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.68rem] font-bold text-amber-700">{counts.attention} attention</span>}{counts.urgent > 0 && <span className="rounded-full bg-red-50 px-2 py-1 text-[0.68rem] font-bold text-red-700">{counts.urgent} urgent</span>}</div>
                                        <div className="mt-4 grid grid-cols-3 gap-2"><Button variant="outline" size="sm" className="rounded-lg" asChild><Link href={`/admin/inspections/${inspection.id}`}>Open</Link></Button><Button variant="outline" size="sm" className="rounded-lg" onClick={() => downloadInspectionPdf(inspection)}><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button><Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleShare(inspection)}><Send className="mr-1.5 h-3.5 w-3.5" />Share</Button></div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <AlertDialog open={Boolean(deleteInspection)} onOpenChange={(open) => { if (!open && !deleting) setDeleteInspection(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete {deleteInspection?.inspectionNumber}?</AlertDialogTitle></AlertDialogHeader>
                    <p className="text-sm leading-6 text-slate-500">This permanently removes the saved inspection record. Download the PDF first if the shop needs to retain a copy.</p>
                    <AlertDialogFooter><AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel><AlertDialogAction disabled={deleting} onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">{deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}Delete inspection</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminShell>
    );
}
