import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { cleanIPAddress, getIPGeolocation, parseUserAgent } from '@/src/lib/ip-geolocation';
import { Prisma } from '@prisma/client';

/**
 * Click tracking endpoint
 * Client-side'den gelen tıklama verilerini kaydeder
 */
export async function POST(request: NextRequest) {
  try {
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
      path,
      clickCount,
      isSuspicious,
      intervals,
      isRegularPattern,
      emptySpaceClicks = 0, // Boş tıklama sayısı
    } = body;

    // IP adresini al
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    const cleanIP = cleanIPAddress(ipAddress);
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    // User-Agent'tan cihaz bilgilerini parse et
    const deviceInfo = parseUserAgent(userAgent);

    // IP geolocation bilgilerini al (asenkron, await etmeden)
    // Not: Bu işlem biraz zaman alabilir, bu yüzden kayıt işlemini bekletmeden yapıyoruz
    const geolocationPromise = getIPGeolocation(cleanIP);

    // Performans optimizasyonu: Sadece gerçekten şüpheli aktivite varsa veritabanı sorgusu yap
    // Client-side'da zaten filtreleme yapıldı, buraya gelenler şüpheli
    // Ancak yine de duplicate kontrolü için son 1 dakikadaki kaydı kontrol et
    const oneMinuteAgo = new Date(Date.now() - 60000);
    
    // Sadece şüpheli aktivite varsa veya yüksek click count varsa veritabanı sorgusu yap
    // Normal aktivite için sorgu yapma (performans için)
    // Not: Bu endpoint'e sadece şüpheli aktivite tespit edildiğinde gelir (ClickTracker'da filtreleme var)
    const existingLog = await prisma.iPLog.findFirst({
      where: {
        ipAddress: cleanIP,
        path: path || '/',
        method: 'CLICK',
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      // Sadece gerekli alanları seç (performans için)
      select: {
        id: true,
        clickRate: true,
        botScore: true,
        isSuspicious: true,
      },
    });

    if (existingLog) {
      // Mevcut kaydı güncelle (tıklama sayısını artır)
      const existingClickRate = (existingLog.clickRate as number) || 0;
      const updatedClickRate = existingClickRate + (clickCount || 1);
      
      // Bot skorunu yeniden hesapla
      const existingBotScore = (existingLog.botScore as number) || 0;
      let newBotScore = existingBotScore;
      
      // Tıklama sayısına göre bot skorunu artır
      if (clickCount >= 10) {
        newBotScore += 20;
      } else if (clickCount >= 5) {
        newBotScore += 10;
      }
      
      // Boş tıklama kontrolü (botlar genelde boş alanlara tıklar)
      if (emptySpaceClicks >= 10) {
        newBotScore += 30;
      } else if (emptySpaceClicks >= 5) {
        newBotScore += 20;
      } else if (emptySpaceClicks >= 3) {
        newBotScore += 10;
      }
      
      // Düzenli pattern tespiti
      if (isRegularPattern) {
        newBotScore += 15;
      }
      
      // Çok hızlı tıklama (200ms'den hızlı)
      if (intervals && intervals.length > 0) {
        const fastClicks = intervals.filter((interval: number) => interval < 200).length;
        if (fastClicks >= 3) {
          newBotScore += 15;
        }
      }

      // Skor 0-100 arası
      newBotScore = Math.min(100, newBotScore);

      const updateData = {
        clickRate: updatedClickRate,
        botScore: newBotScore,
        isSuspicious: newBotScore >= 50 || isSuspicious,
      } as Prisma.IPLogUpdateInput;

      await prisma.iPLog.update({
        where: { id: existingLog.id },
        data: updateData,
      });

      return NextResponse.json({ success: true, updated: true }, { status: 200 });
    }

    // Yeni kayıt oluştur (sadece gerçekten şüpheli aktivite varsa - daha yüksek eşik)
    if (isSuspicious || clickCount >= 10 || emptySpaceClicks >= 5) {
      // Bot skorunu hesapla
      let botScore = 0;
      
      if (clickCount >= 10) {
        botScore += 30;
      } else if (clickCount >= 5) {
        botScore += 15;
      }
      
      // Boş tıklama kontrolü (botlar genelde boş alanlara tıklar)
      if (emptySpaceClicks >= 10) {
        botScore += 30;
      } else if (emptySpaceClicks >= 5) {
        botScore += 20;
      } else if (emptySpaceClicks >= 3) {
        botScore += 10;
      }
      
      if (isRegularPattern) {
        botScore += 20;
      }
      
      if (intervals && intervals.length > 0) {
        const fastClicks = intervals.filter((interval: number) => interval < 200).length;
        if (fastClicks >= 3) {
          botScore += 15;
        }
      }

      botScore = Math.min(100, botScore);

      const createData = {
        ipAddress: cleanIP,
        userAgent: userAgent,
        referer: referer,
        path: path || '/',
        method: 'CLICK', // Özel method: sayfa içi tıklama
        userId: null,
        sessionId: null,
        clickRate: clickCount || 1,
        botScore: botScore,
        isSuspicious: botScore >= 50 || isSuspicious,
        // Trafik kaynağı bilgileri yok (sayfa içi tıklama)
        trafficSource: null,
        trafficMedium: null,
        // Cihaz bilgileri
        deviceType: deviceInfo.deviceType || null,
        deviceBrand: deviceInfo.deviceBrand || null,
        deviceModel: deviceInfo.deviceModel || null,
        browserName: deviceInfo.browserName || null,
        browserVersion: deviceInfo.browserVersion || null,
        osName: deviceInfo.osName || null,
        osVersion: deviceInfo.osVersion || null,
      } as Prisma.IPLogCreateInput;

      // IP kaydı oluştur (geolocation gelene kadar beklemeyiz)
      prisma.iPLog
        .create({
          data: createData,
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
              // Development'ta log
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Click Tracking] Geolocation güncellendi: ${cleanIP} -> ${geoData?.country || 'N/A'}, ${geoData?.city || 'N/A'}`);
              }
            } else if (process.env.NODE_ENV === 'development') {
              console.log(`[Click Tracking] Geolocation bilgisi yok: ${cleanIP} (localhost veya private IP)`);
            }
          } catch (error) {
            // Geolocation güncelleme hatası, sessizce devam et
            console.error('Click tracking geolocation güncelleme hatası:', error);
          }
        })
        .catch((error) => {
          // Hataları sessizce logla, endpoint'i yavaşlatma
          console.error('Click tracking kayıt hatası:', error);
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Hata olsa bile 200 döndür, client-side'ı yavaşlatma
    console.error('Click tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

