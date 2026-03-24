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

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
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

  const categories = ["Tümü", ...Array.from(new Set(problems.map(p => p.category)))];

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Tümü" || problem.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-12 md:py-20">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">Güncel EPLAN Sorunları</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Kullanıcılarımızın karşılaştığı en yaygın EPLAN P8 hata kodları ve sorunlarını burada bulabilir, 
              çözüm adımlarını ilgili sayfalarda detaylıca inceleyebilirsiniz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  className="pl-10 h-12 bg-white dark:bg-slate-900 shadow-sm" 
                  placeholder="Hata kodu veya sorununuzu arayın..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
             {categories.map(category => (
               <button
                 key={category}
                 onClick={() => setActiveCategory(category)}
                 className={cn(
                   "px-5 py-2 rounded-full text-sm font-semibold transition-all border",
                   activeCategory === category 
                     ? "bg-electric-600 text-white border-electric-600 shadow-md shadow-electric-600/20 dark:bg-electric-500 dark:border-electric-500" 
                     : "bg-white text-slate-600 border-slate-200 shadow-sm hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                 )}
               >
                 {category}
               </button>
             ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-10 h-10 border-4 border-electric-200 border-t-electric-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <Link href={`/problems/${problem.id}`} key={problem.id} className="block group">
                    <div className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-electric-900/5 group-hover:border-electric-400/50 rounded-2xl rounded-tr-none">
                      <ProblemCard problem={problem} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <p className="font-medium text-lg mb-2">Kayıt Bulunamadı</p>
                  <p>Aradığınız filtreye uygun sonuç çıkmadı.</p>
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
