"use client";

import { Play, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useVideoAccess } from "@/hooks/useVideoAccess";

export function VideoAdOverlay({ children, videoId, title }: { children: React.ReactNode, videoId: string, title?: string }) {
  const { isLoaded, isUnlocked, watchVideo, needsAd } = useVideoAccess();
  const [unlocked, setUnlocked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoaded) {
      setUnlocked(isUnlocked(videoId));
    }
  }, [isLoaded, videoId, isUnlocked]);

  const handleWatch = () => {
    if (needsAd && !unlocked) {
      setIsWatchingAd(true);
      // Simulate a 5 second Google Ad
      setTimeout(() => {
        watchVideo(videoId);
        setUnlocked(true);
        setIsWatchingAd(false);
      }, 5000);
    } else {
      watchVideo(videoId);
      setUnlocked(true);
    }
  };

  if (!isClient) return <div className="opacity-0">{children}</div>;
  if (unlocked) return <>{children}</>;

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
      <div className="opacity-40 pointer-events-none select-none filter blur-md transition-all group-hover:blur-[8px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[2px] z-10 p-6 text-center">
        
        {isWatchingAd ? (
           <div className="flex flex-col items-center">
             <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex flex-col items-center backdrop-blur-md">
               <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
               <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Sponsorlu İçerik (Google Ads)</h3>
               <p className="text-slate-300 text-sm">Videonuza ulaşmak için reklamın bitmesini bekleyin... (5s)</p>
             </div>
           </div>
        ) : (
           <>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
              <Play className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight line-clamp-1 px-4">{title || "Eğitim Videosu"}</h3>
            
            {needsAd ? (
               <>
                 <p className="text-slate-200 text-sm mb-6 max-w-sm px-4">
                   Ücretsiz izleme hakkınızı (3 video) doldurdunuz. Bu videoyu izlemek için kısa bir sponsorlu içerik görüntülemeniz gerekmektedir.
                 </p>
                 <Button onClick={handleWatch} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow-xl shadow-blue-500/20 px-8 h-12 rounded-full font-bold transition-transform hover:scale-105">
                   <Play className="w-4 h-4 mr-2" /> Reklam İzle ve Devam Et
                 </Button>
               </>
            ) : (
               <>
                 <p className="text-slate-200 text-sm mb-6 max-w-sm px-4">
                   Bu eğitim videosunu hemen, tamamen ücretsiz izleyebilirsiniz.
                 </p>
                 <Button onClick={handleWatch} className="bg-green-600 hover:bg-green-700 text-white border-none shadow-xl shadow-green-600/20 px-8 h-12 rounded-full font-bold transition-transform hover:scale-105">
                   <Play className="w-4 h-4 mr-2" /> Ücretsiz İzle
                 </Button>
               </>
            )}
           </>
        )}
      </div>
    </div>
  );
}
