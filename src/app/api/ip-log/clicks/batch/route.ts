import { NextRequest, NextResponse } from 'next/server';
import { cleanIPAddress } from '@/src/lib/ip-geolocation';
import { clickQueue } from '@/src/lib/click-queue';

/**
 * Click target information interface
 */
export interface ClickTargetInfo {
  tagName: string;
  className: string;
  elementId: string; // 'id' yerine 'elementId' kullanıyoruz (IndexedDB keyPath ile çakışmaması için)
  text: string;
  href: string;
}

export async function POST(request: NextRequest) {
  try {
    // IP adresini al
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    const cleanIP = cleanIPAddress(ipAddress);

    // Body'yi parse et (JSON veya Blob)
    let body;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      // sendBeacon'dan gelen Blob
      const blob = await request.blob();
      const text = await blob.text();
      body = JSON.parse(text);
    }

    const { clicks, path } = body;

    if (!clicks || !Array.isArray(clicks) || clicks.length === 0) {
      return NextResponse.json({ success: true, queued: false });
    }

    // Queue'ya ekle
    clickQueue.push({
      ipAddress: cleanIP,
      clicks: clicks || [],
      path: path || '/',
      timestamp: Date.now(),
    });

    // Queue çok büyürse eski kayıtları temizle (max 1000 item)
    if (clickQueue.length > 1000) {
      clickQueue.splice(0, clickQueue.length - 1000);
    }

    // Hemen döndür (analiz yapma)
    return NextResponse.json({ success: true, queued: true });
  } catch (error) {
    // Hata olsa bile 200 döndür (client-side'ı bloklama)
    console.error('Batch click queue error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

