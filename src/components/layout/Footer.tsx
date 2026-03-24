import Link from "next/link";
import { Activity, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950/50">
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
            <p className="text-sm text-slate-500 max-w-sm dark:text-slate-400">
              EPLAN elektrik proje çizim programı kullanan mühendislerin en yaygın
              sorunlarını anında çözen birinci sınıf SaaS platformu.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Ürün</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/problems" className="hover:text-electric-500 transition-colors">Sorun Veritabanı</Link></li>
              <li><Link href="/videos" className="hover:text-electric-500 transition-colors">Eğitimler</Link></li>
              <li><Link href="/macro-service" className="hover:text-electric-500 transition-colors">Makro Hizmeti</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Destek</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/instant-solve" className="hover:text-electric-500 transition-colors">Anında Destek</Link></li>
              <li><Link href="/submit-problem" className="hover:text-electric-500 transition-colors">Sorun Bildir</Link></li>
              <li><Link href="/docs" className="hover:text-electric-500 transition-colors">Dokümantasyon</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} EplanDoctor. Tüm hakları saklıdır.</p>
          
          <div className="flex items-center gap-6">
            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6 mr-2">
              <Link href="https://instagram.com" target="_blank" className="text-slate-400 hover:text-pink-600 transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex gap-4 text-sm text-slate-400">
              <Link href="#" className="hover:text-slate-600">Gizlilik</Link>
              <Link href="#" className="hover:text-slate-600">Şartlar</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
