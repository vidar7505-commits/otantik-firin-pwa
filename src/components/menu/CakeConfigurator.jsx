import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Plus, Minus, ShoppingBag, Sparkles, Star, MapPin, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import img0No from '../../assets/images/0no.png';
import img1No from '../../assets/images/1no.png';

const CAKE_SIZES = [
  { label: '0 No', image: img0No, desc: '4-6 Kişilik' },
  { label: '1 No', image: img1No, desc: '8-10 Kişilik' },
];

const AI_SUGGESTIONS = {
  'Doğum Günü': ['İyi ki doğdun, iyi ki varsın!', 'Yeni yaşın mutluluk getirsin.', 'Nice mutlu, sağlıklı yıllara!', 'Günün en tatlı anı seninle olsun.', 'Pastan kadar tatlı bir ömür dileriz.'],
  'Aşk & Yıldönümü': ['Seni her gün daha çok seviyorum.', 'Birlikte nice tatlı yıllara❤', 'Kalbimin en tatlı köşesi...', 'Sonsuz aşkımıza...', 'En güzel hikayemize...'],
  'Geçmiş Olsun': ['En kısa zamanda sağlığına kavuşman dileğiyle.', 'Acil şifalar dileriz.', 'Çabuk iyileş, seni özledik!', 'Dualarımız seninle, geçmiş olsun.', 'Şifalar seninle olsun.'],
  'Tebrik & Kutlama': ['Başarıların daim olsun!', 'Seninle gurur duyuyoruz.', 'Yeni başlangıçlar şans getirsin.', 'Muhteşem bir gelecek seni bekliyor.', 'Yolun açık olsun!'],
};

export const CakeConfigurator = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [guideIdx, setGuideIdx] = useState(0);
  const [freeExtras, setFreeExtras] = useState({
    candle: false,
    sparkler: false,
    hasMessage: false,
    message: ''
  });
  const [paidExtras, setPaidExtras] = useState({
    'num-candle': 0,
    'text-candle': 0,
    'volcano': 0
  });
  const [activeAiCategory, setActiveAiCategory] = useState('Doğum Günü');

  // ref callback: registers wheel + click-drag scroll the moment the element mounts
  const hScrollRef = useCallback((el) => {
    if (!el) return;

    // Mouse-wheel → horizontal scroll
    const wheelHandler = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };
    el.addEventListener('wheel', wheelHandler, { passive: false });

    // Click-drag → horizontal scroll
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    const onMouseDown = (e) => {
      isDown = true;
      hasDragged = false;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollStart = el.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMouseUp = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 5) {
        hasDragged = true;
      }
      el.scrollLeft = scrollStart - walk;
    };

    const onClickCapture = (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.style.cursor = 'grab';
    el.style.userSelect = 'none';
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('click', onClickCapture, true); // Intercept in capture phase to prevent false clicks
  }, []);

  const accentColor = '#E53935';
  const glassbg = 'rgba(255,255,255,0.03)';
  const glassBorder = 'rgba(255,255,255,0.08)';

  const selectedSize = CAKE_SIZES[selectedSizeIdx].label;
  const basePrice = product.price;
  const sizeSurcharge = selectedSizeIdx === 1 ? 100 : 0;
  const extrasTotal = (paidExtras['num-candle'] * 40) + (paidExtras['text-candle'] * 40) + (paidExtras['volcano'] * 40);
  const totalPrice = basePrice + sizeSurcharge + extrasTotal;

  const openGuide = () => {
    setGuideIdx(selectedSizeIdx); // open with the currently selected size
    setShowGuide(true);
  };

  const handleUpdateExtra = (id, delta) => {
    setPaidExtras(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
  };

  const handleAdd = () => {
    addToCart({
      ...product,
      id: `${product.id}-${selectedSize}-${Date.now()}`,
      name: `${product.name} (${selectedSize})`,
      price: totalPrice,
      selectedSize,
      extras: { free: freeExtras, paid: paidExtras },
      quantity: 1
    });
    onClose();
  };

  return (
    <div style={{ color: '#fff', position: 'relative' }}>
      {/* Subtle ambient glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: accentColor, filter: 'blur(120px)', opacity: 0.12, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: '#fff' }}>{product.name}</h2>
          <p style={{ fontSize: '0.82rem', opacity: 0.45, color: '#fff', marginTop: '2px' }}>Pasta Tercihleri ve Ekstralar</p>
        </div>
        <button onClick={onClose} style={{ background: glassbg, border: `1px solid ${glassBorder}`, color: '#fff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} />
        </button>
      </div>

      {/* Size Selection */}
      <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>Boyut Seçimi</h3>
          <button
            onClick={openGuide}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}
          >
            <Info size={13} /> BOYUT REHBERİ
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {CAKE_SIZES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSelectedSizeIdx(i)}
              style={{
                flex: 1, padding: '1.2rem', borderRadius: '22px',
                border: selectedSizeIdx === i ? `1px solid ${accentColor}55` : `1px solid ${glassBorder}`,
                background: selectedSizeIdx === i ? `linear-gradient(135deg, ${accentColor}0D, transparent)` : glassbg,
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                boxShadow: selectedSizeIdx === i ? `0 8px 24px ${accentColor}0F` : 'none'
              }}
            >
              <Star size={16} style={{ color: selectedSizeIdx === i ? accentColor : 'rgba(255,255,255,0.1)' }} fill={selectedSizeIdx === i ? accentColor : 'transparent'} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', opacity: 0.4, color: '#fff' }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Free Add-ons */}
      <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>Ücretsiz Seçenekler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
          {[
            { id: 'candle', label: 'Klasik Mum', icon: '🕯️' },
            { id: 'sparkler', label: 'Maytap', icon: '✨' }
          ].map(item => (
            <button key={item.id} onClick={() => setFreeExtras(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
              style={{
                padding: '1rem', borderRadius: '18px',
                border: freeExtras[item.id] ? `1px solid ${accentColor}44` : `1px solid ${glassBorder}`,
                background: freeExtras[item.id] ? `linear-gradient(135deg,${accentColor}08,transparent)` : glassbg,
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.25s'
              }}>
              <div style={{ width: '19px', height: '19px', borderRadius: '5px', border: '1.5px solid', borderColor: freeExtras[item.id] ? accentColor : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {freeExtras[item.id] && <Check size={13} color={accentColor} strokeWidth={3} />}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{item.icon} {item.label}</span>
            </button>
          ))}
        </div>

        {/* Message Plaque */}
        <div style={{ background: glassbg, padding: '1.4rem', borderRadius: '26px', border: `1px solid ${glassBorder}` }}>
          <div onClick={() => setFreeExtras(prev => ({ ...prev, hasMessage: !prev.hasMessage }))}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: freeExtras.hasMessage ? '1.3rem' : 0 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1.5px solid', borderColor: freeExtras.hasMessage ? accentColor : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {freeExtras.hasMessage && <Check size={13} color={accentColor} strokeWidth={3} />}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>🔖 Plaka Üzerine Yazı İstiyorum</span>
          </div>

          <AnimatePresence>
            {freeExtras.hasMessage && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '1rem', marginBottom: '1.2rem', border: `1px solid ${glassBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--gold)' }}>
                    <Wand2 size={14} style={{ color: 'var(--gold)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--gold)' }}>YAZI ÖNERİLERİ</span>
                  </div>
                  
                  {/* Category chips - horizontal scroll */}
                  <div
                    ref={hScrollRef}
                    style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '10px' }}
                    className="no-scrollbar"
                  >
                    {Object.keys(AI_SUGGESTIONS).map(cat => (
                      <button key={cat} onClick={() => setActiveAiCategory(cat)}
                        style={{
                          padding: '7px 14px', borderRadius: '28px', fontSize: '0.72rem', whiteSpace: 'nowrap',
                          background: activeAiCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                          color: activeAiCategory === cat ? '#000' : 'rgba(255,255,255,0.55)',
                          border: 'none', fontWeight: 700, transition: '0.3s', cursor: 'pointer'
                        }}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Suggestion messages - horizontal scroll with mouse wheel */}
                  <AnimatePresence mode="wait">
                    {activeAiCategory && (
                      <motion.div
                        key={activeAiCategory}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        ref={hScrollRef}
                        style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '8px', paddingBottom: '6px' }}
                        className="no-scrollbar"
                      >
                        {AI_SUGGESTIONS[activeAiCategory].map(msg => (
                          <button key={msg} onClick={() => setFreeExtras(prev => ({ ...prev, message: msg }))}
                            style={{
                              padding: '10px 15px', borderRadius: '14px', fontSize: '0.78rem', textAlign: 'left',
                              background: 'rgba(255,255,255,0.04)', border: `1px solid ${glassBorder}`,
                              color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                            }}>
                            {msg}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <textarea
                  placeholder="Kendi mesajınızı yazın veya yukarıdan seçin..."
                  value={freeExtras.message}
                  onChange={e => setFreeExtras(prev => ({ ...prev, message: e.target.value }))}
                  style={{ width: '100%', height: '90px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${glassBorder}`, borderRadius: '16px', padding: '0.9rem', color: '#fff', resize: 'none', fontSize: '0.9rem', outline: 'none' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Paid Extras */}
      <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.1rem' }}>
          <Sparkles size={15} color="var(--gold)" />
          <h3 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', opacity: 0.85 }}>Özel Gün Ekstraları</h3>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { id: 'num-candle', label: 'Sayılı Mum', icon: '🔢', desc: 'Rakamlar mağazada seçilecektir.' },
            { id: 'text-candle', label: 'Yazılı Mum', icon: '✍️' },
            { id: 'volcano', label: 'Volkan', icon: '🌋' }
          ].map(extra => (
            <div key={extra.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: glassbg, padding: '0.9rem 1.1rem', borderRadius: '20px', border: `1px solid ${glassBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>{extra.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{extra.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700 }}>+40 TL</div>
                  {extra.desc && <div style={{ fontSize: '0.62rem', opacity: 0.4, color: '#fff', marginTop: '1px' }}>{extra.desc}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handleUpdateExtra(extra.id, -1)} style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${glassBorder}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={13} /></button>
                <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center', color: '#fff' }}>{paidExtras[extra.id]}</span>
                <button onClick={() => handleUpdateExtra(extra.id, 1)} style={{ width: '30px', height: '30px', borderRadius: '9px', background: glassbg, border: `1px solid ${accentColor}40`, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={13} /></button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: `1px solid ${glassBorder}` }}>
          <MapPin size={13} color="var(--gold)" />
          <p style={{ fontSize: '0.7rem', opacity: 0.45, color: '#fff' }}>Sayılı ve yazılı mum çeşitleri şubeden teslim alırken seçilebilir.</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${glassBorder}`, paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: '0.72rem', opacity: 0.4, color: '#fff', marginBottom: '2px' }}>Toplam Tutar</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{totalPrice.toFixed(2)} ₺</div>
        </div>
        <button onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', borderRadius: '18px', background: accentColor, border: 'none', color: '#fff', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '1px', cursor: 'pointer', boxShadow: `0 10px 36px ${accentColor}30` }}>
          SEPETE EKLE <ShoppingBag size={17} />
        </button>
      </div>

      {/* ═══ SIZE GUIDE MODAL ═══ */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowGuide(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: '16px',
              overflowY: 'hidden'
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '440px',
                height: '100%',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}
            >
              {/* Top Tabs — fixed height */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '30px', padding: '4px', flexShrink: 0 }}>
                {CAKE_SIZES.map((s, i) => (
                  <button key={s.label} onClick={() => setGuideIdx(i)}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: '26px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                      background: guideIdx === i ? '#fff' : 'transparent',
                      color: guideIdx === i ? '#000' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s'
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Image — flex:1 takes ALL remaining space, min-height:0 prevents flex overflow */}
              <div style={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={guideIdx}
                    src={CAKE_SIZES[guideIdx].image}
                    alt={`${CAKE_SIZES[guideIdx].label} Boyut Rehberi`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </AnimatePresence>

                {/* Prev / Next arrows */}
                <button onClick={() => setGuideIdx(i => (i + CAKE_SIZES.length - 1) % CAKE_SIZES.length)}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setGuideIdx(i => (i + 1) % CAKE_SIZES.length)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Size label & close — fixed height */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '12px',
                flexShrink: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '12px 16px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{CAKE_SIZES[guideIdx].label} Boyut</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.5, color: '#fff' }}>{CAKE_SIZES[guideIdx].desc}</div>
                </div>
                <button onClick={() => setShowGuide(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 20px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                  <X size={14} /> KAPAT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
