"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Cog, Zap, CheckCircle2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { saveUserRequest } from "@/lib/firebase/services";

export default function MacroServicePage() {
  return (
    <ProtectedRoute>
      <MacroServicePageContent />
    </ProtectedRoute>
  );
}

function MacroServicePageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
    const companyName = formData.get("companyName");
    const summary = formData.get("summary");
    const details = formData.get("details");

    try {
      setStatusMessage("Gönderiliyor...");
      
      const firestorePromise = saveUserRequest(user.uid, "macro", {
        fullName, companyName, summary, details
      });

      const emailPromise = fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "macro-service",
          payload: { fullName, companyName, summary, details }
        })
      });

      // Run in parallel
      const [fireSuccess, emailResp] = await Promise.all([firestorePromise, emailPromise]);

      const result = await emailResp.json();

      if (!emailResp.ok) {
        throw new Error(result.message || "E-posta gönderilemedi.");
      }

      if (!fireSuccess) {
        console.warn("Firestore kaydı başarısız oldu ama e-posta gönderildi.");
      }

      // Success feedback on button
      setStatusMessage("Talebiniz Gönderildi");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
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
        <Section className="py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                 Özel Makro Hizmeti
               </h1>
               <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                 Kendi projelerinize veya şirketinize özel EPLAN makro kütüphaneleri hazırlıyoruz. Zaman kaybettiren çizimleri bize bırakın, siz mühendisliğe odaklanın.
               </p>
               
               <ul className="space-y-6 mb-8">
                 <li className="flex gap-4">
                   <div className="w-12 h-12 bg-electric-100 rounded-xl flex justify-center items-center text-electric-600 shrink-0 dark:bg-electric-900/30 dark:text-electric-400">
                     <Package className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Şalter & Sürücü Makroları</h4>
                     <p className="text-slate-600 dark:text-slate-400 mt-1">Sık kullandığınız markaların cihaz özeliklerine göre 2D makrolar.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-12 h-12 bg-amber-100 rounded-xl flex justify-center items-center text-amber-600 shrink-0 dark:bg-amber-900/30 dark:text-amber-400">
                     <Cog className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Dinamik Sembol & Antetler</h4>
                     <p className="text-slate-600 dark:text-slate-400 mt-1">EPLAN'ın otomatik veri çekebildiği akıllı formlar ve özel semboller.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-12 h-12 bg-green-100 rounded-xl flex justify-center items-center text-green-600 shrink-0 dark:bg-green-900/30 dark:text-green-400">
                     <Zap className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-lg text-slate-900 dark:text-white">EPLAN Pro Panel 2D Makroları</h4>
                     <p className="text-slate-600 dark:text-slate-400 mt-1">Pano yerleşimini hatasız yapabilmeniz için ölçüleri birebir 2 boyutlu makrolar.</p>
                   </div>
                 </li>
               </ul>
             </div>

             <div>
                <Card className="soft-shadow border-slate-200 dark:border-slate-800">
                  <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl border-b border-slate-100 dark:border-slate-800 pb-6">
                    <CardTitle className="text-2xl">Makro Talebi Oluştur</CardTitle>
                    <CardDescription className="text-base mt-2">
                       Hangi cihaz veya parça için makro istediğinizi belirtin, size teklif dönelim.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-8 space-y-5">
                    {isSuccess ? (
                      <div className="text-center py-8">
                         <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-emerald-900/30">
                           <CheckCircle2 className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold mb-2">Talebiniz İletildi!</h3>
                         <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                           Size en kısa sürede dönüş yapacağız.
                         </p>
                         <Button variant="outline" onClick={() => setIsSuccess(false)}>Yeni Talep Oluştur</Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ad Soyad</label>
                          <Input name="fullName" placeholder="Mehmet Yılmaz" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Firma Adı</label>
                          <Input name="companyName" placeholder="ABC Otomasyon Sanayi" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Cihaz / İhtiyaç Özeti</label>
                          <Input name="summary" placeholder="Örn: Siemens S7-1500 serisi 2D Makrolar" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Detaylar</label>
                          <textarea 
                            name="details"
                            className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950" 
                            placeholder="Talep ettiğiniz marka, model veya teknik özellikleri buraya yazın..."
                            required
                          ></textarea>
                        </div>
                        <Button type="submit" size="lg" className="w-full mt-2 text-base h-14" isLoading={isLoading} disabled={isLoading}>
                          {isLoading ? statusMessage : (statusMessage.startsWith("Hata") ? statusMessage : "Talebi Gönder")}
                        </Button>
                      </form>
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
