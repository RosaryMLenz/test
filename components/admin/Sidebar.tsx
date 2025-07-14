"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
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

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 bg-neutral-900 text-white h-full flex flex-col justify-between">
            {/* Header */}
            <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-bold tracking-wide">Rainforest21</h2>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2 p-6">
                <Link
                    href="/admin/dashboard"
                    className="hover:text-green-400 transition"
                >
                    Dashboard
                </Link>
            </nav>

            {/* Footer Admin Dropdown */}
            <div className="p-4 border-t border-neutral-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User size={20} />
                    <span className="text-sm">Admin</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-neutral-800"
                        >
                            <MoreVertical size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push("/admin/account")}>
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowConfirm(true)}>
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Logout Confirmation Dialog (outside dropdown!) */}
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
        </aside>
    );
}
