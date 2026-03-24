"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, CheckCircle2, MessageCircle, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlanManagementModal } from "@/components/payment/PlanManagementModal";
import { useVideoAccess } from "@/hooks/useVideoAccess";
import { PlayCircle } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const { watchedCount, isLoaded } = useVideoAccess();

  const handleLogout = async () => {
    // Mock API delay
    await new Promise(r => setTimeout(r, 500));
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-electric-100 text-electric-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold dark:bg-electric-900/50 dark:text-electric-400">
                AE
              </div>
              <div>
                  <h2 className="font-bold text-slate-900 dark:text-white leading-tight">Ahmet E.</h2>
                  <div className="flex flex-col mt-0.5 gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">ahmet.e@sirketim.com</span>
                    <div className="flex items-center gap-2">
                       <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800">
                         <CheckCircle2 className="w-3 h-3 mr-1" /> Premium Üye
                       </span>
                    </div>
                  </div>
                </div>
            </div>
            <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab("overview")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", activeTab === "overview" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" /> Genel Bakış
              </button>
              <button 
                onClick={() => setActiveTab("tickets")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", activeTab === "tickets" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <MessageCircle className="w-4 h-4 mr-3" /> Destek Taleplerim
              </button>
              <button 
                onClick={() => setActiveTab("downloads")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", activeTab === "downloads" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <FileText className="w-4 h-4 mr-3" /> Kütüphanem
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", activeTab === "settings" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <Settings className="w-4 h-4 mr-3" /> Hesap Ayarları
              </button>
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <Button onClick={handleLogout} variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 justify-start">
                <LogOut className="w-4 h-4 mr-3" /> Çıkış Yap
              </Button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Genel Bakış</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Aktif Talepler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">İndirilen Dosya</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">14</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-100 uppercase tracking-wider">İzlenen Videolar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black flex items-center mb-1">
                      <PlayCircle className="w-6 h-6 mr-2 opacity-80" />
                      {isLoaded ? watchedCount : "..."} Video
                    </div>
                    <p className="text-xs text-indigo-100 font-medium">Eğitim Kütüphanesi İstatistiği</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-lg">Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Makro Hizmeti Talebi</div>
                          <div className="text-sm text-slate-500 mt-1">Omron PLC şablonları için talep oluşturuldu.</div>
                        </div>
                        <div className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-md dark:bg-amber-900/30 dark:text-amber-500">İnceleniyor</div>
                      </div>
                      <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Premium WhatsApp Destek</div>
                          <div className="text-sm text-slate-500 mt-1">Anydesk bağlantısı ile senkronizasyon sorunu çözüldü.</div>
                        </div>
                        <div className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-md dark:bg-green-900/30 dark:text-green-500">Tamamlandı</div>
                      </div>
                      <div className="flex items-start justify-between pb-2 text-slate-400 dark:text-slate-500">
                        <div>
                          <div className="font-medium">IEC Kütüphanesi İndirildi</div>
                        </div>
                        <div className="text-xs">3 gün önce</div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hesap Ayarları</h2>
              
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ad Soyad</label>
                      <Input defaultValue="Ahmet E." className="bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Firma / Ünvan</label>
                      <Input defaultValue="Mühendis / Premium Üye" className="bg-white dark:bg-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">E-Posta Adresi</label>
                    <Input defaultValue="ahmet.e@sirketim.com" type="email" className="bg-white dark:bg-slate-900" />
                  </div>
                  <Button className="font-bold bg-electric-600 hover:bg-electric-700 text-white shadow-md">Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600 dark:text-red-400">Şifre Değiştir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mevcut Şifre</label>
                    <Input type="password" placeholder="••••••••••••" className="bg-white dark:bg-slate-900" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Yeni Şifre</label>
                    <Input type="password" placeholder="Yeni şifrenizi girin" className="bg-white dark:bg-slate-900" />
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 font-bold mt-2">Şifreyi Güncelle</Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mt-8 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600 dark:text-amber-400 font-bold flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2" /> Geliştirici Test Araçları (Sıfırlama)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6 pt-0">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Sistem arka planda (tarayıcı belleği) sizin daha önce kaç jeton aldığınızı ve hangi videoların/dökümanların kilidini açtığınızı hatırlar. Eğer <b>"tüm içerikleri tekrar kilitle ve jetonlarımı sıfırla"</b> gibi bir test yapmak isterseniz aşağıdaki butonu kullanabilirsiniz.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-bold mt-2"
                    onClick={() => {
                       localStorage.removeItem("eplandoktor_watched_count");
                       localStorage.removeItem("eplandoktor_unlocked_videos");
                       window.location.reload();
                    }}
                  >
                    Video İzleme Geçmişini Sıfırla
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* DESTEK TALEPLERIM */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Destek Taleplerim</h2>
                <Button className="bg-electric-600 hover:bg-electric-700 text-white font-bold h-10 px-4">Yeni Talep Oluştur</Button>
              </div>
              
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                 <div className="w-full">
                    <div className="grid grid-cols-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-2">Talep Konusu</div>
                      <div>Tarih</div>
                      <div>Durum</div>
                    </div>
                    
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="grid grid-cols-4 px-6 py-5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="col-span-2 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white">Omron PLC Makro Şablon Talebi</div>
                          <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">Özel üretim NX serisi için makro dosyalarının EPLAN standartlarına ekstradan uyarlanması işlemleri.</div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">21.03.2026</div>
                        <div><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">İnceleniyor</span></div>
                      </div>
                      
                      <div className="grid grid-cols-4 px-6 py-5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="col-span-2 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white">Premium WhatsApp Ekran Desteği</div>
                          <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">Bağlantı şemalarındaki kopma sorunu ve terminal klemens uyuşmazlığının kök analizi.</div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">15.03.2026</div>
                        <div><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500">Çözüldü</span></div>
                      </div>
                      
                      <div className="grid grid-cols-4 px-6 py-5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors opacity-70">
                        <div className="col-span-2 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white line-through decoration-slate-300">İptal Edilmiş Proje Taslak İsteği</div>
                          <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">Siemens S7-1200 Eğitim Panosu kaba taslağı ve demo onay süreci.</div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">02.02.2026</div>
                        <div><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">İptal Edildi</span></div>
                      </div>
                    </div>
                 </div>
              </Card>
            </div>
          )}

          {/* KÜTÜPHANEM */}
          {activeTab === "downloads" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dijital Kütüphanem</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                 {[
                   { title: "EPLAN IEC Standartları Kılavuzu", type: "PDF Dosyası", size: "4.2 MB", date: "Bugün" },
                   { title: "Siemens Kontaktör 2D Makroları", type: "EDZ Dosyası", size: "12.8 MB", date: "Geçen Hafta" },
                   { title: "Örnek MCC Panosu Bağlantı Şeması", type: "DXF/DWG", size: "1.5 MB", date: "15 Şubat" },
                   { title: "En Sık Yapılan 5 Hata - Eğitim Slaytı", type: "Sunum", size: "8.1 MB", date: "Ocak 2026" },
                 ].map((item, i) => (
                    <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-sm hover:border-electric-300 dark:hover:border-electric-700/50 transition-all group">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center dark:bg-electric-900/20 dark:text-electric-400">
                             <FileText className="w-5 h-5" />
                           </div>
                           <Button variant="ghost" size="sm" className="text-electric-600 hover:text-white hover:bg-electric-600 opacity-0 group-hover:opacity-100 transition-opacity">
                             İndir
                           </Button>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{item.title}</h3>
                        <div className="flex items-center text-xs font-semibold text-slate-500 space-x-3">
                           <span>{item.type}</span>
                           <span>•</span>
                           <span>{item.size}</span>
                           <span>•</span>
                           <span>Eklenme: {item.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                 ))}
              </div>
            </div>
          )}

        </div>
        
      </main>

      <Footer />

      <PlanManagementModal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
      />
    </div>
  );
}
