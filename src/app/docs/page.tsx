import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Download, BookOpen, Search, ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_DOCS = [
  { id: 1, title: "EPLAN P8 Klavye Kısayolları (PDF)", desc: "En çok kullanılan kısayollarla tasarım hızınızı 2 katına çıkarın.", type: "PDF" },
  { id: 2, title: "Standart Sembol Kütüphanesi Rehberi", desc: "IEC ve NFPA standartlarında sembol kullanımı.", type: "Rehber" },
  { id: 3, title: "Pano Montaj Çizimi Standartları", desc: "Uluslararası pano tasarımı yönergeleri.", type: "Doküman" },
  { id: 4, title: "Özel Antet (Plot Frame) Tasarımı Oluşturma", desc: "Şirketinize özel antet tasarımı adım adım anlatım.", type: "Doküman" },
];

const MOCK_CIRCUITS = [
  { id: 1, category: "Motor Kontrol", title: "Yıldız - Üçgen Yol Verme Kumanda ve Güç Devresi" },
  { id: 2, category: "PLC Donanım / IO", title: "Siemens S7-1200 / S7-1500 Dijital Bağlantıları" },
  { id: 3, category: "Tahrik Sistemleri", title: "Frekans Konvertörü (Sürücü) Tipik Bağlantı Şeması" },
  { id: 4, category: "Güvenlik (Safety)", title: "Acil Stop (Safety Relay) Güvenlik Devresi" },
  { id: 5, category: "Sensör / Ölçüm", title: "Analog ve Dijital Sensör Besleme Hatları" },
  { id: 6, category: "Aydınlatma / Pano", title: "Pano İçi Isıtma, Soğutma ve Aydınlatma Lojikleri" },
];

const MOCK_AUTOCAD = [
  { id: 1, title: "Dikili Tip Pano Genel Görünüm (800x200x600)", desc: "Standart dikili tip pano için 2D ön, yan ve iç sac yerleşim çizimleri.", type: "DWG" },
  { id: 2, title: "Duvar Tipi Pano Yerleşimi (600x800x250)", desc: "Otomasyon kontrol panosu için örnek 2D montaj paneli dizilimi.", type: "DXF" },
  { id: 3, title: "Piyano Tipi Konsol Pano Çizimi", desc: "Operatör masası / konsol tipi pano için ölçülendirilmiş şablon.", type: "DWG" },
  { id: 4, title: "Örnek Klemens Dizilimi ve Ray Ölçekleri", desc: "1:1 ölçekli klemens, şalter ve kablo kanalı taslakları.", type: "DWG" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900/40">
        <Section className="py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Dokümantasyon & Rehberler</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Projelerinizde başvurabileceğiniz hazır dokümanlar, kısayol listeleri ve standart yönergeleri indirin.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
            {MOCK_DOCS.map((doc, idx) => {
              const content = (
                <Card key={doc.id} className="group hover:-translate-y-1 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">{doc.type}</div>
                        <CardTitle className="text-lg mb-2 group-hover:text-electric-600 transition-colors">{doc.title}</CardTitle>
                        <CardDescription>{doc.desc}</CardDescription>
                      </div>
                    </div>
                    <Link href="/dashboard" className="p-2 border border-slate-200 rounded-lg hover:bg-electric-50 hover:text-electric-600 hover:border-electric-200 transition-colors shrink-0 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700">
                      <Download className="w-5 h-5" />
                    </Link>
                  </CardHeader>
                </Card>
              );
              return content;
            })}
          </div>

          {/* YENİ ALT BÖLÜM: Sık Karşılaşılan Tipik Devre Çizimleri */}
          <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-10 flex flex-col justify-center items-center text-center">
              <div className="inline-flex items-center rounded-full bg-electric-100 px-3 py-1 text-sm font-medium text-electric-600 mb-4 dark:bg-electric-900/40 dark:text-electric-400">
                <BookOpen className="w-4 h-4 mr-2" />
                Referans Şablonlar
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Sık Karşılaşılan Tipik Devre Çizimleri</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                Daha önce sahada aktif çalışan projelere ait tipik devre veya makro sayfası şablonları. Benzer pano tasarımlarında kılavuz olarak kullanabilirsiniz.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_CIRCUITS.map((circuit, idx) => {
                const content = (
                <Card key={circuit.id} className="group overflow-hidden flex flex-col">
                  {/* Thumbnail / Mockup Area for Circuit Diagram */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/20 mix-blend-overlay"></div>
                    <Search className="w-10 h-10 text-slate-400 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300 z-10" />
                    {/* Placeholder hint text for Nano Banana */}
                    <span className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-medium px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded z-10 pointer-events-none">
                      [Görsel Temsili: Tipik EPLAN Devre Makrosu]
                    </span>
                    <div className="absolute inset-4 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded opacity-50"></div>
                  </div>
                  <CardHeader className="p-5 flex-grow">
                    <div className="text-xs font-semibold text-electric-600 dark:text-electric-400 mb-2">{circuit.category}</div>
                    <CardTitle className="text-[15px] leading-snug group-hover:text-electric-600 transition-colors">
                      {circuit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 mt-auto">
                    <Link href="/dashboard" className="w-full">
                      <Button variant="outline" className="w-full text-sm h-9">
                        Çizimi İncele
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                );
                return <div key={circuit.id}>{content}</div>;
              })}
            </div>
            <div className="mt-8 text-center flex items-center justify-center mb-20 border-b border-slate-100 dark:border-slate-800 pb-20">
               <Button variant="link" className="text-electric-600 dark:text-electric-400">Daha Fazla Örnek Çizim Yükle <ArrowRight className="ml-1 w-4 h-4"/></Button>
            </div>
          </div>

          {/* YENİ ALT BÖLÜM: AutoCAD Panel Çizimleri (2D) */}
          <div className="pt-10">
            <div className="mb-10 flex flex-col justify-center items-center text-center">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-4 dark:bg-blue-900/40 dark:text-blue-400">
                <PenTool className="w-4 h-4 mr-2" />
                2D Tasarım Arşivi
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">AutoCAD Panel Tasarımları (2D)</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                Otomasyon ve elektrik genel pano tasarımcıları için hazır, ölçekli 2D AutoCAD dosya (.dwg, .dxf) arşivini bilgisayarınıza indirip panolarınızı detaylandırın.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {MOCK_AUTOCAD.map((doc) => (
                <div key={doc.id}>
                  <Card className="group hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <PenTool className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{doc.type}</div>
                          <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">{doc.title}</CardTitle>
                          <CardDescription>{doc.desc}</CardDescription>
                        </div>
                      </div>
                      <Link href="/dashboard" className="p-2 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shrink-0 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700">
                        <Download className="w-5 h-5" />
                      </Link>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
