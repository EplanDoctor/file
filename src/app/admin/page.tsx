"use client";

import { useState } from "react";
import { Sidebar } from "lucide-react"; // using as a mock icon for sidebar toggle if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, AlertCircle, FileVideo } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("problems")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === "problems" ? "bg-electric-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            Sorunlar (Veritabanı)
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === "users" ? "bg-electric-600 text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            Kullanıcılar & Premium
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-electric-100 flex items-center justify-center text-electric-600 font-bold">A</div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Toplam Sorun</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,284</div>
                    <p className="text-xs text-emerald-500 mt-1">+24 bu ay</p>
                  </CardContent>
                </Card>
                <Card>
                   <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Çözümlenen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">982</div>
                    <p className="text-xs text-emerald-500 mt-1">%76 Başarı Oranı</p>
                  </CardContent>
                </Card>
                <Card>
                   <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Premium Üyeler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">145</div>
                    <p className="text-xs text-emerald-500 mt-1">+12 bu hafta</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Son Bekleyen Talepler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-4">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          <div>
                            <p className="font-medium">Macro dosyası yüklenmiyor hata kodu: 404</p>
                            <p className="text-xs text-slate-500">Kullanıcı: ahmet@... - 2 saat önce</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">İncele</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "problems" && (
            <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Yeni Sorun Ekle (Mock)</h3>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Başlık</label>
                      <Input placeholder="Sorun başlığı" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Açıklama</label>
                      <textarea className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-electric-500 dark:bg-slate-950 dark:border-slate-800" rows={4}></textarea>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Çözüm (Markdown destekli)</label>
                      <textarea className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-electric-500 dark:bg-slate-950 dark:border-slate-800" rows={6}></textarea>
                   </div>
                   <Button><Plus className="w-4 h-4 mr-2"/> Veritabanına Ekle</Button>
                </CardContent>
              </Card>
            </div>
          )}

           {activeTab === "users" && (
            <div className="text-center py-20 text-slate-500">
              Kullanıcı yönetimi modülü henüz aktif değil.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
