"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { loginWithGoogle } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsLogin?: boolean;
}

type AuthView = "login" | "register" | "forgot_password" | "success_reset";

export function AuthModal({ isOpen, onClose, defaultIsLogin = false }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultIsLogin ? "login" : "register");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  useEffect(() => {
    if (isOpen) {
      setView(defaultIsLogin ? "login" : "register");
    }
  }, [isOpen, defaultIsLogin]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API Process
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    
    if (view === "forgot_password") {
      setView("success_reset");
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  const renderContent = () => {
    if (view === "success_reset") {
      return (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900/30 dark:text-green-400">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">E-posta Gönderildi!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Lütfen e-posta kutunuzu kontrol edin. Şifre sıfırlama talimatlarını içeren bir bağlantı gönderdik.
          </p>
          <Button className="w-full h-12" onClick={() => setView("login")}>Giriş Ekranına Dön</Button>
        </div>
      );
    }

    if (view === "forgot_password") {
      return (
        <>
          <div className="text-center mb-6 pt-2">
            <h2 className="text-2xl font-bold mb-2">Şifrenizi Sıfırlayın</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
               Hesabınıza bağlı e-posta adresinizi girin, sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input className="pl-10" type="email" placeholder="Kayıtlı E-posta Adresiniz" required />
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
              Sıfırlama Bağlantısı Gönder
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
             <button className="text-slate-500 font-medium hover:text-electric-600 transition-colors inline-flex items-center" onClick={() => setView("login")}>
               <ArrowLeft className="w-4 h-4 mr-1"/> Giriş ekranına dön
             </button>
          </div>
        </>
      );
    }

    // Default Login / Register View
    const isLogin = view === "login";

    return (
      <>
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl font-bold mb-2">{isLogin ? "Tekrar Hoş Geldiniz" : "Ücretsiz Hesabınızı Oluşturun"}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLogin 
              ? "EPLAN çözümlerine ulaşmak için giriş yapın." 
              : "EplanDoctor platformuna saniyeler içinde katılın."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin && (
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button 
                type="button"
                className={cn("flex-1 text-sm py-1.5 rounded-md font-semibold transition-all shadow-sm", loginMethod === "email" ? "bg-white text-electric-600 dark:bg-slate-800 dark:text-electric-400" : "text-slate-500 hover:text-slate-700 shadow-none")}
                onClick={() => setLoginMethod("email")}
              >E-Posta</button>
              <button 
                type="button"
                className={cn("flex-1 text-sm py-1.5 rounded-md font-semibold transition-all shadow-sm", loginMethod === "phone" ? "bg-white text-electric-600 dark:bg-slate-800 dark:text-electric-400" : "text-slate-500 hover:text-slate-700 shadow-none")}
                onClick={() => setLoginMethod("phone")}
              >Telefon (SMS)</button>
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input className="pl-10" placeholder="Adınız Soyadınız" required />
            </div>
          )}
          
          {(!isLogin || loginMethod === "email") ? (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input className="pl-10" type="email" placeholder="E-posta Adresiniz" required />
            </div>
          ) : (
            <div className="relative flex gap-3">
               <div className="relative w-24">
                 <span className="absolute inset-0 flex items-center justify-center font-semibold text-slate-600 dark:text-slate-300 pointer-events-none">+90</span>
                 <Input className="w-full text-transparent focus:text-transparent bg-slate-50 border-slate-200 dark:bg-slate-900 pointer-events-none select-none" readOnly />
               </div>
               <div className="relative flex-1">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <Input className="pl-10 font-medium" type="tel" placeholder="5XX XXX XX XX" required pattern="[0-9]{10}" maxLength={10} />
               </div>
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input className="pl-10" type="password" placeholder="Şifreniz" required />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-electric-600 focus:ring-electric-500 cursor-pointer" />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-800 transition-colors">Beni Hatırla</span>
              </label>
              <button type="button" onClick={() => setView("forgot_password")} className="font-semibold text-electric-600 hover:text-electric-700 hover:underline transition-colors">Şifremi Unuttum?</button>
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
            {isLogin ? "Giriş Yap" : "Ücretsiz Kayıt Ol"}
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <span className="relative bg-white dark:bg-slate-950 px-4 text-xs font-semibold text-slate-500 uppercase">Veya</span>
        </div>

        <Button variant="outline" className="w-full h-12 border-slate-200 dark:border-slate-800 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" onClick={handleGoogleLogin} disabled={isLoading}>
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google ile Devam Et
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">{isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}</span>{" "}
          <button className="text-electric-600 font-semibold hover:underline" onClick={() => setView(isLogin ? "register" : "login")}>
            {isLogin ? "Ücretsiz Kayıt Ol" : "Buradan Giriş Yapın"}
          </button>
        </div>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      {renderContent()}
    </Modal>
  );
}
