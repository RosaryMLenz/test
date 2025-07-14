// File: app/admin/account/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminAccountPage() {
    const [email, setEmail] = useState("admin@example.com"); // Replace with real session email
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
            const res = await fetch("/api/admin/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                toast.error("Failed to update admin account");
                return;
            }

            toast.success("Account updated!");
        } catch (err) {
            console.error("Error updating admin account:", err);
            toast.error("Error updating account");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold text-center">Admin Account</h1>

            <div className="flex flex-col gap-4 space-y-4">
                <div>
                    <Label htmlFor="email" className="pb-2">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="pb-2">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword" className="pb-2">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button className="w-full mt-4" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
