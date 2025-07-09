// app/components/StickyNavWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function StickyNavWrapper() {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setShow(false); // scroll down, hide
            } else {
                setShow(true); // scroll up, show
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
                show ? "translate-y-0" : "-translate-y-full"
            } shadow-sm bg-white dark:bg-black`}
        >
            <NavBar />
        </div>
    );
}
