"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Nasıl Çalışır", href: "#how-it-works" },
    { label: "Özellikler", href: "#features" },
    { label: "Fiyatlar", href: "#pricing" },
];

const USER_PANEL = "#";

export default function Header() {
    const [visible, setVisible] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                visible
                    ? "translate-y-0 opacity-100 bg-ink-900/85 backdrop-blur-xl"
                    : "-translate-y-full opacity-0"
            }`}
        >
            <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden">
                <div
                    className="h-full w-full"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, var(--color-silver-400) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "electricity-flow 6s linear infinite",
                        opacity: 0.4,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-censter justify-between h-16 lg:h-20">

                    <a href="#" aria-label="RichCase" className="relative inline-flex items-center h-full group">
                        <img src="/demos/richcase/rc-700x700.png" alt="" className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-80" />
                    </a>

                    <nav className="hidden lg:flex items-center gap-9">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="relative font-body text-sm text-silver-500 hover:text-silver-300 transition-colors duration-200 group"
                            >
                                {link.label}
                                <span aria-hidden="true" className="absolute -bottom-1.5 left-0 w-0 h-px bg-silver-400 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href={USER_PANEL}
                            className="hidden sm:inline-flex items-center font-body text-sm text-silver-300 px-5 py-2.5 border border-silver-400/30 hover:border-silver-400/60 hover:bg-silver-400/[0.06] transition-all duration-200"
                        >
                            Giriş Yap
                        </a>

                        <a
                            href="#"
                            className="hidden sm:inline-flex items-center font-body font-medium text-sm text-ink-950 px-5 py-2.5 bg-silver-300 hover:bg-silver-200 transition-colors duration-200"
                        >
                            Kayıt Ol
                        </a>

                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
                            className="lg:hidden p-2 border border-silver-400/30 text-silver-300 hover:bg-silver-400/[0.08] transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="lg:hidden border-t border-silver-400/20 py-4 space-y-1 bg-ink-900/95 backdrop-blur-xl">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-3 font-body text-base text-silver-300 hover:bg-silver-400/[0.06] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={USER_PANEL}
                            className="block mx-4 mt-3 text-center font-body text-sm text-silver-300 px-6 py-3 border border-silver-400/30"
                        >
                            Giriş Yap
                        </a>
                        <a
                            href="#"
                            className="block mx-4 mt-2 text-center font-body font-medium text-sm text-ink-950 px-6 py-3 bg-silver-300"
                        >
                            Kayıt Ol
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}
