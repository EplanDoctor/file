"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import Link from "next/link";

export default function BuyLibraryPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = () => {
    // Redirect to Dashboard library after payment
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20 relative overflow-hidden">
          {/* Decorative Background Point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
            <Link href="/docs" className="inline-flex items-center justify-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700 mb-6 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
              <BookOpen className="w-4 h-4 mr-2 fill-amber-600 text-amber-600" />
              Sınırsız Kütüphane Erişimi
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              Eğitim ve Doküman Arşivinin <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Kilidini Açın</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Premium eğitim videolarımıza, güncel EPLAN makrolarına ve profesyonel devre çizim kütüphanesine anında erişim sağlayın.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <Card className="border-2 border-amber-500/20 shadow-2xl relative overflow-hidden bg-white/50 backdrop-blur-xl dark:bg-slate-950/80">
               <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
               <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                     <div className="flex gap-5">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 flex justify-center items-center shrink-0 shadow-inner">
                         <Video className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                       </div>
                       <div>
                         <h3 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Eğitim & Arşiv Paketi</h3>
                         <div className="flex items-center text-sm text-slate-500 font-medium">
                           100+ Premium Özel Dosya ve Video
                         </div>
                       </div>
                     </div>
                     <div className="text-left sm:text-right">
                       <div className="text-4xl font-black text-slate-900 dark:text-white">₺99</div>
                       <div className="text-xs text-slate-400 uppercase font-bold mt-1">Ömür Boyu Erişim</div>
                     </div>
                  </div>

                  <div className="space-y-4 mb-10 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                     {[
                       "Tüm EPLAN ve AutoCAD arşivi paneline anında yetki",
                       "Premium Eğitim Videolarının tamamını izleyebilme",
                       "Güncel Terminal ve Klemens 2D Şablonları",
                       "Yeni eklenecek içeriklere ömür boyu ücretsiz ulaşım"
                     ].map((item, i) => (
                       <div key={i} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                         <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{item}</span>
                       </div>
                     ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 border-none"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    ₺99 - Eğitimi Şimdi Satın Al
                  </Button>
                  
                  <div className="mt-5 flex justify-center items-center text-xs text-slate-400 font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1 text-amber-500" /> 256-Bit SSL ile %100 Güvenli Cüzdan İşlemi
                  </div>
               </CardContent>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={handlePaymentSuccess}
        price="₺99"
        planName="Eğitim ve Arşiv Kütüphanesi Erişimi"
      />
    </div>
  );
}
