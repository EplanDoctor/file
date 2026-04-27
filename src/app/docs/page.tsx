"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Download, BookOpen, Search, ArrowRight, PenTool, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { getDynamicContent } from "@/lib/firebase/services";
import { usePurchases } from "@/hooks/usePurchases";
import { BuyerInfoModal } from "@/components/payment/BuyerInfoModal";
import { PRICES } from "@/lib/constants";







import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DocsPage() {
  return (
    <ProtectedRoute>
      <DocsPageContent />
    </ProtectedRoute>
  );
}

function DocsPageContent() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<any[]>([]);
  const [circuits, setCircuits] = useState<any[]>([]);
  const [autocadList, setAutocadList] = useState<any[]>([]);

  const { hasPurchased, loading: purchasesLoading } = usePurchases();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    getDynamicContent("docs").then(data => setDocs(data));
    getDynamicContent("circuits").then(data => setCircuits(data));
    getDynamicContent("autocad").then(data => setAutocadList(data));
  }, []);

  const handleDownload = (item: any, type: 'doc' | 'circuit' | 'autocad') => {
    if (hasPurchased(item.id)) {
      window.open(item.fileUrl, "_blank");
    } else {
      let price = PRICES.DOC;
      if (type === 'autocad') price = PRICES.AUTOCAD;
      if (type === 'circuit') price = PRICES.CIRCUIT;

      setSelectedProduct({
        id: item.id,
        type: type,
        name: item.title,
        price: price
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-16 md:py-28">
          <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="inline-flex items-center justify-center rounded-full bg-electric-100 px-6 py-2 text-[10px] font-black text-electric-600 mb-8 dark:bg-electric-900/30 dark:text-electric-400 border border-electric-200 dark:border-electric-800 tracking-widest shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              {t.docs_page.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[1.05]">
              {t.docs_page.title}
            </h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed opacity-70 italic">
              {t.docs_page.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-32 max-w-6xl mx-auto">
            {docs.map((doc) => (
              <Card key={doc.id} className="group hover:-translate-y-2 transition-all duration-500 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[35px] overflow-hidden">
                <CardHeader className="p-8 flex flex-row items-start justify-between">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-[22px] bg-electric-50 text-electric-600 dark:bg-electric-900/50 dark:text-electric-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 mb-2 tracking-widest">{doc.type || "Doküman"}</div>
                      <CardTitle className="text-xl font-black mb-3 group-hover:text-electric-600 transition-colors tracking-tight">{doc.title || "İsimsiz"}</CardTitle>
                      <CardDescription className="text-[11px] font-bold opacity-70 leading-relaxed uppercase">{doc.desc || ""}</CardDescription>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(doc, 'doc')} 
                    className={`p-4 rounded-2xl transition-all shadow-sm shrink-0 ${hasPurchased(doc.id) ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-electric-600 hover:text-white hover:shadow-electric-600/20"}`}
                  >
                    {hasPurchased(doc.id) ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </button>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Section: Typical Circuits */}
          <div className="pt-24 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-16 text-center animate-in fade-in duration-1000">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-[10px] font-black text-emerald-700 mb-6 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 tracking-widest">
                <BookOpen className="w-4 h-4 mr-2" />
                {t.docs_page.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">{t.docs_page.section_typical}</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto opacity-70 uppercase italic">
                {t.docs_page.section_typical_desc}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {circuits.map((circuit) => (
                <Card key={circuit.id} className="group overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] transition-all hover:scale-[1.02] duration-500">
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-slate-950/20"></div>
                    <Search className="w-12 h-12 text-slate-400 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500 z-10" />
                    <span className="absolute bottom-4 left-4 text-[9px] text-slate-400 font-black tracking-widest px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full z-10 shadow-sm">
                      #{(circuit.category || "GENEL").toUpperCase()}
                    </span>
                    <div className="absolute inset-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-[30px] opacity-40"></div>
                  </div>
                  <CardHeader className="p-8">
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mb-3 tracking-widest">TYPE: {circuit.category || "Genel"}</div>
                    <CardTitle className="text-lg font-black leading-tight group-hover:text-emerald-600 transition-colors tracking-tight h-14 overflow-hidden">
                      {circuit.title || "İsimsiz Çizim"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <Button 
                      onClick={() => handleDownload(circuit, 'circuit')}
                      variant={hasPurchased(circuit.id) ? "default" : "outline"} 
                      className={`w-full text-[10px] font-black uppercase tracking-widest h-12 rounded-2xl transition-all ${hasPurchased(circuit.id) ? "bg-emerald-600 hover:bg-emerald-700" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      {hasPurchased(circuit.id) ? t.docs_page.btn_view : `${PRICES.CIRCUIT} TL SATIN AL`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-16 text-center border-b border-slate-200 dark:border-slate-800 pb-20">
               <Button variant="link" className="text-electric-600 dark:text-electric-400 font-black text-[11px] tracking-widest uppercase hover:no-underline group">
                 {t.docs_page.btn_more} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
               </Button>
            </div>
          </div>

          {/* Section: AutoCAD */}
          <div className="pt-24 max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-[10px] font-black text-blue-700 mb-6 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 tracking-widest">
                <PenTool className="w-4 h-4 mr-2" />
                2D CAD ARCHIVE
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">{t.docs_page.section_autocad}</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto opacity-70 uppercase italic">
                {t.docs_page.section_autocad_desc}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {autocadList.map((doc) => (
                <Card key={doc.id} className="group hover:-translate-y-2 transition-all duration-500 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[35px] overflow-hidden border-l-[6px] border-l-blue-600">
                  <CardHeader className="p-8 flex flex-row items-start justify-between">
                    <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-[22px] bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-500">
                        <PenTool className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 mb-2 tracking-widest">{doc.type || "CAD"}</div>
                        <CardTitle className="text-xl font-black mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{doc.title || "İsimsiz Proje"}</CardTitle>
                        <CardDescription className="text-[11px] font-bold opacity-70 leading-relaxed uppercase">{doc.desc || ""}</CardDescription>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(doc, 'autocad')}
                      className={`p-4 rounded-2xl transition-all shadow-sm shrink-0 ${hasPurchased(doc.id) ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-blue-600/20"}`}
                    >
                      {hasPurchased(doc.id) ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {selectedProduct && (
        <BuyerInfoModal 
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}

      <Footer />
    </div>
  );
}
