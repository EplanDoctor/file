"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldCheck, ShoppingCart } from "lucide-react";

interface BuyerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    type: string;
    id: string;
    name: string;
    price: number;
  };
  onSuccess?: () => void;
}

export function BuyerInfoModal({ isOpen, onClose, product }: BuyerInfoModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName?.split(' ')[0] || "",
    surname: user?.displayName?.split(' ').slice(1).join(' ') || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postcode: ""
  });
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SHOPIER_PAYMENT_STATUS') {
        if (event.data.status === 'success') {
          onClose();
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload(); 
          }
        } else {
          // Error
          alert(`Ödeme başarısız: ${event.data.reason || 'Bilinmeyen hata'}`);
          setShowIframe(false);
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic Validation
    const phoneRegex = /^[0-9\s]{10,15}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      alert('Lütfen geçerli bir telefon numarası giriniz (Örn: 05551234455).');
      setLoading(false);
      return;
    }

    if (formData.address.length < 10) {
      alert('Lütfen daha detaylı bir adres giriniz.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/shopier/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: product.type,
          productId: product.id,
          productName: product.name,
          userId: user?.uid,
          buyer: {
            ...formData,
            phone: cleanPhone // Send cleaned phone to Shopier
          }
        })
      });

      const data = await response.json();

      if (data.action && data.fields) {
        setShowIframe(true); // Shows the processing message
        
        const width = 600;
        const height = 800;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open('', 'ShopierPayment', `width=${width},height=${height},left=${left},top=${top}`);
        
        setTimeout(() => {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.action;
          form.target = 'ShopierPayment';

          Object.entries(data.fields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }, 100);
      } else {
        alert(data.error || 'Ödeme başlatılamadı.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-[30px] border-none">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-electric-400 via-electric-600 to-electric-400"></div>
      
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white">
            <ShoppingCart className="w-8 h-8 text-electric-600" />
            GÜVENLİ ÖDEME
          </h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">
             {product.name} - <span className="text-electric-600 font-black">{product.price} TL</span>
          </p>
        </div>

        {showIframe ? (
          <div className="w-full h-[300px] flex flex-col items-center justify-center text-center p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <Loader2 className="w-12 h-12 animate-spin text-electric-600 mb-6" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Ödeme Bekleniyor</h3>
            <p className="text-sm font-bold text-slate-500">Lütfen açılan pencerede ödeme işleminizi tamamlayın. Pencereyi kapattıktan sonra işlem otomatik devam edecektir.</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">AD</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl border-slate-100 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">SOYAD</label>
                <Input required value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="rounded-xl border-slate-100 dark:border-slate-800" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">TELEFON</label>
              <Input required type="tel" placeholder="05XX XXX XX XX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-xl border-slate-100 dark:border-slate-800" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">TAM ADRES</label>
              <textarea 
                required 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Ödeme onayı için gereklidir..."
                className="flex min-h-[80px] w-full rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">ŞEHİR</label>
                <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="rounded-xl border-slate-100 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">POSTA KODU</label>
                <Input required value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} className="rounded-xl border-slate-100 dark:border-slate-800" />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-electric-600 to-indigo-600 hover:from-electric-500 hover:to-indigo-500 text-white font-black tracking-widest rounded-2xl shadow-xl shadow-electric-500/20 active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ÖDEMEYE GEÇ (SHOPIER)"}
              </Button>
            </div>

            <div className="flex justify-center items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase opacity-60">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               SSL GÜVENLİ ÖDEME ALTYAPISI
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
