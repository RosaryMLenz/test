"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Done() {
    const router = useRouter();

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold mb-2 text-green-600">
                Booking Complete!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Thank you for booking with us. We look forward to servicing your vehicle.
            </p>
            <button
                onClick={() => {
                    console.log("Done clicked, navigating home...");
                    router.push("/");
                    // Fallback if modal structure blocks navigation:
                     window.location.href = "/";
                }}
                className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
                Done
            </button>
        </div>
    );
}
