"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing token.");
            router.push("/forgot-password");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        if (res.ok) {
            toast.success("Password reset successfully. You can now log in.");
            router.push("/admin/login");
        } else {
            const data = await res.json();
            toast.error(data.error || "Failed to reset password.");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center">Reset Password</h1>
                <Input
                    type="password"
                    placeholder="Enter your new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </div>
    );
}
