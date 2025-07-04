"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

type Language = "en" | "es";

interface LanguageContextProps {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps>({
    language: "en",
    toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const stored = localStorage.getItem("language") as Language;
        if (stored === "en" || stored === "es") {
            setLanguage(stored);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
