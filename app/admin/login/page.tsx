"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!email || !password) {
            setError("Email and password are required.");
            setLoading(false);
            return;
        }

        if (res?.error) {
            setError("Invalid email or password.");
            toast.error("Invalid email or password. Please try again.");
        } else {
            toast.success("Login successful!");
            router.push("/admin/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-sm shadow-lg border dark:border-neutral-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">
                        Admin Login
                    </CardTitle>
                    <CardDescription>
                        Access your Rainforest Automotive admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@rainforest21.com"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
