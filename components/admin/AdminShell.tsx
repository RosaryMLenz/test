"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminShellProps {
    title: string;
    description: string;
    eyebrow?: string;
    actions?: ReactNode;
    children: ReactNode;
}

export default function AdminShell({ title, description, eyebrow, actions, children }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <div className="relative flex min-h-screen bg-[#f3f5f2] text-foreground dark:bg-neutral-950">
            <button
                type="button"
                aria-label="Close sidebar overlay"
                className={cn(
                    "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
                    sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 overflow-hidden bg-background transition-[width,transform,border-color] duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen",
                    sidebarOpen
                        ? "w-72 translate-x-0 border-r"
                        : "w-72 -translate-x-full border-r lg:w-0 lg:translate-x-0 lg:border-r-0",
                )}
            >
                <Sidebar onNavigate={closeSidebarOnMobile} />
            </aside>

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 md:px-7">
                    <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-xl"
                                onClick={() => setSidebarOpen((open) => !open)}
                            >
                                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                                <span className="sr-only">Toggle sidebar</span>
                            </Button>
                            <div className="min-w-0">
                                {eyebrow && (
                                    <p className="mb-0.5 hidden text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#17643f] sm:block">
                                        {eyebrow}
                                    </p>
                                )}
                                <h1 className="truncate text-lg font-bold tracking-tight text-slate-950 dark:text-white md:text-xl">
                                    {title}
                                </h1>
                                <p className="hidden truncate text-xs text-slate-500 md:block">{description}</p>
                            </div>
                        </div>
                        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                    </div>
                </header>

                <main className="mx-auto max-w-[1480px] p-4 md:p-7">{children}</main>
            </div>
        </div>
    );
}
