"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProblem, saveUserRequest, uploadFileToStorage } from "@/lib/firebase/services";
import { CheckCircle2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SubmitProblemPage() {
  return (
    <ProtectedRoute>
      <SubmitProblemPageContent />
    </ProtectedRoute>
  );
}

function SubmitProblemPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth(); // getting logged in user

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("Lütfen giriş yapın");
      return;
    }
    setIsLoading(true);
    setStatusMessage("İşlem başlatılıyor...");
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    try {
      let fileUrl = "";
      if (selectedFile) {
        setStatusMessage("Dosya yükleniyor...");
        fileUrl = await uploadFileToStorage(selectedFile, `users/${user.uid}/uploads/${Date.now()}_${selectedFile.name}`);
      }

      setStatusMessage("Gönderiliyor (Lütfen Bekleyin)...");
      
      const firestorePromise = saveUserRequest(user.uid, "problem", {
        title, category, description, fileUrl
      });

      const emailPromise = fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "submit-problem",
          payload: { title, category, description: description + (fileUrl ? `\n\nDosya: ${fileUrl}` : "") }
        })
      });

      // User specifically requested 2s delay
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

      // Network timeout of 15 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı. Lütfen internetinizi kontrol edin.")), 15000)
      );

      // Wait for everything
      const [fireSuccess, emailResp] = await Promise.race([
        Promise.all([firestorePromise, emailPromise, delayPromise]),
        timeoutPromise
      ]) as [boolean, Response, unknown];

      const result = await emailResp.json();

      if (!emailResp.ok) {
        throw new Error(result.message || "E-posta gönderilemedi.");
      }

      // Show "Talebiniz Gönderildi" on button for 1s
      setStatusMessage("Talebiniz Gönderildi");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setSelectedFile(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Form Hatası:", error);
      setStatusMessage("Hata: " + (error.message || "Bilinmeyen bir sorun."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Kendi Sorununu Yaz</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                EPLAN'da karşılaştığınız hatayı bize detaylıca anlatın. Uzmanlarımız veya topluluk saniyeler içinde çözüm üretsin.
              </p>
            </div>

            {isSuccess ? (
              <Card className="border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                <CardContent className="flex flex-col items-center text-center p-12">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sorununuz İletildi!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                    Destek talebiniz başarıyla alındı. Çözüm bulunduğunda sizi bilgilendireceğiz.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => setIsSuccess(false)} variant="outline">Yeni Soru Sor</Button>
                    <Link href="/problems"><Button>Sorunları İncele</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sorun Detayları</CardTitle>
                  <CardDescription>Lütfen sorununuzu mümkün olduğunca açık ifade edin.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sorun Başlığı / Hata Kodu</label>
                      <Input name="title" placeholder="Örn: PDF export sırasında Türkçe karakter bozulması" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kategori</label>
                      <select name="category" className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950">
                        <option>Lisans / Dongle</option>
                        <option>Export / Çıktı</option>
                        <option>Veritabanı (Project Data)</option>
                        <option>Makro Yönetimi</option>
                        <option>Diğer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Detaylı Açıklama</label>
                      <textarea 
                        name="description"
                        className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950" 
                        placeholder="Sorun ne zaman başladı? Hangi işlemleri yaptıktan sonra bu hatayı aldınız?"
                        required
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center justify-between">
                        Ekran Görüntüsü / Log Dosyası (İsteğe Bağlı)
                        <span className="text-xs text-slate-400">Max 5MB</span>
                      </label>
                      <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {selectedFile ? <span className="text-electric-500 font-bold">{selectedFile.name}</span> : <span>Dosyayı buraya sürükleyin veya <span className="text-electric-500 font-medium">bilgisayarınızdan seçin</span></span>}
                        </p>
                        <p className="text-xs text-slate-400">PNG, JPG, PDF veya ZIP desteklenir.</p>
                      </label>
                    </div>

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading} disabled={isLoading}>
                      {isLoading ? statusMessage : (statusMessage.startsWith("Hata") ? statusMessage : "Sorunu Gönder")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
