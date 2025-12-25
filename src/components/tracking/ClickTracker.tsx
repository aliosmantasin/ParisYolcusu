"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

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

/**
 * IndexedDB helper functions
 */
const DB_NAME = 'ClickTrackerDB';
const STORE_NAME = 'clicks';
const DB_VERSION = 1;

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function addClick(click: { timestamp: number; path: string; targetInfo: ClickTargetInfo }): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    // id alanını ekleme - autoIncrement otomatik olarak ekleyecek
    await store.add(click);
  } catch (error) {
    console.error('IndexedDB addClick error:', error);
  }
}

async function getAllClicks(): Promise<Array<{ timestamp: number; path: string; targetInfo: ClickTargetInfo }>> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB getAllClicks error:', error);
    return [];
  }
}

async function clearClicks(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.clear();
  } catch (error) {
    console.error('IndexedDB clearClicks error:', error);
  }
}

/**
 * Click Tracker Component
 * Tüm tıklamaları IndexedDB'ye kaydeder ve 60 saniyede bir batch olarak gönderir
 */
export function ClickTracker() {
  const pathname = usePathname();
  const batchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Admin sayfalarında takip etme
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }

    // Batch processing: Her 60 saniyede bir IndexedDB'deki tüm tıklamaları gönder
    batchIntervalRef.current = setInterval(async () => {
      try {
        const clicks = await getAllClicks();
        if (clicks.length > 0) {
          await sendBatchClicks(clicks);
          await clearClicks();
        }
      } catch (error) {
        console.error('Batch send error:', error);
      }
    }, 60000); // 60 saniyede bir

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Admin sayfalarında takip etme
      if (window.location.pathname.startsWith('/admin')) {
        return;
      }

      // requestAnimationFrame ile main thread'i bloklamadan işle
      requestAnimationFrame(async () => {
        const now = Date.now();
        
        // Tıklama hedefini analiz et
        // SVG element'lerinde className ve href SVGAnimatedString olabilir, string'e çevir
        let className = '';
        try {
          // className'i string'e çevir (SVG element'leri için)
          if (target.className) {
            if (typeof target.className === 'string') {
              className = target.className;
            } else if (typeof target.className === 'object' && target.className !== null && 'baseVal' in target.className) {
              // SVGAnimatedString için
              className = (target.className as { baseVal?: string }).baseVal || '';
            } else {
              className = String(target.className);
            }
          }
        } catch {
          className = '';
        }

        let href = '';
        try {
          // href'i string'e çevir (SVG element'leri için)
          const anchorElement = target as HTMLAnchorElement;
          if (anchorElement.href) {
            if (typeof anchorElement.href === 'string') {
              href = anchorElement.href;
            } else if (typeof anchorElement.href === 'object' && anchorElement.href !== null && 'baseVal' in anchorElement.href) {
              // SVGAnimatedString için
              href = (anchorElement.href as { baseVal?: string }).baseVal || '';
            } else {
              href = String(anchorElement.href);
            }
          }
        } catch {
          href = '';
        }

        const targetInfo: ClickTargetInfo = {
          tagName: target.tagName.toLowerCase(),
          className: className,
          elementId: target.id || '', // 'id' yerine 'elementId' kullanıyoruz
          text: (target.textContent?.substring(0, 50) || '').trim(),
          href: href,
        };

        // IndexedDB'ye kaydet (non-blocking)
        await addClick({
          timestamp: now,
          path: window.location.pathname,
          targetInfo,
        });
      });
    };

    // Tıklama event'ini dinle
    document.addEventListener('click', handleClick, true); // Capture phase'de dinle

    // Sayfa kapanırken de gönder (beforeunload)
    const handleBeforeUnload = async () => {
      try {
        const clicks = await getAllClicks();
        if (clicks.length > 0) {
          // sendBeacon kullan (sayfa kapanırken bile gönderir)
          await sendBatchClicks(clicks, true);
          await clearClicks();
        }
      } catch (error) {
        console.error('Beforeunload send error:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
      }
    };
  }, [pathname]);

  /**
   * Boş tıklama kontrolü
   * Boş alanlara (div, body, html) yapılan tıklamaları tespit eder
   */
  const isEmptySpaceClick = (targetInfo: ClickTargetInfo): boolean => {
    return (
      !targetInfo.href &&
      !targetInfo.elementId &&
      !targetInfo.className &&
      (targetInfo.tagName === 'div' || 
       targetInfo.tagName === 'body' || 
       targetInfo.tagName === 'html' ||
       targetInfo.tagName === 'section' ||
       targetInfo.tagName === 'main' ||
       targetInfo.tagName === 'article')
    );
  };

  const sendBatchClicks = async (
    clicks: Array<{ timestamp: number; path: string; targetInfo: ClickTargetInfo }>,
    useBeacon = false
  ) => {
    try {
      // Boş tıklamaları say
      const emptySpaceClicks = clicks.filter(c => isEmptySpaceClick(c.targetInfo)).length;
      const totalClicks = clicks.length;
      
      // Bot tespiti kriterleri
      const isSuspicious = 
        totalClicks >= 50 || // 60 saniyede 50+ tıklama
        (totalClicks >= 20 && emptySpaceClicks >= 5) || // 20+ tıklama ve 5+ boş tıklama
        emptySpaceClicks >= 10; // 10+ boş tıklama

      // Tıklamaları path'e göre grupla
      const clicksByPath = clicks.reduce((acc, click) => {
        if (!acc[click.path]) {
          acc[click.path] = [];
        }
        acc[click.path].push(click);
        return acc;
      }, {} as Record<string, typeof clicks>);

      // Her path için ayrı batch gönder
      for (const [path, pathClicks] of Object.entries(clicksByPath)) {
        // Path için boş tıklama sayısını hesapla
        const pathEmptyClicks = pathClicks.filter(c => isEmptySpaceClick(c.targetInfo)).length;
        
        // Tıklama aralıklarını hesapla (düzenli pattern tespiti için)
        const timestamps = pathClicks.map(c => c.timestamp).sort((a, b) => a - b);
        const intervals: number[] = [];
        for (let i = 1; i < timestamps.length; i++) {
          intervals.push(timestamps[i] - timestamps[i - 1]);
        }
        
        // Düzenli pattern tespiti (aralıklar çok benzer ise)
        let isRegularPattern = false;
        if (intervals.length >= 5) {
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
          const stdDev = Math.sqrt(variance);
          // Standart sapma ortalamanın %20'sinden küçükse düzenli pattern
          isRegularPattern = stdDev < avgInterval * 0.2 && avgInterval < 5000;
        }

        const batchData = JSON.stringify({
          clicks: pathClicks.map(c => ({
            timestamp: c.timestamp,
            targetInfo: c.targetInfo,
          })),
          path,
          clickCount: pathClicks.length,
          emptySpaceClicks: pathEmptyClicks,
          isSuspicious: isSuspicious || pathEmptyClicks >= 5,
          intervals,
          isRegularPattern,
        });

        // Şüpheli aktivite varsa direkt click endpoint'ine gönder (bot skoru hesaplansın)
        if (isSuspicious || pathEmptyClicks >= 5) {
          // Şüpheli aktivite için direkt click endpoint'ine gönder
          const clickData = {
            path,
            clickCount: pathClicks.length,
            emptySpaceClicks: pathEmptyClicks,
            isSuspicious: true,
            intervals,
            isRegularPattern,
          };

          if (useBeacon && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(clickData)], { type: 'application/json' });
            navigator.sendBeacon('/api/ip-log/click', blob);
          } else {
            await fetch('/api/ip-log/click', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(clickData),
              keepalive: true,
            }).catch(() => {
              // Hataları sessizce yok say
            });
          }
        } else {
          // Normal aktivite için batch endpoint'ine gönder (queue'ya eklenir)
          if (useBeacon && navigator.sendBeacon) {
            // Sayfa kapanırken sendBeacon kullan
            const blob = new Blob([batchData], { type: 'application/json' });
            navigator.sendBeacon('/api/ip-log/clicks/batch', blob);
          } else {
            // Normal durumda fetch with keepalive
            await fetch('/api/ip-log/clicks/batch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: batchData,
              keepalive: true,
            }).catch(() => {
              // Hataları sessizce yok say
            });
          }
        }
      }
    } catch (error) {
      // Hata olsa bile sessizce devam et
      console.error('Batch click send error:', error);
    }
  };

  return null; // Bu component görsel bir şey render etmez
}

