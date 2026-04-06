"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Activity, Zap, ChevronDown, Wrench, FileCode2, MessageCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { AuthModal } from "../auth/AuthModal"

import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if auth is required from query params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "required") {
        setIsAuthModalOpen(true);
        // Clean up URL to avoid re-triggering
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  const mainNavItems = [
    { name: t.nav.problems, href: "/problems" },
    { name: t.nav.submit, href: "/submit-problem" },
    { name: t.nav.videos, href: "/videos" },
    { name: t.nav.docs, href: "/docs" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md uppercase">
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
                  "text-xs font-bold transition-colors hover:text-electric-500 px-2",
                  pathname === item.href ? "text-electric-600 dark:text-electric-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Hizmetlerimiz Dropdown */}
            <div className="relative group px-2 py-4 cursor-pointer">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-electric-600 transition-colors">
                {t.nav.services} <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0">
                <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 overflow-hidden p-2 flex flex-col gap-1">
                  
                  <Link href="/instant-solve" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{t.nav.instant_solve}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{t.nav.instant_solve_desc}</div>
                    </div>
                  </Link>

                  <Link href="/macro-service" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{t.nav.macro}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{t.nav.macro_desc}</div>
                    </div>
                  </Link>

                  <Link href="/proje-teklifi" className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-700 dark:text-amber-500 leading-none mb-1">{t.nav.project}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{t.nav.project_desc}</div>
                    </div>
                  </Link>

                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher (Flags) */}
            <div className="flex gap-2 mr-2 border-r border-slate-200 dark:border-slate-800 pr-4">
              <button onClick={() => setLanguage('tr')} className={cn("transition-transform hover:scale-110", language === 'tr' ? "ring-2 ring-electric-500 rounded-sm" : "opacity-40")}>
                <img src="https://flagcdn.com/w40/tr.png" alt="TR" className="w-6 h-auto" />
              </button>
              <button onClick={() => setLanguage('en')} className={cn("transition-transform hover:scale-110", language === 'en' ? "ring-2 ring-electric-500 rounded-sm" : "opacity-40")}>
                <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-6 h-auto" />
              </button>
              <button onClick={() => setLanguage('de')} className={cn("transition-transform hover:scale-110", language === 'de' ? "ring-2 ring-electric-500 rounded-sm" : "opacity-40")}>
                <img src="https://flagcdn.com/w40/de.png" alt="DE" className="w-6 h-auto" />
              </button>
            </div>

            {user ? (
               <div className="relative group">
                 <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-electric-500 transition-all group shadow-sm">
                   <div className="hidden lg:block text-right">
                     <div className="text-[10px] font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[100px]">{user.displayName || 'EPLAN UZMANI'}</div>
                     <div className="text-[8px] font-bold text-slate-400 leading-none">PROFİLİM</div>
                   </div>
                   <div className="w-9 h-9 rounded-full bg-electric-100 overflow-hidden border-2 border-white dark:border-slate-800 group-hover:border-electric-500 transition-colors shadow-sm">
                     {user.photoURL ? (
                       <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-electric-600 bg-electric-50">
                         <User className="w-5 h-5" />
                       </div>
                     )}
                   </div>
                 </button>
                 
                 {/* Dropdown Menu */}
                 <div className="absolute top-full right-0 mt-3 w-56 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden p-2 flex flex-col gap-1">
                     <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <User className="w-4 h-4 text-slate-400" />
                       <span className="text-[10px] font-black tracking-widest">{t.nav.profile_settings}</span>
                     </Link>

                     {/* Admin Link - Only for owner */}
                     {user.email === "cnr.pano@gmail.com" && (
                       <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl bg-electric-500/10 hover:bg-electric-500/20 text-electric-400 transition-colors">
                         <Activity className="w-4 h-4" />
                         <span className="text-[10px] font-black tracking-widest">YÖNETİM PANELİ</span>
                       </Link>
                     )}

                     <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                     <button 
                       onClick={logout}
                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                     >
                       <Zap className="w-4 h-4" />
                       <span className="text-[10px] font-black tracking-widest">{t.nav.logout}</span>
                     </button>
                   </div>
                 </div>
               </div>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:flex text-slate-600 font-bold text-xs" onClick={() => setIsAuthModalOpen(true)}>
                  {t.nav.login}
                </Button>
                <Button className="rounded-full shadow-sm font-bold text-xs px-6" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" /> {t.nav.start}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}
