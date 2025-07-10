"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            toast.success("If your email exists, a reset link has been sent.");
        } else {
            toast.error("Something went wrong. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>
        </div>
    );
}
