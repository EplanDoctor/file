import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Cog, Zap } from "lucide-react";

export default function MacroServicePage() {
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ad Soyad</label>
                      <Input placeholder="Mehmet Yılmaz" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Firma Adı</label>
                      <Input placeholder="ABC Otomasyon Sanayi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cihaz / İhtiyaç Özeti</label>
                      <Input placeholder="Örn: Siemens S7-1500 serisi 2D Makrolar" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Detaylar</label>
                      <textarea 
                        className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950" 
                        placeholder="Talep ettiğiniz marka, model veya teknik özellikleri buraya yazın..."
                      ></textarea>
                    </div>
                    <Button size="lg" className="w-full mt-2 text-base h-14">
                      Talebi Gönder
                    </Button>
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
