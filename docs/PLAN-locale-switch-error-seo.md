# Dil değişiminde çıkan hata — kök neden, çözüm planı ve SEO değerlendirmesi

Tarih: 2026-08-24 · Ortam: canlı (https://tugceaydincignakli.com) · Durum: onaylandı, uygulama bekliyor

---

## 1. Bulgu: bu bir 404 değil, istemci tarafı bir DOM çökmesi

Ekran görüntüsündeki sayfa Next.js 16'nın kendi yerleşik hata ekranıdır
(`node_modules/next/dist/client/components/builtin/global-error.js`, `DefaultGlobalError`).

Ekranın hangi hata sınıfı olduğunu metnin kendisi söylüyor:

- `error.digest` **varsa** metin `"A server error occurred. Reload to try again."` olur ve yalnızca
  **Reload** düğmesi görünür.
- `error.digest` **yoksa** metin `"Reload to try again, or go back."` olur ve **Reload + Back**
  düğmeleri birlikte görünür.

Görselde `"Reload to try again, or go back."` ve iki düğme birlikte var. Yani `digest` yok:
**sunucu hatası değil, istemci tarafında yakalanmamış bir JavaScript hatası.** Adres çubuğu da
`/en` — URL doğru üretilmiş, sayfa bulunamamış değil, render edilirken patlamış.

### Sunucu tarafının sağlam olduğunu doğrulayan ölçümler

- `/en`, `/en/services`, `/en/about`, `/en/appointments`, `/en/kvkk/*`, `/en/services/1`,
  `/en/services/2`, `/en/admin/login` → hepsi **200**.
- `/en` için RSC isteği (dil değişiminin attığı istek) 40 denemede **40/40 200**, 55 KB gövde.
- `/` → `307` ile `/tr`'ye, `/en/` ve `/tr/` → `308` ile eki temizliyor. Hepsi beklenen davranış.

---

## 2. Kök neden: tarayıcı sayfa çevirisi, React'in sahip olduğu metin düğümlerini değiştiriyor

Konsol hatası kesin teşhisi verdi:

```
NotFoundError: The object can not be found here.
  reportError — 3peubv2924kx4.js:1:117019
  p, oO, (anonymous), IG, LJ, lb, i4, us, i4, us, i4, us, ...
```

Canlıdaki `3peubv2924kx4.js` dosyasını indirip yığın izindeki ofsetleri çözdüm. `117019`
konumundaki kod React DOM'un **silme (deletion) commit** yolu:

```js
case 6: ... i5.removeChild(n.stateNode) ... catch(e){ sN(n,t,e) }
```

- `case 6` = **HostText** fiber, yani bir **metin düğümü**.
- `NotFoundError: The object can not be found here.` tam olarak `removeChild`'ın, verilen düğüm
  artık o ebeveynin çocuğu değilse fırlattığı DOM istisnasıdır.
- Tekrar eden `i4` / `us` çerçeveleri bu iki fonksiyonun karşılıklı özyinelemesi
  (`function us(e,t){ if(8772&t.subtreeFlags) ... i4(e,t.alternate,t) ... }`) — commit sırasında
  ağacın gezilmesi.
- En üstteki `p` çerçevesi Next.js'in hata köprüsü: `isBailoutToCSRError` / `isNextRouterError`
  değilse `reportGlobalError(e)` çağırıyor. Yani hata global hata ekranına dönüşüyor.

Bunun tek bir anlamı var: **React'in sahip olduğu metin düğümleri React'in dışında bir şey
tarafından taşınmış/sarmalanmış.** Kanıtlar tarayıcı sayfa çevirisini gösteriyor: ilk görselde
adres çubuğundaki çeviri simgesi, konsol görselinin sağ alt köşesinde **"Auto → en"** kaynak/hedef
seçici.

Zincir şu:

1. Tarayıcı Türkçe sayfayı İngilizceye çeviriyor; metin düğümlerini kendi sarmalayıcılarıyla
   değiştiriyor.
2. Kullanıcı dil düğmesine basıyor. `[locale]` segmenti değiştiği için React **tüm ağacı**
   yeniden render ediyor ve eski metin düğümlerinin **hepsini silmek** zorunda kalıyor.
3. `removeChild` çağrıları, çevirinin yerinden oynattığı düğümler için başarısız oluyor →
   `NotFoundError`.
4. Uygulamada hiç hata sınırı olmadığı için hata köke kadar çıkıyor ve tüm doküman Next'in
   markasız İngilizce hata ekranıyla değiştiriliyor.

Bu, temiz bir tarayıcıda (çeviri kapalı) 20+ denemede hiç tekrar etmemesini de açıklıyor —
tekrar üretmek için çevirinin açık olması gerekiyor. "İlk seferde patlıyor, yenileyince düzeliyor"
gözlemi de buradan geliyor: yenilemeden sonra React temiz, kendi sahip olduğu DOM ile başlıyor.

### Neden ana sayfada?

Ana sayfa hem giriş noktası (çeviri istemi/otomatik çeviri orada devreye giriyor) hem de en yoğun
metin düğümüne sahip sayfa. Ayrıca yalnızca ana sayfada bulunan `ServicesCarousel` ve
`TestimonialsCarousel`, `Autoplay` ile her slayt değişiminde `setState` tetikleyip yeniden render
ediyor — yani çeviri açıkken sürekli yeni commit üretiyor.

## 2b. Sorunu büyüten yapısal etkenler

Aşağıdakiler hatanın sebebi değil ama yıkıcı ve aralıklı olmasının sebebi. Hepsi ayrıca
düzeltilmeli.

### Uygulamada hiç hata sınırı yok — asıl büyütücü

`src/app` altında `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` dosyalarının
**hiçbiri yok**. Tek bir istemci hatası hiçbir yerde yakalanmıyor ve tüm dokümanı götürüyor;
kullanıcıya siteye dönecek tek bir bağlantı bile kalmıyor.

Aynı boşluk gerçek 404'lerde de görünüyor: `/en/tr`, `/tr/en`, `/en/hizmetler`, silinmiş bir
hizmetin adresi → hepsi Next'in varsayılan `404: This page could not be found.` sayfasını
gösteriyor. Markasız, İngilizce, menüsüz.

### Tüm site gereksiz yere dinamik — her geçiş taze sunucu render'ı

`src/app/[locale]/layout.tsx` içinde sadece footer'daki "Personel girişi" bağlantısını gizlemek
için `await cookies()` çağrılıyor:

```81:82:src/app/[locale]/layout.tsx
  const cookieStore = await cookies();
  const isStaffLoggedIn = !!cookieStore.get(SESSION_COOKIE);
```

Bu tek çağrı **bütün siteyi** statik render'dan çıkarıyor. Ölçümle doğrulandı: her sayfa
`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` dönüyor ve hiçbir yanıtta
`x-nextjs-prerender` yok. Aynı layout'taki `generateStaticParams()` bu yüzden ölü kod. Canlıda
ölçülen dil geçiş süresi **800–1150 ms**; bu uzun pencere hem kullanıcıyı tekrar tıklamaya itiyor
hem de çökme için geniş bir zaman aralığı bırakıyor.

### Dil değiştirici geri bildirim vermiyor ve tekrar tıklamaya açık

```15:20:src/components/layout/language-toggle.tsx
  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }
    router.replace(pathname, { locale: nextLocale });
  }
```

`useTransition` yok, bekleme durumu yok, düğmeler kilitlenmiyor. Ayrıca `nextLocale === locale`
koruması `useLocale()`'e bakıyor; bu değer geçiş tamamlanana kadar **eski dilde** kaldığı için
ikinci tıklama engellenmiyor ve üst üste binen iki gezinme oluşuyor.

Buna bağlı ikinci bir risk: next-intl'in `usePathname()`'i öneki yalnızca `useLocale()` ile
eşleşiyorsa kırpıyor (`node_modules/next-intl/.../useBasePathname.js`), `router.replace` ise öneki
koşulsuz ekliyor (`createSharedNavigationFns.js` → `applyPathnamePrefix`). İstemcinin dili ile URL
öneki bir an ayrışırsa çift önekli adres üretilir. Canlıda doğruladım: `/en/tr` ve `/tr/en` → **404**.

### Yan bulgu: bozuk RSC başlığı 500 veriyor

`Next-Router-State-Tree` başlığı geçersiz gönderildiğinde sunucu `500 Internal Server Error`
dönüyor. Gerçek tarayıcılar böyle istek atmaz ama botlar atabilir; sunucu tarafında da hata
yönetimi olmadığını gösteriyor.

---

## 3. Çözüm planı

Seçilen yaklaşım: **hedefli**. Dil geçişi tam sayfa gezinmesine çevrilir, React'in sürekli
değiştirdiği bölgeler çeviriden muaf tutulur, hata sınırları güvenlik ağı olarak eklenir. Statik
içerik çevrilebilir kalır — sağlık turizmi ziyaretçileri için önemli.

### Adım 1 — Dil geçişini tam sayfa gezinmesine çevir (asıl düzeltme)

`src/components/layout/language-toggle.tsx` içindeki `router.replace(pathname, { locale })`
istemci tarafı geçişi yerine gerçek bir doküman gezinmesi kullanılacak: düğmeler yerine
`<a href="/en/...">` bağlantıları (veya `window.location.assign`).

Neden bu çökme sınıfını bitiriyor: doküman tamamen değiştiği için React'in çeviri tarafından
bozulmuş eski DOM'u uzlaştırması (reconcile) hiç gerekmiyor — silinecek metin düğümü kalmıyor.

Yan kazançlar:

- Diller arası **taranabilir `<a>` bağlantıları** oluşur; Google alternatif dil sürümlerini
  bağlantı üzerinden de keşfeder.
- `<html lang>` taze dokümanla doğru şekilde güncellenir.
- Çift tıklama / yeniden giriş sorunu ortadan kalkar; tarayıcı kendi yükleme göstergesini verir.
- Çift önekli `/en/tr` üretme riski yapısal olarak kalkar (hedef yol açıkça kurulacak).

Not: `syncLocaleCookie` artık çalışmayacak, ama gerek de yok — middleware önekli istekte
`NEXT_LOCALE` çerezini kendisi set ediyor (ölçtüm: `/en` yanıtında
`set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax`).

### Adım 2 — Hata sınırları ve markalı 404 (güvenlik ağı)

- `src/app/[locale]/error.tsx`: istemci bileşeni, iki dilde, `reset()` ile "Tekrar dene" düğmesi.
  Locale layout'un içinde render edildiği için Header/Footer korunur.
- `src/app/global-error.tsx`: son çare. Kendi `<html>`/`<body>` kabuğunu üretmeli, layout'a veya
  çeviriye bağımlı olmamalı (satır içi stil + sabit TR/EN metin).
- `src/app/[locale]/not-found.tsx` ve `src/app/not-found.tsx`: markalı, dile duyarlı 404;
  ana sayfa / hizmetler / iletişim bağlantıları; `noindex`.
  Dikkat: `src/app/layout.tsx` şu an sadece `children` döndürüyor, `<html>`/`<body>` yok — kök
  `not-found.tsx` kendi doküman kabuğunu sağlamalı.

### Adım 3 — React'in sürekli değiştirdiği bölgeleri çeviriden muaf tut

`translate="no"` (ve gerekirse `className="notranslate"`) yalnızca şuralara:

- `ServicesCarousel` ve `TestimonialsCarousel` bölümleri — `Autoplay` her slayt değişiminde
  `setState` tetikleyip yeniden render ediyor, yani çeviri açıkken en riskli iki nokta.
- `Toaster` (sonner) — DOM'a dinamik olarak düğüm ekleyip çıkarıyor.

Statik metinler (hero, kartlar, footer, hizmet listesi) çevrilebilir kalır. `notranslate`
indeksleme veya sıralamayı etkilemez; yalnızca tarayıcının çeviri müdahalesini engeller.

### Adım 4 — Statik render'ı geri kazan

`src/app/[locale]/layout.tsx` içindeki `cookies()` çağrısını kaldır. "Personel girişi" bağlantısı
koşulsuz gösterilsin — `/admin/*` zaten `src/middleware.ts` ile korunuyor, bağlantının görünür
olması güvenlik sorunu değil. (Alternatif: oturumu küçük bir route handler ile kontrol eden ayrı
bir istemci bileşeni; davranış korunur ama bir istek ekler.)

Doğrulama: `curl -I` çıktısında `x-nextjs-prerender: 1` ve önbelleklenebilir bir `Cache-Control`
görülmeli; `private, no-store` kalkmalı. Bu, Adım 1'deki tam sayfa gezinmesinin maliyetini de
neredeyse sıfırlar.

### Adım 5 — Ana sayfa carousel'lerini sunucuda render et

- Veriyi sunucuda çek — `fetchActiveServices` zaten `src/lib/server/services.ts` içinde var — ve
  prop olarak geçir. İstemcide yalnızca Embla etkileşimi kalsın.
- `Autoplay({...})` çağrısını render'ın dışına çıkar (`useMemo` veya modül sabiti), böylece Embla
  her render'da yeniden başlatılmaz.

Bu adım hem çökme yüzeyini küçültür hem de aşağıdaki en büyük SEO açığını kapatır.

### Adım 6 — Geçici backend arızasında 404 verme

`src/lib/server/services.ts` içinde `fetchServiceById`, "hizmet yok" ile "backend'e ulaşılamadı"
durumlarının ikisinde de `null` dönüyor; sayfa da ikisinde de `notFound()` çağırıyor. Bu, geçici
bir arızada Google'a "bu sayfa silindi" demek. İkisi ayrıştırılmalı: `AbortSignal.timeout(...)`
eklenmeli ve ağ/HTTP hatasında `notFound()` yerine hata fırlatılmalı ki Adım 2'deki hata sınırı
"tekrar dene" gösterebilsin.

### Adım 7 — SEO düzeltmeleri

- `src/lib/seo.ts` (`buildLanguageAlternates`, satır 35-36): `x-default` şu an apex `/`'i
  gösteriyor, o da `307` yönlendirme. İndekslenebilir olan `/tr`'ye çevrilmeli.
- `src/app/sitemap.ts`: her dili kendi `<loc>` kaydı olarak yaz, alternates setine `x-default`
  ekle, `lastModified: new Date()` yerine sabit tarih kullan
  (`NEXT_PUBLIC_SITE_LAST_UPDATED` zaten `next.config.ts` içinde damgalanıyor) veya hizmetin
  `updatedAt` değerini kullan.
- `NextIntlClientProvider`'a tüm katalog yerine yalnızca gereken ad alanları verilmeli (bkz. 4.4).

### Adım 8 — Doğrulama

- **Kritik repro:** tarayıcı çevirisi **açıkken** ana sayfada dil geçişini 20+ kez tekrarla
  (Safari Çeviri ve Chrome Google Translate ile ayrı ayrı), masaüstü ve mobil görünümde, hızlı
  çift tıklama dahil. Konsolda `NotFoundError` görülmemeli.
- `/en/tr`, `/tr/en`, `/en/hizmetler` → markalı, dile duyarlı 404 ve gerçek `404` durum kodu.
- `curl -I` ile prerender ve önbelleklenebilirlik; `curl` çıktısında hizmet ve yorum metinlerinin
  JS olmadan görünmesi.
- canonical / hreflang / sitemap çıktısını yeniden kontrol et.

---

## 4. SEO değerlendirmesi

### 4.1 Hata ekranının kendisi: doğrudan SEO etkisi düşük

Hata tarayıcı çevirisi kaynaklı ve tamamen istemci tarafında. Googlebot sayfa çevirisi
kullanmadığı için bu çökmeyi tetiklemez; ilk HTML çekişi de sağlam (ölçtüm: hepsi 200). Yani
**bu hata yüzünden indeksleme kaybı yaşandığı beklenmiyor.**

Etki insan tarafında ve orada ciddi: Türkçe sayfayı tarayıcısıyla çevirmiş bir ziyaretçi —
tipik olarak yabancı, yani sağlık turizmi hedef kitlesi — siteyi İngilizceye almaya çalıştığı
anda gezinilemeyen bir sistem hatası görüyor. Dönüşüm için mümkün olan en kötü moment.

### 4.2 Bugün ölçülebilir en büyük kayıp: ana sayfa içeriği HTML'de yok

Ana sayfanın sunucu HTML'inde şunlar **hiç yok** (grep ile doğrulandı):

- `>Hizmetlerimiz<`, `>Her gülüşe özel bakım<`, `>Hastalarımız ne diyor<` başlıkları → 0 eşleşme
- Hizmet adları render edilmiş metin olarak → 0 eşleşme (yalnızca RSC yükündeki serileştirilmiş
  çeviri JSON'unda geçiyorlar, o da sayfa içeriği sayılmaz)
- `carousel` işaretlemesi → 0 eşleşme

Ticari niyeti en yüksek içerik — hizmet adları, açıklamalar, hasta yorumları — ana sayfanın sunucu
HTML'inde bulunmuyor; yalnızca istemci JS'i API'den çektikten sonra ortaya çıkıyor. Google JS'i
render eder ama bunu ikinci bir tarama dalgasında, kuyruğa alarak ve daha az güvenilir şekilde
yapar. Hasta yorumları için ayrıca `Review`/`AggregateRating` yapısal verisi üretilmiyor — yerel
diş hekimi aramalarında yıldız zenginleştirmesi fırsatı kaçıyor.

`/tr/services` liste sayfası sunucu bileşeni ve içeriği HTML'de mevcut (`>Genel Muayene<`
bulundu). Yani kayıp ana sayfaya özgü.

### 4.3 Core Web Vitals: her sayfa önbelleksiz

Her yanıt `private, no-cache, no-store`. Hiçbir sayfa prerender edilmiyor, hiçbir katman
önbelleğe alamıyor. Buradan ölçülen TTFB 250–420 ms; Türkiye'den mobil bağlantıda belirgin şekilde
daha kötü olacak ve doğrudan LCP'ye yazılıyor. LCP ve INP sıralama sinyalidir. Adım 4 bunu tek
dosya değişikliğiyle çözüyor.

### 4.4 Sayfa ağırlığı: çeviri kataloğunun tamamı her sayfada

`NextIntlClientProvider`'a tüm mesaj kataloğu veriliyor; 372 anahtarın tamamı — KVKK hukuk
metinleri dahil — her sayfanın HTML'ine serileştiriliyor. Ana sayfa HTML'i bu yüzden ~101 KB.
Yalnızca gereken ad alanlarını geçirmek bunu belirgin şekilde düşürür.

### 4.5 hreflang ve sitemap kusurları

- `x-default` apex `/`'i gösteriyor, o da `307` yönlendirme. Google hreflang hedeflerinin canonical
  ve indekslenebilir olmasını ister; yönlendiren bir hedef yok sayılır. Sonuç: TR/EN çiftinin küme
  olarak doğru gruplanmaması riski.
- Sitemap'te `/en/...` adresleri hiç kendi `<loc>` kaydı olarak geçmiyor, yalnızca `/tr` kaydının
  `xhtml:link` alternatifi olarak var. Ayrıca sitemap alternates setinde `x-default` yok.
- `lastmod` her istekte o anın zaman damgası. Google böyle bir `lastmod`'a güvenmeyi bırakır ve
  yok sayar; tazelik sinyali kaybediliyor.

### 4.6 Doğru kurulmuş olanlar (bozmayalım)

Sayfa başına canonical ve `tr`/`en` hreflang çiftleri doğru; `robots.txt` ve `sitemap.xml` 200
dönüyor; `/admin` taramaya kapalı; `Dentist`, `WebSite`, `PostalAddress`, `GeoCoordinates`,
`OpeningHoursSpecification`, `ReserveAction` JSON-LD'leri mevcut; www → apex 301 ve HTTPS
zorlaması yerinde.

---

## 5. Uygulama sırası

Adım 1 → 2 → 3 semptomu bitirir (1 asıl düzeltme, 2 güvenlik ağı, 3 kalan çeviri riski).
Adım 4 → 5 yavaşlığı ve çökme yüzeyini ortadan kaldırır. Adım 6 → 7 SEO borcunu kapatır.
Adım 8 doğrulaması, özellikle tarayıcı çevirisi açıkken yapılan repro, kabul kriteridir.
