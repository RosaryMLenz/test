// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';
import {Providers} from "@/app/providers";
import { LanguageProvider } from "@/context/LanguageContext";
import ClientWrapper from '@/app/ClientWrapper'; // Import the new client component

// 🚀 SEO metadata
export const metadata: Metadata = {
    metadataBase: new URL('https://rainforest21automotive.com'),
    title: {
        default: 'Rainforest21 Automotive | Las Vegas Auto Repair',
        template: '%s | Rainforest21 Automotive',
    },
    description:
        'Straightforward auto repair and maintenance in Las Vegas, including oil changes, brakes, diagnostics, A/C service, and more.',
    openGraph: {
        title: 'Rainforest21 Automotive | Las Vegas Auto Repair',
        description:
            'Honest repairs, clear answers, and dependable auto care in Las Vegas.',
        url: 'https://rainforest21automotive.com',
        siteName: 'Rainforest21 Automotive',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og.png',
                width: 1200,
                height: 630,
                alt: 'Rainforest21 Automotive — Honest repairs. Clear answers.',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rainforest21 Automotive | Las Vegas Auto Repair',
        description:
            'Honest repairs, clear answers, and dependable auto care in Las Vegas.',
        images: ['/og.png'],
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
            {/* Structured data for LocalBusiness -> AutoRepair */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'AutoRepair',
                        name: 'Rainforest21 Automotive',
                        description:
                            'Reliable mechanic services in Las Vegas, NV, including oil changes, brakes, and diagnostics.',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: '3280 Wynn Rd, Unit 4',
                            addressLocality: 'Las Vegas',
                            addressRegion: 'NV',
                            postalCode: '89102',
                            addressCountry: 'US',
                        },
                        telephone: '+1-702-762-7573',
                        email: 'office@rainforest21automotive.com',
                        url: 'https://rainforest21automotive.com',
                        openingHoursSpecification: [
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                                opens: '09:00',
                                closes: '18:00',
                            },
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: 'Saturday',
                                opens: '09:00',
                                closes: '12:00',
                            },
                        ],
                    }),
                }}
            />
        </head>

        <body className="antialiased">
            <Providers>
                <LanguageProvider>
                    <ClientWrapper>
                        <Toaster position="top-center" />
                        {children}
                    </ClientWrapper>
                </LanguageProvider>
            </Providers>
        </body>

        </html>
    );
}
