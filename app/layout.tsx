// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';
import {Providers} from "@/app/providers";
import { LanguageProvider } from "@/context/LanguageContext";
import ClientWrapper from '@/app/ClientWrapper'; // Import the new client component

const inter = Inter({ subsets: ['latin'] });

// 🚀 SEO metadata
export const metadata: Metadata = {
    title: 'Rainforest Automotive',
    description:
        'Rainforest Automotive: Reliable, affordable mechanic services in Las Vegas, NV. Book oil changes, brake repairs, diagnostics, and more with transparent pricing and fast service.',
    openGraph: {
        title: 'Rainforest Automotive',
        description:
            'Reliable mechanic services in Las Vegas, NV. Book oil changes, brake repairs, and diagnostics easily online!',
        url: 'https://rainforest21automotive.com',
        siteName: 'Rainforest Automotive',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rainforest Automotive',
        description:
            'Las Vegas trusted auto repair and mechanic service. Book online for quick, quality repairs.',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            {/* Explicit <title> tag for IDE clarity */}
            <title>Rainforest Automotive</title>

            {/* Structured data for LocalBusiness -> AutoRepair */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'AutoRepair',
                        name: 'Rainforest Automotive',
                        description:
                            'Reliable mechanic services in Las Vegas, NV, including oil changes, brakes, and diagnostics.',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Las Vegas',
                            addressRegion: 'NV',
                        },
                        telephone: '+1-702-762-7573', // Replace with shop phone
                        url: 'https://rainforest21automotive.com', // Replace with deployed URL
                    }),
                }}
            />
        </head>

        <body className={inter.className}>
        <div id="scroll-container" className="overflow-auto h-screen">
            <Providers>
                <LanguageProvider>
                    <ClientWrapper>
                        <Toaster position="top-center" />
                        {children}
                    </ClientWrapper>
                </LanguageProvider>
            </Providers>
        </div>
        </body>

        </html>
    );
}