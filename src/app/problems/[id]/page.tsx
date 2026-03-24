"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { getProblemById, Problem } from "@/lib/firebase/services";
import { CheckCircle2, XCircle, ArrowLeft, TerminalSquare, AlertTriangle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProblemDetailPage() {
  const params = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      if (params.id) {
        const data = await getProblemById(params.id as string);
        setProblem(data || null);
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-6 dark:bg-slate-800">
             <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Kayıt Bulunamadı</h2>
          <p className="text-slate-500 mb-8 max-w-md">Aradığınız hata kodu veya sorun veritabanımızda mevcut değil.</p>
          <Link href="/problems">
            <Button><ArrowLeft className="w-4 h-4 mr-2" /> Tüm Sorunlara Dön</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-8 md:py-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/problems" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-electric-600 transition-colors mb-8 dark:hover:text-electric-400">
              <ArrowLeft className="w-4 h-4 mr-2" /> Sorun Veritabanına Dön
            </Link>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-8">
              <div className="p-6 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-electric-600 bg-electric-100 px-3 py-1 rounded-full dark:bg-electric-900/50 dark:text-electric-400 border border-electric-200 dark:border-electric-800">
                    {problem.category}
                  </span>
                  {problem.resolved ? (
                    <span className="flex items-center text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full dark:bg-emerald-900/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Çözüm Bulundu
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full dark:bg-amber-900/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Çözüm Bekleniyor
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                  {problem.title}
                </h1>
                <div className="flex items-center text-sm font-semibold text-slate-500 gap-4 dark:text-slate-400">
                  <span>Hata Kodu Ref: #{problem.id.slice(0, 6).toUpperCase()}</span>
                  <span>•</span>
                  <span>Görüntülenme: 1.2k</span>
                </div>
              </div>

              <div className="p-6 md:p-12 space-y-12">
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-900 dark:text-white">
                    <TerminalSquare className="w-6 h-6 mr-3 text-slate-400" /> Sorun Açıklaması & Hata Detayları
                  </h3>
                  <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {problem.description}
                    </p>
                  </div>
                </div>

                {problem.solution && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 md:p-10 border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-emerald-800 dark:text-emerald-400">
                      <CheckCircle2 className="w-7 h-7 mr-3" /> Kesin Çözüm Adımları
                    </h3>
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8">
                      <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                        {problem.solution}
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-emerald-200/60 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-500">Bu makale sorununuzu çözdü mü?</p>
                      <div className="flex gap-3">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20">Evet, Teşekkürler!</Button>
                        <Button variant="outline" className="bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-slate-600 dark:text-slate-400">Hayır, İşe Yaramadı</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium CTA Box */}
                {!problem.resolved && (
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 md:p-8 border border-amber-200 dark:border-amber-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-xl font-bold text-amber-900 dark:text-amber-500 mb-2">Hâlâ çözemediniz mi?</h4>
                      <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">Uzman mühendislerimiz ekranınıza bağlanıp bu sorunu sadece dakikalar içinde kalıcı olarak çözebilir.</p>
                    </div>
                    <Link href="/instant-solve" className="w-full md:w-auto shrink-0">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-6 shadow-lg shadow-amber-500/20 text-base">Ücretli Uzman Desteği Al</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
