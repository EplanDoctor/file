"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // MVP Yetki Kontrolü
      if (email === "cnr.pano@gmail.com") {
        router.push("/admin");
      } else {
        alert("Bu panele sadece yöneticiler erişebilir.");
        auth.signOut();
      }
    } catch (err) {
      console.error(err);
      alert("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-electric-600/20 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-electric-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Girişi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Adresi</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Şifre</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-electric-600 hover:bg-electric-700 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Yönetici Paneline Gir"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
