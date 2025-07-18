// Sidebar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {LayoutDashboard, Moon, Sun, LogOut, Settings, MoreVertical} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Sidebar() {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const finalTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        setTheme(finalTheme);
        document.documentElement.classList.toggle('dark', finalTheme === 'dark');
    }, []);

    if (!isMounted) return null; // 🔥 Prevent hydration mismatch

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    return (
        <div className="flex w-64 flex-col border-r bg-background">
            <nav className="flex flex-col gap-4 py-5 px-2 sm:py-5">
                <Link href="/admin/dashboard" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <LayoutDashboard className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Rainforest Automotive</span>
                </Link>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start pl-10" asChild>
                    <Link href="/admin/dashboard?filter=today">
                        <span className="text-sm">Today Bookings</span>
                    </Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start pl-10" asChild>
                    <Link href="/admin/dashboard?filter=past">
                        <span className="text-sm">Past Bookings</span>
                    </Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start pl-10" asChild>
                    <Link href="/admin/dashboard?filter=upcoming">
                        <span className="text-sm">Upcoming Bookings</span>
                    </Link>
                </Button>

                {/* Add more navigation items if needed */}
            </nav>
            <nav className="mt-auto flex flex-col gap-4 px-2 sm:py-5">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span>Admin</span>
                    <Button
                        variant="ghost"
                        className="ml-auto h-8 w-8"
                        size="icon"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/admin/account")}>
                                <Settings className="mr-2 h-4 w-4" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowConfirm(true)}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-neutral-500">
                        Are you sure you want to sign out?
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>
                            Sign Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}