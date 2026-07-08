# Otantik Fırın - Sistem ve Mimari Özeti (V2.0)

Bu belge, Otantik Fırın uygulamasının teknik mimarisini, veri akışını ve mevcut operasyonel durumunu detaylandırır. Herhangi bir yeni geliştirici veya yapay zeka aracı için tam bağlam sağlar.

## 1. Teknik Yığın (Tech Stack)
- **Frontend:** React + Vite
- **State Management:** 
  - `CartContext`: Genel sepet ve sipariş akışı.
  - `useBoxStore` (Zustand): Karmaşık Kutu İnşa (Box Builder) ve akıllı kürasyon mantığı.
- **Animasyon:** Framer Motion (Premium geçişler ve modal etkileşimleri).
- **İkonlar:** Lucide React.
- **Stil:** Vanilla CSS (Custom Root Variables & Glassmorphism).
- **Kalıcılık:** LocalStorage (Zustand Persist & Context Sync).

## 2. Mimari Yapı ve Veri Akışı

### A. Akıllı Kutu İnşa Sistemi (Custom Box Builder)
Uygulamanın kalbi olan bu modül, müşterinin karar verme sürecini hızlandırmak için tasarlanmıştır.

1.  **Konfigürasyon (`OrderConfigurator`):** Gramaj (500g/1kg), Paketleme (Tek Kutu/Ayrı Kutular) ve Hazır Oran (Tatlı/Tuzlu) seçimleri.
2.  **Atomik Durum (`useBoxStore`):** 
    - `boxes`: `{ box1: [], box2: [] }` yapısı sayesinde çift kutu senkronizasyonu.
    - `fillRemaining(preference)`: Kalan boşluğu "En Çok Satanlar", "Tatlı" veya "Tuzlu" seçkisiyle otomatik doldurma.
3.  **UI Kontrolleri:**
    - `QuantitySlider`: 0-20 arası hızlı seçim sağlayan taktil slider.
    - `Box Tabs`: Ayrı kutular seçildiğinde kutular arası hızlı geçiş.
4.  **Limit Guard (Sınır Gardiyanı):**
    - Hedef gramaj aşıldığında kullanıcıyı engellemek yerine **"1KG'a Yükselt"** veya **"Karışık Tamamla"** gibi akıllı opsiyonlar sunar.

### B. Sipariş ve Fiş Yönetimi
- **Global Sepet:** Tamamlanan kutular ve tekli ürünler `CartContext` üzerinden yönetilir.
- **Özel Notlar:** Checkout aşamasında `['Arayın', 'Değiştirin', 'Özel İstek']` kategorilerinde not alınabilir.
- **Personel Fişi (`OrderSlipModal`):** Operasyonel hataları sıfırlamak için müşteri notları fişin en üstünde **Kırmızı Etiketli ve Kalın Puntolu** gösterilir.

## 3. Özellik Listesi (Checkpoint)
- [x] **Smart Curation:** Tek tıkla kutuyu dükkanın en iyileriyle doldurma.
- [x] **Persistence:** Tarayıcı kapansa dahi sepet ve inşa aşamasındaki kutu korunur.
- [x] **Dynamic Weights:** 500g (250+250) ve 1kg (500+500) otomatik bölme mantığı.
- [x] **Usta Notu:** Özel ürünlerde ustalardan gelen lezzet ipuçları.
- [x] **WhatsApp Entegrasyonu:** WhatsApp uyumlu profesyonel sipariş fişi üretimi.
- [x] **Alerjen Takibi:** Ürün bazlı detaylı alerjen kartları.

## 4. Kritik Dosyalar ve Görevleri
| Dosya Path | Görev |
| :--- | :--- |
| `src/store/useBoxStore.js` | Kutu inşa mantığı, auto-fill ve gramaj hesaplamaları. |
| `src/context/CartContext.jsx` | Sepet, sipariş onayı ve WhatsApp slip üretimi. |
| `src/pages/SelectionPage.jsx` | Ürün listesi ve Kutu İnşa UI merkezi. |
| `src/data/products.js` | Ürün metadata, auto-fill kategorileri ve usta notları. |
| `src/components/ui/QuantitySlider.jsx` | 0-20 arası hassas adet seçimi. |

## 5. Bilinen Eksikler ve Yol Haritası
- [ ] **Backend Bağlantısı:** Mevcut sistem tamamen client-side çalışmaktadır. API tabanlı stok takibi gereklidir.
- [ ] **Gerçek Zamanlı Tartım:** IOT bir terazi ile entegre edilerek gramaj sapmalarının canlı aktarılması.
- [ ] **Ödeme Geçidi:** Iyzico/Stripe gibi sistemlerin Checkout sayfasına entegrasyonu.
- [ ] **Müşteri Geçmişi:** Firebase/Supabase ile kullanıcı hesapları ve favori karışımların tutulması.

## 6. Hata ve Kritik Uyarılar
- **Sapma Payı:** Ürünler el yapımı olduğu için fişlerde her zaman +/-%15 sapma uyarısı bulunur.
- **Auto-Fill Kısıtı:** Stoktaki ürün azaldığında auto-fill algoritması kategori bazlı havuza geri döner.
