"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, AlertCircle, LayoutDashboard, Database, UploadCloud } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getRequestsForAdmin, addDynamicContent, uploadFileToStorage, updateRequestStatus } from "@/lib/firebase/services";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [requests, setRequests] = useState<any[]>([]);
  const [globalProblemsCount, setGlobalProblemsCount] = useState(0);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState("all");
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);

  // New Content States
  const [newDoc, setNewDoc] = useState({ type: "PDF", title: "", desc: "", category: "docs" });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  // Refs for resetting file inputs
  const docInputRef = useRef<HTMLInputElement>(null);

  // Auto-categorize document based on file extension
  useEffect(() => {
    if (docFile) {
      const ext = docFile.name.split('.').pop()?.toLowerCase() || '';
      if (ext === 'pdf') {
        setNewDoc(prev => ({ ...prev, category: 'docs', type: 'PDF' }));
      } else if (['dwg', 'dxf'].includes(ext)) {
        setNewDoc(prev => ({ ...prev, category: 'autocad', type: ext.toUpperCase() }));
      } else {
        setNewDoc(prev => ({ ...prev, category: 'circuits', type: ext.toUpperCase() || 'EPLAN' }));
      }
    }
  }, [docFile]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== "cnr.pano@gmail.com") {
        router.push("/admin/login");
      } else {
        fetchRequests();
      }
    }
  }, [user, loading, router]);

  const fetchRequests = async () => {
    setIsFetchingRequests(true);
    const [reqData, probData] = await Promise.all([
      getRequestsForAdmin(),
      getProblems()
    ]);
    setRequests(reqData);
    setGlobalProblemsCount(probData.filter(p => !p.resolved).length);
    setIsFetchingRequests(false);
  };


  const handleStatusUpdate = async (userId: string, requestId: string, newStatus: string) => {
    setUpdatingRequestId(requestId);
    try {
      const success = await updateRequestStatus(userId, requestId, newStatus);
      if (success) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        ));
      } else {
        alert("Durum güncellenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (requestFilter === "all") return true;
    return (req.status || "pending") === requestFilter;
  });

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) {
      alert("Lütfen önce bir dosya seçin.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      let fileUrl = "";
      if (docFile) {
        const timestamp = Date.now();
        fileUrl = await uploadFileToStorage(
          docFile, 
          `admin_uploads/${timestamp}_${docFile.name}`,
          (progress) => setUploadProgress(progress)
        );
      }
      
      const success = await addDynamicContent(newDoc.category, {
        type: newDoc.type,
        title: newDoc.title,
        desc: newDoc.desc,
        fileUrl,
        fileName: docFile?.name || "",
        createdAt: Date.now()
      });
      
      if (success) {
        setUploadProgress(100);
        setTimeout(() => {
          alert("Doküman başarıyla yüklendi.");
          setNewDoc({ type: "PDF", title: "", desc: "", category: "docs" });
          setDocFile(null);
          setUploadProgress(0);
          if (docInputRef.current) docInputRef.current.value = "";
        }, 300);
      } else {
        alert("Doküman kaydı veritabanına eklenirken bir hata oluştu.");
      }
    } catch(err: any) {
      console.error("Doc upload error:", err);
      alert(`Hata: ${err.message || 'Doküman yüklenemedi.'}`);
    } finally {
      setIsUploading(false);
    }
  }

  if (loading || !user || user.email !== "cnr.pano@gmail.com") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-tight">EplanDoctor <span className="text-electric-500">Admin</span></span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === "overview" ? "bg-electric-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3"/> Gelen Talepler
          </button>
          <button 
            onClick={() => router.push("/admin/problems")}
            className="w-full flex items-center px-4 py-3 rounded-xl transition-colors hover:bg-slate-800 hover:text-white"
          >
            <AlertCircle className="w-5 h-5 mr-3"/> Sorunları Yanıtla
          </button>
          <button 
            onClick={() => setActiveTab("content")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === "content" ? "bg-electric-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <Database className="w-5 h-5 mr-3"/> İçerik Yönetimi
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold capitalize">{activeTab === 'overview' ? 'Gelen Talepler' : 'İçerik Ekleme'}</h2>
          <div className="flex items-center gap-4">
             <div className="text-sm text-slate-500">{user.email}</div>
             <div className="w-8 h-8 rounded-full bg-electric-100 flex items-center justify-center text-electric-600 font-bold">A</div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Toplam Gelen Talep</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{requests.length}</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-electric-500/50 transition-colors" onClick={() => {
                  setActiveTab("overview");
                  setRequestFilter("pending");
                }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Bekleyen Talepler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-500">
                      {requests.filter(r => r.status !== 'resolved' && r.status !== 'rejected').length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-electric-500/50 transition-colors" onClick={() => router.push("/admin/problems")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Çözülmemiş Sorunlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-electric-600">
                      {globalProblemsCount}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2 mb-2">
                {["all", "pending", "processing", "resolved"].map((f) => (
                  <Button 
                    key={f}
                    variant={requestFilter === f ? "default" : "outline"}
                    size="sm"
                    className="capitalize rounded-full text-[10px] font-bold h-8 px-4"
                    onClick={() => setRequestFilter(f)}
                  >
                    {f === 'all' ? 'Tümü' : f === 'pending' ? 'Bekliyor' : f === 'processing' ? 'İnceleniyor' : 'Tamamlandı'}
                  </Button>
                ))}
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tüm Kullanıcı Talepleri</CardTitle>
                  <Button size="sm" onClick={fetchRequests} disabled={isFetchingRequests}>Yenile</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRequests.length === 0 && !isFetchingRequests && (
                      <div className="text-center py-10 text-slate-500">Filtreye uygun talep bulunamadı.</div>
                    )}
                    {filteredRequests.map((req, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 gap-4 transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${req.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-electric-100 text-electric-600'}`}>
                            <AlertCircle className="w-5 h-5 shrink-0" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                {req.type}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleString('tr-TR') : 'Tarih Belirsiz'}
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white">{req.title || req.fullName || "İsimsiz Talep"}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{req.description || req.details || req.summary || "Açıklama yok."}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              {req.fileUrl && (
                                <a href={req.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-electric-600 bg-electric-50 dark:bg-electric-900/20 px-3 py-1 rounded-md hover:underline decoration-2 underline-offset-4">Dosyayı Gör</a>
                              )}
                              {req.email && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{req.email}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 min-w-[140px]">
                          <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Durumu Güncelle</div>
                          <select 
                            disabled={updatingRequestId === req.id}
                            value={req.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(req.userId, req.id, e.target.value)}
                            className="w-full text-xs font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-electric-500 outline-none cursor-pointer"
                          >
                            <option value="pending">⏳ Bekliyor</option>
                            <option value="processing">🔍 İnceleniyor</option>
                            <option value="resolved">✅ Tamamlandı</option>
                            <option value="rejected">❌ Reddedildi</option>
                          </select>
                          {updatingRequestId === req.id && <div className="text-[9px] text-electric-500 mt-1 font-bold animate-pulse">Güncelleniyor...</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "content" && (
            <div className="max-w-4xl mx-auto space-y-8">
              

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5"/> Doküman / Kütüphane Ekle</CardTitle>
                  <CardDescription>Sitedeki Docs, Circuits ve AutoCAD listelerine anında yansır.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDoc} className="space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Koleksiyon / Kategori</label>
                          <select 
                            value={newDoc.category} 
                            onChange={e => setNewDoc({...newDoc, category: e.target.value})}
                            title="Dosya tipine göre otomatik seçilir"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950"
                          >
                            <option value="docs">Dokümanlar (PDF, Rehberler)</option>
                            <option value="circuits">Tipik Devreler (EPLAN vb.)</option>
                            <option value="autocad">AutoCAD (DWG/DXF)</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Dosya Tipi Etiketi</label>
                          <Input required value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})} placeholder="PDF, DWG, Rehber vb." />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">İçerik Başlığı</label>
                          <Input required value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} placeholder="İçerik Başlığı" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Açıklama</label>
                          <Input required value={newDoc.desc} onChange={e => setNewDoc({...newDoc, desc: e.target.value})} placeholder="Kısa içerik açıklaması" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Dosya (Firebase Storage'a Yüklenecek)</label>
                          <Input type="file" ref={docInputRef} onChange={e => setDocFile(e.target.files?.[0] || null)} className="cursor-pointer file:bg-electric-500 file:text-white file:border-none file:rounded file:px-3 file:py-1 file:mr-4 file:hover:bg-electric-600 transition-all" />
                       </div>
                     </div>
                     <Button type="submit" disabled={isUploading} className="w-full">
                        <UploadCloud className="w-4 h-4 mr-2"/> 
                        {isUploading ? `Yükleniyor %${uploadProgress}` : 'İçeriği Yükle ve Yayınla'}
                     </Button>
                  </form>
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
