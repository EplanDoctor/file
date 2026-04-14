"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, FileText, Settings, LogOut, CheckCircle2, MessageCircle, Zap, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PlanManagementModal } from "@/components/payment/PlanManagementModal";
import { usePurchases } from "@/hooks/usePurchases";
import { PlayCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUserTickets, getUserActivities, createSupportTicket, SupportTicket, UserActivity } from "@/lib/firebase/services";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

function DashboardPageContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const { hasPurchased, loading: purchasesLoading } = usePurchases();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoadingData(true);
        const [userTickets, userActivities] = await Promise.all([
          getUserTickets(user.uid),
          getUserActivities(user.uid)
        ]);
        setTickets(userTickets);
        setActivities(userActivities);
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const libraryItems: any[] = [];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleNewTicket = async () => {
    if (user) {
      const ticketTitle = "Yeni Destek Talebi";
      const success = await createSupportTicket(user.uid, ticketTitle);
      if (success) {
        // Refresh tickets locally
        const updatedTickets = await getUserTickets(user.uid);
        const updatedActivities = await getUserActivities(user.uid);
        setTickets(updatedTickets);
        setActivities(updatedActivities);
      }
      
      const message = encodeURIComponent(ticketTitle);
      window.open(`https://wa.me/905318691454?text=${message}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-electric-100 text-electric-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black dark:bg-electric-900/50 dark:text-electric-400 overflow-hidden">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    getInitials(user.displayName)
                )}
              </div>
              <div>
                  <h2 className="font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{user.displayName || "EPLAN Uzmanı"}</h2>
                  <div className="flex flex-col mt-1 gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</span>
                    <div className="flex items-center gap-2">
                       <span className="inline-flex w-fit items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                         <CheckCircle2 className="w-3 h-3 mr-1" /> Kayıtlı Kullanıcı
                       </span>
                    </div>
                  </div>
                </div>
            </div>
            <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab("overview")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black transition-colors uppercase tracking-widest", activeTab === "overview" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-3" /> Genel Bakış
              </button>
              <button 
                onClick={() => setActiveTab("tickets")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black transition-colors uppercase tracking-widest", activeTab === "tickets" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-3" /> Taleplerim
              </button>
              <button 
                onClick={() => setActiveTab("downloads")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black transition-colors uppercase tracking-widest", activeTab === "downloads" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <FileText className="w-3.5 h-3.5 mr-3" /> Kütüphanem
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={cn("w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black transition-colors uppercase tracking-widest", activeTab === "settings" ? "bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white")}
              >
                <Settings className="w-3.5 h-3.5 mr-3" /> Ayarlar
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
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktif Talepler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{tickets.filter(t => t.status === 'open').length}</div>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İndirilen Dosya</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{libraryItems.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-100 uppercase tracking-wider">Satın Alınan İçerik</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black flex items-center mb-1">
                      <Zap className="w-6 h-6 mr-2 opacity-80" />
                      {purchasesLoading ? "..." : "Aktif"}
                    </div>
                    <p className="text-xs text-indigo-100 font-medium">Shopier Ödeme Geçmişi</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mt-8 rounded-[30px] overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-8">
                  <CardTitle className="text-lg font-black uppercase tracking-widest">Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="space-y-6">
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                           <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-electric-600" />
                              </div>
                              <div className="flex-grow">
                                <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{activity.description}</div>
                                <div className="text-xs font-bold text-slate-400 mt-1 uppercase italic">{formatDate(activity.createdAt)}</div>
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="text-center py-12 flex flex-col items-center gap-4">
                           <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                             <Zap className="w-8 h-8" />
                           </div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Henüz bir aktivite kaydı bulunmuyor.</p>
                        </div>
                      )}
                      {loadingData && (
                        <div className="text-center py-4">
                          <div className="w-6 h-6 border-2 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                      )}
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
                      <label className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Ad Soyad</label>
                      <Input defaultValue={user.displayName || ""} className="bg-white dark:bg-slate-900 font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Firma / Ünvan</label>
                      <Input defaultValue="Mühendis / Premium Üye" className="bg-white dark:bg-slate-900 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">E-Posta Adresi</label>
                    <Input defaultValue={user.email || ""} type="email" disabled className="bg-slate-50 dark:bg-slate-800/50 font-bold cursor-not-allowed" />
                  </div>
                  <Button className="font-bold bg-electric-600 hover:bg-electric-700 text-white shadow-md">Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* DESTEK TALEPLERIM */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Destek Taleplerim</h2>
                <Button 
                  onClick={handleNewTicket} 
                  className="bg-electric-600 hover:bg-electric-700 text-white font-bold h-10 px-4"
                >
                  Yeni Talep Oluştur
                </Button>
              </div>
              
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden rounded-[30px]">
                 <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Talep Konusu</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Tarih</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Durum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tickets.length > 0 ? (
                          tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                  </div>
                                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{ticket.title}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-500 uppercase italic">
                                {formatDate(ticket.createdAt)}
                              </td>
                              <td className="px-8 py-6 text-right">
                                <span className={cn(
                                  "inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                                  ticket.status === 'open' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-500/20" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                )}>
                                  {ticket.status === 'open' ? "BEKLİYOR" : "TAMAMLANDI"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center py-20">
                               <div className="flex flex-col items-center gap-4">
                                 <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200">
                                   <MessageCircle className="w-10 h-10" />
                                 </div>
                                 <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">Henüz bir destek talebiniz bulunmuyor.</p>
                               </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                 </div>
              </Card>
            </div>
          )}

          {/* KÜTÜPHANEM */}
          {activeTab === "downloads" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dijital Kütüphanem</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 {libraryItems.length > 0 ? (
                   libraryItems.map((item, i) => (
                    <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-sm hover:border-electric-300 dark:hover:border-electric-700/50 transition-all group rounded-2xl">
                       {/* item content */}
                    </Card>
                   ))
                 ) : (
                   <div className="col-span-2 text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] bg-white/50 dark:bg-slate-900/50">
                      <div className="w-20 h-20 rounded-[30px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                        <FileText className="w-10 h-10" />
                      </div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Henüz indirilen dosya yok</h3>
                      <p className="text-[11px] font-bold text-slate-500 uppercase italic opacity-70">Dokümanlar sayfasından içerik indirebilirsiniz.</p>
                      <Link href="/docs" className="mt-8 inline-block">
                         <Button className="bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-full h-10 hover:bg-electric-600 transition-all">Dokümanlara Göz At</Button>
                      </Link>
                   </div>
                 )}
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
