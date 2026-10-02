"use client";

import React from "react";

export default function TelegramInvite() {
    return (
        <section
            className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
            style={{
                background: "linear-gradient(160deg, #1a1a1a 0%, #0f0f0f 50%, #050505 100%)",
            }}
        >

            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="font-rc-display font-extrabold text-display-2 text-ink-100 leading-none mb-6">
                        Gruba katıl,{" "}
                        <span className="text-gradient-gold">içeride ol.</span>
                    </h2>

                    <p className="font-body text-body-lg text-ink-300 leading-relaxed max-w-xl mx-auto mb-10">
                        Piyasa yorumları, bot güncellemeleri ve üye sohbeti —
                        hepsi RichCase Telegram grubunda. Katıl, topluluğun nabzını tut.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <a
                            href="https://t.me/richcase"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 font-body font-bold uppercase tracking-[0.06em] px-6 py-4 text-base sm:px-10 sm:py-5 sm:text-lg bg-gold-500 text-ink-950 border-2 border-ink-950 shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:2px_2px_0_0_rgba(0,0,0,1)] transition-transform"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            Gruba Katıl
                        </a>

                        <p className="font-body text-sm text-ink-300 uppercase tracking-[0.18em]">
                            Ücretsiz · Herkese açık
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
