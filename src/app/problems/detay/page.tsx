"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { getProblemById, Problem } from "@/lib/firebase/services";
import { CheckCircle2, XCircle, ArrowLeft, TerminalSquare, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

function ProblemDetailContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const idValue = searchParams.get("id");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (idValue) {
        const data = await getProblemById(idValue);
        setProblem(data || null);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [idValue]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-[4px] border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <div className="w-24 h-24 bg-slate-200 text-slate-500 rounded-[40px] flex items-center justify-center mb-8 dark:bg-slate-800 shadow-inner">
             <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white tracking-widest">{t.search.no_results_title}</h2>
          <p className="text-xs font-bold text-slate-500 mb-10 max-w-md opacity-70 italic">{t.search.no_results_desc}</p>
          <Link href="/problems">
            <Button className="h-14 px-8 font-black text-xs uppercase tracking-widest shadow-xl"><ArrowLeft className="w-4 h-4 mr-3" /> {t.detail.back}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-12 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <Link href="/problems" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-electric-600 transition-all mb-10 group dark:hover:text-electric-400">
              <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" /> {t.detail.back}
            </Link>

            <div className="bg-white dark:bg-slate-900 rounded-[50px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mb-12">
              <div className="p-8 md:p-20 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-[9px] font-black uppercase tracking-widest text-electric-600 bg-electric-100 px-4 py-2 rounded-full dark:bg-electric-900/50 dark:text-electric-400 border border-electric-200 dark:border-electric-800">
                    {problem.category}
                  </span>
                  {problem.resolved ? (
                    <span className="flex items-center text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full dark:bg-emerald-900/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm shadow-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> {t.detail.resolved}
                    </span>
                  ) : (
                    <span className="flex items-center text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-4 py-2 rounded-full dark:bg-amber-900/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <XCircle className="w-3.5 h-3.5 mr-2" /> {t.detail.unresolved}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.05] mb-10 text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  {problem.title}
                </h1>
                <div className="flex items-center text-[10px] font-black tracking-widest text-slate-400 gap-6 dark:text-slate-500 opacity-60">
                  <span>Hata Kodu Ref: #{problem.id.slice(0, 8).toUpperCase()}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Görüntülenme: 1.2k+</span>
                </div>
              </div>

              <div className="p-8 md:p-20 space-y-20">
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-1 h-12 bg-slate-200 dark:bg-slate-800 rounded-full hidden md:block"></div>
                  <h3 className="text-sm font-black mb-6 flex items-center text-slate-900 dark:text-white tracking-widest uppercase opacity-70">
                    <TerminalSquare className="w-5 h-5 mr-3 text-slate-400" /> {t.detail.description_title}
                  </h3>
                  <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-lg">
                      {problem.description}
                    </p>
                  </div>
                </div>

                {problem.solution && (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[40px] p-8 md:p-16 border border-emerald-100 dark:border-emerald-900/30 shadow-inner relative overflow-hidden transition-all duration-700">
                    {/* Decorative Background Icon */}
                    <CheckCircle2 className="absolute -right-12 -top-12 w-64 h-64 text-emerald-500/5 rotate-12 pointer-events-none" />
                    
                    <h3 className="text-sm font-black mb-10 flex items-center text-emerald-800 dark:text-emerald-400 tracking-widest uppercase">
                      <Zap className="w-5 h-5 mr-3 fill-emerald-500/20 text-emerald-500" /> {t.detail.solution_title}
                    </h3>
                    <div className="prose prose-xl prose-slate dark:prose-invert max-w-none mb-12">
                      <div className="text-slate-700 dark:text-slate-200 leading-loose whitespace-pre-wrap font-bold text-lg md:text-xl italic border-l-4 border-emerald-500/30 pl-8">
                        {problem.solution}
                      </div>
                    </div>
                    
                    <div className="pt-10 border-t border-emerald-200/40 dark:border-emerald-800/40">
                      {showSuccess ? (
                        <div className="bg-emerald-600 text-white p-6 rounded-[30px] flex items-center gap-6 animate-in zoom-in-95 duration-500 shadow-2xl shadow-emerald-600/30">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h4 className="font-black text-xl mb-1 tracking-tight">{t.detail.success_message}</h4>
                             <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">E-Plan Projelerinde Başarılar!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                          <p className="text-xs font-black text-emerald-800/60 dark:text-emerald-500/60 tracking-widest uppercase">{t.detail.was_helpful}</p>
                          <div className="flex gap-4 w-full sm:w-auto">
                            <Button 
                              onClick={() => setShowSuccess(true)}
                              className="flex-grow sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest h-14 px-8 shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                            >
                              {t.detail.yes}
                            </Button>
                            <Link href="/instant-solve" className="flex-grow sm:flex-initial">
                              <Button 
                                variant="outline" 
                                className="w-full bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest h-14 px-8 hover:bg-slate-50 transition-all"
                              >
                                {t.detail.no}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!problem.resolved && !showSuccess && (
                  <div className="bg-slate-900 rounded-[40px] p-8 md:p-14 border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-electric-600/20 rounded-full blur-[100px] group-hover:bg-electric-600/40 transition-colors duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="max-w-md">
                        <h4 className="text-2xl font-black text-white mb-3 tracking-tight">{t.detail.still_unresolved}</h4>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase opacity-80">{t.detail.premium_teaser}</p>
                      </div>
                      <Link href="/instant-solve" className="w-full md:w-auto shrink-0">
                        <Button className="w-full bg-electric-600 hover:bg-electric-500 text-white font-black h-16 px-10 shadow-2xl shadow-electric-600/30 text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                          {t.detail.btn_premium}
                        </Button>
                      </Link>
                    </div>
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

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProblemDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-[4px] border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    }>
      <ProtectedRoute>
        <ProblemDetailContent />
      </ProtectedRoute>
    </Suspense>
  );
}
