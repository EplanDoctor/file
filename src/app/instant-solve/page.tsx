"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";

export default function InstantSolvePage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = () => {
    // Redirect to WhatsApp seamlessly after payment successfully processed
    window.location.href = "https://wa.me/905550000000?text=Merhaba,%20EplanDoctor%20üzerinden%20Premium%20Destek%20ödememi%20tamamladım.%20Sorunum%20hakkında%20yardımcı%20olabilir%20misiniz?";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20 relative overflow-hidden">
          {/* Decorative Background Point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-green-500/10 blur-[100px] rounded-full point-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 mb-6 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-500/30">
              <Zap className="w-4 h-4 mr-2 fill-green-600 text-green-600" />
              Saniyeler İçinde Bağlanın
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              Sorununuzu <span className="text-green-600">WhatsApp'tan</span> Çok Hızlı Çözelim
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Zamanınız çok değerli. Beklemeden hemen uzmanlarımıza direkt bağlanın, ekran paylaşımı ile anında sorununuzu çözelim ve işinize hemen dönün.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <Card className="border-2 border-green-500/20 shadow-2xl relative overflow-hidden bg-white/50 backdrop-blur-xl dark:bg-slate-950/80">
               <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
               <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                     <div className="flex gap-5">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 flex justify-center items-center shrink-0 shadow-inner">
                         <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                       </div>
                       <div>
                         <h3 className="text-2xl font-bold mb-1">Tek Seferlik Hızlı Destek</h3>
                         <div className="flex items-center text-sm text-slate-500 font-medium font-mono">
                           <Clock className="w-4 h-4 mr-1.5 text-slate-400" /> Ortalama Yanıt: 2 Dk
                         </div>
                       </div>
                     </div>
                     <div className="text-left sm:text-right">
                       <div className="text-4xl font-black text-slate-900 dark:text-white">₺499</div>
                       <div className="text-xs text-slate-400 uppercase font-bold mt-1">Tek Seferlik Ücret</div>
                     </div>
                  </div>

                  <div className="space-y-4 mb-10 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                     {[
                       "Uzman eğitmen ile WhatsApp metin veya arama ile birebir görüşme",
                       "Gerekirse Anydesk / Teamviewer ile direkt bilgisayar bağlantısı",
                       "Sorun çözülmezse %100 Kesintisiz Ücret İadesi Garantisi",
                       "Sunucu logları ve şablonlarınıza öncelikli destek protokolü"
                     ].map((item, i) => (
                       <div key={i} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                         <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{item}</span>
                       </div>
                     ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    <MessageCircle className="w-6 h-6 mr-2" /> ₺499 - Öde ve WhatsApp'a Bağlan
                  </Button>
                  
                  <div className="mt-5 flex justify-center items-center text-xs text-slate-400 font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> 256-Bit SSL ile %100 Güvenli Ödeme Çözümü
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
        price="₺499"
        planName="Anında VIP WhatsApp Destek"
      />
    </div>
  );
}
