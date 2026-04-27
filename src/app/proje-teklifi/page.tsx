"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Send, FileCheck2, Clock, CheckCircle2, Factory } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveUserRequest } from "@/lib/firebase/services";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProjeTeklifiPage() {
  return (
    <ProtectedRoute>
      <ProjeTeklifiPageContent />
    </ProtectedRoute>
  );
}

function ProjeTeklifiPageContent() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("Lütfen giriş yapın");
      return;
    }
    setIsLoading(true);
    setStatusMessage("İşlem başlatılıyor...");
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const projectType = formData.get("projectType");
    const details = formData.get("details");

    try {
      setStatusMessage("Gönderiliyor...");
      
      const firestorePromise = saveUserRequest(user.uid, "project_proposal", {
        fullName, phone, email, projectType, details
      });

      const emailPromise = fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "proje-teklifi",
          payload: { fullName, phone, email, projectType, details }
        })
      });

      // Show "Gönderiliyor..." for at least 2 seconds
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

      // Wait for both the operations and the minimum delay
      const [fireSuccess, emailResp] = await Promise.all([firestorePromise, emailPromise, delayPromise]);

      const result = await (emailResp as Response).json();

      if (!(emailResp as Response).ok) {
        throw new Error(result.message || "E-posta gönderilemedi.");
      }

      if (!fireSuccess) {
        console.warn("Firestore kaydı başarısız oldu ama e-posta gönderildi.");
      }

      // Now show "Talebiniz Gönderildi" for 1 second
      setStatusMessage("Talebiniz Gönderildi");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error: any) {
      console.error(error);
      setStatusMessage("Hata: " + (error.message || "Bilinmeyen bir sorun."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row gap-12 lg:items-center max-w-6xl mx-auto relative z-10">
            {/* Sol Taraf - Bilgi */}
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 mb-6 dark:bg-amber-900/30 dark:text-amber-500 ring-1 ring-amber-500/30">
                <Factory className="w-4 h-4 mr-2" />
                Profesyonel Elektrik Tasarımı
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
                Projelerinizi Bize Bırakın.<br/>Kusursuz <span className="text-amber-500">EPLAN</span> Çizimleri.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg">
                Zaman kısıtınız mı var? Teknik ofis ekibiniz mi eksik? Uluslararası IEC, UL standartlarında imalata hazır panel çizimlerini EPLAN uzmanlarımıza projelendirin.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 text-amber-500">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Uluslararası Standartlar</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">IEC/EN 61439 standartlarına harfiyen uygun, normlu etiketlemeler.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 text-amber-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Eksiksiz Üretim Formları</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Terminal şemaları, kablo listesi ve 2D imalat paneli ölçümleri.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 text-amber-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Hızlı Teslimat</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Belirlenen proje takvimine %100 sadakat. Acil teslimat seçenekleri.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Form */}
            <div className="flex-1 w-full max-w-md mx-auto lg:max-w-md lg:w-auto">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl bg-white/50 backdrop-blur-xl dark:bg-slate-950/80">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                       <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
                         <CheckCircle2 className="w-10 h-10" />
                       </div>
                       <h2 className="text-2xl font-bold mb-2">Talebiniz Alındı!</h2>
                       <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                         Proje mühendislerimiz dosyanızı inceleyecek ve en kısa sürede fiyat teyidi için sizinle iletişime geçecektir.
                       </p>
                       <Button variant="outline" onClick={() => setIsSubmitted(false)}>Yeni Proje Talebi</Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold mb-2">Ücretsiz Proje Teklifi Al</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Projeniz hakkındaki genel bilgileri doldurun, 24 saat içerisinde teklifimizi iletelim.</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">İsim Soyisim</label>
                            <Input name="fullName" required placeholder="Adınız" className="bg-white dark:bg-slate-900" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Telefon</label>
                            <Input name="phone" required placeholder="05XX XXX XX XX" type="tel" className="bg-white dark:bg-slate-900" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">E-Posta / Şirket Bilgisi</label>
                          <Input name="email" required placeholder="sirketiniz@email.com" type="email" className="bg-white dark:bg-slate-900" />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Proje Tipi</label>
                          <select name="projectType" className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-800">
                            <option>Otomasyon/PLC Panosu</option>
                            <option>MCC (Motor Kontrol) Panosu</option>
                            <option>Dağıtım Panosu</option>
                            <option>Makine Elektrik Projesi (Sıfırdan)</option>
                            <option>Açık Plan Düzenleme & Sembol</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Proje Detayları & İhtiyaçlar</label>
                          <textarea 
                            name="details"
                            className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px] dark:bg-slate-900 dark:border-slate-800"
                            placeholder="Motor gücü, tahmini sayfa sayısı, kullanılacak şalt marka tercihiniz (Örn: Siemens, Schneider) gibi detayları ekleyebilirsiniz..."
                            required
                          ></textarea>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20" isLoading={isLoading} disabled={isLoading}>
                          {isLoading ? statusMessage : (statusMessage.startsWith("Hata") ? statusMessage : <><Send className="w-4 h-4 mr-2" /> Teklif İste</>)}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
