"use client";

import { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";

export default function StickyNavWrapper() {
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        console.log("Navbar mounted");

        const scrollContainer = document.getElementById("scroll-container");

        const handleScroll = () => {
            const currentScrollY = scrollContainer?.scrollTop ?? 0;

            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setShow(false);
            } else {
                setShow(true);
            }

            lastScrollY.current = currentScrollY;
        };

        scrollContainer?.addEventListener("scroll", handleScroll);
        return () => scrollContainer?.removeEventListener("scroll", handleScroll);
    }, []);

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
