"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/types/BookingFormData";
import Sidebar from "@/components/admin/Sidebar";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 dark:bg-black bg-white">
                <h1 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
                    Bookings
                </h1>
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
                            {bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <td className="p-2">
                                        <Checkbox />
                                    </td>
                                    <td className="p-2">{booking.name}</td>
                                    <td className="p-2">{booking.email}</td>
                                    <td className="p-2">{booking.phone}</td>
                                    <td className="p-2">{booking.date}</td>
                                    <td className="p-2">{booking.time}</td>
                                    <td className="p-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                                router.push(`/admin/bookings/${booking.id}`)
                                            }
                                        >
                                            <MoreVertical size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
