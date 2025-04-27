# Çerez (Cookie) İzin Sistemi

Bu belge, Paris Yolcusu web sitesindeki GDPR uyumlu çerez izin sisteminin nasıl çalıştığını açıklamaktadır.

## Genel Bakış

Çerez izin sistemi, kullanıcıların web sitesinde hangi üçüncü taraf scriptlerin ve çerezlerin yükleneceğini kontrol etmelerini sağlar. Sistem aşağıdaki prensipleri takip eder:

1. Varsayılan olarak, bir kullanıcı siteyi ilk ziyaret ettiğinde hiçbir üçüncü taraf script yüklenmez
2. Kullanıcıya aşağıdaki seçenekleri sunan bir izin banner'ı gösterilir:
   - Tüm çerezleri kabul et
   - Tüm çerezleri reddet
   - Tercihlerini özelleştir
3. Scriptler yalnızca kullanıcı açıkça izin verdikten sonra yüklenir
4. Kullanıcılar istedikleri zaman tercihlerini değiştirebilirler

## Bileşenler

Sistem aşağıdaki bileşenlerden oluşur:

### 1. Context Provider (`CookieConsentContext.tsx`)

- İzin durumunu yönetir (analitik, pazarlama, işlevsel)
- İzin tercihlerini güncellemek için metotlar sağlar
- Tercihleri localStorage'a kaydeder
- Çerezleri temizlemek için fonksiyonlar içerir

### 2. İzin Banner'ı (`CookieConsentBanner.tsx` / `ClientCookieBanner.tsx`)

- Kullanıcı izin seçenekleriyle etkileşimde bulunmadığında sayfanın altında gösterilir
- Tüm çerezleri kabul et, tüm çerezleri reddet veya tercihleri özelleştir seçenekleri sunar
- Kullanıcı etkileşimi olmadığında mevcut takip çerezlerini kontrol eder ve geçici olarak devre dışı bırakır
- Modern ve responsive tasarım, mobil cihazlarda kolonları alt alta dizerken, büyük ekranlarda yan yana yerleştirir
- Belirgin gölge efekti ile sayfada daha görünür hale getirilmiştir (`shadow-2xl` ve özel CSS gölge)
- Tüm butonlar hover efektleri ve geçiş animasyonları ile geliştirilmiştir
- Akıllı buton sıralaması: "Kabul Et" butonu mobil cihazlarda en üstte, masaüstünde ise en sağda konumlandırılmıştır (`flex-col-reverse` ve `sm:flex-row` kombinasyonu ile)

### 3. Tercihler Modalı Yapısı (Server ve Client Component Ayrımı)

#### 3.1 Server Component (`CookiePreferencesModal.tsx`)
- Next.js'in Server Components özelliğini kullanır
- next-intl ile çevirileri alır ve çeviri verilerini client component'a aktarır
- İstemci tarafı (client-side) state'lere erişmez
- "use client" direktifi içermez ve tamamen server-side çalışır
- Uluslararasılaştırma (i18n) desteği için ideal yapıdadır

#### 3.2 Client Wrapper (`CookiePreferencesClientWrapper.tsx`)
- "use client" direktifi içerir ve client-side işlemleri yönetir
- useCookieConsent hook'unu kullanarak modal gösterim durumunu (isPreferencesOpen) kontrol eder
- Server component'tan gelen çevirileri alır
- Modal görünürlüğünü (isPreferencesOpen) kontrol eder
- Server ve client kodunu temiz bir şekilde ayırarak, Next.js'in hem server components hem de client interaktivitesinin avantajlarını kullanır

#### 3.3 Modal İçeriği (`ClientCookiePreferencesModal.tsx`)
- Modalın görsel ve interaktif öğelerini içerir
- Çerez kategorileri üzerinde ayrıntılı kontrol sağlar
- Server-side component'tan gelen çeviri metinlerini kullanır
- Ekran boyutuna dinamik olarak yanıt veren responsive tasarım
- Mobil cihazlarda düzgün bir şekilde scroll edilebilen içerik alanı
- Modern toggle butonlar ile kullanıcı dostu arayüz (Açık/Kapalı durumları için çeviri metinleri)

### 4. Koşullu Script Yükleyici (`ConditionalScripts.tsx`)

- Scriptleri yalnızca kullanıcı ilgili kategori için izin verdiyse yükler
- Google Tag Manager, Google Analytics, Microsoft Clarity ve Facebook Pixel gibi scriptleri yönetir
- Her script için kategori bazlı kontrol sağlar (analitik, pazarlama, işlevsel)

### 5. Çerez Temizleyici (`CookieCleaner.tsx`)

- Kullanıcı reddettiyse veya henüz etkileşimde bulunmadıysa çerezleri temizler
- İzin kategorilerine göre (analitik, pazarlama, işlevsel) ilgili çerezleri temizler

### 6. Tercih Yöneticisi (`CookieConsentManager.tsx`)

- Footer'da tercihleri yeniden açmak için simge butonu sunar
- Metin yerine şık bir çerez simgesi kullanır (SVG ikon)
- Hover efekti ve erişilebilirlik özellikleri (aria-label ve title) içerir
- Kullanıcılara görsel olarak tanımlayıcı bir arayüz sunar
- Farklı dil desteği için çeviri metinlerini title ve aria-label olarak kullanır

## Nasıl Çalışır

1. Kullanıcı siteyi ziyaret ettiğinde, `CookieConsentProvider` varsayılan tercihlerle (hepsi kapalı) başlatılır
2. Sayfanın altında `CookieConsentBanner` gösterilir
3. Kullanıcı izin vermeden hiçbir üçüncü taraf script yüklenmez
4. Kullanıcı bir seçim yaptığında, tercihleri localStorage'a kaydedilir
5. `ConditionalScripts` bileşeni, Google Tag Manager'ı yalnızca kullanıcı analitik veya pazarlama için izin verdiyse yükler
6. Kullanıcılar istedikleri zaman footer'daki çerez simgesine tıklayarak tercihlerini değiştirebilirler
7. Kullanıcı belirli kategorileri reddettiğinde, o kategoriye ait çerezler otomatik olarak temizlenir

## Uluslararasılaştırma (i18n) Entegrasyonu

Çerez izin sistemi, Next.js'in i18n sistemi ile tam entegrasyon içinde çalışacak şekilde tasarlanmıştır:

1. **Server Components** (CookiePreferencesModal.tsx, CookieConsentBanner.tsx):
   - next-intl'in `useTranslations` hook'unu kullanarak çevirileri alır
   - Çeviri metinlerini client component'lara props olarak aktarır
   - Sayfanın dil ayarına bağlı olarak doğru çevirileri gösterir
   - Server tarafında render edilir ve SEO dostu bir yapı sağlar

2. **Client Components** (CookiePreferencesClientWrapper.tsx, ClientCookiePreferencesModal.tsx, ClientCookieBanner.tsx):
   - Server component'tan gelen çeviri metinlerini kullanır
   - Kullanıcı etkileşimlerini ve client-side state'leri yönetir
   - "use client" direktifi ile client tarafında çalışır
   - useCookieConsent hook'u kullanarak izin durumunu yönetir

3. **Çeviri Anahtarları**:
   - CookieBanner - Banner metinleri için
   - CookiePreferences - Modal içeriği ve arayüz öğeleri için
   - Tüm buton ve etiketler için çeviriler yapılandırılmıştır
   - Açık/Kapalı toggle durumları için dil desteği

Bu yapı, Next.js server components ve i18n desteğini verimli bir şekilde kullanarak hem performans hem de uluslararasılaştırma açısından optimum bir çözüm sunar.

## Üçüncü Taraf Scriptlerinin Yönetimi

Sistemimiz şu anda aşağıdaki üçüncü taraf scriptlerini yönetmektedir:

1. **Google Tag Manager** - Analitik veya pazarlama için izin verildiğinde yüklenir
2. **Google Analytics** - Yalnızca analitik için izin verildiğinde yüklenir
3. **Microsoft Clarity** - Yalnızca analitik için izin verildiğinde yüklenir
4. **Facebook Pixel** - Yalnızca pazarlama için izin verildiğinde yüklenir

Kullanıcı reddettikten sonra, ilgili çerezler otomatik olarak temizlenir ve scriptler devre dışı bırakılır. Kullanıcı henüz etkileşimde bulunmadıysa, bu scriptler hiç yüklenmez.

## Tasarım ve Kullanıcı Deneyimi Özellikleri

Çerez banner ve modalı, modern ve kullanıcı dostu bir deneyim sunmak için aşağıdaki özelliklere sahiptir:

### Banner Tasarımı
- Sayfanın altında sabit (fixed) konumlandırma
- Belirgin gölge efekti ile sayfanın geri kalanından ayrışma
- Responsive layout: Mobil cihazlarda tek kolon, tablet ve masaüstünde iki kolonlu görünüm
- Butonlar için hover efektleri ve geçiş animasyonları
- İçeriği maksimum genişlikte sınırlama ile büyük ekranlarda da düzgün görünüm
- Butonlarda tam genişlik (mobil) ve otomatik genişlik (masaüstü) ile responsive davranış
- UX optimizasyonu: "Kabul Et" butonu mobil cihazlarda en üstte (kolay erişim için), masaüstünde en sağda (doğal eylem akışı için) konumlanır

### Modal Tasarımı
- Dinamik yükseklik hesaplaması ile farklı ekran boyutlarına uyum:
  - Mobil cihazlarda: Ekran yüksekliğinin %90'ı (maksimum 600px)
  - Masaüstünde: Ekran yüksekliğinin %80'i (maksimum 700px)
- Yapışkan başlık ve alt çubuk ile geniş içeriklerde kolay gezinme
- iOS ve Android cihazlarda düzgün kaydırma için WebkitOverflowScrolling desteği
- Kategorileri açık/kapalı gösteren modern yuvarlak toggle butonlar
- Modal dışına tıklayarak kapatma imkanı
- Özel gölge ve yuvarlatılmış köşeler ile modern görünüm
- Çerez kategorilerini kartlar halinde gösterme
- Mobil ve masaüstü için optimize edilmiş boşluk ve padding değerleri
- Banner ile tutarlı buton sıralaması: Alt kısımda da "Kabul Et" butonu mobil cihazlarda en üstte, masaüstünde en sağda görünür

### Erişilebilirlik Özellikleri
- Tüm butonlarda aria-label etiketleri
- Belirgin odaklanma efektleri (focus styles)
- Klavye ile gezinme desteği
- Semantik HTML yapısı
- Yeterli kontrast oranlarıyla okunabilir metin
- Footer'daki çerez simgesi için title ve aria-label kullanımı

## Özelleştirme

İzin kategorilerini veya banner/modal görünümünü özelleştirmek için aşağıdaki dosyaları değiştirebilirsiniz:

- `CookieConsentContext.tsx` - İzin kategorilerini değiştirmek için
- `ClientCookieBanner.tsx` - Banner görünümünü değiştirmek için
- `CookiePreferencesModal.tsx` - Server-side çevirileri ve props aktarımını değiştirmek için
- `CookiePreferencesClientWrapper.tsx` - Modal görünürlük kontrollerini değiştirmek için
- `ClientCookiePreferencesModal.tsx` - Tercihler modalının görünümünü değiştirmek için
- `CookieConsentManager.tsx` - Footer'daki çerez simgesini değiştirmek için
- `ConditionalScripts.tsx` - İzne bağlı olarak hangi scriptlerin yükleneceğini değiştirmek için

### Çevirileri Yapılandırma
Çevirileri yapılandırmak için messages klasöründeki dil dosyalarını düzenleyin:

1. `CookieBanner` bölümü - Banner metinleri için
2. `CookiePreferences` bölümü - Modal metinleri, etiketler ve açıklamalar için
3. Her dil için gerekli tüm anahtarları tanımladığınızdan emin olun

### Stil Özelleştirmesi

Banner ve modal tasarımları Tailwind CSS sınıfları kullanılarak oluşturulmuştur. Aşağıdaki öğeleri özelleştirmek mümkündür:

- Renkler - Marka kimliğine uygun olarak buton ve arkaplan renklerini değiştirin
- Yazı tipleri - Font boyutları ve ağırlıkları
- Boşluklar - Padding ve margin değerleri
- Gölgeler - shadow sınıfları ve özel CSS gölgelerle derinlik efektleri
- Animasyonlar - Geçiş (transition) süreleri ve efektleri
- Responsive breakpoint'ler - sm, md, lg öneklerini kullanarak farklı ekran boyutları için davranışlar
- Flex yönlendirme - İçerik yerleşimini özelleştirmek için flex-row, flex-col, flex-row-reverse gibi sınıflar

## GDPR Uyumluluğu

Bu uygulama, GDPR gereksinimlerine aşağıdaki şekillerde uyum sağlamayı amaçlar:

1. Açık izin olmadan çerezleri yüklemez
2. Çerez kullanımı hakkında açık bilgi sağlar
3. Kullanıcıların hangi çerez kategorilerini kabul ettiklerini seçmelerine olanak tanır
4. İstedikleri zaman tercihlerini değiştirme imkanı sunar
5. Detaylı bir çerez politikası içerir
6. Kullanıcı reddettiğinde ilgili çerezleri otomatik olarak temizler
7. Varsayılan olarak çerezleri devre dışı bırakır (opt-in yaklaşımı)

## Next.js Server-Client Model Entegrasyonu

Bu sistem, Next.js'in server ve client component modeline tam entegrasyon sağlayacak şekilde tasarlanmıştır:

1. **Server Components** - Server-side rendering yaparak çevirileri işler ve SEO'yu destekler
2. **Client Wrappers** - Server component'lar ile client component'lar arasında köprü görevi görür
3. **Client Components** - Kullanıcı etkileşimlerini ve state yönetimini yapar

Bu mimari, Next.js uygulamalarında server ve client işlemleri arasında net bir ayrım sağlar, bu da:
- Daha iyi performans (server-side rendering)
- Daha iyi SEO (içerik server tarafında oluşturulur)
- Temiz kod yapısı (sorumlulukların net ayrımı)
- Kolay uluslararasılaştırma (i18n entegrasyonu)
- İyi kullanıcı deneyimi (client-side etkileşimler)

## Başka Projelere Uyarlama

Bu çerez izin sistemini başka projelere uyarlamak için izlenmesi gereken adımlar:

1. Tüm CookieConsent klasörünü proje dosyalarınıza kopyalayın
2. Context dosyalarını projenizin context yapısına entegre edin
3. Banner ve modal bileşenlerini projenizin genel layout'una ekleyin
4. Dil desteği için messages klasörüne gerekli çevirileri ekleyin
5. Çerezleri ve scriptleri kendi ihtiyaçlarınıza göre `ConditionalScripts.tsx` dosyasında güncelleyin
6. Stil ve metinleri markanıza uygun şekilde özelleştirin
7. Herhangi bir özel çerez durumu için `CookieCleaner.tsx` dosyasını güncelleyin
8. Yeni projenizin dil desteğine göre çevirileri yapılandırın

Bu sistem, farklı tasarım tercihlerine, teknik gereksinimlere ve çoklu dil desteğine uyum sağlayacak şekilde modüler olarak tasarlanmıştır. 