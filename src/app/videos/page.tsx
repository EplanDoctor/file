"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { VideoCard } from "@/components/VideoCard";
import { VideoAdOverlay } from "@/components/VideoAdOverlay";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { PlayCircle, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { getDynamicContent } from "@/lib/firebase/services";

// Mock data
const MOCK_VIDEOS = [
  { id: 1, title: "EPLAN ile Hızlı Projelendirme", duration: "15:24" },
  { id: 2, title: "Klemens Planı Oluşturma Temelleri", duration: "08:45" },
  { id: 3, title: "Projeyi PDF'e Kayıpsız Çıkarma (Türkçe Karakter Çözümü)", duration: "05:12" },
  { id: 4, title: "Sık Kullanılan Makroları Düzenleme ve Ekleme", duration: "12:30" },
  { id: 5, title: "2D Panel Tasarımına Giriş - Temel Pratikler", duration: "21:15" },
  { id: 6, title: "Veritabanı Hatalarını Giderme ve Backup Stratejileri", duration: "16:05" },
];

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function VideosPage() {
  return (
    <ProtectedRoute>
      <VideosPageContent />
    </ProtectedRoute>
  );
}

function VideosPageContent() {
  const { t } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<{ id: number, title: string } | null>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    getDynamicContent("videos").then(data => {
      if (data && data.length > 0) {
        setVideos(data);
      } else {
        setVideos(MOCK_VIDEOS);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 uppercase">
      <Navbar />
      
      <main className="flex-grow">
        <Section className="py-16 md:py-28 relative overflow-hidden">
          {/* Decorative Background Point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-blue-500/10 blur-[120px] rounded-full point-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-6 py-2 text-[10px] font-black text-blue-700 mb-8 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 tracking-widest shadow-sm">
              <PlayCircle className="w-4 h-4 mr-2" />
              {t.videos_page.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[1.05]">
              {t.videos_page.title_part1} <span className="text-blue-600">{t.videos_page.title_part2}</span>
            </h1>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed opacity-70 italic shadow-sm bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              {t.videos_page.desc} <span className="text-blue-600 block mt-4 font-black">{t.videos_page.free_hint}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto relative z-10 px-4">
            {videos.map((video) => (
                <VideoAdOverlay key={video.id} videoId={`video-${video.id}`} title={video.title}>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <VideoCard 
                        title={video.title} 
                        duration={video.duration} 
                        description={video.description}
                        onClick={() => setActiveVideo(video)} 
                    />
                  </div>
                </VideoAdOverlay>
            ))}
          </div>

          <VideoPlayerModal 
            isOpen={!!activeVideo}
            onClose={() => setActiveVideo(null)}
            videoTitle={activeVideo?.title || ""}
          />

          <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest opacity-50 uppercase">
              <Zap className="w-4 h-4" />
              YENİ VİDEOLAR HER PAZARTESİ EKLENİR
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
