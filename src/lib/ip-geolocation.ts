import { UAParser } from 'ua-parser-js';

// IPv4-mapped IPv6 adreslerini temizle (::ffff: prefix'ini kaldır)
// Localhost IP'lerini normalize et
export function cleanIPAddress(ip: string): string {
  if (!ip || ip === 'unknown') {
    return 'unknown';
  }
  
  // IPv4-mapped IPv6 adreslerini temizle (::ffff: prefix'ini kaldır)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  // IPv6 loopback adreslerini IPv4'e çevir
  if (ip === '::1' || ip === '::') {
    return '127.0.0.1';
  }
  
  // IPv6 localhost varyasyonları
  if (ip === '0:0:0:0:0:0:0:1' || ip === '0000:0000:0000:0000:0000:0000:0000:0001') {
    return '127.0.0.1';
  }
  
  return ip;
}

// IP geolocation bilgilerini al (ip-api.com - ücretsiz, dakikada 45 istek)
export async function getIPGeolocation(ip: string): Promise<{
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  timezone?: string;
  isp?: string;
} | null> {
  try {
    const cleanIP = cleanIPAddress(ip);
    
    // Localhost ve private IP'ler için null döndür
    if (cleanIP === '127.0.0.1' || cleanIP === 'localhost' || cleanIP.startsWith('192.168.') || cleanIP.startsWith('10.') || cleanIP.startsWith('172.')) {
      return null;
    }

    // ip-api.com - ücretsiz API (dakikada 45 istek limiti)
    const response = await fetch(`http://ip-api.com/json/${cleanIP}?fields=status,message,country,countryCode,city,regionName,timezone,isp`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.status === 'fail') {
      return null;
    }

    return {
      country: data.country || null,
      countryCode: data.countryCode || null,
      city: data.city || null,
      region: data.regionName || null,
      timezone: data.timezone || null,
      isp: data.isp || null,
    };
  } catch (error) {
    // Hata durumunda sessizce null döndür, loglama yapma (çok fazla log oluşturur)
    return null;
  }
}

// User-Agent'tan cihaz bilgilerini parse et
export function parseUserAgent(userAgent: string | null): {
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
} {
  if (!userAgent) {
    return {};
  }

  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Device type belirleme
    let deviceType: string | undefined;
    if (result.device.type) {
      deviceType = result.device.type; // mobile, tablet
    } else {
      // Eğer device type yoksa, OS'e göre tahmin et
      const osName = result.os.name?.toLowerCase() || '';
      if (osName.includes('android') || osName.includes('ios') || osName.includes('windows phone')) {
        deviceType = 'mobile';
      } else if (osName.includes('windows') || osName.includes('mac') || osName.includes('linux')) {
        deviceType = 'desktop';
      } else {
        deviceType = 'unknown';
      }
    }

    // Bot kontrolü (device.type 'bot' olamaz, bu yüzden UA ve browser kontrolü yapıyoruz)
    const uaLower = result.ua?.toLowerCase() || '';
    const browserNameLower = result.browser.name?.toLowerCase() || '';
    if (uaLower.includes('bot') || browserNameLower.includes('bot') || uaLower.includes('crawler') || uaLower.includes('spider')) {
      deviceType = 'bot';
    }

    return {
      deviceType,
      deviceBrand: result.device.vendor || undefined,
      deviceModel: result.device.model || undefined,
      browserName: result.browser.name || undefined,
      browserVersion: result.browser.version || undefined,
      osName: result.os.name || undefined,
      osVersion: result.os.version || undefined,
    };
  } catch (error) {
    return {};
  }
}

