// File: app/admin/bookings/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Booking } from "@/types/BookingFormData";
import { Textarea } from "@/components/ui/textarea";

export default function EditBookingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`/api/bookings/${id}`);
                const data = await res.json();
                setBooking(data.booking);
            } catch (error) {
                console.error("Failed to load booking:", error);
                toast.error("Failed to load booking");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBooking();
    }, [id]);

    const handleChange = (field: keyof Booking, value: string) => {
        setBooking((prev) => prev ? { ...prev, [field]: value } : prev);
    };

    const handleSubmit = async () => {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
        });

        if (!res.ok) {
            toast.error("Failed to update booking");
            return;
        }

        toast.success("Booking updated");
        router.push("/admin/dashboard");
    };

    if (loading) return <Skeleton className="h-64 w-full" />;

    if (!booking) return <p className="text-red-500">Booking not found</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold text-center">Edit Booking</h1>

            <div className="space-y-4 p-2">
                <div>
                    <Label htmlFor="name" className="pb-2">Name</Label>
                    <Input
                        id="name"
                        value={booking.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="email" className="pb-2">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={booking.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="phone" className="pb-2">Phone</Label>
                    <Input
                        id="phone"
                        value={booking.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="reason" className="pb-2">Reason</Label>
                    <Input
                        id="reason"
                        value={booking.reason ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("reason", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="make" className="pb-2">Make</Label>
                    <Input
                        id="make"
                        value={booking.make ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("make", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="year" className="pb-2">Year</Label>
                    <Input
                        id="year"
                        value={booking.year ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("year", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="model" className="pb-2">Model</Label>
                    <Input
                        id="model"
                        value={booking.model ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("model", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="trim" className="pb-2">Trim</Label>
                    <Input
                        id="trim"
                        value={booking.trim ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("trim", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="problemDescription" className="pb-2">Problem Description</Label>
                    <Textarea
                        id="problemDescription"
                        value={booking.problemDescription ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("problemDescription", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="date" className="pb-2">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={booking.date ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("date", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="time" className="pb-2">Time</Label>
                    <Input
                        id="time"
                        type="text"
                        value={booking.time ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("time", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="additionalDetails" className="pb-2">Additional Details</Label>
                    <Textarea
                        id="additionalDetails"
                        value={booking.additionalDetails ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("additionalDetails", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="dropOffOrWait" className="pb-2">Drop Off or Wait</Label>
                    <Input
                        id="dropOffOrWait"
                        value={booking.dropOffOrWait ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("dropOffOrWait", e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </div>
            </div>
        </div>
    );
}