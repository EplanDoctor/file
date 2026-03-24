import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Section";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProblemCard } from "@/components/ProblemCard";
import { MOCK_PROBLEMS } from "@/lib/firebase/services";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const recentProblems = MOCK_PROBLEMS.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <Section className="pt-32 pb-24 lg:pt-40 lg:pb-32 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-electric-100 dark:bg-electric-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-electric-200 bg-electric-50 px-3 py-1 text-sm font-medium text-electric-600 mb-8 dark:border-electric-800 dark:bg-electric-900/30 dark:text-electric-400">
                <span className="flex h-2 w-2 rounded-full bg-electric-500 mr-2 animate-pulse"></span>
                Hatasız Tasarımlar İçin Kesintisiz Dijital Çözüm Ortağınız
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                E-Plan Projelerinizde <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-500 to-blue-600">
                  Hata Almaya Son
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                En yaygın mühendislik hatalarını saniyeler içinde çözün veya karmaşık projeleriniz için uzmanlarımızdan anında destek alın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/problems">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                    Güncel Sorunları Gör
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/submit-problem">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-white/50 backdrop-blur-sm">
                    Sorunu Çözdür
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> 7/24 Erişim</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> Uzman Destek</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> Video Eğitimler</div>
              </div>
            </div>
            <div className="relative">
              {/* Product UI Mockup Simulation */}
              <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl soft-shadow p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-4 w-full rounded bg-slate-50 dark:bg-slate-800/50"></div>
                  <div className="h-4 w-5/6 rounded bg-slate-50 dark:bg-slate-800/50"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-24 rounded-xl bg-electric-50 dark:bg-electric-900/20 border border-electric-100 dark:border-electric-800/50"></div>
                    <div className="h-24 rounded-xl bg-slate-50 dark:bg-slate-800"></div>
                  </div>
                </div>
                {/* Notice text for Nano Banana prompt */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px]">
                   <span className="text-sm font-semibold text-slate-600 bg-white shadow-sm px-4 py-2 rounded-full hidden">
                     [Görsel Temsili: Nano Banana Dashboard]
                   </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* HOW IT WORKS SECTION */}
        <Section background="muted">
           <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-4">
              Nasıl Çalışır?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-electric-100 via-electric-500 to-electric-100 dark:from-slate-800 dark:via-electric-600 dark:to-slate-800"></div>
            
            <div className="relative text-center px-6">
              <div className="bg-white dark:bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center soft-shadow mb-6 relative z-10">
                <span className="text-2xl font-bold text-electric-500">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Sorununu Bul</h3>
              <p className="text-slate-600 dark:text-slate-400">Yaşadığın hatayı veya problemi arama çubuğuna yazarak ilgili başlığa ulaş.</p>
            </div>
            <div className="relative text-center px-6">
              <div className="bg-white dark:bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center soft-shadow mb-6 relative z-10">
                <span className="text-2xl font-bold text-electric-500">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Çözümü İncele</h3>
              <p className="text-slate-600 dark:text-slate-400">Adım adım rehberler ve eğitim videoları ile sorununu saniyeler içinde çöz.</p>
            </div>
            <div className="relative text-center px-6">
              <div className="bg-white dark:bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center soft-shadow mb-6 relative z-10">
                <span className="text-2xl font-bold text-electric-500">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Destek Al</h3>
              <p className="text-slate-600 dark:text-slate-400">Çözemediğiniz karmaşık problemler için WhatsApp destek hattına bağlan.</p>
            </div>
          </div>
        </Section>

        {/* PROBLEMS SECTION */}
        <Section id="problems">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-4">
              En Sık Karşılaşılan Problemler
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Mühendislerin EPLAN'da en çok karşılaştığı sorunların hızlı çözümlerini anında inceleyin.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/problems">
              <Button variant="outline" size="lg">Tüm Sorunları Görüntüle</Button>
            </Link>
          </div>
        </Section>

        {/* TRUST SECTION */}
        <Section background="dark" className="border-y border-slate-800">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Mühendisler İçin Özel Olarak Tasarlandı</h2>
               <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                 EplanDoctor sıradan bir forum değildir. Tüm çözümler profesyoneller tarafından doğrulanmış, zaman kaybını önlemek ve proje teslim sürelerinizi kısaltmak için tasarlanmış birinci sınıf bir bilgi merkezi ve destek platformudur.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start">
                   <ShieldCheck className="w-6 h-6 text-emerald-400 mr-3 shrink-0" />
                   <div>
                     <h4 className="font-semibold text-white">Doğrulanmış Çözümler</h4>
                     <p className="text-sm text-slate-400 mt-1">Sadece işe yarayan, onaylanmış teknik çözüm adımları.</p>
                   </div>
                 </li>
                 <li className="flex items-start">
                   <Zap className="w-6 h-6 text-amber-400 mr-3 shrink-0" />
                   <div>
                     <h4 className="font-semibold text-white">Zaman Tasarrufu</h4>
                     <p className="text-sm text-slate-400 mt-1">Sorun aramakla geçirdiğiniz saatleri tasarıma ayırın.</p>
                   </div>
                 </li>
               </ul>
             </div>
             <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
                <span className="text-slate-500 text-sm font-medium px-4 py-2 border border-slate-700/50 rounded-full bg-slate-800/50">
                  [Görsel Temsili: Güven veren mühendislik arayüzü]
                </span>
             </div>
           </div>
        </Section>

        {/* PRICING SECTION */}
        <Section className="py-20 bg-slate-50 dark:bg-slate-900/30">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-4">
              Net Çözümler, Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              İhtiyaçlarınıza uygun destek modelini seçin. Gizli sürpriz ücretler veya bitmek bilmeyen abonelikler yok.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Free Plan */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
               <div className="mb-6">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Topluluk Erişimi</h3>
                 <p className="text-slate-500 text-sm">Temel EPLAN sorunlarınızı kendiniz öğrenerek çözmek için ideal.</p>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₺0</span>
                 <span className="text-slate-500 font-medium ml-1">/süresiz</span>
               </div>
               <div className="space-y-4 mb-8 flex-grow">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                   <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">100+ Güncel Sorun ve Çözüm Arşivi</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                   <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">Temel Eğitim Dokümanları ve Videolar</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                   <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">Standart Forum / Ticket Desteği</span>
                 </div>
               </div>
               <Link href="/problems" className="w-full mt-auto">
                 <Button variant="outline" className="w-full h-12 bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">Arşivi İncele (Ücretsiz)</Button>
               </Link>
             </div>

             {/* Premium Plan */}
             <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-electric-900/20 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-electric-400 to-electric-600"></div>
               <div className="absolute top-4 right-4 bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                 EN ÇOK TERCİH EDİLEN
               </div>
               <div className="mb-6 pt-4">
                 <h3 className="text-2xl font-bold text-white mb-2">Premium Destek</h3>
                 <p className="text-slate-400 text-sm">Kritik proje duruşlarını önlemek ve işinize hızla dönmek için.</p>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-extrabold text-white">₺499</span>
                 <span className="text-slate-400 font-medium ml-1">/tek seferlik (Jeton)</span>
               </div>
               <div className="space-y-4 mb-8 flex-grow">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-electric-400 shrink-0" />
                   <span className="text-slate-300 font-medium text-sm">VIP WhatsApp Canlı Anında Bağlantı</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-electric-400 shrink-0" />
                   <span className="text-slate-300 font-medium text-sm">Anydesk/TeamViewer ile Ekran Müdahalesi</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                   <span className="text-white font-bold text-sm">Sorun Çözülmezse %100 Ücret İade Garantisi</span>
                 </div>
               </div>
               <Link href="/instant-solve" className="w-full mt-auto">
                 <Button className="w-full h-12 bg-electric-600 hover:bg-electric-500 text-white font-bold border-electric-600 shadow-lg shadow-electric-600/30 transition-colors">Uzmana Bağlan</Button>
               </Link>
             </div>
          </div>
        </Section>

        {/* CTA SECTION */}
        <Section background="electric">
          <div className="text-center max-w-3xl mx-auto py-8">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl mb-6">
              Hemen Sorununu Çöz, Projeni Hızlandır!
            </h2>
            <p className="text-electric-100 text-lg mb-10">
              EplanDoctor premium özelliklerini keşfedin, eğitimlere katılın ve kesintisiz teknik destek ile kariyerinizde bir adım öne geçin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/instant-solve">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-10 text-lg font-bold shadow-md">
                  Anında Destek Al
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-electric-700 hover:bg-electric-800 text-white border-electric-700 shadow-md">
                  Dokümanlara Göz At
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
