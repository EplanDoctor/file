"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  ArrowLeft, 
  Filter, 
  Search, 
  Clock,
  ExternalLink,
  ChevronRight,
  Zap
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getProblems, updateProblemResponse, Problem } from "@/lib/firebase/services";

export default function AdminProblemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("pending");
  
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [solutionText, setSolutionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== "cnr.pano@gmail.com") {
        router.push("/admin/login");
      } else {
        fetchProblems();
      }
    }
  }, [user, loading, router]);

  const fetchProblems = async () => {
    setIsLoading(true);
    const data = await getProblems();
    setProblems(data);
    setIsLoading(false);
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem || !solutionText.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await updateProblemResponse(selectedProblem.id, solutionText);
      if (success) {
        alert("Yanıt başarıyla kaydedildi.");
        setSolutionText("");
        setSelectedProblem(null);
        fetchProblems();
      } else {
        alert("Hata: Yanıt kaydedilemedi.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "pending" && !p.resolved) || 
                         (filter === "resolved" && p.resolved);
    return matchesSearch && matchesFilter;
  });

  if (loading || !user || user.email !== "cnr.pano@gmail.com") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Geri
          </Button>
          <h1 className="text-lg font-bold">Sorun Yönetimi</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-sm text-slate-500 hidden md:block">{user.email}</div>
           <div className="w-8 h-8 rounded-full bg-electric-100 flex items-center justify-center text-electric-600 font-bold">A</div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Sorunlarda ara..." 
                  className="pl-10 h-11 bg-white dark:bg-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filter === "pending" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilter("pending")}
                  className="rounded-full text-xs"
                >
                  Bekleyenler
                </Button>
                <Button 
                  variant={filter === "resolved" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilter("resolved")}
                  className="rounded-full text-xs"
                >
                  Çözülenler
                </Button>
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilter("all")}
                  className="rounded-full text-xs"
                >
                  Tümü
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="py-20 text-center text-slate-500">Yükleniyor...</div>
              ) : filteredProblems.length === 0 ? (
                <div className="py-20 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p>Herhangi bir sorun bulunamadı.</p>
                </div>
              ) : (
                filteredProblems.map((p) => (
                  <Card 
                    key={p.id} 
                    className={`cursor-pointer transition-all hover:border-electric-500/50 ${selectedProblem?.id === p.id ? 'border-electric-500 ring-1 ring-electric-500' : ''}`}
                    onClick={() => {
                      setSelectedProblem(p);
                      setSolutionText(p.solution || "");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {p.resolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{p.category}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm mb-1 line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Response Column */}
          <div className="lg:col-span-7">
            {selectedProblem ? (
              <div className="space-y-6">
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h2 className="text-2xl font-black tracking-tight">{selectedProblem.title}</h2>
                      <a 
                        href={`/problems/detay?id=${selectedProblem.id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:text-electric-500 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-electric-100 text-electric-700 text-[10px] font-bold rounded-full dark:bg-electric-900/30 dark:text-electric-400">
                        {selectedProblem.category}
                      </span>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${selectedProblem.resolved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {selectedProblem.resolved ? 'Çözüldü' : 'Bekliyor'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" /> Sorun Açıklaması
                      </h3>
                      <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedProblem.description}
                      </div>
                    </div>

                    <form onSubmit={handleRespond} className="space-y-6">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-electric-500" /> Çözüm / Yanıt
                        </h3>
                        <Textarea 
                          required
                          placeholder="Buraya çözümü detaylıca yazın..." 
                          className="min-h-[250px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm leading-relaxed focus:ring-electric-500"
                          value={solutionText}
                          onChange={(e) => setSolutionText(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          type="submit" 
                          className="flex-1 h-14 bg-electric-600 hover:bg-electric-700 text-white font-bold rounded-2xl shadow-lg shadow-electric-600/20"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Kaydediliyor..." : selectedProblem.resolved ? "Yanıtı Güncelle" : "Çözümü Yayınla"}
                        </Button>
                        {selectedProblem.resolved && (
                          <Button 
                            type="button" 
                            variant="outline"
                            className="h-14 px-8 rounded-2xl"
                            onClick={() => setSelectedProblem(null)}
                          >
                            Kapat
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6">
                  <ChevronRight className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sorun Seçin</h3>
                <p className="text-sm text-slate-500 max-w-xs">Sol taraftaki listeden yanıtlamak istediğiniz sorunu seçerek başlayın.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
