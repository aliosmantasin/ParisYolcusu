"use client";

import { useEffect } from 'react';

// Tawk.to API için TypeScript tip tanımı
declare global {
  interface Window {
    Tawk_API?: {
      showWidget?: () => void;
      hideWidget?: () => void;
      toggle?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      onLoad?: (callback: () => void) => void;
      onStatusChange?: (callback: (status: string) => void) => void;
      onChatStarted?: (callback: () => void) => void;
      onChatEnded?: (callback: () => void) => void;
      onMaximize?: (callback: () => void) => void;
      onMinimize?: (callback: () => void) => void;
      onOfflineSubmit?: (callback: (data: Record<string, unknown>) => void) => void;
      setAttributes?: (attributes: Record<string, unknown>, callback?: () => void) => void;
      addEvent?: (event: string, metadata: Record<string, unknown>, callback?: () => void) => void;
      addTags?: (tags: string[], callback?: () => void) => void;
      removeTags?: (tags: string[], callback?: () => void) => void;
      getStatus?: () => string;
      isChatMaximized?: () => boolean;
      isChatMinimized?: () => boolean;
      isChatHidden?: () => boolean;
      isChatOngoing?: () => boolean;
      isVisitorEngaged?: () => boolean;
      getWindowType?: () => string;
      setCustomAttributes?: (attributes: Record<string, unknown>, callback?: () => void) => void;
      clearAll?: () => void;
      visitor?: {
        name: string;
        email: string;
        hash: string;
      };
      [key: string]: unknown; // Diğer özellikler için
    };
    Tawk_LoadStart?: Date;
  }
}

interface TawkToProps {
  propertyId?: string;
  widgetId?: string;
}

const TawkTo = ({ 
  propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID || '6946684563447e19862c4140',
  widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID || '1jctgekca'
}: TawkToProps) => {
  useEffect(() => {
    // Tawk.to script'ini yükle (Tawk.to'nun orijinal yöntemi)
    if (propertyId && widgetId && typeof window !== 'undefined') {
      // Eğer script zaten yüklenmişse tekrar yükleme
      if (window.Tawk_API) {
        return;
      }

      // Tawk.to'nun orijinal script yapısını kullan
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Google Ads dönüşüm takibi için dataLayer event gönderme fonksiyonu
      // Consent kontrolü GTM tag seviyesinde yapılıyor, burada her zaman gönderiyoruz
      const sendConversionEvent = (eventName: string, eventData?: Record<string, unknown>) => {
        if (typeof window !== 'undefined' && window.dataLayer) {
          const eventPayload: Record<string, unknown> = {
            event: eventName,
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            ...eventData
          };
          window.dataLayer.push(eventPayload as Parameters<typeof window.dataLayer.push>[0]);
          console.log(`[Tawk.to Conversion] ✅ Event sent to dataLayer: ${eventName}`, eventPayload);
        } else {
          console.error(`[Tawk.to Conversion] ❌ dataLayer not available for event: ${eventName}`);
        }
      };

      // Tawk.to widget z-index'ini cookie banner'ın altına almak için ayarla
      const setTawkToZIndex = () => {
        // Tawk.to widget'ının z-index'ini cookie banner'ın altına al
        if (window.Tawk_API && window.Tawk_API.setAttributes) {
          window.Tawk_API.setAttributes({
            zIndex: 30 // Cookie banner'dan düşük (banner: 2000000001)
          }, function() {
            console.log('[Tawk.to] Z-index set to 30');
          });
        }
        // Alternatif olarak CSS ile de ayarlayabiliriz
        const tawkWidget = document.querySelector('#tawkchat-container, .tawk-chat-container, iframe[src*="tawk.to"]');
        if (tawkWidget) {
          (tawkWidget as HTMLElement).style.zIndex = '30';
        }
      };

      // Tawk.to callback'lerini ayarla - Widget tıklaması ve mesaj başlatma için
      const setupCallbacks = () => {
        console.log('[Tawk.to] Callback\'leri ayarlıyoruz...');

        if (!window.Tawk_API) {
          console.error('[Tawk.to] Tawk_API mevcut değil!');
          return;
        }

        // Tawk.to yüklendiğinde
        if (window.Tawk_API.onLoad) {
          window.Tawk_API.onLoad(function() {
            console.log('[Tawk.to] ✅ Tawk.to yüklendi');
            setTawkToZIndex();
            
            // Widget'a tıklama tracking'i - Widget açıldığında (maximize olduğunda)
            setupWidgetClickTracking();
          });
        }

        // Chat başlatıldığında (kullanıcı ilk mesajı gönderdiğinde)
        // Bu en önemli conversion event'i - Google Ads için
        if (window.Tawk_API.onChatStarted) {
          window.Tawk_API.onChatStarted(function() {
            console.log('[Tawk.to] ✅✅✅ CHAT BAŞLATILDI - Mesaj gönderildi!');
            sendConversionEvent('tawk_to_chat_started', {
              event_category: 'Tawk.to',
              event_label: 'Message Started',
              conversion_type: 'message_started'
            });
          });
        }

        // Chat sona erdiğinde (opsiyonel, analitik için)
        if (window.Tawk_API.onChatEnded) {
          window.Tawk_API.onChatEnded(function() {
            console.log('[Tawk.to] Chat sona erdi');
          });
        }
      };

      // Widget'a tıklama tracking'i - Widget açıldığında (maximize olduğunda)
      const setupWidgetClickTracking = () => {
        let clickTracked = false;

        const trackWidgetClick = () => {
          if (clickTracked) return; // Zaten track edildiyse tekrar gönderme
          
          if (window.Tawk_API && window.Tawk_API.isChatMaximized) {
            try {
              const isMaximized = window.Tawk_API.isChatMaximized();
              
              if (isMaximized) {
                clickTracked = true;
                console.log('[Tawk.to] ✅✅✅ WIDGET AÇILDI - Tıklandı!');
                sendConversionEvent('tawk_click_id', {
                  event_category: 'Tawk.to',
                  event_label: 'Widget Clicked',
                  conversion_type: 'widget_click'
                });
                return true; // Track edildi
              }
            } catch (error) {
              console.warn('[Tawk.to] isChatMaximized hatası:', error);
            }
          }
          return false; // Henüz track edilmedi
        };

        // onMaximize callback'i varsa kullan (en güvenilir yöntem)
        if (window.Tawk_API && window.Tawk_API.onMaximize) {
          window.Tawk_API.onMaximize(function() {
            if (!clickTracked) {
              clickTracked = true;
              console.log('[Tawk.to] ✅✅✅ WIDGET AÇILDI (onMaximize callback) - Tıklandı!');
              sendConversionEvent('tawk_click_id', {
                event_category: 'Tawk.to',
                event_label: 'Widget Clicked',
                conversion_type: 'widget_click'
              });
            }
          });
          console.log('[Tawk.to] ✅ onMaximize callback ayarlandı');
        }

        // Fallback: Widget durumunu periyodik kontrol et (her 200ms'de bir, daha hızlı)
        let checkInterval: NodeJS.Timeout | null = null;
        let checkCount = 0;
        const maxChecks = 150; // 30 saniye (150 * 200ms)

        checkInterval = setInterval(() => {
          checkCount++;
          
          if (trackWidgetClick() || checkCount >= maxChecks) {
            if (checkInterval) {
              clearInterval(checkInterval);
              checkInterval = null;
            }
          }
        }, 200);

        // Ayrıca ilk kontrolleri hemen yap (daha agresif)
        trackWidgetClick();
        setTimeout(() => trackWidgetClick(), 100);
        setTimeout(() => trackWidgetClick(), 300);
        setTimeout(() => trackWidgetClick(), 500);
        setTimeout(() => trackWidgetClick(), 1000);
        setTimeout(() => trackWidgetClick(), 2000);
      };

      (function() {
        const s1 = document.createElement('script');
        const s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s1.onload = () => {
          console.log('[Tawk.to] Script yüklendi');
          
          // Tawk.to API'nin tamamen hazır olması için bekle
          const waitForTawkAPI = setInterval(() => {
            if (window.Tawk_API && typeof window.Tawk_API.onLoad === 'function') {
              clearInterval(waitForTawkAPI);
              console.log('[Tawk.to] ✅ Tawk_API hazır, callback\'leri ayarlıyoruz...');
              setupCallbacks();
            }
          }, 100);
          
          // 10 saniye sonra timeout - callback'leri yine de ayarla
          setTimeout(() => {
            clearInterval(waitForTawkAPI);
            if (window.Tawk_API) {
              console.log('[Tawk.to] ⚠️ Timeout sonrası callback\'leri ayarlıyoruz...');
              setupCallbacks();
            }
          }, 10000);
        };
        if (s0 && s0.parentNode) {
          s0.parentNode.insertBefore(s1, s0);
        } else {
          document.head.appendChild(s1);
        }
      })();

      // Cleanup function
      return () => {
        // Component unmount olduğunda script'i kaldır
        const existingScript = document.querySelector(`script[src*="tawk.to/${propertyId}"]`);
        if (existingScript) {
          existingScript.remove();
        }
        // Tawk_API'yi temizle
        if (window.Tawk_API) {
          delete window.Tawk_API;
        }
        if (window.Tawk_LoadStart) {
          delete window.Tawk_LoadStart;
        }
      };
    }
      }, [propertyId, widgetId]);


  return (
    <div 
      id="tawk-to-wrapper" 
      className="tawk-to-wrapper"
      style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 30 }}
    >
      {/* Tawk.to widget bu div içinde yüklenecek */}
      {/* Conversion tracking: Tawk.to API callback'leri kullanılıyor */}
      {/* Events: tawk_click_id (widget açıldığında) ve tawk_to_chat_started (mesaj gönderildiğinde) */}
    </div>
  );
};

export default TawkTo;

