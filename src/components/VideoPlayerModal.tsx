"use client";

import { X, PlayCircle, Maximize2, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoUrl?: string;
}

export function VideoPlayerModal({ isOpen, onClose, videoTitle, videoUrl }: VideoPlayerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  // Placeholder video if none provided
  const embedUrl = videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop with strong blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] shadow-2xl shadow-blue-500/20 overflow-hidden border border-white/10 animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header/Title Bar */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{videoTitle}</h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="flex items-center text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                     <ShieldCheck className="w-3 h-3 mr-1" /> Orijinal İçerik
                   </span>
                   <span className="flex items-center text-[10px] font-bold text-amber-400 uppercase tracking-tighter">
                     <Zap className="w-3 h-3 mr-1" /> Full HD 1080p
                   </span>
                </div>
              </div>
           </div>
           
           <button 
             onClick={onClose}
             className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:rotate-90 active:scale-90 border border-white/10"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Video Player Iframe */}
        <iframe
          src={embedUrl}
          title={videoTitle}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* Footer info/controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">EPLAN DOCTOR EDUCATION PLATFORM © 2026</p>
        </div>
      </div>
    </div>
  );
}
