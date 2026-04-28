"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col uppercase">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <Section>
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-electric-200 bg-electric-50 px-3 py-1 text-[10px] font-black text-electric-600 mb-8 dark:border-electric-800 dark:bg-electric-900/30 dark:text-electric-400">
              <Shield className="w-3 h-3 mr-2" />
              GÜVENLİ VE ŞEFFAF
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-12 leading-tight">
              GİZLİLİK <span className="text-electric-500">POLİTİKASI</span>
            </h1>

            <div className="space-y-12 text-slate-300">
              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-electric-500" />
                  1. VERİ TOPLAMA
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  EPLANDOCTOR OLARAK, KULLANICILARIMIZIN GİZLİLİĞİNE ÖNEM VERİYORUZ. HİZMETLERİMİZİ SUNABİLMEK ADINA GOOGLE AUTH ÜZERİNDEN AD-SOYAD VE E-POSTA ADRESİNİZİ ALIYORUZ. BU VERİLER SADECE KULLANICI DENEYİMİNİ İYİLEŞTİRMEK VE SATIN ALDIĞINIZ İÇERİKLERE ERİŞİMİNİZİ SAĞLAMAK İÇİN KULLANILIR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <Eye className="w-5 h-5 text-electric-500" />
                  2. ÖDEME GÜVENLİĞİ
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  ÖDEME İŞLEMLERİ DOĞRUDAN SHOPIER ALTYAPISI ÜZERİNDEN GERÇEKLEŞTİRİLİR. KREDİ KARTI VEYA BANKA KARTI BİLGİLERİNİZ HİÇBİR ŞEKİLDE SUNUCULARIMIZDA TUTULMAZ VEYA İŞLENMEZ. SHOPIER KENDİ GİZLİLİK VE GÜVENLİK PROTOKOLLERİYLE BU VERİLERİ KORUR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-electric-500" />
                  3. ÇEREZLER VE ANALİTİK
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  PLATFORMUMUZUN PERFORMANSINI ÖLÇMEK VE SİZE DAHA İYİ HİZMET VEREBİLMEK ADINA ÇEREZLER (COOKIES) KULLANILMAKTADIR. BU ÇEREZLER OTURUM YÖNETİMİ VE TERCİHLERİNİZİN HATIRLANMASI İÇİN GEREKLİDİR.
                </p>
              </section>

              <section className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-black text-white mb-4">İLETİŞİM</h2>
                <p className="text-sm font-bold text-slate-400">
                  GİZLİLİK POLİTİKAMIZLA İLGİLİ HER TÜRLÜ SORUNUZ İÇİN DESTEK@EPLANDOKTOR.COM ADRESİNDEN BİZE ULAŞABİLİRSİNİZ.
                </p>
              </section>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
