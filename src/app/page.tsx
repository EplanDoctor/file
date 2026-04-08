"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Section";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProblemCard } from "@/components/ProblemCard";
import { getProblems, Problem, getPlatformStats, incrementVisitorCount } from "@/lib/firebase/services";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Activity, Users, UserCheck, FileText, PlayCircle, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState({
    visitorsCount: 145000,
    usersCount: 14500,
    docsCount: 2400,
    videosCount: 350,
    problemsSolvedCount: 8400
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getProblems();
      setRecentProblems(data.slice(0, 1));
    };
    fetch();

    const fetchStats = async () => {
      // Check session storage to avoid incrementing multiple times per session
      if (!sessionStorage.getItem("visited")) {
        await incrementVisitorCount();
        sessionStorage.setItem("visited", "true");
      }
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col uppercase">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <Section className="pt-32 pb-24 lg:pt-40 lg:pb-32 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-electric-100 dark:bg-electric-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-electric-200 bg-electric-50 px-3 py-1 text-[10px] font-black text-electric-600 mb-8 dark:border-electric-800 dark:bg-electric-900/30 dark:text-electric-400">
                <span className="flex h-2 w-2 rounded-full bg-electric-500 mr-2 animate-pulse"></span>
                {t.hero.badge}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                {t.hero.title_part1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-500 to-blue-600">
                  {t.hero.title_part2}
                </span>
              </h1>
              <p className="text-lg font-bold text-slate-400 mb-10 leading-relaxed max-w-xl">
                {t.hero.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/problems">
                  <Button size="lg" className="w-full sm:w-auto text-sm font-black h-14 px-8 shadow-xl shadow-electric-500/20">
                    {t.hero.btn_problems}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/submit-problem">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-black h-14 px-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-sm text-white">
                    {t.hero.btn_solve}
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 text-[11px] text-slate-400 font-black">
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> {t.hero.feature1}</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> {t.hero.feature2}</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/> {t.hero.feature3}</div>
              </div>
            </div>
            <div className="relative">
              {/* Product UI Mockup Simulation */}
              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl soft-shadow p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
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
              </div>
            </div>
          </div>
        </Section>

        {/* HOW IT WORKS SECTION */}
        <Section background="muted">
           <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl mb-4">
              {t.how_it_works.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-electric-100 via-electric-500 to-electric-100 dark:from-slate-800 dark:via-electric-600 dark:to-slate-800"></div>
            
            <div className="relative text-center px-6">
              <div className="bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-900 flex items-center justify-center shadow-2xl mb-6 relative z-10 transition-transform hover:-translate-y-2">
                <span className="text-3xl font-black text-electric-500">1</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">{t.how_it_works.step1_title}</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">{t.how_it_works.step1_desc}</p>
            </div>
            <div className="relative text-center px-6">
              <div className="bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-900 flex items-center justify-center shadow-2xl mb-6 relative z-10 transition-transform hover:-translate-y-2">
                <span className="text-3xl font-black text-electric-500">2</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">{t.how_it_works.step2_title}</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">{t.how_it_works.step2_desc}</p>
            </div>
            <div className="relative text-center px-6">
              <div className="bg-slate-950 w-24 h-24 mx-auto rounded-full border-4 border-slate-900 flex items-center justify-center shadow-2xl mb-6 relative z-10 transition-transform hover:-translate-y-2">
                <span className="text-3xl font-black text-electric-500">3</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">{t.how_it_works.step3_title}</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">{t.how_it_works.step3_desc}</p>
            </div>
          </div>
        </Section>

        {/* PROBLEMS SECTION */}
        <Section id="problems">
          <div className="text-center max-w-2xl mx-auto mb-16 uppercase">
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
              {t.problems.title}
            </h2>
            <p className="text-sm font-bold text-slate-400">
              {t.problems.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/problems">
              <Button variant="outline" size="lg" className="h-12 px-10 font-bold border-slate-800 text-white shadow-sm">{t.problems.btn_all}</Button>
            </Link>
          </div>
        </Section>

        {/* TRUST SECTION */}
        <Section background="dark" className="border-y border-slate-800">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-black tracking-tighter sm:text-5xl mb-8 leading-tight">{t.pricing.premium_badge} <br /><span className="text-electric-500">EPLAN DOCTOR</span></h2>
               <p className="text-lg font-bold text-slate-400 mb-10 leading-relaxed">
                 EplanDoctor sıradan bir forum değildir. Tüm çözümler profesyoneller tarafından doğrulanmış, zaman kaybını önlemek ve proje teslim sürelerinizi kısaltmak için tasarlanmış birinci sınıf bir bilgi merkezi ve destek platformudur.
               </p>
               <ul className="space-y-6">
                 <li className="flex items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                   <ShieldCheck className="w-8 h-8 text-emerald-400 mr-4 shrink-0" />
                   <div>
                     <h4 className="font-black text-white uppercase text-sm tracking-widest">100+ Çözüm Arşivi</h4>
                     <p className="text-xs font-bold text-slate-400 mt-1 uppercase italic">Doğrulanmış ve onaylanmış teknik çözüm adımları.</p>
                   </div>
                 </li>
                 <li className="flex items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                   <Zap className="w-8 h-8 text-electric-400 mr-4 shrink-0" />
                   <div>
                     <h4 className="font-black text-white uppercase text-sm tracking-widest">{t.pricing.premium_feature2}</h4>
                     <p className="text-xs font-bold text-slate-400 mt-1 uppercase italic">Sorun aramakla geçirdiğiniz saatleri tasarıma ayırın.</p>
                   </div>
                 </li>
               </ul>
             </div>
             <div className="relative h-[450px] w-full rounded-[40px] overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 to-transparent"></div>
                <Activity className="w-24 h-24 text-electric-500/20 animate-pulse" />
             </div>
           </div>
        </Section>

        {/* PRICING SECTION */}
        <Section background="muted" className="py-20">
          <div className="text-center max-w-2xl mx-auto mb-16 uppercase">
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-5xl mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-sm font-bold text-slate-400">
              {t.pricing.desc}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
             {/* Premium Plan - Now the Only Plan */}
             <div className="bg-slate-900 dark:bg-slate-950 rounded-[40px] p-10 md:p-14 border border-slate-800 shadow-2xl shadow-electric-900/40 relative overflow-hidden flex flex-col transition-all hover:shadow-electric-500/20 group">
               <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-electric-400 via-blue-500 to-electric-600"></div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                 <div>
                   <div className="inline-flex items-center bg-electric-500/10 text-electric-400 text-[10px] font-black px-4 py-2 rounded-full border border-electric-500/20 mb-4 tracking-widest">
                     {t.pricing.premium_badge}
                   </div>
                   <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter">{t.pricing.premium_title}</h3>
                   <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed max-w-sm">{t.pricing.premium_desc}</p>
                 </div>
                 <div className="text-left md:text-right">
                   <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-blue-500 mb-1 tracking-tighter">{t.pricing.premium_price}</div>
                   <div className="text-electric-500/80 text-[10px] font-black uppercase tracking-[0.25em]">{t.pricing.premium_duration.replace("/", "")}</div>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6 mb-12">
                 <div className="space-y-5">
                   <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
                     <div className="bg-electric-500/20 p-2 rounded-lg">
                       <Zap className="w-5 h-5 text-electric-400 shrink-0" />
                     </div>
                     <span className="text-slate-200 font-bold text-sm leading-tight">{t.pricing.premium_feature1}</span>
                   </div>
                   <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
                     <div className="bg-electric-500/20 p-2 rounded-lg">
                       <Zap className="w-5 h-5 text-electric-400 shrink-0" />
                     </div>
                     <span className="text-slate-200 font-bold text-sm leading-tight">{t.pricing.premium_feature2}</span>
                   </div>
                 </div>
                 <div className="space-y-5">
                   <div className="flex items-center gap-4 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                     <div className="bg-emerald-500/20 p-2 rounded-lg">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                     </div>
                     <span className="text-white font-black text-sm leading-tight">{t.pricing.premium_feature3}</span>
                   </div>
                   <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50 opacity-60">
                     <div className="bg-slate-700 p-2 rounded-lg">
                       <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                     </div>
                     <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">7/24 Kesintisiz Teknik Erişim</span>
                   </div>
                 </div>
               </div>

               <Link href="/instant-solve" className="w-full">
                 <Button className="w-full h-16 bg-electric-600 hover:bg-electric-500 text-white font-black text-sm border-electric-600 shadow-2xl shadow-electric-600/40 transition-all uppercase tracking-[0.2em] group-hover:scale-[1.02] active:scale-95">
                   {t.pricing.premium_btn}
                   <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
                 </Button>
               </Link>
             </div>
          </div>
        </Section>

        {/* STATS SECTION */}
        <Section background="dark" className="border-t border-slate-800 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-electric-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-electric-900/20 group">
              <div className="p-4 bg-electric-500/10 rounded-2xl mb-4 text-electric-400 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">
                {stats.visitorsCount > 1000 ? (stats.visitorsCount / 1000).toFixed(1) + 'K+' : stats.visitorsCount}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t.stats.visitors}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20 group">
              <div className="p-4 bg-amber-500/10 rounded-2xl mb-4 text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stats.docsCount}</div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t.stats.documents}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 group">
              <div className="p-4 bg-purple-500/10 rounded-2xl mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stats.videosCount}</div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t.stats.videos}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 group">
              <div className="p-4 bg-blue-500/10 rounded-2xl mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stats.problemsSolvedCount}</div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t.stats.problems_solved}</div>
            </div>
          </div>
        </Section>

        {/* CTA SECTION */}
        <Section background="electric">
          <div className="text-center max-w-3xl mx-auto py-8 uppercase">
            <h2 className="text-3xl font-black tracking-tighter text-white md:text-6xl mb-6">
              {t.cta.title}
            </h2>
            <p className="text-electric-100 text-sm font-bold mb-12 opacity-80">
              {t.cta.desc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/instant-solve">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-16 px-12 text-sm font-black shadow-2xl">
                  {t.cta.btn_support}
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-sm font-black bg-electric-700 hover:bg-electric-800 text-white border-electric-700 shadow-2xl">
                  {t.cta.btn_docs}
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
