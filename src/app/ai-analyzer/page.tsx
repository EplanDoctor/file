"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, FileSearch, Sparkles, Clock, CheckCircle2, AlertTriangle, FileText, Zap, ChevronRight } from "lucide-react";
import { uploadFileToStorage, saveAIAnalysis, getUserAIAnalyses } from "@/lib/firebase/services";
import { cn } from "@/lib/utils";

export default function AIAnalyzerPage() {
  return (
    <ProtectedRoute>
      <AIAnalyzerContent />
    </ProtectedRoute>
  );
}

function AIAnalyzerContent() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const data = await getUserAIAnalyses(user.uid);
    setHistory(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
      setSelectedHistoryItem(null);
    }
  };

  const startAnalysis = async () => {
    if (!file || !user) return;

    setIsLoading(true);
    setProgress(10);
    setAnalysisResult(null);

    try {
      // 1. Upload file to Storage
      const storagePath = `ai-projects/${user.uid}/${Date.now()}_${file.name}`;
      const downloadUrl = await uploadFileToStorage(file, storagePath, (p) => {
        setProgress(10 + (p * 0.3)); // 10% to 40%
      });

      // 2. Call AI API
      setProgress(50);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("AI Analiz motoru yanıt vermedi.");
      
      const data = await res.json();
      const report = data.analysis;
      setAnalysisResult(report);

      // 3. Save to Firestore
      setProgress(90);
      await saveAIAnalysis(user.uid, file.name, downloadUrl, report);
      
      setProgress(100);
      fetchHistory(); // Refresh history
    } catch (error: any) {
      console.error(error);
      alert("Hata: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Action Area */}
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
               <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                 <Sparkles className="text-electric-500 w-10 h-10" />
                 AI DEVRE ANALİZÖRÜ
               </h1>
               <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic">
                 Şebeke enerjisi altında sanal simülasyon ve kısa devre koruma denetimi
               </p>
            </div>

            {/* Analysis Result Display */}
            {(analysisResult || selectedHistoryItem) ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-0 shadow-2xl shadow-electric-500/10 rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <CardHeader className="bg-slate-900 p-8 border-b border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <CardTitle className="text-white text-xl font-black uppercase tracking-tight">Analiz Raporu</CardTitle>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                             {selectedHistoryItem ? selectedHistoryItem.fileName : file?.name}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-electric-500/20 flex items-center justify-center">
                        <Zap className="text-electric-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="report-container whitespace-pre-wrap font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                        {(analysisResult || selectedHistoryItem.analysis).split('\n').map((line: string, i: number) => (
                           <p key={i} className={cn(
                             "mb-4",
                             (line.startsWith('-') || line.startsWith('*')) && "pl-5 border-l-2 border-electric-500 text-slate-900 dark:text-white font-black"
                           )}>
                             {line}
                           </p>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                       <Button variant="ghost" onClick={() => {setAnalysisResult(null); setSelectedHistoryItem(null); setFile(null);}} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                         Yeni Analiz Başlat
                       </Button>
                       {selectedHistoryItem?.fileUrl && (
                         <a href={selectedHistoryItem.fileUrl} target="_blank" className="flex items-center text-xs font-black text-electric-600 uppercase tracking-widest hover:underline">
                           <FileText className="w-4 h-4 mr-2" /> PDF'i Görüntüle
                         </a>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Upload Area */
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-[40px] overflow-hidden shadow-inner">
                <CardContent className="p-12 text-center flex flex-col items-center">
                    <div className={cn(
                      "w-24 h-24 rounded-[32px] flex items-center justify-center mb-6 transition-all duration-500",
                      isLoading ? "bg-electric-500 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-300"
                    )}>
                      {isLoading ? <Zap className="text-white w-10 h-10" /> : <Upload className="w-10 h-10" />}
                    </div>

                    {isLoading ? (
                      <div className="w-full max-w-md space-y-4">
                        <h3 className="text-lg font-black uppercase tracking-tight">AI Analizi İşleniyor...</h3>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-electric-500 transition-all duration-300" 
                             style={{ width: `${progress}%` }}
                           />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                          Sanal Devre Enerjisi Veriliyor ve Kontak Mantığı Denetleniyor
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Devre Analizine Başlayın</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-sm mb-8">
                          PDF formatındaki proje dosyanızı sürükleyin, AI tüm senaryoları ve kısa devre risklerini saniyeler içinde çıkarsın.
                        </p>
                        
                        <div className="w-full max-w-md flex flex-col gap-4">
                          <input 
                            type="file" 
                            id="pdf-upload" 
                            accept=".pdf" 
                            className="hidden" 
                            onChange={handleFileUpload}
                          />
                          {!file ? (
                             <label htmlFor="pdf-upload" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-electric-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                               <FileText size={18} /> PDF Dosyası Seçin
                             </label>
                          ) : (
                            <div className="space-y-4">
                               <div className="bg-electric-50 dark:bg-electric-900/20 p-4 rounded-xl border border-electric-100 dark:border-electric-800/50 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                   <FileText className="text-electric-500" />
                                   <div className="text-left">
                                      <p className="text-xs font-black uppercase tracking-tight">{file.name}</p>
                                      <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                   </div>
                                 </div>
                                 <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-500 font-bold text-[10px] uppercase">Kaldır</Button>
                               </div>
                               <Button onClick={startAnalysis} className="w-full py-8 bg-electric-600 hover:bg-electric-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-electric-500/20 active:scale-95 flex items-center justify-center gap-3">
                                 <Sparkles /> Analizi Başlat
                               </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            )}
            
            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="text-orange-600 dark:text-orange-400 w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Hata Analizi</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Bağlantı kopukluklarını ve tasarım hatalarını anında bulur.</p>
               </div>
               <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Zap className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Simülasyon</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Sanal enerji vererek NO/NC kontak mantığını test eder.</p>
               </div>
               <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-600 dark:text-green-400 w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Kısa Devre Testi</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Kritik faz çakışmalarını ve sargı hatalarını denetler.</p>
               </div>
            </div>
          </div>

          {/* History Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
             <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <Clock size={16} />
                    <h2 className="text-[10px] font-black uppercase tracking-widest">Geçmiş Analizler</h2>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter italic">Proje Arşivi</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto p-4 space-y-2">
                   {history.length > 0 ? (
                     history.map((item) => (
                       <button 
                         key={item.id} 
                         onClick={() => {setSelectedHistoryItem(item); setAnalysisResult(null);}}
                         className={cn(
                           "w-full p-4 rounded-xl text-left transition-all group flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                           selectedHistoryItem?.id === item.id ? "bg-electric-50 dark:bg-electric-900/20 border border-electric-100 dark:border-electric-800/50" : "border border-transparent"
                         )}
                       >
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-electric-500 group-hover:text-white transition-colors">
                            <FileSearch size={14} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">{item.fileName}</div>
                            <div className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase italic">{formatDate(item.createdAt)}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 self-center opacity-0 group-hover:opacity-100" />
                       </button>
                     ))
                   ) : (
                     <div className="text-center py-12 px-6">
                        <FileSearch className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Henüz bir analiz kaydı bulunmuyor.</p>
                     </div>
                   )}
                </div>
             </div>
          </aside>

        </div>
      </main>

      <Footer />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
        }

        .report-container p {
          animation: fadeSlideIn 0.5s ease forwards;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
