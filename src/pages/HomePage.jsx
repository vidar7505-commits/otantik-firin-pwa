import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Minus, ShoppingCart, Star, ChevronRight, ChevronLeft, X, Check, Info, Droplets, Leaf, Nut, Egg, Wheat, Flame, Cake, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderConfigurator } from '../components/menu/OrderConfigurator';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';
import { CakeConfigurator } from '../components/menu/CakeConfigurator';
import img0no from '../assets/images/0no.png';
import img1no from '../assets/images/1no.png';
import { PRODUCTS_DATA as initialProducts } from '../data/products';
import { getRecommendations } from '../utils/recommendations';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

// ─── Menü Yaş Pasta Konfiguratörü ────────────────────────────────────────────
const CAKE_MENU_SIZES = [
  {
    no: 0,
    label: '0 No',
    subtitle: 'Küçük Boy',
    desc: '4-6 Kişilik',
    diameter: '14 cm',
    height: '7 cm',
    occasion: 'Küçük Kutlamalar',
    surcharge: 0,
    img: img0no,
  },
  {
    no: 1,
    label: '1 No',
    subtitle: 'Orta Boy',
    desc: '8-10 Kişilik',
    diameter: '18 cm',
    height: '7 cm',
    occasion: 'Aile ve Arkadaş\nBuluşmaları',
    surcharge: 100,
    img: img1no,
  },
];

const PAID_EXTRAS = [
  { id: 'text-candle', label: 'Yazılı Mum', price: 25, icon: '🕯️' },
  { id: 'sparkler-paid', label: 'Maytap (Büyük)', price: 35, icon: '✨' },
  { id: 'volcano', label: 'Volkan (Süslü)', price: 50, icon: '🌋' },
];

const NUM_CANDLE_OPTIONS = ['1','2','3','4','5','6','7','8','9','0'];

const PLATE_SUGGESTIONS = [
  'İyi ki doğdun! 🎂',
  'Mutlu Yıllar 🎉',
  'Tebrikler! 🌟',
  'Nice mutlu yıllara ❤️',
  'Seni seviyoruz 💕',
  'Hayırlı olsun 🎊',
  'Başarılar! 🏆',
  'Yıldönümünüz kutlu olsun 💍',
];

const MenuCakeConfigurator = ({ product, onClose, onAddToCart }) => {
  const basePrice = product.price || 450;
  const [selectedSizeNo, setSelectedSizeNo] = useState(0);
  const [plakaYazisi, setPlakaYazisi] = useState('');
  const [hasMessage, setHasMessage] = useState(false);
  const [freeCandle, setFreeCandle] = useState(false);
  const [freeSparkler, setFreeSparkler] = useState(false);
  const [paidExtras, setPaidExtras] = useState({});
  const [numCandleQty, setNumCandleQty] = useState({});
  const [showNumCandle, setShowNumCandle] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const selectedSize = CAKE_MENU_SIZES.find(s => s.no === selectedSizeNo);

  const extrasTotal = PAID_EXTRAS.reduce((acc, e) => acc + (paidExtras[e.id] || 0) * e.price, 0);
  const numCandleTotal = Object.values(numCandleQty).reduce((a, b) => a + b, 0) * 15;
  const finalPrice = (basePrice + (selectedSize?.surcharge || 0) + extrasTotal + numCandleTotal) * quantity;

  const togglePaidExtra = (id) => {
    setPaidExtras(prev => ({ ...prev, [id]: (prev[id] || 0) === 0 ? 1 : 0 }));
  };

  const toggleNumCandle = (num) => {
    setNumCandleQty(prev => ({ ...prev, [num]: (prev[num] || 0) === 0 ? 1 : 0 }));
  };

  const handleAddToCart = () => {
    const chosenNums = Object.entries(numCandleQty).filter(([, c]) => c > 0).map(([n]) => n);
    const cartItem = {
      id: `cake-${product.id}-${Date.now()}`,
      name: product.name,
      price: finalPrice / quantity,
      quantity,
      image: product.image,
      selectedSize: selectedSize?.label,
      extras: {
        free: { candle: freeCandle, sparkler: freeSparkler, hasMessage, message: hasMessage ? plakaYazisi : '' },
        paid: { ...Object.fromEntries(PAID_EXTRAS.map(e => [e.id, paidExtras[e.id] || 0])), 'num-candle': numCandleQty }
      },
      orderJson: {
        size_no: selectedSizeNo,
        size_label: selectedSize?.label,
        size_subtitle: selectedSize?.subtitle,
        diameter: selectedSize?.diameter,
        serves: selectedSize?.desc,
        plate_message: hasMessage ? plakaYazisi : null,
        free_candle: freeCandle,
        free_sparkler: freeSparkler,
        num_candles: chosenNums,
      }
    };
    onAddToCart(cartItem);
    onClose();
  };

  const RED = '#E53935';
  const RED_MUTED = 'rgba(229,57,53,0.1)';

  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Başlık ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
        <div>
          <span style={{ fontSize: '0.6rem', color: RED, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Yaş Pasta Özelleştir</span>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: 0, lineHeight: 1.2, color: '#fff' }}>{product.name}</h2>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <X size={16} />
        </button>
      </div>

      {/* ── Boyut Seçimi — Görsel Kartlar ── */}
      <div style={{ marginBottom: '1.4rem' }}>
        <p style={{ fontSize: '0.68rem', opacity: 0.45, marginBottom: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Pasta Boyutu</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CAKE_MENU_SIZES.map(size => {
            const isActive = selectedSizeNo === size.no;
            return (
              <button
                key={size.no}
                onClick={() => setSelectedSizeNo(size.no)}
                style={{
                  padding: 0,
                  borderRadius: 20,
                  border: isActive ? `2.5px solid ${RED}` : '1.5px solid rgba(255,255,255,0.07)',
                  background: 'none',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 8px 24px rgba(229,57,53,0.25)` : 'none',
                }}
              >
                {/* Görsel */}
                <img
                  src={size.img}
                  alt={size.label}
                  style={{
                    width: '100%',
                    aspectRatio: '9/14',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    filter: isActive ? 'brightness(1)' : 'brightness(0.65)',
                    transition: 'filter 0.25s ease',
                  }}
                />
                {/* Overlay seçim çipi */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: RED,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}>
                    <Check size={13} color="#fff" strokeWidth={3} />
                  </div>
                )}
                {/* Ek ücret etiketi */}
                {size.surcharge > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(212,175,55,0.92)',
                    color: '#000',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: 20,
                  }}>
                    +{size.surcharge} ₺
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* Seçilen boyut bilgi satırı */}
        {selectedSize && (
          <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: '0.7rem', opacity: 0.55, paddingLeft: 2 }}>
            <span>📏 Ç: {selectedSize.diameter}</span>
            <span>📐 Y: {selectedSize.height}</span>
            <span>👥 {selectedSize.desc}</span>
          </div>
        )}
      </div>

      {/* ── Plaka Yazısı ── */}
      <div style={{ marginBottom: '1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: '0.68rem', opacity: 0.45, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>💌 Plaka Yazısı</p>
          <button
            onClick={() => { setHasMessage(h => !h); if (hasMessage) setPlakaYazisi(''); }}
            style={{
              padding: '3px 12px', borderRadius: 20,
              border: hasMessage ? `1px solid ${RED}` : '1px solid rgba(255,255,255,0.12)',
              background: hasMessage ? RED_MUTED : 'transparent',
              color: hasMessage ? RED : 'rgba(255,255,255,0.35)',
              fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer',
            }}
          >
            {hasMessage ? '✓ Açık' : 'Ekle'}
          </button>
        </div>

        {hasMessage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Popüler Öneriler */}
            <div>
              <p style={{ fontSize: '0.6rem', opacity: 0.35, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>EN ÇOK TERCİH EDİLENLER</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PLATE_SUGGESTIONS.map(sug => (
                  <button
                    key={sug}
                    onClick={() => setPlakaYazisi(sug)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 20,
                      border: plakaYazisi === sug ? `1px solid ${RED}` : '1px solid rgba(255,255,255,0.1)',
                      background: plakaYazisi === sug ? RED_MUTED : 'rgba(255,255,255,0.03)',
                      color: plakaYazisi === sug ? RED : 'rgba(255,255,255,0.55)',
                      fontSize: '0.68rem',
                      fontWeight: plakaYazisi === sug ? 800 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
            {/* Manuel giriş */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                maxLength={40}
                placeholder="Veya kendi yazınızı girin… (maks. 40 karakter)"
                value={plakaYazisi}
                onChange={e => setPlakaYazisi(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${plakaYazisi ? RED + '66' : 'rgba(255,255,255,0.08)'}`,
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
              <span style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '0.6rem', opacity: 0.3 }}>
                {plakaYazisi.length}/40
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Ücretsiz İkramlar ── */}
      <div style={{ marginBottom: '1.2rem' }}>
        <p style={{ fontSize: '0.68rem', opacity: 0.45, marginBottom: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>🎁 İkramlar (Ücretsiz)</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'candle', label: 'Mum 🕯️', val: freeCandle, toggle: () => setFreeCandle(v => !v) },
            { key: 'sparkler', label: 'Maytap ✨', val: freeSparkler, toggle: () => setFreeSparkler(v => !v) },
          ].map(item => (
            <button
              key={item.key}
              onClick={item.toggle}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 14, cursor: 'pointer',
                border: item.val ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.08)',
                background: item.val ? RED_MUTED : 'rgba(255,255,255,0.02)',
                color: item.val ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '0.78rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'all 0.2s',
              }}
            >
              {item.label}
              {item.val && <Check size={12} color={RED} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Ücretli Ekstralar ── */}
      <div style={{ marginBottom: '1.4rem' }}>
        <p style={{ fontSize: '0.68rem', opacity: 0.45, marginBottom: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>➕ Ücretli Ekstralar</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PAID_EXTRAS.map(extra => (
            <button key={extra.id} onClick={() => togglePaidExtra(extra.id)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                border: paidExtras[extra.id] ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.07)',
                background: paidExtras[extra.id] ? RED_MUTED : 'rgba(255,255,255,0.02)',
                color: '#fff',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{extra.icon} {extra.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800 }}>+{extra.price} ₺</span>
                {paidExtras[extra.id] > 0 && <Check size={13} color={RED} strokeWidth={3} />}
              </div>
            </button>
          ))}

          {/* Sayılı Mum */}
          <div>
            <button onClick={() => setShowNumCandle(v => !v)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                border: Object.values(numCandleQty).some(v => v > 0) ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.07)',
                background: Object.values(numCandleQty).some(v => v > 0) ? RED_MUTED : 'rgba(255,255,255,0.02)',
                color: '#fff',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>🔢 Sayılı Mum</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800 }}>+15 ₺/rakam</span>
                <ChevronRight size={14} style={{ transform: showNumCandle ? 'rotate(90deg)' : 'none', transition: '0.2s', opacity: 0.5 }} />
              </div>
            </button>
            {showNumCandle && (
              <div style={{ marginTop: 6, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '0.6rem', opacity: 0.35, marginBottom: 8, fontWeight: 700 }}>RAKAM SEÇİN</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {NUM_CANDLE_OPTIONS.map(num => (
                    <button key={num} onClick={() => toggleNumCandle(num)}
                      style={{
                        width: 34, height: 34, borderRadius: 10, cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem',
                        border: numCandleQty[num] ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.1)',
                        background: numCandleQty[num] ? RED_MUTED : 'rgba(255,255,255,0.03)',
                        color: numCandleQty[num] ? RED : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {Object.entries(numCandleQty).filter(([, c]) => c > 0).length > 0 && (
                  <p style={{ fontSize: '0.62rem', color: 'var(--gold)', marginTop: 8, fontWeight: 700 }}>
                    Seçilenler: {Object.entries(numCandleQty).filter(([, c]) => c > 0).map(([n]) => n).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Adet + Sepete Ekle ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.72rem', opacity: 0.4, fontWeight: 700 }}>ADET</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ color: RED, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={16} /></button>
            <span style={{ fontWeight: 900, fontSize: '1rem', minWidth: 18, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{ color: RED, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>{finalPrice.toFixed(0)} ₺</span>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%', padding: '14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${RED} 0%, #B71C1C 100%)`,
            color: '#fff', fontWeight: 900, fontSize: '0.88rem', letterSpacing: 1.5,
            boxShadow: '0 8px 24px rgba(229,57,53,0.3)',
          }}
        >
          SEPETE EKLE — {finalPrice.toFixed(0)} ₺
        </button>
      </div>
    </div>
  );
};

const ALLERGEN_OPTIONS = ['Gluten', 'Süt', 'Yumurta', 'Susam', 'Kuruyemiş', 'Soya'];

const Banner = ({ banner, isActive, isFilterActive, onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ 
      opacity: isActive ? 1 : 0.3, 
      scale: isActive ? 1 : 0.9,
      filter: isActive ? 'blur(0px)' : 'blur(2px)',
      borderColor: isFilterActive ? 'var(--gold)' : 'rgba(212,175,55,0.1)'
    }}
    transition={{ duration: 0.8, ease: "circOut" }}
    whileHover={banner.id === 1 ? { scale: 1.02, borderColor: 'var(--gold)' } : {}}
    style={{ 
      width: 'min(85vw, 550px)',
      flex: '0 0 auto',
      height: '180px', 
      background: banner.color, 
      borderRadius: '32px', 
      padding: '2rem', 
      position: 'relative', 
      border: '2px solid', // Increased border width for active state
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      cursor: banner.id === 1 ? 'pointer' : 'grab',
      boxShadow: isFilterActive ? '0 0 30px rgba(212,175,55,0.2), inset 0 0 40px rgba(212,175,55,0.1)' : (isActive && banner.id === 1) ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(212,175,55,0.05)' : 'none'
    }}
  >
    {banner.id === 1 && (
      <div style={{ position: 'absolute', top: '1.2rem', right: '1.5rem', display: 'flex', gap: '4px', color: 'var(--gold)', opacity: 0.4 }}>
        <Star size={12} fill="currentColor" />
        <Star size={8} fill="currentColor" style={{ marginTop: '8px' }} />
      </div>
    )}
    
    <h3 style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>{banner.title}</h3>
    <p style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '75%', marginTop: '0.5rem' }}>{banner.subtitle}</p>
    
    {banner.id === 1 && (
      <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>
        ÖZEL MENÜYÜ İNCELE <ChevronRight size={14} />
      </div>
    )}

    <div style={{ 
      position: 'absolute', 
      right: '1.8rem', 
      bottom: '1rem', 
      fontSize: banner.id === 1 ? '5rem' : '3.5rem', 
      opacity: (banner.id === 1 || isFilterActive) ? 0.35 : 0.2,
      filter: (banner.id === 1 || isFilterActive) ? 'drop-shadow(0 0 25px rgba(212,175,55,0.3))' : 'none',
      transform: banner.id === 1 ? 'rotate(-15deg)' : 'none'
    }}>{banner.id === 1 ? '🌙' : banner.icon}</div>
  </motion.div>
);

const ProductCard = ({ product, onSelect, setActiveTab }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // Category specific styles for visual distinction
  const getCategoryStyles = () => {
    switch(product.category) {
      case 'Poğaça & Açma': return { border: '1px solid rgba(255, 167, 38, 0.3)', background: 'rgba(255, 167, 38, 0.05)', accent: '#FFA726' };
      case 'Kekler': return { border: '1px solid rgba(171, 71, 188, 0.3)', background: 'rgba(171, 71, 188, 0.05)', accent: '#AB47BC' };
      case 'Cookiler': return { border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.05)', accent: '#D4AF37' };
      case 'Tek Kişilik Pastalar': return { border: '1px solid rgba(66, 165, 245, 0.3)', background: 'rgba(66, 165, 245, 0.05)', accent: '#42A5F5' };
      case 'Yaş Pastalar': return { border: '1px solid rgba(229, 57, 53, 0.3)', background: 'rgba(229, 57, 53, 0.05)', accent: '#E53935' };
      default: return { border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', accent: 'var(--gold)' };
    }
  };

  const catStyle = getCategoryStyles();

  const handleQuickAdd = (e) => {
    e.stopPropagation(); 
    if (product.category === 'kuru-pasta' || product.category === 'petifur') {
        setActiveTab('search');
    } else if (product.isConfigurable) {
        onSelect(product);
    } else {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <motion.div
      onClick={() => onSelect(product)}
      className="glass"
      whileHover={{ y: -5, borderColor: product.category === 'Petifür' ? '#ba68c8' : 'var(--gold)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        borderRadius: '24px',
        padding: '16px', // Increased padding for better breathing room
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: catStyle.border,
        height: '260px', // Slightly increased height for better balance
        backgroundColor: catStyle.background,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      <div style={{ 
        height: '110px',
        borderRadius: '18px',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        position: 'relative'
      }}>
        {product.image}
        {product.tag && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--gold)', color: '#000', fontSize: '0.55rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>{product.tag}</div>
        )}
      </div>
      <div>
        <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '2px', fontWeight: 600 }}>{product.name}</h4>
        {product.isCake && product.availableSizes && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            {product.availableSizes.map(s => (
              <span key={s} style={{ fontSize: '0.55rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>{s}</span>
            ))}
          </div>
        )}
        <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: catStyle.accent, fontWeight: 700, fontSize: '1.1rem' }}>{product.price.toFixed(2)} ₺</span>
          <button 
            type="button"
            onClick={handleQuickAdd}
            className={isAdded ? "glass" : "glass-gold"} 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: isAdded ? '#4CAF50' : catStyle.accent,
              border: `1px solid ${isAdded ? '#4CAF50' : catStyle.border}`,
              background: isAdded ? 'rgba(76,175,80,0.1)' : undefined,
              transition: 'all 0.3s ease'
            }}
          >
            {isAdded ? <Check size={20} /> : (product.isConfigurable ? <ChevronRight size={20} /> : <Plus size={20} />)}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Custom Hook for Mouse Drag Scroll with Click Capture Guard
const useDraggableScroll = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    const onMouseDown = (e) => {
      isDown = true;
      isDragging = false;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none'; // Prevent text selection
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      if (Math.abs(x - startX) > 6) {
        isDragging = true;
      }
      const walk = (x - startX) * 1.2; 
      el.scrollLeft = scrollLeft - walk;
    };

    const onClickCapture = (e) => {
      if (isDragging) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, [ref, ref.current]);
};

const HomePage = ({ setActiveTab }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedFeedbackId, setAddedFeedbackId] = useState(null);

  const productRecommendations = useMemo(() => {
    return getRecommendations(selectedProduct, initialProducts);
  }, [selectedProduct]);

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setIsConfiguring(false); // Reset to details view when a new product is selected
    setQuantity(1);
  };
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [excludedAllergens, setExcludedAllergens] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeSpecial, setActiveSpecial] = useState(0);
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeSlip, setActiveSlip] = useState(null);
  const [isBoxBuilderOpen, setIsBoxBuilderOpen] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const { addToCart } = useCart();
  const catScrollRef = useRef(null);
  const bannerRef = useRef(null);
  const specialScrollRef = useRef(null);
  const modalRecsRef = useRef(null);
  const productsGridRef = useRef(null);
  const detailPanelRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  useDraggableScroll(catScrollRef);
  useDraggableScroll(bannerRef);
  useDraggableScroll(specialScrollRef);
  useDraggableScroll(modalRecsRef);
  useBodyScrollLock(Boolean(selectedProduct) || Boolean(showFilters) || Boolean(activeSlip));

  const banners = [
    { id: 2, title: 'Geleneksel Miras', subtitle: 'Taş fırınımızdan çıkan taze ekmeklerimizi denediniz mi?', color: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', icon: '🍞' }
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // Don't show box builder specific items in the main menu list normally
      if (p.category === 'kuru-pasta' || p.category === 'petifur') return false;

      const matchesCategory = activeCategory === 'Hepsi' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const hasExcludedAllergen = p.allergens.some(a => excludedAllergens.includes(a));
      const matchesTag = !selectedTag || (p.tags && p.tags.includes(selectedTag));
      return matchesCategory && matchesSearch && !hasExcludedAllergen && matchesTag;
    });
  }, [activeCategory, searchQuery, excludedAllergens, selectedTag]);

  // Reset special index when products or categories change to avoid scroll bugs
  useEffect(() => {
    setActiveSpecial(0);
  }, [selectedTag, activeCategory]);

  const handleBannerClick = (banner) => {
    if (banner.id === 1) {
      setSelectedTag('Ramazan');
      setActiveCategory('Hepsi');
      setSearchQuery('');
      
      // Reset scroll for results with a slight delay for state update
      setTimeout(() => {
        if (productsGridRef.current) {
          const yOffset = -120; // Breathing room for sticky header
          const element = productsGridRef.current;
          const targetY = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          slowScrollToWindow(targetY, 2000); 
        }
      }, 100);
    }
  };

  const specialProducts = useMemo(() => filteredProducts.filter(p => p.isSpecial), [filteredProducts]);

  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Auto-banner effect (Slower, smoother, with manual reset)
  useEffect(() => {
    const timer = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction > 5000) {
        setActiveBanner(prev => (prev + 1) % banners.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length, lastInteraction]);

  // Auto-special products scroll (Synced with banners, responsive shift)
  useEffect(() => {
    // Only run if we are in 'Hepsi' category where special products are visible
    if (specialProducts.length <= 2 || activeCategory !== 'Hepsi') return;
    
    const timer = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction > 5000) {
        const isMobile = window.innerWidth <= 600;
        const stepAmt = isMobile ? 1 : 2;
        setActiveSpecial(prev => (prev + stepAmt) >= (specialProducts.length * 2) ? 0 : prev + stepAmt);
      }
    }, 6000); 
    return () => clearInterval(timer);
  }, [specialProducts.length, lastInteraction, activeCategory]);

  // Sync scroll with activeBanner (Smooth)
  useEffect(() => {
    if (bannerRef.current) {
      const el = bannerRef.current;
      const scrollAmount = (el.scrollWidth / banners.length) * activeBanner;
      el.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [activeBanner, banners.length]);

  // Custom ultra-smooth scroll utility
  const smoothScrollTo = (element, target, duration = 1000) => {
    const start = element.scrollLeft;
    const change = target - start;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function: easeInOutQuad
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;

      element.scrollLeft = start + change * easedProgress;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Custom ultra-smooth window scroll for premium transitions
  const slowScrollToWindow = (targetY, duration = 2000) => {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    let startTime = null;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Luxurious easeInOutCubic
      const easing = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startY + difference * easing);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Sync scroll with activeSpecial (2-by-2 sliding)
  useEffect(() => {
    if (specialScrollRef.current && specialProducts.length > 0) {
      const el = specialScrollRef.current;
      const cardWidth = el.scrollWidth / (specialProducts.length * 2);
      const targetScroll = activeSpecial * cardWidth;
      
      // Only auto-scroll if user haven't interacted recently
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction > 5000) {
        el.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  }, [activeSpecial, specialProducts.length, lastInteraction]);

  // Check if categories are overflowing to show/hide arrows
  const checkOverflow = () => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      setCanScroll({
        left: scrollLeft > 10,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  useEffect(() => {
    if (!selectedProduct || !detailPanelRef.current) return;

    const node = detailPanelRef.current;
    const frame = requestAnimationFrame(() => {
      node.scrollTop = 0;
      node.scrollTo({ top: 0, behavior: 'auto' });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedProduct?.id, isConfiguring]);

  const toggleAllergen = (allergen) => {
    setExcludedAllergens(prev => 
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const scrollCategories = (dir) => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ paddingBottom: '120px', backgroundColor: 'var(--anthracite)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      
      {/* ═══ BANNERS ═══ */}
      <div style={{ padding: '100px 0 1rem', position: 'relative', overflow: 'hidden' }}>
        <div 
          ref={bannerRef}
            style={{ 
            position: 'relative',
            height: '200px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -100, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', padding: '0 1.5rem' }}
            >
              <Banner 
                banner={banners[activeBanner]} 
                isActive={true} 
                isFilterActive={selectedTag === 'Ramazan' && banners[activeBanner].id === 1}
                onClick={() => handleBannerClick(banners[activeBanner])} 
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Banner Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => { setActiveBanner(idx); setLastInteraction(Date.now()); }}
              style={{ 
                width: activeBanner === idx ? '24px' : '8px', 
                height: '4px', 
                borderRadius: '4px', 
                background: activeBanner === idx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>
      </div>

      {/* ═══ SEARCH & FILTERS ═══ */}
      <div style={{ 
        position: 'sticky', 
        top: 'var(--header-height)', 
        zIndex: 100, 
        backgroundColor: 'var(--anthracite)', 
        padding: '1.2rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.03)'
      }}>
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.4rem', borderRadius: '50px' }}>
            <Search size={20} style={{ opacity: 0.4 }} />
            <input 
              type="text" 
              placeholder="Lezzet ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }} 
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: (excludedAllergens.length > 0 || selectedTag) ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
              color: (excludedAllergens.length > 0 || selectedTag) ? 'var(--gold)' : '#fff',
              boxShadow: (excludedAllergens.length > 0 || selectedTag) ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative' 
            }}
          >
            <Filter size={20} />
            {(excludedAllergens.length > 0 || selectedTag) && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: 'var(--gold)', color: '#000', fontSize: '0.6rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {excludedAllergens.length + (selectedTag ? 1 : 0)}
              </span>
            )}
          </button>

          {(selectedTag || excludedAllergens.length > 0 || activeCategory !== 'Hepsi' || searchQuery) && (
            <motion.button 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => { 
                setSelectedTag(null); 
                setExcludedAllergens([]); 
                setActiveCategory('Hepsi'); 
                setSearchQuery(''); 
              }}
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'rgba(255,60,60,0.1)',
                border: '1px solid rgba(255,60,60,0.2)',
                color: '#ff4d4d',
                alignSelf: 'center'
              }}
            >
              <X size={16} />
            </motion.button>
          )}
        </div>

        {/* Categories Container - Fixed for Universal Responsiveness */}
          <button 
            onClick={() => scrollCategories('left')} 
            className={`arrow-btn desktop-only ${canScroll.left ? 'visible' : 'hidden'}`} 
            style={{ left: '-25px' }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            ref={catScrollRef}
            onScroll={checkOverflow}
            className="no-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '12px', 
              overflowX: 'auto', 
              scrollBehavior: 'smooth',
              flex: 1, 
              padding: '12px 0 16px',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              borderBottom: '1px solid rgba(212, 175, 55, 0.08)', // Subtle tray border
              backdropFilter: 'blur(10px)', // Showcase depth
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            {['Hepsi', 'Poğaça & Açma', 'Kekler', 'Cookiler', 'Tek Kişilik Pastalar', 'Yaş Pastalar'].map((cat) => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedTag(null); }}
                style={{ 
                  padding: '10px 28px', 
                  borderRadius: '14px', 
                  fontSize: '0.82rem', 
                  whiteSpace: 'nowrap', 
                  backgroundColor: (activeCategory === cat && !selectedTag) ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: (activeCategory === cat && !selectedTag) ? 'var(--gold)' : 'rgba(255,255,255,0.4)', 
                  border: (activeCategory === cat && !selectedTag) ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: (activeCategory === cat && !selectedTag) 
                    ? 'inset 0 2px 8px rgba(0,0,0,0.4), 0 4px 15px rgba(212,175,55,0.05)' 
                    : 'inset 0 1px 2px rgba(255,255,255,0.02)',
                  transition: 'all 0.5s ease-in-out', // Slow 'dimmer' transition
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="catActiveShowcase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.2) 0%, transparent 100%)', // Top-down lighting
                      pointerEvents: 'none'
                    }} 
                  />
                )}
                <span style={{ 
                  position: 'relative', 
                  zIndex: 1, 
                  fontWeight: (activeCategory === cat && !selectedTag) ? 700 : 400,
                  letterSpacing: '0.5px'
                }}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => scrollCategories('right')} 
            className={`arrow-btn desktop-only ${canScroll.right ? 'visible' : 'hidden'}`} 
            style={{ right: '-25px' }}
          >
            <ChevronRight size={20} />
          </button>
      </div>

      {/* ═══ CTA CARD ═══ */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <motion.div
           whileHover={{ y: -5, scale: 1.01 }}
           onClick={() => setActiveTab('search')}
           style={{
             background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(20,20,20,0.8) 100%)',
             borderRadius: '30px',
             padding: '2.2rem',
             border: '1px solid rgba(212,175,55,0.3)',
             cursor: 'pointer',
             position: 'relative',
             overflow: 'hidden',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px',
             boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
           }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.1, transform: 'rotate(-15deg)' }}>📦</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={16} fill="var(--gold)" color="var(--gold)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' }}>Artizan Deneyim</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: '#fff', maxWidth: '80%', lineHeight: 1.2 }}>Artizan Kurupasta ve Petifür Kutuları</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.6, maxWidth: '70%', marginBottom: '0.8rem' }}>Kendi seçkinizi oluşturmak için dilediğiniz lezzetleri kutunuza ekleyin.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontWeight: 800, fontSize: '0.8rem' }}>
            KUTU İNŞA ET <ChevronRight size={18} />
          </div>
        </motion.div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div ref={productsGridRef} style={{ padding: '2rem 1.5rem' }}>
        {specialProducts.length > 0 && searchQuery === '' && activeCategory === 'Hepsi' && (
          <div style={{ 
            marginBottom: '4rem', 
            background: 'rgba(212,175,55,0.02)', 
            padding: '2rem 0', 
            borderRadius: '40px',
            border: '1px solid rgba(212,175,55,0.05)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', padding: '0 2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
              Günün <span style={{ color: 'var(--gold)' }}>Gözdeleri</span>
            </h2>
            <div 
              ref={specialScrollRef}
              onMouseDown={() => setLastInteraction(Date.now())}
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                overflowX: 'auto', 
                padding: '1rem 2.5rem 2rem', // Added top/bottom padding to prevent clipping
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Loopable cloning for seamless feel */}
              {[...specialProducts, ...specialProducts].map((p, idx) => (
                <motion.div 
                  key={`${p.id}-${idx}`} 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: (idx % specialProducts.length) * 0.15 
                  }}
                  className="special-product-item"
                >
                  <ProductCard product={p} onSelect={handleSelectProduct} setActiveTab={setActiveTab} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
          {searchQuery ? 'Arama' : (selectedTag === 'Ramazan' ? 'Ramazana Özel' : activeCategory)} <span style={{ color: 'var(--gold)' }}>Lezzetleri</span>
        </h2>
        
        {searchQuery === '' && activeCategory === 'Hepsi' ? (
          Object.entries(
            filteredProducts.reduce((acc, p) => {
              if (!acc[p.category]) acc[p.category] = [];
              acc[p.category].push(p);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '3.5rem' }}>
              <h3 style={{ 
                fontSize: '0.8rem', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '3px', 
                marginBottom: '1.5rem', 
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                {category}
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                gap: '12px'
              }}>
                {items.map(p => <ProductCard key={p.id} product={p} onSelect={handleSelectProduct} setActiveTab={setActiveTab} />)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            padding: '0'
          }}>
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} onSelect={handleSelectProduct} setActiveTab={setActiveTab} />)}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.3 }}>
            <Info size={48} style={{ marginBottom: '1rem', margin: '0 auto' }} />
            <p>Seçtiğiniz kriterlere uygun lezzet bulunamadı.</p>
            <button 
              onClick={() => { 
                setExcludedAllergens([]); 
                setActiveCategory('Hepsi'); 
                setSearchQuery(''); 
                setSelectedTag(null);
              }} 
              style={{ color: 'var(--gold)', marginTop: '1rem', textDecoration: 'underline', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Configurator Modals */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 4000, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="glass"
              style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem', borderRadius: '40px', border: '1px solid var(--gold-muted)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: '#fff' }}>Hassasiyetler</h3>
                <button onClick={() => setShowFilters(false)} style={{ opacity: 0.5 }}><X size={24} /></button>
              </div>
              <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Görmek istemediğiniz içerikleri seçin:</p>
              

              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {ALLERGEN_OPTIONS.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => toggleAllergen(opt)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1.2rem 1.5rem', 
                      borderRadius: '16px', 
                      backgroundColor: excludedAllergens.includes(opt) ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                      border: excludedAllergens.includes(opt) ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                      transition: '0.2s'
                    }}
                  >
                    <span style={{ color: excludedAllergens.includes(opt) ? 'var(--gold)' : '#fff', fontWeight: excludedAllergens.includes(opt) ? 700 : 400 }}>{opt} İçermeyenler</span>
                    {excludedAllergens.includes(opt) ? <Check size={18} style={{ color: 'var(--gold)' }} /> : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />}
                  </button>
                ))}
              </div>

              <button className="btn-premium" onClick={() => setShowFilters(false)} style={{ width: '100%', marginTop: '2.5rem' }}>Sonuçları Gör</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ PRODUCT DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', paddingTop: 'var(--header-height)' }}
            onClick={() => {
              // Only close on backdrop click when viewing details, NOT while configuring
              if (!isConfiguring) { setSelectedProduct(null); setIsConfiguring(false); }
            }}
          >
            <motion.div
              ref={detailPanelRef}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="glass"
              style={{ width: '100%', maxWidth: '480px', background: 'var(--anthracite)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '2.5rem 2rem 3rem', border: `1px solid ${selectedProduct.isCake ? '#E5393544' : 'var(--gold-muted)'}`, maxHeight: '90vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
              onClick={(e) => e.stopPropagation()}
            >
              {isConfiguring ? (
                selectedProduct.isCake ? (
                  <CakeConfigurator
                    product={selectedProduct}
                    onClose={() => { setSelectedProduct(null); setIsConfiguring(false); }}
                  />
                ) : (
                  <OrderConfigurator 
                    product={selectedProduct} 
                    onClose={() => { setSelectedProduct(null); setIsConfiguring(false); }} 
                    onConfirm={(configuredProduct) => {
                      addToCart(configuredProduct, 1);
                      setSelectedProduct(null);
                      setIsConfiguring(false);
                      setActiveSlip(configuredProduct.formattedSlip);
                    }}
                  />
                )
              ) : (
                <>
                  <div style={{ width: '50px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '-1rem auto 2.5rem' }} />
                  
                  <div style={{ height: '260px', borderRadius: '32px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', marginBottom: '2.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: selectedProduct.isCake ? 'radial-gradient(circle at center, rgba(229, 57, 53, 0.15) 0%, transparent 70%)' : 'none' }} />
                    <span style={{ position: 'relative', zIndex: 1 }}>{selectedProduct.image}</span>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 300, fontFamily: 'var(--font-serif)' }}>{selectedProduct.name}</h2>
                      <div style={{ background: selectedProduct.isCake ? 'rgba(229, 57, 53, 0.15)' : 'var(--gold-muted)', color: selectedProduct.isCake ? '#E53935' : 'var(--gold)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>⭐ {selectedProduct.rating}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedProduct.tags?.map(tag => (
                        <span key={tag} className="glass-gold" style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Usta Notu</h4>
                    <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{selectedProduct.fullDesc}</p>
                  </div>

                  <div style={{ marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.5 }}>İçerik & Alerjen Bilgisi</h4>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Un', has: selectedProduct.allergens.includes('Gluten'), icon: Wheat },
                        { label: 'Süt', has: selectedProduct.allergens.includes('Süt'), icon: Droplets },
                        { label: 'Yumurta', has: selectedProduct.allergens.includes('Yumurta'), icon: Egg },
                        { label: 'Kuruyemiş', has: selectedProduct.allergens.includes('Kuruyemiş'), icon: Nut }
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: item.has ? 1 : 0.2 }}>
                            <item.icon size={18} style={{ color: item.has ? 'var(--gold)' : '#fff' }} />
                            <span style={{ fontSize: '0.9rem', color: item.has ? '#fff' : 'rgba(255,255,255,0.4)' }}>{item.label} {item.has ? 'Var' : 'Yok'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amazon-style Recommendations: Yanına Yakışanlar */}
                  {productRecommendations.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h4 style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🛒 Birlikte Tercih Edilenler
                      </h4>
                      <div 
                        ref={modalRecsRef}
                        style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          overflowX: 'auto', 
                          paddingBottom: '8px', 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none', 
                          WebkitOverflowScrolling: 'touch',
                          cursor: 'grab'
                        }} 
                        className="no-scrollbar"
                      >
                        {productRecommendations.map(rec => {
                          const isAdded = addedFeedbackId === rec.id;
                          return (
                            <div 
                              key={rec.id} 
                              className="glass" 
                              style={{ 
                                flexShrink: 0, 
                                width: '124px', 
                                padding: '12px 10px', 
                                borderRadius: '18px', 
                                border: '1px solid rgba(255,255,255,0.06)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '6px', 
                                justifyContent: 'space-between',
                                background: 'rgba(255,255,255,0.02)'
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', textAlign: 'center' }}>
                                <span style={{ fontSize: '2rem' }}>{rec.image}</span>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', height: '32px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.2 }}>
                                  {rec.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 800 }}>
                                  {rec.price} ₺
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(rec, 1);
                                  setAddedFeedbackId(rec.id);
                                  setTimeout(() => setAddedFeedbackId(null), 1500);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  borderRadius: '10px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  background: isAdded ? '#2e7d32' : 'rgba(212,175,55,0.1)',
                                  border: isAdded ? '1px solid #2e7d32' : '1px solid rgba(212,175,55,0.2)',
                                  color: isAdded ? '#fff' : 'var(--gold)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {isAdded ? 'Eklendi! ✓' : <><Plus size={10} /> Sepete Ekle</>}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                    {!selectedProduct.isConfigurable && !selectedProduct.isCake && (
                      <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 1.5rem', height: '64px', borderRadius: '20px' }}>
                        <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ color: 'var(--gold)' }}><Minus size={24}/></button>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                        <button onClick={() => setQuantity(q => q+1)} style={{ color: 'var(--gold)' }}><Plus size={24}/></button>
                      </div>
                    )}
                      <button 
                        className="btn-premium" 
                        style={{ 
                          flex: 1, 
                          borderRadius: '20px', 
                          height: '60px', 
                          fontSize: '0.85rem',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          fontWeight: 900,
                          boxShadow: '0 10px 30px rgba(212,175,55,0.1)'
                        }}
                        onClick={() => { 
                          if (selectedProduct.isConfigurable || selectedProduct.isCake) {
                            setIsConfiguring(true);
                          } else {
                            addToCart(selectedProduct, quantity); 
                            setSelectedProduct(null); 
                          }
                        }}
                      >
                        {selectedProduct.isConfigurable || selectedProduct.isCake ? 'Hemen Özelleştir' : `${(selectedProduct.price * quantity).toFixed(2)} ₺ • SEPETE EKLE`}
                      </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeSlip && <OrderSlipModal slip={activeSlip} onClose={() => setActiveSlip(null)} />}
      </AnimatePresence>

      <style>{`
        .arrow-btn { position: absolute; z-index: 5; background: rgba(0,0,0,0.8); borderRadius: 50%; padding: 10px; color: var(--gold); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 1px solid rgba(212,175,55,0.3); transition: all 0.3s ease; opacity: 0; pointer-events: none; }
        .arrow-btn.visible { opacity: 1; pointer-events: auto; }
        .arrow-btn.hidden { opacity: 0; pointer-events: none; }
        .arrow-btn:hover { background: var(--gold); color: var(--anthracite); transform: scale(1.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) { .desktop-only { display: none; } }
      `}</style>
    </div>
  );
};

export default HomePage;
