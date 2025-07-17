"use client";

import { useEffect, useMemo, useState } from "react";
import { Booking } from "@/types/BookingFormData";
import Sidebar from "@/components/admin/Sidebar";
import { MoreVertical, Menu, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    PaginationState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DashboardClient() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const res = await fetch("/api/bookings");
                const data = await res.json();
                setBookings(data.bookings ?? []);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/bookings/${id}`, { method: "DELETE" });
            setBookings((prev) => prev.filter((b) => b.id !== id));
            toast.success("Booking deleted");
        } catch (err) {
            console.error("Error deleting booking:", err);
            toast.error("Failed to delete booking");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const columns: ColumnDef<Booking>[] = useMemo(() => [
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
        { accessorKey: "problemDescription", header: "Problem Description", cell: ({ row }) => row.original.problemDescription || "N/A" },
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
        { accessorKey: "additionalDetails", header: "Additional Details", cell: ({ row }) => row.original.additionalDetails || "N/A" },
        { accessorKey: "dropOffOrWait", header: "Drop Off or Wait", cell: ({ row }) => row.original.dropOffOrWait || "N/A" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
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
    ], [router]);

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
            setBookings((prev) => prev.filter((b) => !ids.includes(b.id)));
            table.resetRowSelection();
            toast.success("Selected bookings deleted");
        } catch (err) {
            console.error("Bulk delete error:", err);
            toast.error("Failed to delete selected bookings");
        } finally {
            setShowBulkDelete(false);
            setBulkDeleting(false);
        }
    };

    if (loading) return <Skeleton className="h-screen w-full" />;

    return (
        <div className="flex h-screen bg-white dark:bg-black">
            {sidebarOpen && (
                <aside className="w-64 flex-shrink-0 overflow-y-auto border-r">
                    <Sidebar />
                </aside>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b px-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Bookings</h1>
                    <Button variant="outline" size="icon" onClick={toggleSidebar}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    <div className="min-w-full overflow-x-auto">
                        <div className="min-w-[1600px]">
                            <Table className="w-full table-auto">
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 gap-2">
                        <Button variant="destructive" disabled={!table.getSelectedRowModel().rows.length} onClick={() => setShowBulkDelete(true)}>
                            🗑 Delete {table.getSelectedRowModel().rows.length} selected
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                                Prev
                            </Button>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
                            <Button variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                                Next
                            </Button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Single Delete Confirmation */}
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

            {/* Bulk Delete Confirmation */}
            <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete selected bookings?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-neutral-500">
                        Are you sure you want to delete {table.getSelectedRowModel().rows.length} booking(s)? This cannot be undone.
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
