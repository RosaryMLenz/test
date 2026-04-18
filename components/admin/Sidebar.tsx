"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock3,
    History,
    LayoutDashboard,
    ListFilter,
    LogOut,
    Moon,
    Settings,
    Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type DashboardFilter = "all" | "today" | "past" | "upcoming";

interface SidebarProps {
    currentFilter: DashboardFilter;
    bookingCounts: Record<DashboardFilter, number>;
    onNavigate?: () => void;
}

const bookingLinks = [
    {
        href: "/admin/dashboard?filter=today",
        label: "Today's Bookings",
        filter: "today" as const,
        icon: CalendarDays,
    },
    {
        href: "/admin/dashboard?filter=upcoming",
        label: "Upcoming Bookings",
        filter: "upcoming" as const,
        icon: Clock3,
    },
    {
        href: "/admin/dashboard?filter=past",
        label: "Past Bookings",
        filter: "past" as const,
        icon: History,
    },
    {
        href: "/admin/dashboard?filter=all",
        label: "All Bookings",
        filter: "all" as const,
        icon: ListFilter,
    },
];

export default function Sidebar({ currentFilter, bookingCounts, onNavigate }: SidebarProps) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const finalTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        setTheme(finalTheme);
        document.documentElement.classList.toggle("dark", finalTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";

        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    return (
        <div className="flex h-full w-72 flex-col bg-background">
            <div className="flex h-full flex-col gap-6 p-4">
                <Link
                    href="/admin/dashboard?filter=today"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-4 shadow-sm"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">Admin Dashboard</p>
                        <p className="truncate text-xs text-muted-foreground">Rainforest Automotive</p>
                    </div>
                </Link>

                <div className="space-y-3">
                    <div className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Bookings
                    </div>
                    <nav className="space-y-1">
                        {bookingLinks.map(({ href, label, filter, icon: Icon }) => {
                            const isActive = currentFilter === filter;
                            const count = bookingCounts[filter];

                            return (
                                <Link
                                    key={filter}
                                    href={href}
                                    onClick={onNavigate}
                                    className={cn(
                                        "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{label}</span>
                                    <span
                                        className={cn(
                                            "ml-auto inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                                            isActive
                                                ? "bg-primary-foreground/16 text-primary-foreground"
                                                : "bg-muted text-foreground"
                                        )}
                                    >
                                        {count}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt="Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">Admin</p>
                            <p className="truncate text-xs text-muted-foreground">Dashboard controls</p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-3 h-10 w-full justify-between rounded-xl px-3"
                        onClick={toggleTheme}
                    >
                        <span className="flex items-center gap-2">
                            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            {theme === "light" ? "Dark mode" : "Light mode"}
                        </span>
                        <span className="text-xs text-muted-foreground">Theme</span>
                    </Button>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl"
                            onClick={() => router.push("/admin/account")}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Account
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl"
                            onClick={() => setShowConfirm(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

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
