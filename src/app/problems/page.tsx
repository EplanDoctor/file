"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { ProblemCard } from "@/components/ProblemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getProblems, Problem } from "@/lib/firebase/services";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProblemsPage() {
  return (
    <ProtectedRoute>
      <ProblemsPageContent />
    </ProtectedRoute>
  );
}

function ProblemsPageContent() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(t.search.all_categories);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const data = await getProblems();
      setProblems(data);
      setIsLoading(false);
    };
    fetchProblems();
  }, []);

  const categories = [t.search.all_categories, ...Array.from(new Set(problems.map(p => p.category)))];

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === t.search.all_categories || problem.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-12 md:py-20">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white">
              {t.search.title}
            </h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl">
              {t.search.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  className="pl-10 h-14 bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800 text-sm font-bold" 
                  placeholder={t.search.placeholder} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
             {categories.map(category => (
               <button
                 key={category}
                 onClick={() => setActiveCategory(category)}
                 className={cn(
                   "px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all border",
                   activeCategory === category 
                     ? "bg-electric-600 text-white border-electric-600 shadow-lg shadow-electric-600/20 dark:bg-electric-500 dark:border-electric-500" 
                     : "bg-white text-slate-600 border-slate-200 shadow-sm hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                 )}
               >
                 {category}
               </button>
             ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center p-20">
              <div className="w-12 h-12 border-[4px] border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <Link href={`/problems/detay?id=${problem.id}`} key={problem.id} className="block group">
                    <div className="h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-electric-900/10 rounded-3xl">
                      <ProblemCard problem={problem} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-24 text-center text-slate-500 bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-200 dark:border-slate-800 border-dashed backdrop-blur-sm">
                  <p className="font-black text-2xl mb-2 text-slate-900 dark:text-white tracking-widest">{t.search.no_results_title}</p>
                  <p className="font-bold text-xs uppercase opacity-60">{t.search.no_results_desc}</p>
                </div>
              )}
            </div>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
}
