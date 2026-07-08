export const CAKE_CATALOG = [
  {
    id: 'bento-1', category: 'Bento Pasta', emoji: '🎁',
    name: 'Minimalist Çikolata Bento',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    shortDesc: 'Tek kişilik şık mini pasta',
    fullDesc: 'El yazısı mesaj yazılabilen, mat çikolata ganajlı minimalist bento pasta. Hediye kutusunda sunulur.',
    refIngredients: ['Çikolata Dolgusu', 'Parça Bitter Çikolata'],
    refSize: '0 No',
    tags: ['Hediye', 'Mini', 'Kişisel'],
    basePrice: 380
  },
  {
    id: 'bento-2', category: 'Bento Pasta', emoji: '🌸',
    name: 'Çiçekli Vanilyalı Bento',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    shortDesc: 'Çiçek süslemeli bento',
    fullDesc: 'Japon tarzı el boyaması çiçek desenleri ile süslenmiş hafif vanilyalı kremalı bento.',
    refIngredients: ['Prenses Krema (Hafif)', 'Çilek'],
    refSize: '0 No',
    tags: ['Trend', 'Hediye', 'Zarif'],
    basePrice: 400
  },
  {
    id: 'trend-1', category: 'Trend Pastalar', emoji: '✨',
    name: 'Lotus Karamel Drip Cake',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80',
    shortDesc: 'Akışkan karamel ve Lotus kırıklı',
    fullDesc: 'Lotus Biscoff drip, tuzlu karamel akışkan sos ve bisküvi parçaları ile süslenmiş modern pasta.',
    refIngredients: ['Akışkan Karamel', 'Beyaz Çikolata'],
    refSize: '1 No',
    tags: ['Modern', 'Viral', 'Karamel'],
    basePrice: 520
  },
  {
    id: 'trend-2', category: 'Trend Pastalar', emoji: '🌈',
    name: 'Ombre Pembe Pasta',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
    shortDesc: 'Tondan tona geçişli pembe rüya',
    fullDesc: 'Açık pembeden koyuya geçişli butter cream kaplama, taze çilek süsleme ve altın varak detayları.',
    refIngredients: ['Prenses Krema (Hafif)', 'Çilek'],
    refSize: '1 No',
    tags: ['Estetik', 'Doğum Günü', 'Pembe'],
    colorWarning: true,
    basePrice: 550
  },
  {
    id: 'seker-1', category: 'Şeker Hamurlu', emoji: '🦄',
    name: 'Unicorn Fantasy',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
    shortDesc: 'Unicorn figürlü şeker hamuru pasta',
    fullDesc: 'El yapımı unicorn figürü, gökkuşağı renk şeker hamuru kaplama, vanilyalı pandispanya.',
    refIngredients: ['Prenses Krema (Hafif)', 'Muz', 'Beyaz Çikolata'],
    refSize: '2 No',
    tags: ['Çocuk', 'Parti', 'Renkli'],
    colorWarning: true,
    basePrice: 580
  },
  {
    id: 'seker-2', category: 'Şeker Hamurlu', emoji: '🌸',
    name: 'Vintage Çiçek Bahçesi',
    image: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80',
    shortDesc: 'El yapımı şeker hamuru çiçekler',
    fullDesc: 'Her biri tek tek şekillendirilen şeker hamuru güller, yapraklar ve vintage tonlu pasta.',
    refIngredients: ['Fıstık Kreması', 'Antep Fıstığı'],
    refSize: '2 No',
    tags: ['Düğün', 'Nişan', 'Zarif'],
    basePrice: 620
  },
  {
    id: 'meyve-1', category: 'Meyveli Pastalar', emoji: '🍓',
    name: 'Kızıl Orman Charlotte',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    shortDesc: 'Orman meyveleri şöleni',
    fullDesc: 'Kedidili bisküvi bordür, frambuaz + vişne + böğürtlen karışımı, hafif mus krema.',
    refIngredients: ['Frambuaz', 'Vişne', 'Böğürtlen'],
    refSize: '1 No',
    tags: ['Hafif', 'Meyveli', 'Zarif'],
    fruitWarning: true,
    basePrice: 480
  },
  {
    id: 'meyve-2', category: 'Meyveli Pastalar', emoji: '🍓',
    name: 'Çilek & Chantilly Klasiği',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80',
    shortDesc: 'Klasik Fransız çilek pastası',
    fullDesc: 'Taze çilek dilimleri, hafif Chantilly krema, ince pandispanya katları. Zarafetin simgesi.',
    refIngredients: ['Çilek', 'Prenses Krema (Hafif)'],
    refSize: '1 No',
    tags: ['Klasik', 'Hafif', 'Taze'],
    fruitWarning: true,
    basePrice: 460
  }
];

export const SHOWCASE_CATALOG = [
  {
    id: 601,
    name: 'Belçika Çikolatalı Yaş Pasta',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    desc: 'Bestseller bitter çikolata şöleni.',
    fullDesc: 'Kat kat yumuşak pandispanya, %70 kakaolu bitter Belçika çikolatası ganajı ve fıstık drajeli nefis dolgu.',
    refIngredients: ['Çikolata Dolgusu', 'Parça Bitter Çikolata'],
    refSize: '1 No',
    basePrice: 450
  },
  {
    id: 602,
    name: 'Kırmızı Meyveli Charlotte',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    desc: 'Frambuaz ve böğürtlenli hafif rüya.',
    fullDesc: 'Çevresi kedidili bisküvilerle kaplı, içine taze orman meyveli özel sos ve ipeksi Chantilly kreması.',
    refIngredients: ['Frambuaz', 'Böğürtlen', 'Prenses Krema (Hafif)'],
    refSize: '1 No',
    basePrice: 480
  },
  {
    id: 603,
    name: 'Çikolata & Frambuaz Şöleni',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    desc: 'Bitter çikolata ve taze frambuaz uyumu.',
    fullDesc: 'Yoğun çikolatalı pandispanya, aralarda bol frambuaz taneleri ve ipeksi çikolata sıvaması.',
    refIngredients: ['Frambuaz', 'Çikolata Dolgusu'],
    refSize: '1 No',
    basePrice: 470
  },
  {
    id: 604,
    name: 'Muzlu & Fındıklı Rulo Pasta',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&q=80',
    desc: 'Cevizli ve taze muzlu rulo pasta klasiği.',
    fullDesc: 'Yerli taze muz dilimleri, kıtır fındık parçaları, hafif beyaz pastacı kreması dolgulu ince rulo.',
    refIngredients: ['Muz', 'Fındık Draje', 'Pastacı Kreması'],
    refSize: '1 No',
    basePrice: 420
  },
  {
    id: 605,
    name: 'Karamelli & Cevizli Pasta',
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&q=80',
    desc: 'Ev yapımı karamel sosu ve ceviz.',
    fullDesc: 'Hafif tuzlu karamel sosu, çıtır fırınlanmış ceviz taneleri ve ipeksi karamelize krema dolgu.',
    refIngredients: ['Akışkan Karamel', 'Antep Fıstığı'],
    refSize: '1 No',
    basePrice: 460
  }
];

export const CATALOG_CATEGORIES = ['Tümü', 'Bento Pasta', 'Trend Pastalar', 'Şeker Hamurlu', 'Meyveli Pastalar'];

export const FILLING_OPTIONS = {
  fruits: ['Muz', 'Çilek', 'Frambuaz', 'Vişne', 'Böğürtlen', 'Şeftali'],
  creams: ['Pastacı Kreması', 'Prenses Krema (Hafif)', 'Çikolata Dolgusu', 'Fıstık Kreması', 'Akışkan Karamel'],
  extras: ['Profiterol', 'Parça Bitter Çikolata', 'Beyaz Çikolata', 'Fındık Draje', 'Antep Fıstığı']
};

export const SIZES = [
  { no: '0 No', desc: '4-6 Kişilik', added: 0 },
  { no: '1 No', desc: '8-10 Kişilik', added: 100 },
  { no: '2 No', desc: '12-14 Kişilik', added: 220 },
  { no: '3 No', desc: '18-20 Kişilik', added: 360 },
  { no: '4 No', desc: '24-26 Kişilik', added: 520 }
];

export const CUSTOM_STYLES = [
  { id: 'bento',    name: 'Bento (Yazılı)',       emoji: '🎁', desc: 'Kişisel mini pasta, mesaj yazılır.' },
  { id: 'photo',    name: 'Resimli / Fotoğraflı', emoji: '🖼️', desc: 'Üzerine fotoğraf veya resim baskı.' },
  { id: 'classic',  name: 'Klasik Sıvama',        emoji: '🎂', desc: 'Temiz butter cream kaplama.' },
  { id: 'fondant',  name: 'Şeker Hamurlu',        emoji: '🌸', desc: 'Figürlü, detaylı şeker hamuru.' },
  { id: 'square',   name: 'Kare',                 emoji: '⬜', desc: '+120₺ ek. Min 1 No.', surcharge: 120, minSize: '1 No' },
  { id: 'heart',    name: 'Kalp',                 emoji: '❤️', desc: 'Min 1 No.', minSize: '1 No' },
  { id: 'nissan',   name: 'Nişan / Düğün',        emoji: '💍', desc: 'Zarif, kat seçenekli.' }
];
