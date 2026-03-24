import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { VideoCard } from "@/components/VideoCard";
import { VideoAdOverlay } from "@/components/VideoAdOverlay";
import { PlayCircle } from "lucide-react";

// Mock data
const MOCK_VIDEOS = [
  { id: 1, title: "EPLAN ile Hızlı Projelendirme", duration: "15:24" },
  { id: 2, title: "Klemens Planı Oluşturma Temelleri", duration: "08:45" },
  { id: 3, title: "Projeyi PDF'e Kayıpsız Çıkarma (Türkçe Karakter Çözümü)", duration: "05:12" },
  { id: 4, title: "Sık Kullanılan Makroları Düzenleme ve Ekleme", duration: "12:30" },
  { id: 5, title: "2D Panel Tasarımına Giriş - Temel Pratikler", duration: "21:15" },
  { id: 6, title: "Veritabanı Hatalarını Giderme ve Backup Stratejileri", duration: "16:05" },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 mb-6 dark:bg-blue-900/30 dark:text-blue-400">
              <PlayCircle className="w-4 h-4 mr-2" />
              Eğitim Kütüphanesi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              Uzmanlardan EPLAN <span className="text-blue-600">Video Eğitimleri</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Gerçek hayat senaryoları üzerinden ilerleyen uygulamalı eğitim videoları ile projelerinizi daha hızlı ve hatasız çizin. (İlk 3 videonuz tamamen ücretsiz!)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {MOCK_VIDEOS.map((video) => (
                <VideoAdOverlay key={video.id} videoId={`video-${video.id}`} title={video.title}>
                  <VideoCard title={video.title} duration={video.duration} />
                </VideoAdOverlay>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
