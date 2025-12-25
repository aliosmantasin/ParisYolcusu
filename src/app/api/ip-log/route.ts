import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { getIPGeolocation, parseUserAgent, cleanIPAddress } from '@/src/lib/ip-geolocation';
// Bot skoru hesaplama geçici olarak devre dışı - performans için
// import { calculateBotScore } from '@/src/lib/bot-detection';

export async function POST(request: NextRequest) {
  try {
    // Trafik loglama devre dışı mı?
    if (process.env.ENABLE_TRAFFIC_LOGGING === 'false') {
      return NextResponse.json({ message: 'Traffic logging disabled' }, { status: 200 });
    }

    // sendBeacon Blob gönderir, normal fetch JSON gönderir
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      // Blob'dan JSON'a çevir
      const blob = await request.blob();
      const text = await blob.text();
      body = JSON.parse(text);
    }

    const { 
      // Client-side'dan gelen veriler (path, method, UTM parametreleri vb.)
      path, 
      method, 
      // Trafik kaynağı bilgileri
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      fbclid,
      trafficSource,
      trafficMedium,
      detectionMethod,
    } = body;

    // Debug: Trafik kaynağı bilgilerini logla (production'da kaldırılabilir)
    if (process.env.NODE_ENV === 'development') {
      console.log('[IP Log] Traffic source data:', {
        gclid,
        fbclid,
        trafficSource,
        trafficMedium,
        detectionMethod,
        utmSource,
        utmMedium,
        path,
      });
    }

    // IP adresini header'lardan al (client-side'dan gelmez, güvenlik için)
    // Öncelik sırası: x-forwarded-for > x-real-ip > cf-connecting-ip > request.ip
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
        // x-forwarded-for birden fazla IP içerebilir (proxy chain), ilkini al
        const ipAddress = 
          (forwardedFor?.split(',')[0]?.trim()) || 
          realIP || 
          cfConnectingIP || 
          'unknown';
    
    // User-Agent ve Referer header'lardan al
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;
    
    // Session ID cookie'den al (opsiyonel)
    const sessionId = request.cookies.get('sessionId')?.value || null;
    const userId: string | null = null; // Token'dan çıkarılabilir, şimdilik null

    // IP adresini temizle (::ffff: prefix'ini kaldır)
    const cleanIP = cleanIPAddress(ipAddress || 'unknown');
    
    // User-Agent'tan cihaz bilgilerini parse et
    const deviceInfo = parseUserAgent(userAgent);

    // IP geolocation bilgilerini al (asenkron, await etmeden)
    // Not: Bu işlem biraz zaman alabilir, bu yüzden kayıt işlemini bekletmeden yapıyoruz
    const geolocationPromise = getIPGeolocation(cleanIP);
    
    // Bot skoru hesaplama KALDIRILDI - Performans için
    // Not: Bot skoru hesaplama çok maliyetli (10+ veritabanı sorgusu)
    // İleride background job olarak çalıştırılabilir veya sadece şüpheli durumlarda yapılabilir
    // Şimdilik bot skoru hesaplamıyoruz - performans öncelikli

    // Önce temel kaydı oluştur
    const logData = {
      ipAddress: cleanIP,
      userAgent: userAgent || null,
      referer: referer || null,
      path: path || '/',
      method: method || 'GET',
      userId: userId || null,
      sessionId: sessionId || null,
      // Trafik kaynağı bilgileri
      // Boş string'leri null'a çevir, ama undefined'ları da null'a çevir
      utmSource: utmSource && utmSource.trim() ? utmSource.trim() : null,
      utmMedium: utmMedium && utmMedium.trim() ? utmMedium.trim() : null,
      utmCampaign: utmCampaign && utmCampaign.trim() ? utmCampaign.trim() : null,
      utmTerm: utmTerm && utmTerm.trim() ? utmTerm.trim() : null,
      utmContent: utmContent && utmContent.trim() ? utmContent.trim() : null,
      gclid: gclid && gclid.trim() ? gclid.trim() : null,
      fbclid: fbclid && fbclid.trim() ? fbclid.trim() : null,
      // trafficSource boş string olsa bile null yapma, sadece undefined/null ise null yap
      trafficSource: trafficSource && trafficSource.trim() ? trafficSource.trim() : (trafficSource === '' ? null : trafficSource),
      trafficMedium: trafficMedium && trafficMedium.trim() ? trafficMedium.trim() : (trafficMedium === '' ? null : trafficMedium),
      detectionMethod: detectionMethod && detectionMethod.trim() ? detectionMethod.trim() : (detectionMethod === '' ? null : detectionMethod),
      // Cihaz bilgileri
      deviceType: deviceInfo.deviceType || null,
      deviceBrand: deviceInfo.deviceBrand || null,
      deviceModel: deviceInfo.deviceModel || null,
      browserName: deviceInfo.browserName || null,
      browserVersion: deviceInfo.browserVersion || null,
      osName: deviceInfo.osName || null,
      osVersion: deviceInfo.osVersion || null,
    };

    // IP kaydı oluştur (geolocation ve bot analizi gelene kadar beklemeyiz)
    prisma.iPLog
      .create({
        data: logData,
      })
      .then(async (log) => {
        // Geolocation bilgileri geldiğinde kaydı güncelle
        try {
          const geoData = await geolocationPromise;
          
          const updateData: {
            country?: string;
            countryCode?: string;
            city?: string;
            region?: string;
            timezone?: string;
            isp?: string;
          } = {};
          
          // Geolocation bilgilerini ekle
          if (geoData) {
            if (geoData.country) updateData.country = geoData.country;
            if (geoData.countryCode) updateData.countryCode = geoData.countryCode;
            if (geoData.city) updateData.city = geoData.city;
            if (geoData.region) updateData.region = geoData.region;
            if (geoData.timezone) updateData.timezone = geoData.timezone;
            if (geoData.isp) updateData.isp = geoData.isp;
          }
          
          // Güncelleme yap
          if (Object.keys(updateData).length > 0) {
            await prisma.iPLog.update({
              where: { id: log.id },
              data: updateData,
            });
          }
        } catch (error) {
          // Geolocation güncelleme hatası, sessizce devam et
          console.error('IP log güncelleme hatası:', error);
        }
      })
      .catch((error) => {
        // Hataları sessizce logla, middleware'i yavaşlatma
        console.error('IP log kayıt hatası:', error);
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Hata olsa bile 200 döndür, middleware'i yavaşlatma
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
