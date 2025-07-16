
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { href: "/", labelEn: "Home", labelEs: "Inicio" },
    { href: "/services", labelEn: "Services", labelEs: "Servicios" },
    { href: "/contact", labelEn: "Contact", labelEs: "Contacto" },
    { href: "/warranty", labelEn: "Warranty", labelEs: "Garantia" },
];

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const { setTheme, resolvedTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="bg-white text-black dark:bg-black dark:text-white border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                <Link href="/" className="text-lg font-semibold tracking-tight hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    Rainforest21 Automotive
                </Link>

                <div className="flex items-center space-x-4">
                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex space-x-4 items-center">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-colors hover:text-green-500 dark:hover:text-green-400",
                                    pathname === link.href ? "text-green-600 dark:text-green-400 font-medium" : ""
                                )}
                            >
                                {language === "en" ? link.labelEn : link.labelEs}
                            </Link>
                        ))}
                    </nav>

                    {/* Language Toggle - Always Visible */}
                    <button
                        onClick={toggleLanguage}
                        className="border border-green-500 dark:border-green-400 px-2 py-1 rounded text-sm hover:bg-green-500 dark:hover:bg-green-400 hover:text-white dark:hover:text-black transition-colors"
                    >
                        {language === "en" ? "ES" : "EN"}
                    </button>

                    {/* Theme Toggle - Always Visible */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {resolvedTheme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                        className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav with animation - Only Links */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-4"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "block transition-colors hover:text-green-500 dark:hover:text-green-400",
                                    pathname === link.href ? "text-green-600 dark:text-green-400 font-medium" : ""
                                )}
                            >
                                {language === "en" ? link.labelEn : link.labelEs}
                            </Link>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}