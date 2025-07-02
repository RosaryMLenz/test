'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        { href: '/discounts', label: 'Discounts' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-black text-white sticky top-0 z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Rainforest Automotive
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`hover:text-green-400 transition ${
                                pathname === link.href ? 'text-green-400' : ''
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Language Toggle Placeholder */}
                    <button
                        onClick={() => alert('Language switch logic here')}
                        className="text-sm border border-green-400 px-2 py-1 rounded hover:bg-green-400 hover:text-black transition"
                    >
                        EN | ES
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded hover:bg-gray-800 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-black border-t border-gray-800 px-4 py-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block hover:text-green-400 transition ${
                                pathname === link.href ? 'text-green-400' : ''
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Language Toggle */}
                    <button
                        onClick={() => {
                            alert('Language switch logic here');
                            setMenuOpen(false);
                        }}
                        className="text-sm border border-green-400 px-2 py-1 rounded hover:bg-green-400 hover:text-black transition w-full"
                    >
                        EN | ES
                    </button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;