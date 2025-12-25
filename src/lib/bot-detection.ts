import { prisma } from './db';

export interface BotAnalysisResult {
  score: number; // 0-100 arası, yüksek = daha şüpheli
  isSuspicious: boolean; // 50+ skor = şüpheli
  clickRate: number; // Dakikada tıklama sayısı
  reasons: string[]; // Şüpheli olma nedenleri
}

/**
 * Bot skoru hesaplama fonksiyonu
 * Trafik kaynağına göre özel analiz yapar
 */
export async function calculateBotScore(
  ipAddress: string,
  path: string,
  trafficSource: string | null
): Promise<BotAnalysisResult> {
  const reasons: string[] = [];
  let score = 0;
  
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const fiveMinutesAgo = new Date(Date.now() - 300000);
  const oneHourAgo = new Date(Date.now() - 3600000);
  
  // 1. Agresif tıklama analizi
  // Sayfa navigasyonları (GET method)
  const pageNavigations1min = await prisma.iPLog.count({
    where: {
      ipAddress,
      method: 'GET',
      createdAt: { gte: oneMinuteAgo },
    },
  });
  
  // Sayfa içi tıklamalar (CLICK method)
  const pageClicks1min = await prisma.iPLog.count({
    where: {
      ipAddress,
      method: 'CLICK',
      createdAt: { gte: oneMinuteAgo },
    },
  });
  
  const totalLogs5min = await prisma.iPLog.count({
    where: {
      ipAddress,
      createdAt: { gte: fiveMinutesAgo },
    },
  });
  
  const totalLogs1hour = await prisma.iPLog.count({
    where: {
      ipAddress,
      createdAt: { gte: oneHourAgo },
    },
  });
  
  // Toplam click rate (sayfa navigasyonları + sayfa içi tıklamalar)
  const totalClicks1min = pageNavigations1min + pageClicks1min;
  const clickRate = totalClicks1min;
  
  // 2. Bot skoru hesaplama - Genel kurallar
  // Sayfa içi tıklamalar daha şüpheli (botlar genelde boşluğa veya butonlara tıklar)
  if (pageClicks1min > 5) {
    score += 25;
    reasons.push(`1 dakikada ${pageClicks1min} sayfa içi tıklama (şüpheli)`);
  }
  if (pageClicks1min > 10) {
    score += 20;
    reasons.push(`Aşırı agresif sayfa içi tıklama: ${pageClicks1min}/dakika`);
  }
  
  // Toplam tıklama (navigasyon + sayfa içi)
  if (totalClicks1min > 10) {
    score += 30;
    reasons.push(`1 dakikada ${totalClicks1min} toplam tıklama (normal: <3)`);
  }
  if (totalClicks1min > 20) {
    score += 20;
    reasons.push(`Aşırı agresif tıklama: ${totalClicks1min}/dakika`);
  }
  if (totalLogs5min > 30) {
    score += 25;
    reasons.push(`5 dakikada ${totalLogs5min} tıklama`);
  }
  if (totalLogs1hour > 100) {
    score += 25;
    reasons.push(`1 saatte ${totalLogs1hour} tıklama (şüpheli)`);
  }
  
  // Click rate yüksekse
  if (clickRate > 10) {
    score += 15;
    reasons.push(`Yüksek click rate: ${clickRate} tık/dk`);
  }
  
  // 3. Trafik kaynağına özel analiz
  if (trafficSource === 'google_ads' || trafficSource === 'meta_ads') {
    const adClicks1min = await prisma.iPLog.count({
      where: {
        ipAddress,
        trafficSource,
        createdAt: { gte: oneMinuteAgo },
      },
    });
    
    const adClicks5min = await prisma.iPLog.count({
      where: {
        ipAddress,
        trafficSource,
        createdAt: { gte: fiveMinutesAgo },
      },
    });
    
    // Reklam trafiğinde daha düşük eşikler
    if (adClicks1min > 5) {
      score += 20;
      reasons.push(`${trafficSource}: 1 dakikada ${adClicks1min} reklam tıklaması`);
    }
    if (adClicks5min > 15) {
      score += 20;
      reasons.push(`${trafficSource}: 5 dakikada ${adClicks5min} reklam tıklaması`);
    }
  }
  
  // 4. Aynı sayfaya tekrar tekrar tıklama
  const recentLogs = await prisma.iPLog.findMany({
    where: {
      ipAddress,
      createdAt: { gte: fiveMinutesAgo },
    },
    select: { path: true },
  });
  
  const pathCounts = recentLogs.reduce((acc, log) => {
    acc[log.path] = (acc[log.path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const samePathClicks = pathCounts[path] || 0;
  if (samePathClicks > 3) {
    score += 15;
    reasons.push(`Aynı sayfaya ${samePathClicks} kez tıklama: ${path}`);
  }
  
  // Çok fazla tekrarlayan path
  const repeatedPaths = Object.entries(pathCounts)
    .filter(([, count]) => count > 3)
    .length;
  
  if (repeatedPaths > 0) {
    score += 10;
    reasons.push(`${repeatedPaths} farklı sayfaya tekrar tekrar tıklama`);
  }
  
  // 5. Çok az farklı sayfa (botlar genelde sınırlı sayıda sayfaya tıklar)
  const uniquePaths = new Set(recentLogs.map(l => l.path)).size;
  if (totalLogs5min > 20 && uniquePaths < 3) {
    score += 20;
    reasons.push(`Çok fazla tıklama ama sadece ${uniquePaths} farklı sayfa`);
  }
  
  // 6. User-Agent analizi (bot tespiti)
  const recentUserAgents = await prisma.iPLog.findMany({
    where: {
      ipAddress,
      createdAt: { gte: fiveMinutesAgo },
    },
    select: { userAgent: true, deviceType: true },
    distinct: ['userAgent'],
  });
  
  const botUserAgents = recentUserAgents.filter(ua => 
    ua.deviceType === 'bot' || 
    (ua.userAgent && (
      ua.userAgent.toLowerCase().includes('bot') ||
      ua.userAgent.toLowerCase().includes('crawler') ||
      ua.userAgent.toLowerCase().includes('spider') ||
      ua.userAgent.toLowerCase().includes('scraper')
    ))
  );
  
  if (botUserAgents.length > 0) {
    score += 30;
    reasons.push('Bot User-Agent tespit edildi');
  }
  
  // 7. Coğrafi tutarsızlık (aynı IP'den farklı ülkeler - proxy/VPN)
  const recentCountries = await prisma.iPLog.findMany({
    where: {
      ipAddress,
      createdAt: { gte: oneHourAgo },
    },
    select: { country: true },
    distinct: ['country'],
  });
  
  const uniqueCountries = recentCountries.filter(c => c.country).length;
  if (uniqueCountries > 3 && totalLogs1hour > 20) {
    score += 10;
    reasons.push(`Aynı IP'den ${uniqueCountries} farklı ülke (proxy/VPN şüphesi)`);
  }
  
  // Skor 0-100 arası
  score = Math.min(100, score);
  
  return {
    score,
    isSuspicious: score >= 50, // 50+ = şüpheli
    reasons,
    clickRate,
  };
}

