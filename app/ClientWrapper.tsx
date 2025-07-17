// app/ClientWrapper.tsx
"use client";

import { usePathname } from 'next/navigation';
import StickyNavWrapper from '@/components/StickyNavWrapper';
import Footer from '@/components/Footer';

export default function ClientWrapper({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <StickyNavWrapper />}
            <main className={!isAdmin ? "pt-16" : ""}>
                {children}
            </main>
            {!isAdmin && (
                <footer>
                    <Footer />
                </footer>
            )}
        </>
    );
}