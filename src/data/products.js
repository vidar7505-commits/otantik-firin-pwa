export const PRODUCTS_DATA = [
  // --- POĞAÇA & AÇMA ---
  { 
    id: 301, name: 'Peynirli Dereotlu Poğaça', category: 'Poğaça & Açma', 
    image: '🥐', price: 25, desc: 'Taze dereotu ve beyaz peynirli.', 
    fullDesc: 'Kıyır kıyır dokusu, bol dereotu ve kaliteli beyaz peyniri ile sabahların vazgeçilmezi.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Taze', 'Kahvaltılık'],
    isBestSeller: true, isSalty: true, isSpecial: true 
  },
  { 
    id: 302, name: 'Zeytinli Açma', category: 'Poğaça & Açma', 
    image: '🥯', price: 28, desc: 'Siyah zeytin ezmeli yumuşak açma.', 
    fullDesc: 'Özel hamuru ile tel tel ayrılan, içi bol zeytin ezmeli nefis açma.', 
    rating: 4.8, allergens: ['Gluten', 'Yumurta'], tags: ['Klasik'],
    isSalty: true 
  },
  {
    id: 303, name: 'Sade Poğaça', category: 'Poğaça & Açma', 
    image: '🥐', price: 22, desc: 'Tereyağlı klasik poğaça.', 
    rating: 4.7, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Klasik'],
    isSalty: true
  },

  // --- KEKLER ---
  { 
    id: 401, name: 'Havuçlu Tarçınlı Kek', category: 'Kekler', 
    image: '🥮', price: 45, desc: 'Cevizli ve mis kokulu ev keki.', 
    fullDesc: 'Bol havuç, tarçın ve iri ceviz parçalarıyla hazırlanan, anne keki tadında yumuşacık lezzet.', 
    rating: 5.0, allergens: ['Gluten', 'Yumurta', 'Kuruyemiş'], tags: ['Ev Yapımı', 'Favori'],
    isBestSeller: true, isSweet: true, isSpecial: true 
  },
  { 
    id: 402, name: 'Limonlu Kurumsal Kek', category: 'Kekler', 
    image: '🍋', price: 40, desc: 'Ferahlatıcı gerçek limon kabuklu.', 
    fullDesc: 'Taze sıkılmış limon suyu ve rendelenmiş kabuklarıyla hazırlanan, ferahlatıcı hafif kek.', 
    rating: 4.8, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Hafif'],
    isSweet: true 
  },
  {
    id: 403, name: 'Mozaik Kek', category: 'Kekler', 
    image: '🍫', price: 42, desc: 'Kakaolu ve Vanilyalı klasik.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Geleneksel'],
    isSweet: true
  },

  // --- COOKİLER ---
  { 
    id: 105, name: 'Lotus Biscoff Bomb', category: 'Cookiler', 
    image: '🍪', price: 35, desc: 'Akışkan Biscoff kremalı.', 
    fullDesc: 'İçerisinde Lotus Biscoff kreması saklı, dışı çıtır bisküvi parçalı modern bir kurabiye.', 
    rating: 5.0, allergens: ['Gluten', 'Soya'], tags: ['Modern', 'Favori'],
    isBestSeller: true, isSweet: true, isSpecial: true 
  },
  { 
    id: 109, name: 'Double Chocolate Cookie', category: 'Cookiler', 
    image: '🍫', price: 35, desc: 'Belçika çikolatalı yumuşak kurabiye.', 
    fullDesc: 'Yüksek kaliteli Belçika çikolatası blokları ile fırından yeni çıkmışçasına yumuşak (chewy) doku.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Çikolatalı', 'Yumuşak'],
    isSweet: true 
  },

  // --- TEK KİŞİLİK PASTALAR ---
  { 
    id: 501, name: 'Meyveli Ekler', category: 'Tek Kişilik Pastalar', 
    image: '🍰', price: 40, desc: 'Çilekli ve özel kremalı ekler.', 
    fullDesc: 'El yapımı ekler hamuru, ipeksi pastacı kreması ve taze çilek dilimleri.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Taze', 'Meyveli'],
    isBestSeller: true, isSweet: true, isSpecial: true 
  },
  { 
    id: 502, name: 'Magnolia Puding', category: 'Tek Kişilik Pastalar', 
    image: '🍮', price: 55, desc: 'Muzlu ve bisküvili hafif puding.', 
    fullDesc: 'Taze krema ile hazırlanan hafif puding, bebe bisküvisi ve taze muz dilimleri.', 
    rating: 5.0, allergens: ['Süt', 'Gluten'], tags: ['Hafif', 'Favori'],
    isSweet: true 
  },

  // --- YAŞ PASTALAR ---
  { 
    id: 601, name: 'Belçika Çikolatalı Yaş Pasta', category: 'Yaş Pastalar', 
    image: '🎂', price: 450, desc: 'Yoğun ganajlı kutlama pastası.', 
    fullDesc: 'Kat kat yumuşak pandispanya, %70 kakaolu Belçika çikolatası ganajı ve fıstık drajeli iç dolgu.', 
    rating: 5.0, allergens: ['Gluten', 'Süt', 'Yumurta', 'Soya'], tags: ['Kutlama', 'Premium'],
    isBestSeller: true, isSweet: true, isSpecial: true,
    isCake: true, isConfigurable: true, availableSizes: ['0 No', '1 No'] 
  },
  { 
    id: 602, name: 'Kırmızı Meyveli Charlotte', category: 'Yaş Pastalar', 
    image: '🍰', price: 480, desc: 'Frambuaz ve böğürtlenli hafif pasta.', 
    fullDesc: 'Kedidili bisküvilerle çevrili, orman meyveleri ve hafif mus krema ile hazırlanan şık pasta.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Meyveli', 'Zarif'],
    isSweet: true,
    isCake: true, isConfigurable: true, availableSizes: ['0 No', '1 No'] 
  },
  { 
    id: 603, name: 'Çikolata & Frambuaz Şöleni', category: 'Yaş Pastalar', 
    image: '🍫', price: 470, desc: 'Bitter çikolata ve taze frambuaz.', 
    fullDesc: 'Özel bitter çikolata ganajı ve taze frambuaz tanelerinin muhteşem uyumu. Hafif ve yoğun bir lezzet.', 
    rating: 5.0, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Favori', 'Çikolatalı'],
    isCake: true, isConfigurable: true, availableSizes: ['0 No', '1 No'] 
  },
  { 
    id: 604, name: 'Muzlu & Fındıklı Rulo Pasta', category: 'Yaş Pastalar', 
    image: '🍌', price: 420, desc: 'Klasik rulo pastanın modern hali.', 
    fullDesc: 'Yumuşacık pandispanya, taze muz dilimleri ve kavrulmuş fındık parçaları ile zenginleştirilmiş rulo pasta.', 
    rating: 4.8, allergens: ['Gluten', 'Süt', 'Yumurta', 'Kuruyemiş'], tags: ['Klasik', 'Muzlu'],
    isCake: true, isConfigurable: true, availableSizes: ['0 No', '1 No'] 
  },
  { 
    id: 605, name: 'Karamelli & Cevizli Pasta', category: 'Yaş Pastalar', 
    image: '🍯', price: 460, desc: 'Tuzlu karamel ve ceviz parçalı.', 
    fullDesc: 'Ev yapımı tuzlu karamel sosu, kıtır ceviz parçaları ve ipeksi krema ile hazırlanan gurme lezzet.', 
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Kuruyemiş'], tags: ['Karamelli', 'Modern'],
    isCake: true, isConfigurable: true, availableSizes: ['0 No', '1 No'] 
  },

  // Kutu için özel ürünler (Box Builder'da kullanılanlar)
  // --- KURU PASTA ---
  { 
    id: 106, name: 'Fıstık Ezmeli Kurabiye', category: 'kuru-pasta', group: 'Gevrek & Kurabiye', 
    image: '🟢', price: 45, desc: 'Gerçek Boz fıstıklı artizan kurabiye.', 
    rating: 4.9, allergens: ['Gluten', 'Kuruyemiş'], tags: ['Premium', 'Fıstıklı'],
    isSweet: true 
  },
  {
    id: 107, name: 'Tuzlu Kandil Simidi', category: 'kuru-pasta', group: 'Geleneksel Tuzlular',
    image: '🥨', price: 40, desc: 'Bol susamlı, ağızda dağılan klasik.',
    rating: 4.8, allergens: ['Gluten', 'Susam'], tags: ['Klasik', 'Tuzlu'],
    isSalty: true
  },
  {
    id: 108, name: 'Peynirli Çubuk', category: 'kuru-pasta', group: 'Geleneksel Tuzlular',
    image: '🥖', price: 40, desc: 'Parmesanlı çıtır atıştırmalık.',
    rating: 4.7, allergens: ['Gluten', 'Süt'], tags: ['Tuzlu'],
    isSalty: true
  },
  {
    id: 110, name: 'Portakallı Anne Kurabiyesi', category: 'kuru-pasta', group: 'Gevrek & Kurabiye',
    image: '🍊', price: 42, desc: 'Taze portakal kabuğu rendeli.',
    rating: 4.9, allergens: ['Gluten', 'Yumurta'], tags: ['Tatlı', 'Anne Usulü'],
    isSweet: true
  },
  {
    id: 111, name: 'Çörek Otlu Mini', category: 'kuru-pasta', group: 'Geleneksel Tuzlular',
    image: '⚫', price: 40, desc: 'Tek lokmalık çörek otlu lezzet.',
    rating: 4.8, allergens: ['Gluten', 'Yumurta'], tags: ['Tuzlu'],
    isSalty: true
  },

  // --- PETİFÜR ---
  { 
    id: 201, name: 'Meyveli Tartlet', category: 'petifur', group: 'Meyveli Seçki', 
    image: '🍓', price: 45, desc: 'Taze çilek ve ipeksi krema dolgulu.', 
    rating: 5.0, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Taze', 'Meyveli'],
    isSweet: true 
  },
  {
    id: 202, name: 'Mini Ekler', category: 'petifur', group: 'Çikolatalı Lezzetler',
    image: '🍫', price: 45, desc: 'Çikolata kaplı çıtır hamur.',
    rating: 4.9, allergens: ['Gluten', 'Süt', 'Yumurta'], tags: ['Çikolatalı'],
    isSweet: true
  },
  {
    id: 203, name: 'Fıstık Rüyası', category: 'petifur', group: 'Özel Dolgular',
    image: '🟢', price: 50, desc: 'Yoğun Antep fıstığı dolgulu mini top.',
    rating: 5.0, allergens: ['Gluten', 'Süt', 'Kuruyemiş'], tags: ['Premium'],
    isSweet: true
  },
  {
    id: 204, name: 'Limonlu Mereng', category: 'petifur', group: 'Meyveli Seçki',
    image: '🍋', price: 45, desc: 'Limon kremalı tartlet.',
    rating: 4.8, allergens: ['Gluten', 'Yumurta'], tags: ['Hafif'],
    isSweet: true
  },
  {
    id: 205, name: 'Kadife (Red Velvet)', category: 'petifur', group: 'Özel Dolgular',
    image: '🔴', price: 48, desc: 'Peynir kremalı mini kek.',
    rating: 4.9, allergens: ['Gluten', 'Süt'], tags: ['Modern'],
    isSweet: true
  }
];
