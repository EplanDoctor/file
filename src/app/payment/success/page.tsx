"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return (
    <Section className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
          <CheckCircle2 className="w-14 h-14 text-emerald-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white uppercase">
          ÖDEME BAŞARILI!
        </h1>
        
        <p className="text-base font-bold text-slate-600 dark:text-slate-400 mb-12 uppercase tracking-tight leading-relaxed">
          İşleminiz onaylandı. Satın aldığınız içeriğe artık süresiz olarak erişebilirsiniz.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
           <Link href="/videos" className="w-full">
            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-widest rounded-2xl uppercase">
              VİDEOLARIMA GİT
            </Button>
           </Link>
           <Link href="/docs" className="w-full">
            <Button variant="outline" className="w-full h-14 border-slate-200 dark:border-slate-800 font-black tracking-widest rounded-2xl uppercase">
              DOKÜMANLARIMA GİT
            </Button>
           </Link>
        </div>
      </div>
    </Section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
