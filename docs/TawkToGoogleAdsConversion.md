# Tawk.to Chat ve Google Ads Dönüşüm Takibi

Bu dokümantasyon, Tawk.to chat sisteminin projeye entegrasyonunu ve Google Ads dönüşüm takibinin nasıl kurulduğunu açıklar.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Kod Entegrasyonu](#kod-entegrasyonu)
3. [Google Tag Manager Kurulumu](#google-tag-manager-kurulumu)
4. [Google Ads Conversion Action Kurulumu](#google-ads-conversion-action-kurulumu)
5. [Test ve Doğrulama](#test-ve-doğrulama)
6. [Event'ler ve Kullanım](#eventler-ve-kullanım)

---

## 🎯 Genel Bakış

Tawk.to, web sitesi ziyaretçileriyle gerçek zamanlı chat yapılmasını sağlayan bir chat sistemidir. Bu entegrasyon ile:

- Tawk.to chat widget'ı tüm sayfalarda aktif
- Chat başlatıldığında Google Ads'e dönüşüm gönderiliyor
- Ziyaretçi aktiviteleri dataLayer üzerinden takip ediliyor

**Kullanılan Teknolojiler:**
- Tawk.to JavaScript API
- Google Tag Manager (GTM)
- Google Ads Conversion Tracking
- Next.js Client Components

---

## 💻 Kod Entegrasyonu

### Bileşen: `src/components/TawkTo.tsx`

Tawk.to entegrasyonu bir React client component olarak implement edilmiştir.

**Özellikler:**
- Tawk.to script'inin dinamik yüklenmesi
- Google Tag Manager dataLayer'a event gönderimi
- Tawk.to API callback'lerinin yönetimi
- TypeScript tip tanımları

**Environment Variables:**
```env
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=6946684563447e19862c4140
NEXT_PUBLIC_TAWKTO_WIDGET_ID=1jctgekca
```

**Kullanım:**
```tsx
import TawkTo from '@/components/TawkTo';

// Layout içinde
<TawkTo />
```

### Event Gönderimi

Kod, aşağıdaki event'leri Google Tag Manager dataLayer'a gönderir:

1. **`tawk_to_visitor_active`** - Tawk.to yüklendiğinde, ziyaretçi aktif olduğunda
2. **`tawk_to_visitor_online`** - Ziyaretçi online durumuna geçtiğinde
3. **`tawk_to_chat_started`** - Chat başladığında (Google Ads dönüşümü için)
4. **`tawk_to_chat_ended`** - Chat sona erdiğinde

**Event Gönderme Fonksiyonu:**
```typescript
const sendConversionEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};
```

---

## 🏷️ Google Tag Manager Kurulumu

### 1. Trigger Oluşturma

**Adımlar:**
1. GTM → **Triggers** → **Yeni**
2. Trigger adı: `Tawk.to Chat Started`
3. Trigger tipi: **Custom Event**
4. Event name: `tawk_to_chat_started` (tam olarak, büyük/küçük harf duyarlı)
5. **Kaydet**

### 2. Google Ads Conversion Tag Oluşturma

**Adımlar:**
1. GTM → **Tags** → **Yeni**
2. Tag tipi: **Google Ads Conversion Tracking**
3. **Conversion ID:** `16928218646` (Google Ads hesabınızdan alın)
4. **Conversion Label:** Google Ads'de oluşturduğunuz conversion action'ın label'ı (örn: `a7qJCOrrtdQbEJa8glg_`)
5. **Trigger:** `Tawk.to Chat Started` (yukarıda oluşturduğunuz trigger)
6. **Kaydet**

### 3. Yayınlama

1. GTM'de **Kaydet** butonuna tıklayın
2. **Gönder** (Submit) butonuna tıklayın
3. Versiyon adı verin (örn: "Tawk.to Conversion Tracking")
4. **Yayınla** (Publish) butonuna tıklayın

---

## 📊 Google Ads Conversion Action Kurulumu

### 1. Conversion Action Oluşturma

**Adımlar:**
1. Google Ads → **Tools** → **Conversions**
2. **+** butonuna tıklayın → **Website** seçin
3. **Kategori seçimi:** **"Kişi" (Contact)** seçin
   - Açıklama: "Bir müşterinin telefon, SMS, e-posta veya **sohbet yoluyla** işletmenizle iletişime geçmesidir"
   - Chat iletişimini kapsar

### 2. Conversion Ayarları

**Form Alanları:**
- **Conversion name:** `Tawk.to Chat Başlatma` veya `Tawk.to Sohbet`
- **Category:** `Contact` (otomatik seçili)
- **Value:** İsterseniz değer ekleyin (opsiyonel)
- **Count:** `One` (her chat başlatma = 1 dönüşüm)
- **Click-through conversion window:** `30 gün` (önerilen)
- **Attribution model:** `Data-driven` veya `Last click` (tercihinize göre)

### 3. Conversion Label'i Kopyalama

1. Oluşturduğunuz conversion action'ı açın
2. **Conversion Label** değerini kopyalayın (örn: `a7qJCOrrtdQbEJa8glg_`)
3. GTM'deki Google Ads Conversion Tag'e yapıştırın

---

## ✅ Test ve Doğrulama

### GTM Preview Modu ile Test

1. **GTM Preview Modunu Açın:**
   - GTM → **Önizleme** (Preview) butonuna tıklayın
   - Web sitenizin URL'ini girin

2. **Chat'i Test Edin:**
   - Web sitenize gidin
   - Tawk.to chat widget'ını açın
   - İlk mesajı gönderin (chat başlatın)

3. **Event'i Kontrol Edin:**
   - GTM Preview panelinde `tawk_to_chat_started` event'inin göründüğünü kontrol edin
   - Google Ads Conversion tag'inin ateşlendiğini doğrulayın

### Google Ads'de Doğrulama

1. **Test Conversions:**
   - Google Ads → **Tools** → **Conversions**
   - Oluşturduğunuz conversion action'ı açın
   - Birkaç saat sonra (bazen 24 saat) test dönüşümlerini görebilirsiniz

2. **Conversion Tracking:**
   - Google Ads → **Tools** → **Conversions**
   - Conversion action'ın durumunu kontrol edin
   - "Etkin" (Active) durumunda olmalı

---

## 📡 Event'ler ve Kullanım

### Gönderilen Event'ler

| Event Adı | Tetiklenme Zamanı | Kullanım Amacı |
|-----------|-------------------|----------------|
| `tawk_to_visitor_active` | Tawk.to yüklendiğinde | Ziyaretçi aktivitesi takibi |
| `tawk_to_visitor_online` | Ziyaretçi online olduğunda | Durum değişikliği takibi |
| `tawk_to_chat_started` | Chat başladığında | **Google Ads dönüşümü** |
| `tawk_to_chat_ended` | Chat sona erdiğinde | Analitik amaçlı (opsiyonel) |

### Event Verileri

**`tawk_to_chat_started` event'i şu verileri içerir:**
```javascript
{
  event: 'tawk_to_chat_started',
  event_category: 'Tawk.to',
  event_label: 'Chat Started',
  value: 1
}
```

---

## 🔧 Sorun Giderme

### Event Tetiklenmiyor

1. **Console Kontrolü:**
   - Browser console'da `[Tawk.to Conversion] Event sent: tawk_to_chat_started` mesajını kontrol edin

2. **dataLayer Kontrolü:**
   - Browser console'da `window.dataLayer` array'ini kontrol edin
   - Event'in push edildiğini doğrulayın

3. **GTM Trigger Kontrolü:**
   - GTM'de trigger'ın event name'inin tam olarak `tawk_to_chat_started` olduğundan emin olun
   - Büyük/küçük harf duyarlı!

### Conversion Görünmüyor

1. **Zaman Gecikmesi:**
   - Google Ads conversion'ları genellikle birkaç saat sonra görünür
   - Bazen 24 saate kadar sürebilir

2. **Conversion Label Kontrolü:**
   - GTM'deki tag'deki Conversion Label'in Google Ads'deki ile eşleştiğinden emin olun

3. **GTM Yayınlama:**
   - GTM'deki değişikliklerin yayınlandığından emin olun

---

## 📝 Notlar

- **Chat Started** event'i Google Ads conversion için kullanılıyor
- **Chat Ended** event'i şu an için sadece analitik amaçlı (GTM trigger'ı yok)
- Tawk.to script'i tüm sayfalarda yükleniyor (`layout.tsx` içinde)
- Environment variables ile Property ID ve Widget ID yönetiliyor

---

## 🔗 İlgili Dosyalar

- `src/components/TawkTo.tsx` - Tawk.to entegrasyon bileşeni
- `src/app/[locale]/(routes)/layout.tsx` - TawkTo component'inin kullanıldığı layout
- `src/components/CookieConsent/ConditionalScripts.tsx` - GTM ve dataLayer yapılandırması

---

**Son Güncelleme:** 20 Aralık 2024
