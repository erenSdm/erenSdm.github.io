"use client";

import React from "react";
import { Mail, MessageCircle } from "lucide-react";
import Twitter from "./TwitterIcon";

export default function Footer() {
    return (
        <footer className="relative bg-ink-950 border-t border-ink-700">

            <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-10 md:pt-16 lg:pt-20 lg:pb-12">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 mb-10 md:mb-14">

                    {/* Marka */}
                    <div className="col-span-2 lg:col-span-1 space-y-5">
                        <div className="inline-flex items-center gap-3">
                            <img src="/demos/richcase/rc-32x32.png" alt="" className="h-7 w-7 object-contain" />
                            <span className="font-body font-bold text-base tracking-[0.08em] text-ink-100">
                                RICHCASE
                            </span>
                        </div>
                        <p className="font-body text-sm text-ink-400 leading-relaxed max-w-xs">
                            Binance Futures için profesyonel otomatik kripto ticaret botu.
                            Hesabını bağla, kazancı izle.
                        </p>

                        <div className="flex gap-2">
                            {[
                                { icon: Twitter,       href: "#", label: "X"        },
                                { icon: MessageCircle, href: "#", label: "Telegram" },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    aria-label={item.label}
                                    className="h-9 w-9 border border-ink-600 bg-ink-900 flex items-center justify-center text-ink-400 hover:border-gold-700/60 hover:text-gold-400 hover:bg-gold-500/[0.06] transition-all duration-200"
                                >
                                    <item.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterCol
                        title="Ürün"
                        links={[
                            { label: "Özellikler",    href: "#features"     },
                            { label: "Fiyatlar",      href: "#pricing"      },
                            { label: "Nasıl Çalışır", href: "#how-it-works" },
                            { label: "Dökümantasyon", href: "#"         },
                        ]}
                    />

                    <FooterCol
                        title="Şirket"
                        links={[
                            { label: "Hakkımızda", href: "#" },
                            { label: "Blog",       href: "#"       },
                            { label: "İletişim",   href: "#"   },
                            { label: "Kariyer",    href: "#"    },
                        ]}
                    />

                    <FooterCol
                        title="Yasal"
                        links={[
                            { label: "Gizlilik Politikası",  href: "#" },
                            { label: "Kullanım Şartları",    href: "#"  },
                            { label: "Risk Bilgilendirmesi", href: "#"     },
                            { label: "İade Politikası",      href: "#"     },
                        ]}
                    />
                </div>

                {/* risk uyarısı */}
                <div className="p-4 sm:p-6 bg-ink-900 border border-ink-700 rounded-none">
                    <div className="font-body text-mono-sm uppercase tracking-[0.18em] text-gold-500 mb-3">
                        Risk Uyarısı
                    </div>
                    <p className="font-body text-sm text-ink-400 leading-relaxed">
                        Kripto para ticareti yüksek risk içerir ve her yatırımcıya uygun değildir.
                        Vadeli işlem, hisse ve opsiyon değerleri dalgalanabilir; bu nedenle ilk
                        yatırımdan daha fazlasını kaybedebilirsiniz. Geçmiş performans gelecek
                        garantisi vermez. RC Platform, kullanıcıların ticaret zararlarından
                        sorumlu değildir.
                    </p>
                </div>

                {/* alt bar */}
                <div className="mt-8 pt-6 border-t border-ink-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body text-mono-sm text-ink-500 uppercase tracking-[0.16em]">
                        © 2026 RichCase Platform · Tüm hakları saklıdır
                    </p>
                    <a
                        href="mailto:support@richcase.com"
                        className="inline-flex items-center gap-2 font-body text-sm text-ink-400 hover:text-gold-400 transition-colors duration-200"
                    >
                        <Mail className="h-4 w-4" />
                        support@richcase.com
                    </a>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div>
            <h3 className="font-heading text-mono-sm uppercase tracking-[0.18em] text-silver-500 mb-5">
                {title}
            </h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="font-body text-sm text-ink-400 hover:text-ink-100 hover:translate-x-0.5 transition-all duration-200 inline-block"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
