# GDPR Cookie Consent Yönetim Sistemi - Detaylı Dokümantasyon

Bu dokümantasyon, Paris Yolcusu web sitesinde uygulanan **Google Consent Mode v2** uyumlu GDPR çerez yönetim sisteminin nasıl oluşturulduğunu, hangi dosyaların kullanıldığını ve Google Tag Manager ile nasıl entegre edildiğini aşama aşama açıklamaktadır.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Kurulum Aşamaları](#kurulum-aşamaları)
4. [Dosya Yapısı ve Açıklamaları](#dosya-yapısı-ve-açıklamaları)
5. [Google Tag Manager Entegrasyonu](#google-tag-manager-entegrasyonu)
6. [Desteklenen Platformlar](#desteklenen-platformlar)
7. [Consent Mode v2 Özellikleri](#consent-mode-v2-özellikleri)
8. [Test ve Doğrulama](#test-ve-doğrulama)

---

## 🎯 Genel Bakış

Bu sistem, **Google Consent Mode v2** standardına tam uyumlu, GDPR ve diğer gizlilik yasalarına uygun bir çerez yönetim çözümüdür. Sistem, kullanıcıların hangi çerez kategorilerini kabul ettiklerini seçmelerine olanak tanır ve bu tercihlere göre üçüncü taraf scriptlerin yüklenmesini kontrol eder.

### Temel Özellikler

- ✅ **Google Consent Mode v2** tam uyumluluk
- ✅ **GDPR, CCPA, LGPD** gibi gizlilik yasalarına uyum
- ✅ **Google Tag Manager** ile tam entegrasyon
- ✅ **Çoklu dil desteği** (TR, EN, FR)
- ✅ **Responsive tasarım** (mobil, tablet, masaüstü)
- ✅ **Server-Client Component** ayrımı (Next.js 13+)
- ✅ **Otomatik çerez temizleme** mekanizması
- ✅ **localStorage** ile tercih saklama

---

## 🏗️ Sistem Mimarisi

### Yüksek Seviye Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         CookieConsentProvider (Context)          │  │
│  │  - State Management                              │  │
│  │  - localStorage Persistence                      │  │
│  │  - Consent Logic                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                               │
│         ┌────────────────┼────────────────┐            │
│         │                │                │            │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐   │
│  │   Banner    │  │    Modal    │  │  Scripts   │   │
│  │  Component  │  │  Component  │  │ Component │   │
│  └─────────────┘  └─────────────┘  └────────────┘   │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Google Tag Manager (GTM)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   GA4    │  │ Facebook │  │ Clarity  │             │
│  │  Tags    │  │  Pixel   │  │  Tags    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Veri Akışı

1. **Sayfa Yükleme** → `ConditionalScripts.tsx` → GTM'e varsayılan consent durumu gönderilir
2. **Kullanıcı Etkileşimi** → `CookieConsentBanner` → Tercih seçimi
3. **Tercih Güncelleme** → `CookieConsentContext` → State güncellenir
4. **Consent Sinyali** → `ConditionalScripts.tsx` → GTM'e `consent_update` eventi gönderilir
5. **GTM Tepkisi** → İlgili etiketler consent durumuna göre tetiklenir veya bloklanır

---

## 📦 Kurulum Aşamaları

### Aşama 1: Temel Dosya Yapısının Oluşturulması

#### 1.1 Context Provider Oluşturma

**Dosya:** `src/components/CookieConsent/CookieConsentContext.tsx`

Bu dosya, tüm consent yönetiminin merkezi noktasıdır. İlk olarak şu yapı oluşturuldu:

```typescript
type ConsentType = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  personalization: boolean;
  security: boolean;
};
```

**Önemli Not:** `functional` ve `security` varsayılan olarak `true` olarak ayarlanmıştır çünkü bunlar sitenin temel işlevselliği için gereklidir.

**Özellikler:**
- `useState` ile consent state yönetimi
- `useEffect` ile localStorage'dan tercih yükleme
- `useEffect` ile tercih değişikliklerini localStorage'a kaydetme
- Bölge tespiti (TR, EU, OTHER)
- Çerez temizleme fonksiyonu

#### 1.2 Banner Component Oluşturma

**Dosyalar:**
- `src/components/CookieConsent/CookieConsentBanner.tsx` (Server Component)
- `src/components/CookieConsent/ClientCookieBanner.tsx` (Client Component)

**Ayrım Nedenleri:**
- Server Component: Çevirileri next-intl ile alır, SEO dostu
- Client Component: Kullanıcı etkileşimlerini yönetir, state kullanır

**Özellikler:**
- Sayfanın altında sabit konumlandırma
- "Tümünü Kabul Et", "Tümünü Reddet", "Tercihleri Ayarla" butonları
- Responsive tasarım (mobil/tablet/masaüstü)
- Hover efektleri ve animasyonlar

#### 1.3 Modal Component Oluşturma

**Dosyalar:**
- `src/components/CookieConsent/CookiePreferencesModal.tsx` (Server Component)
- `src/components/CookieConsent/CookiePreferencesClientWrapper.tsx` (Wrapper)
- `src/components/CookieConsent/ClientCookiePreferencesModal.tsx` (Client Component)

**Üç Katmanlı Yapı:**
1. **Server Component:** Çevirileri alır, props olarak aktarır
2. **Wrapper:** Server ve Client arasında köprü, modal görünürlüğünü yönetir
3. **Client Component:** UI ve kullanıcı etkileşimlerini yönetir

**Özellikler:**
- Dinamik yükseklik (ekran boyutuna göre)
- Scroll edilebilir içerik alanı
- Toggle butonlar (Açık/Kapalı)
- Her çerez kategorisi için detaylı açıklama

### Aşama 2: Google Tag Manager Entegrasyonu

#### 2.1 ConditionalScripts Component Oluşturma

**Dosya:** `src/components/CookieConsent/ConditionalScripts.tsx`

Bu dosya, GTM ile consent durumunu senkronize eden kritik bileşendir.

**İlk Versiyon (V1):**
```typescript
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  // ...
});
```

**Güncel Versiyon (V2):**
```typescript
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",        // V2 parametresi
  ad_personalization: "denied",  // V2 parametresi
  functionality_storage: "granted",
  security_storage: "granted",
  wait_for_update: 2000,
  region: ['TR', 'EU']
});
```

**Önemli Özellikler:**
- Sayfa yüklendiğinde varsayılan consent durumu gönderilir
- Kullanıcı tercih değiştirdiğinde `consent_update` eventi gönderilir
- Hem `gtag()` API'si hem de `dataLayer.push()` kullanılır
- GTM script'i consent ayarlarından sonra yüklenir

#### 2.2 Consent Update Mekanizması

**Fonksiyon:** `sendGtagConsent()`

Bu fonksiyon, kullanıcı tercih değiştirdiğinde çağrılır:

```typescript
function sendGtagConsent(consent: { analytics: boolean; marketing: boolean }) {
  const consentUpdate: ConsentUpdate = {
    ad_storage: consent.marketing ? 'granted' : 'denied',
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  };

  // GTM için event
  window.dataLayer.push({
    event: 'consent_update',
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied'
  });

  // Google Consent Mode API
  if (window.gtag) {
    window.gtag('consent', 'update', {
      ...consentUpdate,
      region: ['TR', 'EU']
    });
  }
}
```

### Aşama 3: Çerez Temizleme Mekanizması

#### 3.1 CookieCleaner Component

**Dosya:** `src/components/CookieConsent/CookieCleaner.tsx`

Bu component, kullanıcı belirli çerez kategorilerini reddettiğinde ilgili çerezleri otomatik olarak temizler.

**Temizlenen Çerez Kategorileri:**

```typescript
const cookiesToClear = {
  ga: ['_ga', '_gid', '_gat'],           // Google Analytics
  fb: ['_fbp', '_fbc'],                  // Facebook Pixel
  clarity: ['_clck', '_clsk'],          // Microsoft Clarity
  custom: []                             // Özel çerezler
};
```

**Temizleme Stratejisi:**
- Tüm olası domain varyasyonlarında temizleme
- Path varyasyonlarında temizleme
- Hem ana domain hem subdomain'lerde temizleme

### Aşama 4: Çoklu Dil Desteği

#### 4.1 Locale Dosyaları

**Dosyalar:**
- `messages/tr.json`
- `messages/en.json`
- `messages/fr.json`

**Çeviri Anahtarları:**
```json
{
  "CookieBanner": {
    "title": "...",
    "description": "...",
    "acceptAll": "...",
    "rejectAll": "...",
    "preferences": "..."
  },
  "CookiePreferences": {
    "title": "...",
    "necessary": { "title": "...", "description": "..." },
    "functional": { "title": "...", "description": "..." },
    "analytics": { "title": "...", "description": "..." },
    "marketing": { "title": "...", "description": "..." },
    "personalization": { "title": "...", "description": "..." },
    "security": { "title": "...", "description": "...", "required": "..." }
  }
}
```

#### 4.2 Server-Client Component Entegrasyonu

**Server Component (CookiePreferencesModal.tsx):**
```typescript
const t = useTranslations("CookiePreferences");
const translations = {
  title: t("title"),
  // ...
};
return <CookiePreferencesClientWrapper translations={translations} />;
```

**Client Component (ClientCookiePreferencesModal.tsx):**
```typescript
interface ClientCookiePreferencesModalProps {
  translations: { /* ... */ }
}
// Server'dan gelen çevirileri kullanır
```

---

## 📁 Dosya Yapısı ve Açıklamaları

### Ana Klasör: `src/components/CookieConsent/`

```
CookieConsent/
├── CookieConsentContext.tsx          # Context Provider - State yönetimi
├── ConditionalScripts.tsx            # GTM entegrasyonu ve consent sinyalleri
├── CookieConsentBanner.tsx           # Banner (Server Component)
├── ClientCookieBanner.tsx            # Banner (Client Component)
├── CookiePreferencesModal.tsx        # Modal (Server Component)
├── CookiePreferencesClientWrapper.tsx # Modal Wrapper
├── ClientCookiePreferencesModal.tsx  # Modal (Client Component)
├── CookieCleaner.tsx                 # Çerez temizleme mekanizması
├── CookieOverlay.tsx                 # Modal overlay (arka plan)
└── README.md                         # Kısa dokümantasyon
```

### Detaylı Dosya Açıklamaları

#### 1. `CookieConsentContext.tsx`

**Amaç:** Tüm consent state'inin merkezi yönetimi

**Önemli Fonksiyonlar:**
- `updateConsent()`: Kullanıcı tercih değiştirdiğinde çağrılır
- `acceptAll()`: Tüm çerezleri kabul eder
- `rejectAll()`: Tüm çerezleri reddeder ve temizler
- `clearTrackingCookies()`: Reddedilen çerezleri temizler

**State Yapısı:**
```typescript
const [consent, setConsent] = useState<ConsentType>({
  analytics: false,
  marketing: false,
  functional: true,      // Varsayılan true
  personalization: false,
  security: true         // Varsayılan true
});
```

**localStorage Yapısı:**
- `cookieConsent`: JSON string olarak consent durumu
- `cookieInteraction`: Kullanıcının etkileşimde bulunup bulunmadığı

#### 2. `ConditionalScripts.tsx`

**Amaç:** Google Tag Manager'a consent durumunu iletmek

**Kritik Bölümler:**

**A) Varsayılan Consent (Sayfa Yüklendiğinde):**
```typescript
gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
  wait_for_update: 2000,
  region: ['TR', 'EU']
});
```

**B) Consent Update (Kullanıcı Tercih Değiştirdiğinde):**
```typescript
useEffect(() => {
  if (hasInteracted) {
    sendGtagConsent(consent);
  }
}, [consent.analytics, consent.marketing, hasInteracted]);
```

**C) GTM Yükleme:**
```typescript
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  // GTM script yükleme kodu
})(window,document,'script','dataLayer','GTM-NJC2MR8S');
```

#### 3. `ClientCookieBanner.tsx`

**Amaç:** Kullanıcıya ilk consent seçeneklerini sunmak

**Özellikler:**
- Sayfanın altında sabit konumlandırma (`fixed bottom-0`)
- Responsive buton yerleşimi
- Hover efektleri
- Accessibility özellikleri (aria-label)

**Buton Aksiyonları:**
- `acceptAll()`: Tüm çerezleri kabul et
- `rejectAll()`: Tüm çerezleri reddet
- `showPreferences()`: Detaylı tercih modalını aç

#### 4. `ClientCookiePreferencesModal.tsx`

**Amaç:** Detaylı çerez tercih yönetimi

**Çerez Kategorileri:**
1. **Zorunlu Çerezler:** Her zaman aktif, kullanıcı değiştiremez
2. **Güvenlik Çerezleri:** Her zaman aktif, kullanıcı değiştiremez
3. **Fonksiyonel Çerezler:** Kullanıcı açıp kapatabilir
4. **Analitik Çerezler:** Kullanıcı açıp kapatabilir
5. **Pazarlama Çerezleri:** Kullanıcı açıp kapatabilir
6. **Kişiselleştirme Çerezleri:** Kullanıcı açıp kapatabilir

**Toggle Buton Mantığı:**
```typescript
<button onClick={() => updateConsent({ analytics: false })}>
  Kapalı
</button>
<button onClick={() => updateConsent({ analytics: true })}>
  Açık
</button>
```

#### 5. `CookieCleaner.tsx`

**Amaç:** Reddedilen çerez kategorilerine ait çerezleri temizlemek

**Temizleme Stratejisi:**
```typescript
const clearCookie = (name: string) => {
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
    `www.${window.location.hostname}`,
    `.www.${window.location.hostname}`
  ];
  
  domains.forEach(domain => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  });
};
```

---

## 🔗 Google Tag Manager Entegrasyonu

### GTM Konfigürasyonu

#### 1. Consent Mode Aktifleştirme

**GTM Arayüzünde:**
1. **Admin** → **Container Settings**
2. **Consent Overview** sekmesi
3. **"Enable consent mode"** işaretle
4. Sistem otomatik olarak **v2** modunu kullanır

#### 2. Built-in Variables Aktifleştirme

**Variables** → **Configure**:
- ✅ Consent Mode - ad_storage
- ✅ Consent Mode - analytics_storage
- ✅ Consent Mode - ad_user_data
- ✅ Consent Mode - ad_personalization
- ✅ Consent Mode - functionality_storage
- ✅ Consent Mode - security_storage

#### 3. Etiket Yapılandırması

**Her etiket için consent ayarları:**

##### A) Google Analytics 4 (GA4)

**Etiket:** `GA4 - Ana Yapılandırma`

**Tetikleyici:**
- `Initialization - All Pages` (Built-in)

**İzin Ayarları:**
- **Yerleşik İzin Kontrolleri:** `analytics_storage` ✅
- **Ek İzin Kontrolleri:** Gerekli değil (trigger zaten kontrol ediyor)

**Not:** GA4 etiketleri, GTM'in yerleşik consent kontrolü sayesinde otomatik olarak `analytics_storage` durumunu kontrol eder.

##### B) Facebook Pixel

**Etiket:** `Facebook Pixel - TR/EN/FR`

**Tetikleyici:**
- `All Pages` (Custom trigger) + Consent koşulları
- VEYA `consent_update` (Custom event) + Path koşulları

**İzin Ayarları:**
- **Yerleşik İzin Kontrolleri:** `ad_storage` ✅
- **Ek İzin Kontrolleri:** Gerekli değil

**Örnek Tetikleyici:**
```
Tetikleyici Türü: Özel Etkinlik
Etkinlik Adı: consent_update
Koşul: Page Path şununla başlar /fr
VE
Koşul: Ad Storage eşittir granted
```

##### C) Microsoft Clarity

**Etiket:** `Microsoft Clarity - Official`

**Tetikleyici:**
- `All Pages` (Custom trigger) + Consent koşulları
- VEYA `consent_update` (Custom event) + Consent koşulları

**İzin Ayarları:**
- **Yerleşik İzin Kontrolleri:** `analytics_storage` ✅

##### D) Google Ads Remarketing

**Etiket:** `Google Ads Remarketing`

**Tetikleyici:**
- `All Pages` (Custom trigger) + Consent koşulları
- VEYA `consent_update` (Custom event) + Consent koşulları

**İzin Ayarları:**
- **Yerleşik İzin Kontrolleri:** `ad_storage` ✅
- **Ek İzin Kontrolleri:** `analytics_storage` ✅ (Önerilir)

**Not:** Remarketing için hem ads hem analytics verisi gerekir.

##### E) Conversion Tracking Etiketleri

**Etiketler:**
- `Genel Kapsayıcı Dönüşüm`
- `Rezervasyon Form Dönüşüm`
- `Bilgi Alma Formu`
- `Telefon Araması Dönüşüm`

**Tetikleyici:**
- Form/Click event trigger'ları + Consent koşulları

**İzin Ayarları:**
- **Yerleşik İzin Kontrolleri:** `ad_storage` + `analytics_storage` ✅

**Örnek Tetikleyici Koşulu:**
```
Form Tetikleyici
VE
Analytics Storage Consent eşittir granted
VE
Ad Storage eşittir granted
```

### GTM Tetikleyici Stratejileri

#### Strateji 1: Initialization Trigger (Önerilen)

**Kullanım:** GA4 gibi her sayfa yüklemesinde çalışması gereken etiketler için

**Avantajlar:**
- GTM'in yerleşik consent kontrolü otomatik çalışır
- Ekstra trigger oluşturmaya gerek yok
- Performans açısından optimal

**Örnek:**
```
Etiket: GA4 - Ana Yapılandırma
Tetikleyici: Initialization - All Pages
İzin: analytics_storage (GTM otomatik kontrol eder)
```

#### Strateji 2: Custom Event + Consent Conditions

**Kullanım:** Facebook Pixel, Clarity gibi etiketler için

**Avantajlar:**
- Hem sayfa yüklemesinde hem consent güncellemesinde çalışır
- Path bazlı kontrol yapılabilir
- Granular kontrol

**Örnek:**
```
Tetikleyici 1: All Pages + Page Path + Consent
Tetikleyici 2: consent_update + Page Path + Consent
```

#### Strateji 3: Form/Click Event + Consent Conditions

**Kullanım:** Conversion tracking etiketleri için

**Avantajlar:**
- Sadece ilgili event gerçekleştiğinde çalışır
- Consent kontrolü trigger seviyesinde yapılır
- GDPR uyumlu

**Örnek:**
```
Tetikleyici: Form Submit
Koşul: analytics_storage = granted
Koşul: ad_storage = granted
```

---

## 🌍 Desteklenen Platformlar

### Google Platformları

#### 1. Google Analytics 4 (GA4)
- **Consent Parametresi:** `analytics_storage`
- **Desteklenen Özellikler:**
  - Page views
  - Events (scroll, click, form submit)
  - E-commerce tracking
  - User properties
  - Custom dimensions
- **Çerezsiz Mod:** ✅ Desteklenir (anonymized pings)

#### 2. Google Tag Manager (GTM)
- **Consent Mode v2:** ✅ Tam destek
- **Built-in Consent Variables:** ✅ Mevcut
- **Tag Firing Rules:** ✅ Consent bazlı
- **Consent API:** ✅ Desteklenir

#### 3. Google Ads
- **Consent Parametreleri:** 
  - `ad_storage`
  - `ad_user_data`
  - `ad_personalization`
- **Desteklenen Özellikler:**
  - Conversion tracking
  - Remarketing
  - Audience targeting
  - Smart bidding

### Facebook Platformları

#### 4. Facebook Pixel
- **Consent Parametresi:** `ad_storage`
- **Desteklenen Özellikler:**
  - Standard events
  - Custom events
  - Conversion tracking
  - Lookalike audiences
  - Dynamic ads
- **Çoklu Dil Desteği:** ✅ (TR, EN, FR ayrı pixel'ler)

**Not:** Facebook Conversion API (CAPI) entegrasyonu önerilir (sunucu tarafı tracking için).

### Microsoft Platformları

#### 5. Microsoft Clarity
- **Consent Parametresi:** `analytics_storage`
- **Desteklenen Özellikler:**
  - Session recordings
  - Heatmaps
  - User behavior analytics
  - Performance insights

### Diğer Platformlar

#### 6. WhatsApp Business API
- **Consent Parametresi:** `ad_storage`
- **Kullanım:** Conversion tracking

#### 7. Özel Tracking Scripts
- **Consent Parametreleri:** İhtiyaca göre `analytics_storage` veya `ad_storage`
- **Entegrasyon:** GTM üzerinden veya doğrudan `ConditionalScripts.tsx` içinde

---

## 🚀 Consent Mode v2 Özellikleri

### V2 Parametreleri

Consent Mode v2, aşağıdaki 6 parametreyi kullanır:

1. **`analytics_storage`**
   - **Amaç:** Analytics çerezlerinin kullanımı
   - **Etkilenen Platformlar:** GA4, Clarity
   - **Varsayılan:** `denied`

2. **`ad_storage`**
   - **Amaç:** Reklam çerezlerinin kullanımı
   - **Etkilenen Platformlar:** Facebook Pixel, Google Ads
   - **Varsayılan:** `denied`

3. **`ad_user_data`** ⭐ V2 Özelliği
   - **Amaç:** Kullanıcı verilerinin reklam amacıyla Google'a gönderilmesi
   - **Etkilenen Platformlar:** Google Ads, Facebook Pixel
   - **Varsayılan:** `denied`

4. **`ad_personalization`** ⭐ V2 Özelliği
   - **Amaç:** Kişiselleştirilmiş reklamcılık (remarketing)
   - **Etkilenen Platformlar:** Google Ads, Facebook Pixel
   - **Varsayılan:** `denied`

5. **`functionality_storage`**
   - **Amaç:** Site işlevselliği için gerekli çerezler
   - **Varsayılan:** `granted` (her zaman aktif)

6. **`security_storage`**
   - **Amaç:** Güvenlik çerezleri
   - **Varsayılan:** `granted` (her zaman aktif)

### Çerezsiz Ping (Cookieless Pings)

**Önemli Özellik:** Consent Mode v2, izin verilmediğinde bile **anonim sinyaller** gönderir.

**Nasıl Çalışır:**
- Kullanıcı `analytics_storage` izni vermediğinde
- GA4 etiketi yine de tetiklenir
- Ancak **hiçbir çerez yazılmaz veya okunmaz**
- Sadece anonim, kişisel olmayan sinyaller gönderilir
- Bu sinyaller, Google'ın **behavioral modeling** için kullanılır

**Avantajları:**
- Veri kaybını minimize eder
- Dönüşüm modelleme için veri sağlar
- GDPR uyumlu (kişisel veri işlenmez)

### Bölgesel Kontrol

**Özellik:** `region` parametresi ile bölgeye özel consent ayarları

**Kullanım:**
```typescript
gtag("consent", "default", {
  // ...
  region: ['TR', 'EU']
});
```

**Etkisi:**
- Belirtilen bölgelerdeki kullanıcılar için özel kurallar
- GDPR gibi yasaların olduğu bölgeler için farklı davranış

---

## ✅ Test ve Doğrulama

### 1. Tag Assistant ile Test

**Adımlar:**
1. Google Tag Assistant'ı açın
2. Site URL'ini girin
3. **"İzin" (Consent)** sekmesine gidin
4. Kontrol edin:
   - ✅ `consent_default` eventi görünüyor mu?
   - ✅ Tüm parametreler doğru değerlerde mi?
   - ✅ `consent_update` eventi çalışıyor mu?

**Beklenen Sonuç:**
```
consent_default:
- ad_storage: denied
- analytics_storage: denied
- ad_user_data: denied
- ad_personalization: denied
- functionality_storage: granted
- security_storage: granted
```

### 2. GTM Preview Mode ile Test

**Adımlar:**
1. GTM'de **Preview** modunu açın
2. Site URL'ini girin
3. **Summary** sekmesinde:
   - ✅ Consent durumunu kontrol edin
   - ✅ Etiketlerin tetiklenme durumunu görün
4. Consent verin ve tekrar kontrol edin

**Beklenen Davranış:**
- Consent vermeden: Etiketler "Blocked" durumunda
- Consent verdikten sonra: Etiketler "Fired" durumunda

### 3. Tarayıcı Console ile Test

**Konsol Komutları:**
```javascript
// Consent durumunu kontrol et
console.log(window.dataLayer);

// Manuel consent güncelleme
window.dataLayer.push({
  event: 'consent_update',
  analytics_storage: 'granted',
  ad_storage: 'granted'
});
```

### 4. Çerez Kontrolü

**Application Tab (F12):**
1. **Cookies** sekmesine gidin
2. Consent vermeden önce: Sadece zorunlu çerezler olmalı
3. Analytics consent verdikten sonra: `_ga`, `_gid` çerezleri görünmeli
4. Marketing consent verdikten sonra: `_fbp`, `_fbc` çerezleri görünmeli

### 5. Network Tab ile Test

**F12 → Network:**
1. **Filter:** `google-analytics` veya `facebook` veya `clarity`
2. Consent vermeden: İstekler görünmemeli veya çerezsiz ping olmalı
3. Consent verdikten sonra: Normal tracking istekleri görünmeli

### 6. GA4 Realtime Raporu ile Test

**Kontrol Edilecekler:**
- Consent vermeden: Anonim ziyaretçiler görünebilir (normal)
- Consent verdikten sonra: Tam tracking verileri görünmeli
- Conversion tracking çalışıyor mu?

---

## 📝 Önemli Notlar ve En İyi Uygulamalar

### 1. Consent State Tutarlılığı

**Önemli:** React state ile GTM consent durumunun senkronize olması gerekir.

**Kontrol:**
- `CookieConsentContext.tsx` içindeki `defaultConsent`
- `ConditionalScripts.tsx` içindeki `gtag("consent", "default")`
- İkisi de aynı değerleri kullanmalı

### 2. localStorage Yönetimi

**Yapı:**
```typescript
localStorage.setItem("cookieConsent", JSON.stringify(consent));
localStorage.setItem("cookieInteraction", "true");
```

**Önemli:** Kullanıcı tercihleri localStorage'da saklanır. Tarayıcı cache temizlendiğinde kaybolur, bu normaldir.

### 3. Çerez Temizleme Stratejisi

**Zamanlama:**
- Kullanıcı reddettiğinde: Hemen temizle
- Kullanıcı tercih değiştirdiğinde: Eski çerezleri temizle, yeni izinlere göre yükle

**Kapsam:**
- Tüm domain varyasyonlarında temizle
- Tüm path'lerde temizle
- Subdomain'lerde de temizle

### 4. Performance Optimizasyonu

**Script Loading:**
- `strategy="afterInteractive"` kullanılır (Next.js Script component)
- GTM script'i async yüklenir
- Consent kontrolü sonrası etiketler yüklenir

**State Management:**
- `useEffect` dependency array'leri optimize edilmiştir
- Gereksiz re-render'lar önlenir

### 5. Accessibility (Erişilebilirlik)

**Özellikler:**
- `aria-label` kullanımı
- Keyboard navigation desteği
- Focus management
- Screen reader uyumluluğu

### 6. SEO Uyumluluğu

**Server Components:**
- Banner ve modal metinleri server-side render edilir
- SEO dostu HTML yapısı
- Çeviriler server tarafında işlenir

---

## 🔧 Sorun Giderme

### Sorun 1: Etiketler Tetiklenmiyor

**Olası Nedenler:**
1. Consent ayarları GTM'de yanlış yapılandırılmış
2. Trigger koşulları çok katı
3. `consent_update` eventi gönderilmiyor

**Çözüm:**
- GTM Preview mode'da consent durumunu kontrol edin
- Trigger koşullarını basitleştirin
- Console'da `window.dataLayer` kontrol edin

### Sorun 2: Çerezler Temizlenmiyor

**Olası Nedenler:**
1. Domain yapılandırması yanlış
2. Path kontrolü eksik
3. Çerez adları yanlış

**Çözüm:**
- `CookieCleaner.tsx` içindeki domain listesini kontrol edin
- Tarayıcı Application tab'ında çerezleri manuel kontrol edin
- Console'da `clearTrackingCookies()` fonksiyonunu test edin

### Sorun 3: Consent Update Çalışmıyor

**Olası Nedenler:**
1. `hasInteracted` state'i `false` kalıyor
2. `useEffect` dependency'leri eksik
3. `sendGtagConsent` fonksiyonu çağrılmıyor

**Çözüm:**
- `CookieConsentContext.tsx` içinde `hasInteracted` kontrolü yapın
- `ConditionalScripts.tsx` içinde `useEffect` dependency'lerini kontrol edin
- Console'da `[ConsentMode] Consent update sent` log'unu arayın

### Sorun 4: Çoklu Dil Çalışmıyor

**Olası Nedenler:**
1. Locale dosyalarında eksik anahtarlar
2. Server component çevirileri alamıyor
3. next-intl yapılandırması eksik

**Çözüm:**
- `messages/tr.json`, `messages/en.json`, `messages/fr.json` dosyalarını kontrol edin
- Tüm `CookiePreferences` anahtarlarının mevcut olduğundan emin olun
- next-intl yapılandırmasını kontrol edin

---

## 📚 Referanslar ve Kaynaklar

### Google Dokümantasyonu

- [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent?hl=tr&consentmode=advanced)
- [GTM Consent Mode Debugging](https://developers.google.com/tag-platform/security/guides/consent-debugging?hl=tr#tag-manager)
- [Consent Mode API Reference](https://developers.google.com/tag-platform/security/guides/consent)

### GDPR Kaynakları

- [GDPR Official Website](https://gdpr.eu/)
- [ICO Guide to GDPR](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)

### Next.js Dokümantasyonu

- [Next.js Script Component](https://nextjs.org/docs/pages/api-reference/components/script)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## 🎓 Sonuç

Bu dokümantasyon, GDPR uyumlu, Google Consent Mode v2 standardına tam uyumlu bir çerez yönetim sisteminin nasıl oluşturulduğunu detaylı bir şekilde açıklamaktadır. Sistem, modern web standartlarına uygun, performanslı ve kullanıcı dostu bir çözüm sunmaktadır.

**Önemli Hatırlatmalar:**
- ✅ Consent Mode v2 parametrelerinin tümü kullanılıyor
- ✅ GTM ile tam entegrasyon sağlanmış
- ✅ Çoklu dil desteği mevcut
- ✅ GDPR ve diğer gizlilik yasalarına uyumlu
- ✅ Otomatik çerez temizleme mekanizması çalışıyor
- ✅ Server-Client component ayrımı doğru yapılmış

**Desteklenen Platformlar:**
- Google Analytics 4
- Google Tag Manager
- Google Ads
- Facebook Pixel
- Microsoft Clarity
- WhatsApp Business API
- Özel tracking scriptleri

Bu sistem, modern web uygulamaları için endüstri standardı bir çözümdür ve gelecekteki güncellemelere hazırdır.

---

**Dokümantasyon Versiyonu:** 1.0  
**Son Güncelleme:** 2024  
**Yazar:** AI Assistant  
**Proje:** Paris Yolcusu Web Sitesi




















