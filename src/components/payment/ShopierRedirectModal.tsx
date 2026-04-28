"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface ShopierRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number | string;
  shopierUrl: string;
}

export function ShopierRedirectModal({ isOpen, onClose, productName, price, shopierUrl }: ShopierRedirectModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = () => {
    setIsRedirecting(true);
    
    // Small delay to show the loading state for better UX
    setTimeout(() => {
      window.open(shopierUrl, "_blank");
      setIsRedirecting(false);
      onClose();
    }, 800);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="sm:max-w-[450px] p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-[35px] border-none shadow-2xl"
    >
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400"></div>
      
      <div className="p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-[25px] flex items-center justify-center mx-auto mb-6 shadow-inner animate-in zoom-in-90 duration-500">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-2">
            GÜVENLİ SATIN AL
          </h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-70">
            {productName}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 mb-8 flex justify-between items-center group transition-all hover:border-emerald-200">
           <div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ÖDENECEK TUTAR</span>
             <span className="text-2xl font-black text-slate-900 dark:text-white">{price} TL</span>
           </div>
           <div className="text-right">
             <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">ÖMÜR BOYU</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ERİŞİM</span>
           </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleRedirect}
            disabled={isRedirecting}
            className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group/btn"
          >
            {isRedirecting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                SHOPIER İLE ÖDE <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full h-12 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl uppercase text-[11px] tracking-widest"
          >
            VAZGEÇ
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase opacity-60">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             SSL GÜVENLİ ÖDEME ALTYAPISI
          </div>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 text-center leading-relaxed max-w-[280px]">
            Ödeme sonrası Shopier sizi otomatik olarak sitemize geri yönlendirecektir.
          </p>
        </div>
      </div>
    </Modal>
  );
}
