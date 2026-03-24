"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlanManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "options" | "update_card" | "buy_new";

export function PlanManagementModal({ isOpen, onClose }: PlanManagementModalProps) {
  const [tab, setTab] = useState<Tab>("options");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setTab("options");
    }, 2000);
  };

  const resetTab = () => {
    setTab("options");
    setIsSuccess(false);
  };

  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">İşlem Tamamlandı!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Talebiniz güvenli bir şekilde sunucularımıza işlendi.
          </p>
        </div>
      );
    }

    if (tab === "update_card") {
      return (
        <>
          <div className="mb-6">
            <button onClick={resetTab} className="text-sm font-semibold text-slate-500 hover:text-electric-600 mb-4 inline-flex items-center">← Geri Dön</button>
            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Kredi Kartını Güncelle</h2>
            <p className="text-sm text-slate-500">Mevcut kullandığınız güvenli kart: **** 4242</p>
          </div>
          <form onSubmit={handleAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Yeni Kart Numarası</label>
              <Input required placeholder="0000 0000 0000 0000" className="font-mono tracking-widest bg-slate-50 dark:bg-slate-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Son Kullanma (A/Y)</label>
                 <Input required placeholder="AA/YY" className="font-mono text-center bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-1.5">
                 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Güvenlik (CVC)</label>
                 <Input required placeholder="***" type="password" className="font-mono text-center tracking-widest bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 font-bold bg-electric-600 hover:bg-electric-700" isLoading={isLoading}>Bilgileri Güvenle Kaydet</Button>
          </form>
        </>
      );
    }

    if (tab === "buy_new") {
       return (
        <>
          <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-electric-100 text-electric-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-electric-900/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Ek WhatsApp Destek Hakkı Al</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Mevcut bağlantı hakkınızı doldurdunuz mu veya yeni bir projede uzmanlarımıza mı ihtiyacınız var? Tek seferlik yeni bir erişim açın.
            </p>
          </div>
          <div className="flex flex-col gap-3">
             <Button onClick={() => window.location.href = "/instant-solve"} className="bg-electric-600 hover:bg-electric-700 text-white font-bold" isLoading={isLoading}>₺499 - VIP Destek Başlat</Button>
             <Button variant="outline" onClick={resetTab} className="bg-white border-slate-200 text-slate-700 font-bold hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">Vazgeç, Geri Dön</Button>
          </div>
        </>
       );
    }

    // Default Options tab
    return (
      <>
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800 dark:text-slate-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Paket Yönetimi</h2>
          <p className="text-sm text-slate-500">Mevcut destek planınıza ait ayarlar.</p>
        </div>
        
        <div className="space-y-3 mt-8">
          <button onClick={() => setTab("update_card")} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-electric-400 hover:bg-electric-50 transition-colors dark:hover:bg-electric-900/10 text-left group bg-white dark:bg-slate-900">
             <div className="bg-electric-100 dark:bg-electric-900/30 w-10 h-10 rounded-full flex items-center justify-center text-electric-600 dark:text-electric-400 mr-4 group-hover:scale-110 transition-transform shrink-0">
               <CreditCard className="w-5 h-5" />
             </div>
             <div>
               <div className="font-bold text-slate-900 dark:text-white">Ödeme Yöntemini Güncelle</div>
               <div className="text-xs text-slate-500 mt-0.5">Sistemde tanımlı güncel kredi kartınızı değiştirin veya güncelleyin.</div>
             </div>
          </button>

          <button onClick={() => setTab("buy_new")} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-electric-300 hover:bg-electric-50 transition-colors dark:hover:bg-electric-900/10 text-left group bg-white dark:bg-slate-900">
             <div className="bg-electric-100 dark:bg-electric-900/30 w-10 h-10 rounded-full flex items-center justify-center text-electric-600 dark:text-electric-400 mr-4 group-hover:scale-110 transition-transform shrink-0">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <div className="font-bold text-slate-900 dark:text-white">Yeni Destek Paketi Al</div>
               <div className="text-xs text-slate-500 mt-0.5">Uzmanlara anında bağlanmak için VIP WhatsApp Destek paketi satın alın.</div>
             </div>
          </button>
        </div>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetTab(); onClose(); }} title="">
      {renderContent()}
    </Modal>
  );
}
