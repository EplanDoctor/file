"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  price?: string;
  planName?: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, price = "₺499", planName = "Tek Seferlik WhatsApp Destek" }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expiry, setExpiry] = useState("");

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setExpiry(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
    
    // Auto redirect after success
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      {!isSuccess ? (
        <>
          <div className="text-center mb-6 pt-2">
            <div className="w-16 h-16 bg-electric-100 text-electric-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-electric-900/30 dark:text-electric-400">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Güvenli Ödeme Ekranı</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {planName} paketi için işlemi tamamlayın.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 flex justify-between items-center">
             <span className="font-semibold text-slate-700 dark:text-slate-200">{planName}</span>
             <span className="text-xl font-bold text-electric-600 dark:text-electric-400">{price} <span className="text-xs text-slate-400 line-through ml-1">₺899</span></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Kart Üzerindeki İsim</label>
              <Input placeholder="Ad Soyad" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Kart Numarası</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input className="pl-10 font-mono tracking-widest text-sm" placeholder="0000 0000 0000 0000" required maxLength={19} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-500 uppercase">Son Kullanma</label>
                 <Input 
                   placeholder="AA/YY" 
                   required 
                   maxLength={5} 
                   className="font-mono text-center"
                   value={expiry}
                   onChange={handleExpiryChange}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-500 uppercase">CVC Kodu</label>
                 <Input type="password" placeholder="***" required maxLength={3} className="font-mono text-center tracking-widest"/>
               </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center py-2">
              <Lock className="w-3 h-3 text-emerald-500" />
              256-bit SSL Güvenli Ödeme Altyapısı
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white" isLoading={isLoading}>
              {price}'yi Güvenle Öde
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ödeme Başarılı!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Ödemeniz ulaştı. İlgili ekrana yönlendiriliyorsunuz... Lütfen bekleyin.
          </p>
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </Modal>
  );
}
