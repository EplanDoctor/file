"use client";

import Link from "next/link";
import { Activity, Instagram } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950/50 uppercase">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-500 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Eplan<span className="text-electric-500">Doctor</span>
              </span>
            </Link>
            <p className="text-xs font-bold text-slate-500 max-w-sm dark:text-slate-400">
              {t.footer.desc}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-black mb-4 text-slate-900 dark:text-slate-100">{t.footer.product}</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <li><Link href="/problems" className="hover:text-electric-500 transition-colors">{t.nav.problems}</Link></li>
              <li><Link href="/videos" className="hover:text-electric-500 transition-colors">{t.nav.videos}</Link></li>
              <li><Link href="/macro-service" className="hover:text-electric-500 transition-colors">{t.nav.macro}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black mb-4 text-slate-900 dark:text-slate-100">{t.footer.support}</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <li><Link href="/instant-solve" className="hover:text-electric-500 transition-colors">{t.nav.instant_solve}</Link></li>
              <li><Link href="/submit-problem" className="hover:text-electric-500 transition-colors">{t.nav.submit}</Link></li>
              <li><Link href="/docs" className="hover:text-electric-500 transition-colors">{t.nav.docs}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400">© {new Date().getFullYear()} EplanDoctor. {t.footer.rights}</p>
          
          <div className="flex items-center gap-6">
            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6 mr-2">
              <Link href="https://instagram.com" target="_blank" className="text-slate-400 hover:text-pink-600 transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex gap-4 text-xs font-bold text-slate-400">
              <Link href="#" className="hover:text-slate-600">{t.footer.privacy}</Link>
              <Link href="#" className="hover:text-slate-600">{t.footer.terms}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
