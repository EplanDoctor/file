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

  const purchased = hasPurchased(videoId, 'video');

  if (purchased) return <>{children}</>;

  return (
    <div className="relative group rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-500">
      <div className="opacity-30 pointer-events-none select-none filter blur-[10px] grayscale transition-all duration-500">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md z-10 p-8 text-center border-t border-white/10">
        
        <div className="w-16 h-16 bg-gradient-to-br from-electric-500 to-indigo-600 rounded-2xl rotate-3 flex items-center justify-center text-white mb-6 shadow-[0_0_40px_rgba(59,130,246,0.5)] animate-in zoom-in-90 duration-500 border border-white/20">
          <Lock className="w-7 h-7 -rotate-3" />
        </div>
        
        <h3 className="text-xl font-black text-white mb-2 tracking-tight px-4 leading-tight shadow-black drop-shadow-md">
          {title || "Eğitim Videosu"}
        </h3>
        
        <div className="bg-electric-500/20 border border-electric-500/30 text-electric-300 text-[10px] font-black px-3 py-1 rounded-full mb-6 uppercase tracking-widest shadow-sm">
          Tüm Eğitim Seti Erişimi
        </div>

        <p className="text-slate-300 text-[11px] font-bold mb-6 max-w-xs px-4 leading-relaxed opacity-90 drop-shadow">
          Bu videoyu satın aldığınızda platformdaki <strong className="text-white">TÜM DİĞER EĞİTİM VİDEOLARINA</strong> da ömür boyu erişim kazanırsınız.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[260px]">
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full h-14 bg-white hover:bg-slate-100 text-slate-900 border-none shadow-[0_10px_40px_rgba(255,255,255,0.1)] rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            <Play className="w-4 h-4 mr-2 text-electric-600 fill-electric-600 group-hover/btn:scale-110 transition-transform" /> 
            PAKETİ AL ({PRICES.VIDEO} TL)
          </Button>
          
          <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2 drop-shadow-md">
            ÖMÜR BOYU ERİŞİM
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
