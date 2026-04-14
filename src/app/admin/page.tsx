"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, AlertCircle, FileVideo, LayoutDashboard, Database, UploadCloud } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getRequestsForAdmin, addDynamicContent, uploadFileToStorage } from "@/lib/firebase/services";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [requests, setRequests] = useState<any[]>([]);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);

  // New Content States
  const [newVideo, setNewVideo] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({ type: "PDF", title: "", desc: "", category: "docs" });
  const [docFile, setDocFile] = useState<File | null>(null);

  // Refs for resetting file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
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
    const data = await getRequestsForAdmin();
    setRequests(data);
    setIsFetchingRequests(false);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Lütfen önce bir video dosyası seçin.");
      return;
    }

    // 100MB Limit (optional but recommended for web uploads)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (videoFile.size > MAX_FILE_SIZE) {
      alert("Dosya çok büyük. Maksimum 100MB yükleyebilirsiniz.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const timestamp = Date.now();
      const fileUrl = await uploadFileToStorage(
        videoFile, 
        `videos/${timestamp}_${videoFile.name}`,
        (progress) => setUploadProgress(progress)
      );
      
      const success = await addDynamicContent("videos", {
        ...newVideo,
        fileUrl,
        fileName: videoFile.name,
        fileSize: videoFile.size,
        updatedAt: timestamp
      });
      
      if (success) {
        setUploadProgress(100);
        // Doğrudan bildirim göster, state'leri temizle (setTimeout finally'den sonra kilitlenmemesi için kaldırıldı)
        alert("Videonuz başarıyla yüklendi.");
        setNewVideo({title: "", description: ""});
        setVideoFile(null);
        setUploadProgress(0);
        if (videoInputRef.current) videoInputRef.current.value = "";
      } else {
        alert("Video kaydı veritabanına eklenirken bir hata oluştu.");
      }
    } catch(err: any) {
      console.error("Upload process error:", err);
      alert(`Hata: ${err.message || 'Video yüklenemedi. Lütfen internet bağlantınızı kontrol edin.'}`);
    } finally {
      setIsUploading(false);
    }
  }

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
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tüm Kullanıcı Talepleri</CardTitle>
                  <Button size="sm" onClick={fetchRequests} disabled={isFetchingRequests}>Yenile</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.length === 0 && !isFetchingRequests && (
                      <div className="text-center py-10 text-slate-500">Henüz hiç talep yok.</div>
                    )}
                    {requests.map((req, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 gap-4">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-5 h-5 text-electric-500 mt-1 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                {req.type}
                              </span>
                              <span className="text-xs text-slate-500">{new Date(req.createdAt?.seconds * 1000).toLocaleString('tr-TR')}</span>
                            </div>
                            <p className="font-medium">{req.title || req.fullName || "İsimsiz Talep"}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{req.description || req.details || req.summary}</p>
                            {req.fileUrl && (
                              <a href={req.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-electric-600 mt-2 inline-block">Ekli Dosyayı Görüntüle</a>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-500 mb-2">UID: {req.userId.substring(0,8)}...</div>
                          <select className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-1">
                            <option>Bekliyor</option>
                            <option>İnceleniyor</option>
                            <option>Çözüldü</option>
                          </select>
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
                  <CardTitle className="flex items-center gap-2"><FileVideo className="w-5 h-5"/> Eğitim Videosu Ekle</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddVideo} className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Video Başlığı</label>
                          <Input required value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} placeholder="Örn: Klemens Planı Oluşturma" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Video İçeriği / Açıklaması</label>
                          <textarea 
                            required 
                            value={newVideo.description} 
                            onChange={e => setNewVideo({...newVideo, description: e.target.value})} 
                            placeholder="Videonun içeriği hakkında kısa bilgi..."
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Video Dosyası (Bilgisayardan Seç)</label>
                          <div className="flex items-center gap-3">
                            <Input 
                              type="file" 
                              accept="video/*"
                              ref={videoInputRef}
                              onChange={e => setVideoFile(e.target.files?.[0] || null)}
                              className="cursor-pointer file:bg-electric-500 file:text-white file:border-none file:rounded file:px-3 file:py-1 file:mr-4 file:hover:bg-electric-600 transition-all"
                            />
                            {videoFile && (
                              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 italic mt-1">* Desteklenen tüm video formatlarını içerir.</p>
                       </div>
                     </div>
                     <Button type="submit" disabled={isUploading || !videoFile} className="w-full bg-electric-600 hover:bg-electric-700 font-black">
                        {isUploading ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">🌀</span> Yükleniyor %{uploadProgress}
                          </span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2"/> Videoyu Yükle ve Yayınla
                          </>
                        )}
                     </Button>
                  </form>
                </CardContent>
              </Card>

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
                     <Button type="submit" disabled={isUploading}>
                        <UploadCloud className="w-4 h-4 mr-2"/> {isUploading ? 'Yükleniyor...' : 'İçeriği Yükle ve Yayınla'}
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
