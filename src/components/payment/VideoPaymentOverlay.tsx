"use client";

import { Play, Lock, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { BuyerInfoModal } from "./BuyerInfoModal";
import { PRICES } from "@/lib/constants";

export function VideoPaymentOverlay({ children, videoId, title }: { children: React.ReactNode, videoId: string, title?: string }) {
  const { hasPurchased, loading } = usePurchases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="opacity-0">{children}</div>;
  if (loading) return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 text-electric-600 animate-spin" />
    </div>
  );

  const purchased = hasPurchased(videoId);

  if (purchased) return <>{children}</>;

  return (
    <div className="relative group rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-500">
      <div className="opacity-30 pointer-events-none select-none filter blur-xl grayscale transition-all">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[4px] z-10 p-8 text-center">
        
        <div className="w-20 h-20 bg-gradient-to-br from-electric-500 to-electric-700 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-electric-500/40 animate-in zoom-in-90 duration-500">
          <Lock className="w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase px-4">
          {title || "Eğitim Videosu"}
        </h3>
        
        <p className="text-slate-300 text-xs font-bold mb-8 max-w-sm px-4 uppercase tracking-widest leading-relaxed">
          Bu eğitim videosuna erişmek için tek seferlik ödeme yapmanız gerekmektedir.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full h-16 bg-white hover:bg-slate-100 text-slate-900 border-none shadow-2xl rounded-[20px] font-black uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5 mr-3 text-electric-600" /> 
            {PRICES.VIDEO} TL SATIN AL
          </Button>
          
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
            ÖMÜR BOYU ERİŞİM • SHOPIER GÜVENCESİYLE
          </div>
        </div>
      </div>

      <BuyerInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          type: 'video',
          id: videoId,
          name: title || "Eğitim Videosu",
          price: PRICES.VIDEO
        }}
      />
    </div>
  );
}
