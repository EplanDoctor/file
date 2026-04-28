"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Suspense } from "react";

function StatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const reason = searchParams.get('reason');

  useEffect(() => {
    // Send message to parent window
    if (typeof window !== "undefined" && window.opener) {
      setTimeout(() => {
        window.opener.postMessage({ 
          type: 'SHOPIER_PAYMENT_STATUS', 
          status: status || 'error',
          reason: reason
        }, '*');
        window.close(); // Close the popup after sending the message
      }, 1500);
    }
  }, [status, reason]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 text-center">
      {status === 'success' ? (
        <>
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase">ÖDEME BAŞARILI</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            {typeof window !== "undefined" && window.opener ? "Pencere otomatik olarak kapatılıyor..." : "Ödemeniz başarıyla alındı. İçeriğe erişebilirsiniz."}
          </p>
          {typeof window !== "undefined" && !window.opener && (
            <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full h-14 bg-electric-600 text-white font-black rounded-2xl shadow-lg shadow-electric-500/20 uppercase tracking-widest text-[11px]"
              >
                Panele Git
              </button>
              <button 
                onClick={() => window.location.href = "/"}
                className="w-full h-12 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl uppercase text-[10px] tracking-widest"
              >
                Ana Sayfa
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase">ÖDEME BAŞARISIZ</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
             {typeof window !== "undefined" && window.opener ? "Bir hata oluştu. Pencere kapatılıyor..." : "Ödeme işlemi sırasında bir sorun oluştu."}
          </p>
          {typeof window !== "undefined" && !window.opener && (
            <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => window.location.href = "/"}
                className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-[11px]"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          )}
        </>
      )}
      {typeof window !== "undefined" && window.opener && <Loader2 className="w-6 h-6 animate-spin text-electric-600 mt-6" />}
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-electric-600" />
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}
