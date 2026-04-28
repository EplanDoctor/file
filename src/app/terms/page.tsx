"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { FileText, Gavel, CreditCard, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col uppercase">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <Section>
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-electric-200 bg-electric-50 px-3 py-1 text-[10px] font-black text-electric-600 mb-8 dark:border-electric-800 dark:bg-electric-900/30 dark:text-electric-400">
              <FileText className="w-3 h-3 mr-2" />
              KULLANIM KOŞULLARI
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-12 leading-tight">
              KULLANIM <span className="text-electric-500">ŞARTLARI</span>
            </h1>

            <div className="space-y-12 text-slate-300">
              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <Gavel className="w-5 h-5 text-electric-500" />
                  1. HİZMET KAPSAMI
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  EPLANDOCTOR, EPLAN ELEKTRİK PROJE ÇİZİM PROGRAMI KULLANAN MÜHENDİSLER İÇİN TEKNİK ÇÖZÜM REHBERLERİ, VİDEO EĞİTİMLER VE DOKÜMANTASYON HİZMETİ SUNAN BİR PLATFORMDUR. PLATFORMDAKİ İÇERİKLERİN BİR KISMI ÜCRETSİZ, BİR KISMI İSE ÜCRETLİDİR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-electric-500" />
                  2. ÖDEME VE İADE
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  ÜCRETLİ İÇERİKLER (VİDEO, DOKÜMAN VB.) SATIN ALINDIKTAN SONRA DİJİTAL OLARAK ANINDA ERİŞİME AÇILIR. BU TÜR DİJİTAL ÜRÜNLERDE, TÜKETİCİ HAKLARI MEVZUATI GEREĞİ CAYMA HAKKI VE İADE MÜMKÜN DEĞİLDİR. SATIN ALMA ÖNCESİ İÇERİK DETAYLARINI İNCELEMENİZ ÖNERİLİR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-electric-500" />
                  3. FİKRİ MÜLKİYET
                </h2>
                <p className="text-sm font-bold leading-relaxed text-slate-400">
                  EPLANDOCTOR ÜZERİNDE SUNULAN TÜM VİDEOLAR, DOKÜMANLAR VE ÇİZİMLER EPLANDOCTOR'UN TELİF HAKKI KORUMASI ALTINDADIR. BU İÇERİKLERİN İZİNSİZ KOPYALANMASI, DAĞITILMASI VEYA TİCARİ AMAÇLA BAŞKA PLATFORMLARDA PAYLAŞILMASI YASAKTIR.
                </p>
              </section>

              <section className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-black text-white mb-4">SORUMLULUK SINIRI</h2>
                <p className="text-sm font-bold text-slate-400">
                  PLATFORMDA SUNULAN ÇÖZÜM REHBERLERİ GENEL BİLGİLENDİRME AMAÇLIDIR. BU REHBERLERİN UYGULANMASI SIRASINDA OLUŞABİLECEK VERİ KAYIPLARI VEYA YAZILIMSAL HATALARDAN EPLANDOCTOR SORUMLU TUTULAMAZ. KULLANICI UYGULAMA ÖNCESİ YEDEK ALMAKLA YÜKÜMLÜDÜR.
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
