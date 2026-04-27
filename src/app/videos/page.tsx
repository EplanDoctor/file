"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { VideoCard } from "@/components/VideoCard";
import { VideoPaymentOverlay } from "@/components/payment/VideoPaymentOverlay";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { PlayCircle, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { getDynamicContent, getStorageVideosOnly } from "@/lib/firebase/services";
import { Loader2 } from "lucide-react";

// No mock data

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
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [videos, setVideos] = useState<any[]>([
    {
      id: "yt-Bh78LHCvSGQ",
      title: "EPLAN P8: Klemens, Röle ve Motor Sembolü Ekleme | Elektrik Proje Tasarımı",
      description: "Bu videoda, EPLAN P8 programında elektrik projelerinin temel taşları olan klemens, röle ve motor sembollerinin projeye nasıl ekleneceğini ve teknik özelliklerini anlatıyoruz.",
      duration: "Eğitim Videosu",
      youtubeId: "Bh78LHCvSGQ",
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    getDynamicContent("videos").then((videosData) => {
      const data = videosData || [];
      setVideos(prev => {
        // Keep the static video at the top, add rest from DB
        const dbVideos = data.filter((v: any) => v.youtubeId !== "Bh78LHCvSGQ");
        return [prev[0], ...dbVideos];
      });
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching videos:", err);
      setLoading(false);
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
              {t.videos_page.desc}
            </p>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 px-4">
            {/* Always show the first video (the static one) immediately if it exists */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {videos.length > 0 && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  <VideoCard 
                      title={videos[0].title} 
                      duration={videos[0].duration || "Eğitim Videosu"} 
                      description={videos[0].description}
                      thumbnailUrl={videos[0].youtubeId ? `https://img.youtube.com/vi/${videos[0].youtubeId}/maxresdefault.jpg` : undefined}
                      onClick={() => setActiveVideo(videos[0])} 
                  />
                </div>
              )}

              {loading ? (
                // Show skeletons for the rest of the grid while loading
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={`skeleton-${i}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Show the rest of the videos from DB
                videos.slice(1).map((video) => {
                  const cardContent = (
                    <div className="group relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                      <VideoCard 
                          title={video.title} 
                          duration={video.duration || "Eğitim Videosu"} 
                          description={video.description}
                          thumbnailUrl={video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg` : undefined}
                          onClick={() => setActiveVideo(video)} 
                      />
                    </div>
                  );

                  // YouTube videos are free, others use the payment overlay
                  if (video.youtubeId) {
                    return <div key={video.id}>{cardContent}</div>;
                  }

                  return (
                    <VideoPaymentOverlay key={video.id} videoId={video.id} title={video.title}>
                      {cardContent}
                    </VideoPaymentOverlay>
                  );
                })
              )}
            </div>

            {!loading && videos.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] bg-white/50 dark:bg-slate-900/50 animate-in zoom-in-95 duration-500">
                 <PlayCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Henüz eğitim videosu eklenmemiş</h3>
                 <p className="text-[11px] font-bold text-slate-500 uppercase italic opacity-70">En kısa sürede yeni içerikler eklenecektir.</p>
              </div>
            )}
          </div>

          <VideoPlayerModal 
            isOpen={!!activeVideo}
            onClose={() => setActiveVideo(null)}
            videoTitle={activeVideo?.title || ""}
            videoUrl={activeVideo?.youtubeId ? `https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1` : activeVideo?.fileUrl}
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
