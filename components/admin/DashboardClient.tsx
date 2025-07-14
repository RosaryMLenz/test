"use client";

import { useEffect, useState } from "react";
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

const BOOKINGS_PER_PAGE = 10;

export default function DashboardClient() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

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

    const paginatedBookings = bookings.slice(
        (currentPage - 1) * BOOKINGS_PER_PAGE,
        currentPage * BOOKINGS_PER_PAGE
    );

    const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);

    return (
        <div className="flex min-h-screen">
            {sidebarOpen && <Sidebar />}
            <main className="flex-1 p-6 dark:bg-black bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        Bookings
                    </h1>
                    <Button onClick={toggleSidebar} size="icon" variant="outline">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>
                {loading ? (
                    <Skeleton className="h-96 w-full" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr className="border-b dark:border-neutral-700">
                                <th className="text-left p-2">Select</th>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Email</th>
                                <th className="text-left p-2">Phone</th>
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Time</th>
                                <th className="text-left p-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <td className="p-2">
                                        <Checkbox
                                            checked={selectedIds.includes(booking.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedIds((prev) =>
                                                    checked
                                                        ? [...prev, booking.id]
                                                        : prev.filter((id) => id !== booking.id)
                                                );
                                            }}
                                        />
                                    </td>
                                    <td className="p-2">{booking.name}</td>
                                    <td className="p-2">{booking.email}</td>
                                    <td className="p-2">{booking.phone}</td>
                                    <td className="p-2">{booking.date}</td>
                                    <td className="p-2">{booking.time}</td>
                                    <td className="p-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(`/admin/bookings/${booking.id}/edit`)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteId(booking.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4 gap-2">
                                <Button
                                    variant="destructive"
                                    disabled={selectedIds.length === 0}
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    🗑 Delete {selectedIds.length} selected
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        Prev
                                    </Button>
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

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
                        Are you sure you want to delete {selectedIds.length} booking(s)? This cannot be undone.
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={bulkDeleting}
                            onClick={async () => {
                                setBulkDeleting(true);
                                try {
                                    await Promise.all(
                                        selectedIds.map((id) =>
                                            fetch(`/api/bookings/${id}`, { method: "DELETE" })
                                        )
                                    );
                                    setBookings((prev) =>
                                        prev.filter((b) => !selectedIds.includes(b.id))
                                    );
                                    setSelectedIds([]);
                                    toast.success("Selected bookings deleted");
                                } catch (err) {
                                    console.error("Bulk delete error:", err);
                                    toast.error("Failed to delete selected bookings");
                                } finally {
                                    setShowBulkDelete(false);
                                    setBulkDeleting(false);
                                }
                            }}
                        >
                            {bulkDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
