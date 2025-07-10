"use client";

import { useState } from "react";
import { Menu, X, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <aside className={`transition-all ${open ? 'w-64' : 'w-16'} bg-neutral-200 dark:bg-neutral-900 h-screen p-4 flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">{open ? "Rainforest21" : "RF21"}</span>
                    <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </Button>
                </div>
                {open && <p className="text-neutral-700">Bookings</p>}
            </div>
            <div className="flex justify-between items-center">
                {open && <p>Admin</p>}
                <Button size="icon" variant="ghost" onClick={() => signOut()}>
                    <MoreVertical size={16} />
                </Button>
            </div>
        </aside>
    );
}
