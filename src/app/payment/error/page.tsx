"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  
  return (
    <Section className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
          <XCircle className="w-14 h-14 text-red-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white uppercase">
          ÖDEME BAŞARISIZ!
        </h1>
        
        <p className="text-base font-bold text-slate-600 dark:text-slate-400 mb-12 uppercase tracking-tight leading-relaxed">
          {reason === 'invalid_token' ? 'Güvenlik doğrulaması başarısız oldu.' : 'Ödeme işlemi sırasında bir hata oluştu veya işlem iptal edildi.'}
          <br />Lütfen bilgilerini kontrol edip tekrar deneyin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-widest rounded-2xl uppercase px-12">
              DASHBOARD'A DÖN
            </Button>
           </Link>
           <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto h-14 border-slate-200 dark:border-slate-800 font-black tracking-widest rounded-2xl uppercase px-12">
             <RefreshCcw className="w-4 h-4 mr-2" /> TEKRAR DENE
           </Button>
        </div>
      </div>
    </Section>
  );
}

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <ErrorContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
