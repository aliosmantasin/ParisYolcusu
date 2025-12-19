import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      date, 
      time, 
      passengers, 
      vehicle, 
      origin, 
      destination, 
      distance, 
      duration, 
      recaptchaToken 
    } = await req.json();

    console.log("📨 Gelen rezervasyon verisi:", { 
      firstName, 
      lastName, 
      email, 
      phone, 
      date, 
      time, 
      passengers, 
      vehicle, 
      origin, 
      destination, 
      distance, 
      duration, 
      recaptchaToken 
    });

    // reCAPTCHA doğrulaması
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );
    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      return NextResponse.json({ message: 'reCAPTCHA doğrulaması başarısız' }, { status: 400 });
    }

    // Nodemailer yapılandırması
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT as string, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Tarih ve saat formatlaması
    const formattedDate = new Date(date).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Müşteriye gönderilecek email
    const customerEmail = {
      from: `"Paris Yolcusu" <${process.env.EMAIL}>`,
      to: email,
      subject: "Rezervasyon Onayı - Paris Yolcusu",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rezervasyon Onayı</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #f8f9fa;
              border-bottom: 2px solid #1e74bd;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #1e74bd;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h2 {
              color: #1e74bd;
              margin-bottom: 20px;
              font-size: 24px;
              text-align: center;
            }
            h3 {
              color: #2c3e50;
              margin-top: 25px;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .details ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .details li {
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .details li:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              margin-top: 30px;
              border-radius: 8px;
              border-top: 2px solid #1e74bd;
            }
            .contact-info {
              margin-top: 15px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">Paris Yolcusu</div>
              <h2>Rezervasyon Onayı</h2>
            </div>
            
            <div class="content">
              <p>Sayın <strong>${firstName} ${lastName}</strong>,</p>
              
              <p>Rezervasyonunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
              
              <h3>Rezervasyon Detayları</h3>
              <div class="details">
                <ul>
                  <li><strong>Ad Soyad:</strong> ${firstName} ${lastName}</li>
                  <li><strong>Telefon:</strong> ${phone}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Tarih ve Saat:</strong> ${formattedDate}</li>
                  <li><strong>Yolcu Sayısı:</strong> ${passengers}</li>
                  <li><strong>Araç:</strong> ${vehicle}</li>
                  <li><strong>Alış Noktası:</strong> ${origin}</li>
                  <li><strong>Varış Noktası:</strong> ${destination}</li>
                  ${distance ? `<li><strong>Mesafe:</strong> ${distance}</li>` : ''}
                  ${duration ? `<li><strong>Tahmini Süre:</strong> ${duration}</li>` : ''}
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Saygılarımızla,<br><strong>Paris Yolcusu</strong></p>
              <div class="contact-info">
                <p>Email: info@parisyolcusu.com<br>
                Tel: +33 651 150 547</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Şirkete gönderilecek email
    const companyEmail = {
      from: `"Paris Yolcusu" <${process.env.EMAIL}>`,
      // to: `paris.yolcusu.info@gmail.com`,
      to: `sosyalsettobox@gmail.com`,
      subject: "Yeni Rezervasyon Talebi",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yeni Rezervasyon Talebi</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #f8f9fa;
              border-bottom: 2px solid #1e74bd;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #1e74bd;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h2 {
              color: #1e74bd;
              margin-bottom: 20px;
              font-size: 24px;
              text-align: center;
            }
            h3 {
              color: #2c3e50;
              margin-top: 25px;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .details ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .details li {
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .details li:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              margin-top: 30px;
              border-radius: 8px;
              border-top: 2px solid #1e74bd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">Paris Yolcusu</div>
              <h2>Yeni Rezervasyon Talebi</h2>
            </div>
            
            <div class="content">
              <h3>Misafirimizin Bilgileri</h3>
              <div class="details">
                <ul>
                  <li><strong>Ad Soyad:</strong> ${firstName} ${lastName}</li>
                  <li><strong>Telefon:</strong> ${phone}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Tarih ve Saat:</strong> ${formattedDate}</li>
                  <li><strong>Yolcu Sayısı:</strong> ${passengers}</li>
                  <li><strong>Araç:</strong> ${vehicle}</li>
                  <li><strong>Alış Noktası:</strong> ${origin}</li>
                  <li><strong>Varış Noktası:</strong> ${destination}</li>
                  ${distance ? `<li><strong>Mesafe:</strong> ${distance}</li>` : ''}
                  ${duration ? `<li><strong>Tahmini Süre:</strong> ${duration}</li>` : ''}
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Bu email otomatik olarak gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      // Her iki emaili de gönder
      const [customerResult, companyResult] = await Promise.all([
        transporter.sendMail(customerEmail),
        transporter.sendMail(companyEmail),
      ]);

      console.log("📧 Müşteri email sonucu:", customerResult);
      console.log("📧 Şirket email sonucu:", companyResult);

      return NextResponse.json({ message: 'Rezervasyon başarıyla gönderildi' });
    } catch (emailError) {
      console.error("📧 Email gönderim hatası:", emailError);
      return NextResponse.json({ message: 'Email gönderilirken bir hata oluştu' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Hatası:', error);
    return NextResponse.json({ message: 'Bir hata oluştu' }, { status: 500 });
  }
} 