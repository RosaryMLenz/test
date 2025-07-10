"use client";

import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/admin/Sidebar";
import { getBookings } from "@/lib/actions/getBookings";
import { Booking } from "@/types/BookingFormData";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const data = await getBookings();
            setBookings(data);
            setLoading(false);
        };
        fetchBookings();
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Bookings</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id}>
                                <td><Checkbox /></td>
                                <td>{b.name}</td>
                                <td>{b.email}</td>
                                <td>{b.phone}</td>
                                <td>{b.date}</td>
                                <td>{b.time}</td>
                                <td>
                                    <Button onClick={() => router.push(`/admin/bookings/${b.id}`)}>
                                        <MoreVertical size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}
