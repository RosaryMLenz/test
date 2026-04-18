"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MoreVertical, Menu, X } from "lucide-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import Sidebar from "@/components/admin/Sidebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/BookingFormData";
import { toast } from "sonner";

type DashboardFilter = "all" | "today" | "past" | "upcoming";

const FILTER_TITLES: Record<DashboardFilter, string> = {
    all: "All Bookings",
    today: "Today's Bookings",
    past: "Past Bookings",
    upcoming: "Upcoming Bookings",
};

function getTodayLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function normalizeDashboardFilter(filter: string | null): DashboardFilter {
    if (filter === "today" || filter === "past" || filter === "upcoming" || filter === "all") {
        return filter;
    }

    return "today";
}

export default function DashboardClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = normalizeDashboardFilter(searchParams.get("filter"));

    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 13,
    });

    useEffect(() => {
        let isCancelled = false;

        const loadBookings = async () => {
            setLoading(true);

            try {
                const response = await fetch("/api/bookings");

                if (!response.ok) {
                    throw new Error("Failed to fetch bookings");
                }

                const data = await response.json();

                if (!isCancelled) {
                    setAllBookings(data.bookings ?? []);
                }
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        void loadBookings();

        return () => {
            isCancelled = true;
        };
    }, []);

    const bookings = useMemo(() => {
        const today = getTodayLocalDateString();

        if (currentFilter === "today") {
            return allBookings.filter((booking) => booking.date === today);
        }

        if (currentFilter === "past") {
            return allBookings.filter((booking) => booking.date && booking.date < today);
        }

        if (currentFilter === "upcoming") {
            return allBookings.filter((booking) => booking.date && booking.date > today);
        }

        return allBookings;
    }, [allBookings, currentFilter]);

    const bookingCounts = useMemo<Record<DashboardFilter, number>>(() => {
        const today = getTodayLocalDateString();

        return {
            all: allBookings.length,
            today: allBookings.filter((booking) => booking.date === today).length,
            past: allBookings.filter((booking) => booking.date && booking.date < today).length,
            upcoming: allBookings.filter((booking) => booking.date && booking.date > today).length,
        };
    }, [allBookings]);

    useEffect(() => {
        setPagination((current) => ({ ...current, pageIndex: 0 }));
    }, [currentFilter]);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/bookings/${id}`, { method: "DELETE" });
            setAllBookings((prev) => prev.filter((booking) => booking.id !== id));
            toast.success("Booking deleted");
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to delete booking");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleSidebar = () => setSidebarOpen((open) => !open);

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const columns: ColumnDef<Booking>[] = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "phone", header: "Phone" },
            { accessorKey: "reason", header: "Reason", cell: ({ row }) => row.original.reason || "N/A" },
            { accessorKey: "make", header: "Make", cell: ({ row }) => row.original.make || "N/A" },
            { accessorKey: "year", header: "Year", cell: ({ row }) => row.original.year || "N/A" },
            { accessorKey: "model", header: "Model", cell: ({ row }) => row.original.model || "N/A" },
            { accessorKey: "trim", header: "Trim", cell: ({ row }) => row.original.trim || "N/A" },
            {
                accessorKey: "problemDescription",
                header: "Problem Description",
                cell: ({ row }) => row.original.problemDescription || "N/A",
            },
            {
                accessorKey: "date",
                header: "Date",
                cell: ({ row }) => row.original.date || "N/A",
                sortingFn: (rowA, rowB, columnId) => {
                    const dateA = new Date(rowA.getValue(columnId) as string);
                    const dateB = new Date(rowB.getValue(columnId) as string);

                    return dateA.getTime() - dateB.getTime();
                },
            },
            { accessorKey: "time", header: "Time", cell: ({ row }) => row.original.time || "N/A" },
            {
                accessorKey: "additionalDetails",
                header: "Additional Details",
                cell: ({ row }) => row.original.additionalDetails || "N/A",
            },
            {
                accessorKey: "dropOffOrWait",
                header: "Drop Off or Wait",
                cell: ({ row }) => row.original.dropOffOrWait || "N/A",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/bookings/${row.original.id}/edit`)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(row.original.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [router]
    );

    const table = useReactTable({
        data: bookings,
        columns,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting, pagination },
    });

    const handleBulkDelete = async () => {
        setBulkDeleting(true);

        try {
            const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);

            await Promise.all(ids.map((id) => fetch(`/api/bookings/${id}`, { method: "DELETE" })));
            setAllBookings((prev) => prev.filter((booking) => !ids.includes(booking.id)));
            table.resetRowSelection();
            toast.success("Selected bookings deleted");
        } catch (error) {
            console.error("Bulk delete error:", error);
            toast.error("Failed to delete selected bookings");
        } finally {
            setShowBulkDelete(false);
            setBulkDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50/60 p-4 dark:bg-neutral-950 md:p-6">
                <Skeleton className="h-full min-h-[calc(100vh-2rem)] w-full rounded-2xl md:min-h-[calc(100vh-3rem)]" />
            </div>
        );
    }

    const selectedCount = table.getSelectedRowModel().rows.length;

    return (
        <div className="relative flex min-h-screen bg-slate-50/60 text-foreground dark:bg-neutral-950">
            <button
                type="button"
                aria-label="Close sidebar overlay"
                className={cn(
                    "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
                    sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 overflow-hidden bg-background transition-[width,transform,border-color] duration-300 ease-in-out lg:relative lg:inset-auto",
                    sidebarOpen
                        ? "w-72 translate-x-0 border-r"
                        : "w-72 -translate-x-full border-r lg:w-0 lg:translate-x-0 lg:border-r-0"
                )}
            >
                <Sidebar
                    currentFilter={currentFilter}
                    bookingCounts={bookingCounts}
                    onNavigate={closeSidebarOnMobile}
                />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-xl"
                            onClick={toggleSidebar}
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>

                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-semibold md:text-2xl">
                                {FILTER_TITLES[currentFilter]}
                            </h1>
                            <p className="hidden text-sm text-muted-foreground sm:block">
                                Manage customer appointments and keep the booking desk aligned.
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden">
                    <div className="h-full overflow-auto p-4 md:p-6">
                        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1600px]">
                                    <Table className="w-full table-auto">
                                        <TableHeader className="sticky top-0 z-10 bg-background">
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <TableHead key={header.id}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows.length ? (
                                                table.getRowModel().rows.map((row) => (
                                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                                        No bookings found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="h-10 rounded-xl"
                                    disabled={!selectedCount}
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    {selectedCount ? `Delete ${selectedCount} selected` : "Delete selected"}
                                </Button>
                                <div className="flex items-center gap-2 self-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-xl"
                                        disabled={!table.getCanPreviousPage()}
                                        onClick={() => table.previousPage()}
                                    >
                                        Prev
                                    </Button>
                                    <span className="min-w-[120px] text-center text-sm text-muted-foreground">
                                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-xl"
                                        disabled={!table.getCanNextPage()}
                                        onClick={() => table.nextPage()}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p>Are you sure you want to delete this booking?</p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete selected bookings?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-neutral-500">
                        Are you sure you want to delete {selectedCount} booking(s)? This cannot be undone.
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={bulkDeleting} onClick={handleBulkDelete}>
                            {bulkDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
