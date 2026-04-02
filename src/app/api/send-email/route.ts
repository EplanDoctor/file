import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { source, payload } = data;

    // source can be 'submit-problem', 'macro-service', 'proje-teklifi'
    let subject = '';
    let htmlContent = '';

    if (source === 'submit-problem') {
      subject = 'Sorun Bildirimi';
      htmlContent = `
        <h2>Yeni Bir Sorun Bildirimi Alındı</h2>
        <p><strong>Başlık/Hata Kodu:</strong> ${payload.title}</p>
        <p><strong>Kategori:</strong> ${payload.category}</p>
        <p><strong>Açıklama:</strong> <br/> ${payload.description}</p>
      `;
    } else if (source === 'macro-service') {
      subject = 'Makro Talebi Oluştur';
      htmlContent = `
        <h2>Yeni Bir Makro Talebi Alındı</h2>
        <p><strong>Ad Soyad:</strong> ${payload.fullName}</p>
        <p><strong>Firma Adı:</strong> ${payload.companyName}</p>
        <p><strong>Cihaz / İhtiyaç Özeti:</strong> ${payload.summary}</p>
        <p><strong>Detaylar:</strong> <br/> ${payload.details}</p>
      `;
    } else if (source === 'proje-teklifi') {
      subject = 'Ücretsiz Proje Teklifi Al';
      htmlContent = `
        <h2>Yeni Bir Proje Teklifi Talebi Alındı</h2>
        <p><strong>İsim Soyisim:</strong> ${payload.fullName}</p>
        <p><strong>Telefon:</strong> ${payload.phone}</p>
        <p><strong>E-Posta / Şirket:</strong> ${payload.email}</p>
        <p><strong>Proje Tipi:</strong> ${payload.projectType}</p>
        <p><strong>Proje Detayları & İhtiyaçlar:</strong> <br/> ${payload.details}</p>
      `;
    } else {
      return NextResponse.json({ success: false, message: 'Geçersiz form kaynağı' }, { status: 400 });
    }

    // SMTP Ayarları
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'cnr.pano@gmail.com', // Gönderici adresi
        pass: process.env.SMTP_PASSWORD, // .env.local içerisinden alınacak uygulama şifresi
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL || 'cnr.pano@gmail.com',
      to: 'cnr.pano@gmail.com',
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ success: false, message: 'E-posta gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}
