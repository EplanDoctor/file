"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Activity, Zap, ChevronDown, Wrench, FileCode2, MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AuthModal } from "../auth/AuthModal"

const mainNavItems = [
  { name: "Güncel Sorunlar", href: "/problems" },
  { name: "Sorun Bildir", href: "/submit-problem" },
  { name: "Eğitim Videoları", href: "/videos" },
  { name: "Dokümanlar", href: "/docs" },
]

export function Navbar() {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("register");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-500 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Eplan<span className="text-electric-500">Doctor</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 lg:gap-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-electric-500 px-2",
                  pathname === item.href ? "text-electric-600 dark:text-electric-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Hizmetlerimiz Dropdown */}
            <div className="relative group px-2 py-4 cursor-pointer">
              <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-electric-600 transition-colors">
                Profesyonel Hizmetler <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden p-2 flex flex-col gap-1">
                  
                  <Link href="/instant-solve" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">Anında Uzmana Bağlan</div>
                      <div className="text-xs text-slate-500 line-clamp-1">Canlı WhatsApp ekran desteği</div>
                    </div>
                  </Link>

                  <Link href="/macro-service" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">EPLAN Makro Tasarımı</div>
                      <div className="text-xs text-slate-500 line-clamp-1">Firmaya özel parça şablonları</div>
                    </div>
                  </Link>

                  <Link href="/proje-teklifi" className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-700 dark:text-amber-500 leading-none mb-1">Proje Çizdir</div>
                      <div className="text-xs text-slate-500 line-clamp-1">Komple IEC standartlarında anahtar teslim</div>
                    </div>
                  </Link>

                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex text-slate-600" onClick={() => openAuthModal("login")}>
              Giriş Yap
            </Button>
            <Button className="rounded-full shadow-sm" onClick={() => openAuthModal("register")}>
              <User className="mr-2 h-4 w-4" /> Ücretsiz Başla
            </Button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultIsLogin={authModalMode === "login"}
      />
    </>
  )
}
