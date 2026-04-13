import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateWithRetry(model: any, params: any[], maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.generateContent(params);
    } catch (error: any) {
      if (error.status === 503 || (error.message && error.message.includes("503"))) {
        if (i === maxRetries - 1) throw error;
        const delay = 2000 * (i + 1);
        console.warn(`Model is overloaded (503). Retrying in ${delay}ms... (Attempt ${i + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    // Knowledge verisini src/data/knowledge.json'dan çekiyoruz
    const knowledgePath = path.join(process.cwd(), 'src/data/knowledge.json');
    let knowledge = [];
    try {
      const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
      knowledge = JSON.parse(knowledgeData);
    } catch (e) {
      console.warn("Knowledge base not found or empty");
    }

    if (!file) {
      return NextResponse.json({ error: "PDF dosyası bulunamadı" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(bytes).toString('base64');

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Sembol görsellerini Ground Truth olarak hazırla
    const symbolParts = knowledge
      .filter((k: any) => k.image)
      .map((k: any) => {
        const base64Data = k.image.split('base64,')[1];
        const mimeType = k.image.split(';')[0].split(':')[1];
        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };
      });

    const systemPrompt = `Sen bir Elektrik Devre Analiz Uzmanısın. Kullanıcı sana bir PDF devre şeması ve beraberinde 'Ground Truth' asistan görselleri sağlıyor.
    
GÖREVLERİN:
1. Şemadaki tüm elemanları tespit et.
2. SANA SAĞLANAN SEMBOL GÖRSELLERİNİ kullanarak şemadaki bileşenleri tanımla.
3. Kullanıcının tanımlarına göre şemayı kontrol et. Tanımlanan bileşenlerin özellikleri:
${knowledge.map((k: any) => `* ${k.name}: ${k.description} (Mantık: ${k.logic})`).join('\n')}

6. Çizim hatalarını, uçuşan (bağlantısı kopuk) kabloları işaret et.
7. DİNAMİK SİMÜLASYON (Sanal Enerjilendirme): Devreye sanal olarak enerji verildiğini varsay. Akım yollarını adım adım takip ederek sistemi tüm olası senaryolarda sanal olarak çalıştır.
8. HATA, GÜVENLİK VE MANTIK TESTİ:
   - Başlangıç anında veya butonlara basıldığında herhangi bir "Kısa Devre" (Short Circuit) ihtimali var mı?
   - Röle/Kontaktörlerin NO/NC kontak yapılandırmaları mantıksal olarak doğru mu? Hatalı kilitlenme veya ters çalışma var mı?
   - Bu devre gerçek bir panoda bu haliyle tam fonksiyonlu çalışır mı? Nokta atışı tespit yap.

Lütfen profesyonel bir teknik dille analiz sun. Özellikle sağlanan sembol görselleriyle şemadaki elemanlar arasındaki eşleşmeleri vurgula.`;

    const result = await generateWithRetry(model, [
      systemPrompt,
      {
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf"
        }
      },
      ...symbolParts
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error: any) {
    console.error("AI Analysis API Error:", error);
    return NextResponse.json({ error: "Analiz başarısız oldu: " + error.message }, { status: 500 });
  }
}
