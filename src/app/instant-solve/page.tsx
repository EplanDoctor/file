"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { createSupportTicket } from "@/lib/firebase/services";
import { usePurchases } from "@/hooks/usePurchases";
import { BuyerInfoModal } from "@/components/payment/BuyerInfoModal";
import { PRICES } from "@/lib/constants";
import { Lock } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function InstantSolvePage() {
  return (
    <ProtectedRoute>
      <InstantSolvePageContent />
    </ProtectedRoute>
  );
}

function InstantSolvePageContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { hasPurchased } = usePurchases();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const expertProductId = "instant-expert-connect";

  const handleWhatsAppConnect = async () => {
    if (!hasPurchased(expertProductId)) {
      setIsPaymentModalOpen(true);
      return;
    }

    const message = encodeURIComponent(t.instant_solve_page.btn);
    
    // If user is logged in, record the ticket
    if (user) {
      await createSupportTicket(user.uid, t.instant_solve_page.card_title);
    }
    
    window.open(`https://wa.me/905318691454?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-16 md:py-28 relative overflow-hidden">
          {/* Decorative Background Point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-6 py-2 text-[10px] font-black text-emerald-700 mb-8 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 tracking-widest shadow-sm">
              <Zap className="w-4 h-4 mr-2 fill-emerald-600 text-emerald-600" />
              {t.instant_solve_page.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[1.05]">
              {t.instant_solve_page.title.split("WhatsApp'tan")[0]}
              <span className="text-emerald-600">WhatsApp'tan</span>
              {t.instant_solve_page.title.split("WhatsApp'tan")[1]}
            </h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed opacity-70">
              {t.instant_solve_page.desc}
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative overflow-hidden bg-white dark:bg-slate-900 rounded-[50px]">
               <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400 animate-gradient-x"></div>
               <CardContent className="p-10 md:p-20">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-8">
                     <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                       <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 flex justify-center items-center shrink-0 shadow-inner group transition-transform hover:scale-110 duration-500">
                         <MessageCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                       </div>
                       <div>
                         <h3 className="text-2xl font-black mb-2 tracking-tight">{t.instant_solve_page.card_title}</h3>
                         <div className="flex items-center justify-center md:justify-start text-[10px] text-slate-400 font-black tracking-widest uppercase italic">
                           <Clock className="w-4 h-4 mr-2 text-emerald-500" /> {t.instant_solve_page.response_time}
                         </div>
                       </div>
                     </div>
                     <div className="text-center md:text-right">
                       <div className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase italic">{t.instant_solve_page.badge}</div>
                     </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-14">
                     {[
                       t.instant_solve_page.feature1,
                       t.instant_solve_page.feature2,
                       t.instant_solve_page.feature3,
                       t.instant_solve_page.feature4
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200">
                         <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                         <span className="text-[11px] text-slate-700 dark:text-slate-300 font-black tracking-tight leading-tight">{item}</span>
                       </div>
                     ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-20 text-[11px] font-black tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-600/30 rounded-[30px] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
                    onClick={handleWhatsAppConnect}
                  >
                    {hasPurchased(expertProductId) ? (
                      <><MessageCircle className="w-6 h-6 mr-3" /> {t.instant_solve_page.btn}</>
                    ) : (
                      <><Lock className="w-4 h-4 mr-2" /> {PRICES.EXPERT} TL ÖDEME YAP VE BAĞLAN</>
                    )}
                  </Button>
                  
                  <div className="mt-8 flex justify-center items-center text-[10px] text-slate-400 font-black tracking-widest opacity-50 uppercase italic">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> {t.instant_solve_page.secure_payment}
                  </div>
               </CardContent>
            </Card>
          </div>
        </Section>
      </main>

      <BuyerInfoModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product={{
          type: 'expert',
          id: expertProductId,
          name: t.instant_solve_page.card_title,
          price: PRICES.EXPERT
        }}
      />

      <Footer />
    </div>
  );
}
