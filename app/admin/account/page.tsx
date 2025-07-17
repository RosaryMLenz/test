"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminAccountPage() {
    const [initialEmail, setInitialEmail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch current admin email
    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const res = await fetch("/api/admin/account");
                const data = await res.json();
                setInitialEmail(data.email);
                setEmail(data.email);
            } catch (err) {
                console.error("Error:", err);
                toast.error("Error updating account");
            }
        };
        fetchEmail();
    }, []);

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/admin/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error(error.message || "Failed to update account");
                return;
            }

            toast.success("Account updated");
            setInitialEmail(email);
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error updating account");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEmail(initialEmail);
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold text-center">Admin Account</h1>

            <div className="flex flex-col gap-4 space-y-4">
                <div>
                    <Label htmlFor="email" className="pb-2">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="pb-2">
                        New Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword" className="pb-2">
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
