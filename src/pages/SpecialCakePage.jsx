import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, ShieldAlert, Upload, Image } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAKE_CATALOG, CATALOG_CATEGORIES, SHOWCASE_CATALOG, FILLING_OPTIONS, SIZES, CUSTOM_STYLES } from '../data/cakeCatalog';

const CONTACT_PHONE = '+90 216 555 12 34';

const s = {
  page: { padding: 'calc(var(--header-height) + 20px) 14px calc(var(--nav-height) + 90px)', minHeight: '100vh', background: 'var(--anthracite)', maxWidth: 600, margin: '0 auto' },
  heading: { textAlign: 'center', marginBottom: '1.8rem' },
  sup: { fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 3 },
  h1: { color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-serif)', margin: 0 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 6 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.2rem', marginBottom: 12 },
  label: { fontSize: '0.65rem', opacity: 0.45, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 },
  chip: (active) => ({ padding: '7px 13px', borderRadius: 20, fontSize: '0.75rem', border: active ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)', background: active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.01)', color: active ? 'var(--gold)' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }),
  sizeBtn: (active) => ({ flex: 1, padding: '9px 4px', borderRadius: 12, textAlign: 'center', border: active ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.07)', background: active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer' }),
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' },
  warn: { background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '10px 12px', fontSize: '0.7rem', color: 'var(--gold)', display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10 },
  pricebar: { position: 'fixed', bottom: 'calc(var(--nav-height) + 4px)', left: 0, right: 0, background: 'rgba(20,18,16,0.97)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(212,175,55,0.15)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 200 },
  btnGold: { background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' },
  btnGlass: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 18px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 4000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  sheet: { background: '#1a1713', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 640, maxHeight: '88vh', overflowY: 'auto', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' },
};

// ─── Detail Modal for Catalog & Tezgah ───────────────────────────────────────
function CakeDetailModal({ cake, onClose, onOrder }) {
  const allSizes = SIZES;
  const [size, setSize] = useState(cake.refSize || '1 No');
  const [fillings, setFillings] = useState(cake.refIngredients || []);

  const toggle = (item) => setFillings(prev =>
    prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
  );

  const sizeObj = allSizes.find(s => s.no === size);
  const fillCost = fillings.length * 20;
  const total = (cake.basePrice || 450) + (sizeObj?.added || 0) + fillCost;

  return (
    <div style={s.overlay} onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={s.sheet}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={cake.image}
            alt={cake.name}
            style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: '24px 24px 0 0', display: 'block' }}
          />
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
          {cake.category && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '3px 8px', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 700 }}>{cake.category}</div>
          )}
          {/* Görseldeki boyut etiketi */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.75)', borderRadius: 8, padding: '4px 10px', fontSize: '0.65rem', color: '#fff', fontWeight: 700 }}>
            📷 Görseldeki Boyut: <span style={{ color: 'var(--gold)' }}>{cake.refSize}</span>
          </div>
        </div>

        <div style={{ padding: '1.2rem 1.4rem' }}>
          {/* Tags */}
          {cake.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {cake.tags.map(t => <span key={t} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 6, padding: '2px 8px', fontSize: '0.62rem', fontWeight: 700 }}>{t}</span>)}
            </div>
          )}

          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', margin: '0 0 6px' }}>{cake.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 14 }}>{cake.fullDesc}</p>

          {/* Uyarılar */}
          {(cake.colorWarning || cake.fruitWarning) && (
            <div style={s.warn}>
              <ShieldAlert size={13} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{cake.colorWarning ? 'Renkli gıda boyaları dilde geçici iz bırakabilir.' : 'Kırmızı meyvelerden dış kaplamasına hafif renk sızması olabilir (doğaldır).'}</span>
            </div>
          )}

          {/* Boyut Seçimi */}
          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <span style={s.label}>Boyut Seçin <span style={{ color: 'rgba(212,175,55,0.6)', fontStyle: 'italic' }}>(görseldeki: {cake.refSize})</span></span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {allSizes.map(sz => (
                <button key={sz.no} onClick={() => setSize(sz.no)} style={{ ...s.sizeBtn(size === sz.no), minWidth: 70 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{sz.no}</div>
                  <div style={{ fontSize: '0.58rem', opacity: 0.5 }}>{sz.desc}</div>
                  {sz.added > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--gold)' }}>+{sz.added}₺</div>}
                </button>
              ))}
            </div>
          </div>

          {/* İçerik Seçimi */}
          <div style={{ marginBottom: 14 }}>
            <span style={s.label}>İç Dolgu & İçerik (her biri +20₺, görseldekiler seçili)</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {[...FILLING_OPTIONS.fruits, ...FILLING_OPTIONS.creams, ...FILLING_OPTIONS.extras].map(item => (
                <button key={item} onClick={() => toggle(item)} style={s.chip(fillings.includes(item))}>
                  {item} {fillings.includes(item) ? '✓' : '+'}
                </button>
              ))}
            </div>
          </div>

          {/* Fiyat + Sipariş */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            <div>
              <span style={{ fontSize: '0.65rem', opacity: 0.5, display: 'block' }}>Tahmini toplam</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>{total} ₺</span>
            </div>
            <button
              onClick={() => onOrder({ cake, size, fillings })}
              style={{ ...s.btnGold, padding: '12px 20px', fontSize: '0.88rem' }}
            >
              Bu Tasarımla Sipariş Ver →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Catalog Grid ─────────────────────────────────────────────────────────────
function CatalogPage({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [modalCake, setModalCake] = useState(null);
  const filtered = activeCategory === 'Tümü' ? CAKE_CATALOG : CAKE_CATALOG.filter(c => c.category === activeCategory);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATALOG_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ ...s.chip(activeCategory === cat), whiteSpace: 'nowrap', flexShrink: 0 }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map(cake => (
          <div key={cake.id} onClick={() => setModalCake(cake)} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ position: 'relative', height: 140 }}>
              <img
                src={cake.image}
                alt={cake.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
              <span style={{ position: 'absolute', bottom: 6, left: 8, fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 700 }}>{cake.category}</span>
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', lineHeight: 1.3, marginBottom: 3 }}>{cake.name}</div>
              <div style={{ fontSize: '0.62rem', opacity: 0.5, marginBottom: 5 }}>{cake.shortDesc}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.82rem' }}>{cake.basePrice} ₺'den</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalCake && (
          <CakeDetailModal
            cake={modalCake}
            onClose={() => setModalCake(null)}
            onOrder={({ cake, size, fillings }) => {
              setModalCake(null);
              onSelect({ cake, size, fillings });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tezgah Grid ─────────────────────────────────────────────────────────────
function TezgahPage({ onSelect }) {
  const [modalCake, setModalCake] = useState(null);

  return (
    <div>
      <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
        Her gün vitrinimizde taze olarak çıkan ve en çok beğenilen imza pastalarımızı keşfedin. Davetinize uygun dilim sayısına göre boyut seçebilir (4 No'ya kadar) ve iç dolgusunu tamamen kendi damak tadınıza göre özelleştirerek hemen ayırtabilirsiniz.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SHOWCASE_CATALOG.map(cake => (
          <div key={cake.id} onClick={() => setModalCake(cake)} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ position: 'relative', height: 140 }}>
              <img
                src={cake.image}
                alt={cake.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', lineHeight: 1.3, marginBottom: 3 }}>{cake.name}</div>
              <div style={{ fontSize: '0.62rem', opacity: 0.5, marginBottom: 5 }}>{cake.desc}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.82rem' }}>{cake.basePrice} ₺'den</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalCake && (
          <CakeDetailModal
            cake={modalCake}
            onClose={() => setModalCake(null)}
            onOrder={({ cake, size, fillings }) => {
              setModalCake(null);
              onSelect({ cake, size, fillings });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Content Step ─────────────────────────────────────────────────────────────
function ContentStep({ fillings, setFillings, creams, setCreams, customNote, setCustomNote, catalogCake, preFillings }) {
  const toggle = (arr, setArr, item) => setArr(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {catalogCake && (
        <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 14, padding: '10px 14px' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Seçilen Tasarım — {catalogCake.name}</span>
          <p style={{ fontSize: '0.72rem', opacity: 0.6, margin: '4px 0 0' }}>Dış görünüm kilitlidir. Aşağıdan yalnızca iç dolgu içeriğini değiştirebilirsiniz.</p>
        </div>
      )}
      <div>
        <span style={s.label}>Meyve Dolguları (her biri +20 ₺)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FILLING_OPTIONS.fruits.map(f => <button key={f} onClick={() => toggle(fillings, setFillings, f)} style={s.chip(fillings.includes(f))}>{f} {fillings.includes(f) ? '✓' : '+'}</button>)}
        </div>
      </div>
      <div>
        <span style={s.label}>Kremalar (her biri +20 ₺)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FILLING_OPTIONS.creams.map(f => <button key={f} onClick={() => toggle(creams, setCreams, f)} style={s.chip(creams.includes(f))}>{f} {creams.includes(f) ? '✓' : '+'}</button>)}
        </div>
      </div>
      <div>
        <span style={s.label}>Ekstra Malzemeler (her biri +20 ₺)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FILLING_OPTIONS.extras.map(f => <button key={f} onClick={() => toggle(fillings, setFillings, f)} style={s.chip(fillings.includes(f))}>{f} {fillings.includes(f) ? '✓' : '+'}</button>)}
        </div>
      </div>
      <div>
        <span style={s.label}>Özel Not / Çıkarmak İstedikleriniz</span>
        <textarea value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Örn: Fındık istemiyorum, üzerine 'İyi Ki Doğdun Deniz' yazılsın..." style={{ ...s.input, height: 80, resize: 'none' }} />
      </div>
    </div>
  );
}

// ─── Delivery Step ────────────────────────────────────────────────────────────
function DeliveryStep({ custName, setCustName, custPhone, setCustPhone, delivDate, setDelivDate, delivTime, setDelivTime, minDateStr }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><span style={s.label}>Ad Soyad</span><input style={s.input} placeholder="İsim Soyisim" value={custName} onChange={e => setCustName(e.target.value)} /></div>
        <div><span style={s.label}>Telefon</span><input style={s.input} type="tel" placeholder="0530 000 00 00" value={custPhone} onChange={e => setCustPhone(e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><span style={s.label}>Teslim Tarihi (en erken 2 gün)</span><input style={s.input} type="date" min={minDateStr} value={delivDate} onChange={e => setDelivDate(e.target.value)} /></div>
        <div><span style={s.label}>Saat</span><input style={s.input} type="time" value={delivTime} onChange={e => setDelivTime(e.target.value)} /></div>
      </div>
      {delivDate && delivDate < minDateStr && <div style={{ color: '#ff5555', fontSize: '0.7rem', fontWeight: 700 }}>⚠️ En erken {new Date(minDateStr).toLocaleDateString('tr-TR')} seçilebilir.</div>}
      <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 14, padding: '12px 14px', fontSize: '0.72rem', color: 'var(--gold)', lineHeight: 1.5 }}>
        💡 <strong>Kapora Bilgisi:</strong> Sipariş onayı için toplam tutarın <strong>%40'ı kapora</strong> olarak peşin ödenir.
      </div>
    </div>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  { label: 'Kaç kişilik?', q: 'Kaç kişilik pasta seçmeliyim?' },
  { label: 'Boyut rehberi', q: 'Pasta boyutları hakkında bilgi verir misiniz?' },
  { label: 'Fiyatlar?', q: 'Pasta fiyatları ne kadar?' },
  { label: 'Kapora nedir?', q: 'Kapora nasıl ödeniyor?' },
  { label: 'Kalp pasta?', q: 'Kalp şeklinde pasta yaptırabilir miyim?' },
  { label: 'Kare pasta?', q: 'Kare pasta fiyatı ne kadar?' },
  { label: 'Teslim süresi?', q: 'Sipariş ne zaman hazır olur?' },
  { label: 'Dolgu seçimi?', q: 'Hangi dolgu seçenekleri var?' },
];

function getBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes('kişi') || t.includes('kaç') || t.includes('boyut') || t.includes('no') || t.includes('rehber'))
    return '0 No → 6–8 kişi, 1 No → 8–10, 2 No → 12–14, 3 No → 15–20, 4 No → 24–26 kişi. 🎂';
  if (t.includes('kalp'))
    return 'Kalp pasta min. 1 No\'dan yapılır, standart fiyata dahildir. ❤️';
  if (t.includes('kare'))
    return 'Kare pasta min. 1 No, +120₺ kalıp farkı uygulanır. 📦';
  if (t.includes('kapora'))
    return 'Toplam fiyatın %40\'ı kapora olarak peşin alınır. Kalanı teslimatta ödenir. 💳';
  if (t.includes('fiyat') || t.includes('ücret') || t.includes('tl') || t.includes('para'))
    return 'Temel fiyat 450₺\'den başlar. Boyut, dolgu ve tarz seçimine göre değişir. Sayfadaki hesaplayıcıdan anlık fiyat görebilirsiniz. 💰';
  if (t.includes('teslim') || t.includes('hazır') || t.includes('gün') || t.includes('süre'))
    return 'Özel pastalar min. 2 iş günü öncesinden sipariş alınır. Teslim tarihini kendiniz seçebilirsiniz. 📅';
  if (t.includes('dolgu') || t.includes('içerik') || t.includes('meyve') || t.includes('krema'))
    return 'Çilek, vişne, mango, muzlu, fındıklı krema, çikolata ganaj ve daha fazlası mevcut. Her biri +20₺. 🍓';
  return 'Pasta tercihinizi adım adım oluşturabilirsiniz — boyut, dolgu ve tarz sayfada seçilebilir. Başka sorunuz var mı? 😊';
}

function QuickQuestions({ onSelectQuestion }) {
  const scrollRef = useRef(null);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const startDrag = (e) => {
    setIsMouseDown(true);
    setDragged(false);
    const clientX = e.pageX || e.touches?.[0]?.clientX || 0;
    setStartX(clientX);
    setScrollLeftState(scrollRef.current ? scrollRef.current.scrollLeft : 0);
  };

  const moveDrag = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    const clientX = e.pageX || e.touches?.[0]?.clientX || 0;
    const diff = Math.abs(clientX - startX);
    if (diff > 8) {
      setDragged(true);
    }
    const walk = (clientX - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const endDrag = (e, q) => {
    setIsMouseDown(false);
    if (!dragged) {
      onSelectQuestion(q);
    }
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={startDrag}
      onMouseMove={moveDrag}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
      onTouchStart={startDrag}
      onTouchMove={moveDrag}
      onTouchEnd={() => setIsMouseDown(false)}
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        flexShrink: 0,
        cursor: isMouseDown ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {QUICK_QUESTIONS.map(qq => (
        <button
          key={qq.label}
          onMouseUp={(e) => endDrag(e, qq.q)}
          onTouchEnd={(e) => endDrag(e, qq.q)}
          style={{
            whiteSpace: 'nowrap',
            flexShrink: 0,
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: 'var(--gold)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          {qq.label}
        </button>
      ))}
    </div>
  );
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [msgs, setMsgs] = useState([
    { id: 1, from: 'bot', text: 'Merhaba! 👋 Pasta siparişinde yardımcı olabilirim. Aşağıdan hızlı soru seçebilir ya da kendiniz yazabilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), from: 'user', text }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now() + 1, from: 'bot', text: getBotReply(text) }]);
      setTyping(false);
    }, 600);
  };

  const btnStyle = {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + 76px)', // Safe above progress bar
    right: 16,
    padding: '10px 18px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(30, 27, 21, 0.95) 0%, rgba(12, 10, 7, 0.97) 100%)',
    border: '1.5px solid var(--gold)',
    color: 'var(--gold)',
    cursor: 'pointer',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
    fontWeight: 800,
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease'
  };

  const chatStyle = fullscreen
    ? {
        position: 'fixed',
        top: 'var(--header-height)',
        bottom: 'var(--nav-height)',
        left: 0,
        right: 0,
        height: 'calc(100dvh - var(--header-height) - var(--nav-height))',
        width: '100vw',
        borderRadius: 0,
        zIndex: 900 // fits nicely between Header (2000) and Nav (1000)
      }
    : {
        position: 'fixed',
        bottom: 'calc(var(--nav-height) + 130px)', // stacks nicely above the trigger button
        right: 14,
        width: 'min(360px, calc(100vw - 28px))',
        borderRadius: 22,
        zIndex: 500,
        maxHeight: '52vh'
      };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="pulse-gold-glow"
          style={btnStyle}
        >
          <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>🧑‍🍳</span>
          <span>Şefe Sor (AI)</span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              ...chatStyle,
              background: '#15120e',
              border: '1px solid rgba(212,175,55,0.2)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ background: 'rgba(212,175,55,0.08)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#25D366', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.5px', flex: 1, textTransform: 'uppercase' }}>Otantik Şef Asistanı</span>
              <button
                onClick={() => setFullscreen(f => !f)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', marginRight: 4 }}
                title={fullscreen ? 'Küçült' : 'Tam Ekran'}
              >
                {fullscreen ? '⤡' : '⤢'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Questions - yatay kaydırmalı */}
            <QuickQuestions onSelectQuestion={send} />

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
              {msgs.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '8px 12px',
                    borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '0.78rem',
                    background: m.from === 'user' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                    color: m.from === 'user' ? 'var(--gold)' : 'rgba(255,255,255,0.88)',
                    border: m.from === 'user' ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)',
                    lineHeight: 1.5
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', gap: 4, padding: '8px 12px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', opacity: 0.6 }}
                    />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', gap: 6, background: '#1c1915', flexShrink: 0 }}>
              <input
                style={{ ...s.input, flex: 1, height: '38px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, fontSize: '0.8rem' }}
                placeholder="Mesajınızı yazın..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
              />
              <button
                onClick={() => send(input)}
                style={{ ...s.btnGold, padding: '0 14px', height: '38px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



class ErrBound extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) return <div style={{ color: '#f55', padding: 40 }}><h3>Bileşen hatası:</h3><pre style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>{this.state.err?.stack}</pre></div>;
    return this.props.children;
  }
}

export default function SpecialCakePage() { return <ErrBound><SpecialCakeInner /></ErrBound>; }

function SpecialCakeInner() {
  const { addDirectOrder } = useCart();
  const [mode, setMode] = useState(() => localStorage.getItem('sc_mode') || 'select');
  const [step, setStep] = useState(() => Number(localStorage.getItem('sc_step') || 1));
  const [catalogCake, setCatalogCake] = useState(() => { try { return JSON.parse(localStorage.getItem('sc_catalog_cake')); } catch { return null; } });
  const [tezgahCake, setTezgahCake] = useState(() => { try { return JSON.parse(localStorage.getItem('sc_tezgah_cake')); } catch { return null; } });
  const [cakeStyle, setCakeStyle] = useState(() => localStorage.getItem('sc_style') || '');
  const [cakeSize, setCakeSize] = useState(() => localStorage.getItem('sc_size') || '1 No');
  const [fillings, setFillings] = useState(() => { try { return JSON.parse(localStorage.getItem('sc_fillings') || '[]'); } catch { return []; } });
  const [creams, setCreams] = useState(() => { try { return JSON.parse(localStorage.getItem('sc_creams') || '[]'); } catch { return []; } });
  const [customNote, setCustomNote] = useState(() => localStorage.getItem('sc_custom_note') || '');
  const [custName, setCustName] = useState(() => localStorage.getItem('sc_name') || '');
  const [custPhone, setCustPhone] = useState(() => localStorage.getItem('sc_phone') || '');
  const [delivDate, setDelivDate] = useState(() => localStorage.getItem('sc_date') || '');
  const [delivTime, setDelivTime] = useState(() => localStorage.getItem('sc_time') || '14:00');
  const [placed, setPlaced] = useState(() => { try { return JSON.parse(localStorage.getItem('sc_placed')); } catch { return null; } });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('sc_mode', mode);
    localStorage.setItem('sc_step', step);
    localStorage.setItem('sc_catalog_cake', JSON.stringify(catalogCake));
    localStorage.setItem('sc_tezgah_cake', JSON.stringify(tezgahCake));
    localStorage.setItem('sc_style', cakeStyle);
    localStorage.setItem('sc_size', cakeSize);
    localStorage.setItem('sc_fillings', JSON.stringify(fillings));
    localStorage.setItem('sc_creams', JSON.stringify(creams));
    localStorage.setItem('sc_custom_note', customNote);
    localStorage.setItem('sc_name', custName);
    localStorage.setItem('sc_phone', custPhone);
    localStorage.setItem('sc_date', delivDate);
    localStorage.setItem('sc_time', delivTime);
    localStorage.setItem('sc_placed', JSON.stringify(placed));
  }, [mode, step, catalogCake, tezgahCake, cakeStyle, cakeSize, fillings, creams, customNote, custName, custPhone, delivDate, delivTime, placed]);

  const minDateStr = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0]; }, []);

  const activeStyle = CUSTOM_STYLES.find(st => st.id === cakeStyle);
  const styleMinSize = activeStyle?.minSize;

  useEffect(() => {
    if (styleMinSize === '1 No' && cakeSize === '0 No') setCakeSize('1 No');
  }, [cakeStyle]);

  const basePrice = useMemo(() => {
    if (mode === 'catalog') return catalogCake?.basePrice || 450;
    if (mode === 'tezgah') return tezgahCake?.basePrice || 450;
    return 450;
  }, [mode, catalogCake, tezgahCake]);

  const sizeAdded = SIZES.find(sz => sz.no === cakeSize)?.added || 0;
  const styleAdded = activeStyle?.surcharge || 0;
  const fillAdded = (fillings.length + creams.length) * 20;
  const total = basePrice + sizeAdded + styleAdded + fillAdded;
  const deposit = Math.round(total * 0.4);

  const reset = () => {
    setMode('select'); setStep(1); setCatalogCake(null); setTezgahCake(null);
    setCakeStyle(''); setCakeSize('1 No'); setFillings([]); setCreams([]);
    setCustomNote(''); setCustName(''); setCustPhone(''); setDelivDate(''); setDelivTime('14:00'); setPlaced(null); setPhotoFile(null);
    localStorage.removeItem('otantik_special_cake_active_draft');
  };

  const submitOrder = () => {
    if (!custName || !custPhone || !delivDate) return alert('Ad soyad, telefon ve tarih zorunludur.');
    if (delivDate < minDateStr) return alert('Teslim tarihi en erken 2 gün sonra olmalıdır.');
    const id = `sp-${Date.now()}`;
    const modeLabel = mode === 'catalog' ? `Katalog: ${catalogCake?.name}` : mode === 'tezgah' ? `Tezgah: ${tezgahCake?.name}` : `Özel: ${activeStyle?.name}`;
    const slip = `🎂 ÖZEL PASTA - OTANTİK\nID: ${id}\nTasarım: ${modeLabel}\nBoyut: ${cakeSize}\nDolgu: ${fillings.join(', ') || 'Yok'}\nKrema: ${creams.join(', ') || 'Standart'}\nNot: ${customNote || '-'}\nTeslim: ${custName} / ${custPhone} / ${delivDate} ${delivTime}\nToplam: ${total}₺  |  Kapora: ${deposit}₺`;
    const order = { id, productName: `Özel Pasta (${cakeSize})`, price: total, date: new Date().toISOString(), slip };
    addDirectOrder(order);
    setPlaced(order);
    setMode('success');
  };

  const STEPS_CATALOG = ['Boyut Seç', 'İçerik & Not', 'Teslimat'];
  const STEPS_OZEL    = ['Stil & Boyut', 'İçerik & Not', 'Teslimat'];
  const STEPS_TEZGAH  = ['Pasta Seç', 'İçerik & Not', 'Teslimat'];
  const steps = mode === 'catalog' ? STEPS_CATALOG : mode === 'tezgah' ? STEPS_TEZGAH : STEPS_OZEL;

  return (
    <div style={s.page}>
      <div style={s.heading}>
        <span style={s.sup}>Yapay Zeka Destekli</span>
        <h1 style={s.h1}>PASTA TASARIMCISI</h1>
        <p style={s.sub}>Otantik kalitesiyle hayal ettiğiniz lezzeti adım adım oluşturun.</p>
      </div>

      <AnimatePresence mode="wait">

        {/* ── LANDING ── */}
        {mode === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {[
              { id: 'catalog', emoji: '📖', title: '1. Katalogdan Tasarım Seç', desc: 'Hazır tasarımlarımızdan birini seçin, iç dolguyu siz belirleyin.' },
              { id: 'ozel',    emoji: '✨', title: '2. Sıfırdan Özel Tasarım',  desc: 'Tarzını, boyutunu ve iç içeriğini adım adım kendiniz oluşturun.' },
              { id: 'tezgah',  emoji: '👩‍🍳', title: '3. Tezgah Pastasını Özelleştir', desc: 'Her gün taze çıkan klasik lezzetlerimizi seçin; kendi kutlamanıza uygun boyut ve malzemelerle hemen özelleştirip ayırtın.' },
            ].map(opt => (
              <div key={opt.id} onClick={() => { setMode(opt.id); setStep(opt.id === 'catalog' || opt.id === 'tezgah' ? 0 : 1); }} style={{ ...s.card, cursor: 'pointer', marginBottom: 12 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{opt.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: opt.id === 'ozel' ? '#fff' : 'var(--gold)', marginBottom: 4 }}>{opt.title}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.55 }}>{opt.desc}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── CATALOG BROWSE (step 0) ── */}
        {mode === 'catalog' && step === 0 && (
          <motion.div key="cat-browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setMode('select')} style={{ color: 'var(--gold)', fontSize: '0.78rem', marginBottom: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Geri</button>
            <CatalogPage onSelect={({ cake, size, fillings: fl }) => {
              setCatalogCake(cake);
              setCakeSize(size);
              // Pre-populate fillings from catalog selection
              const fruits = fl.filter(f => FILLING_OPTIONS.fruits.includes(f));
              const crs = fl.filter(f => FILLING_OPTIONS.creams.includes(f));
              const extras = fl.filter(f => FILLING_OPTIONS.extras.includes(f));
              setFillings([...fruits, ...extras]);
              setCreams(crs);
              setStep(2); // skip to content step since size already selected
            }} />
          </motion.div>
        )}

        {/* ── TEZGAH BROWSE (step 0) ── */}
        {mode === 'tezgah' && step === 0 && (
          <motion.div key="tezgah-browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setMode('select')} style={{ color: 'var(--gold)', fontSize: '0.78rem', marginBottom: 14, background: 'none', border: 'none', cursor: 'pointer' }}>← Geri</button>
            <TezgahPage onSelect={({ cake, size, fillings: fl }) => {
              setTezgahCake(cake);
              setCakeSize(size);
              const fruits = fl.filter(f => FILLING_OPTIONS.fruits.includes(f));
              const crs = fl.filter(f => FILLING_OPTIONS.creams.includes(f));
              const extras = fl.filter(f => FILLING_OPTIONS.extras.includes(f));
              setFillings([...fruits, ...extras]);
              setCreams(crs);
              setStep(2);
            }} />
          </motion.div>
        )}

        {/* ── BUILDER STEPS ── */}
        {mode !== 'select' && mode !== 'success' && step > 0 && (
          <motion.div key={`step-${mode}-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
              <button onClick={() => {
                if (step === 1 || step === 2) {
                  if (mode === 'catalog' || mode === 'tezgah') setStep(0);
                  else if (step === 1) setMode('select');
                  else setStep(step - 1);
                } else {
                  setStep(step - 1);
                }
              }} style={{ color: 'var(--gold)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}>← Geri</button>
              <button onClick={reset} style={{ color: '#ff5555', fontSize: '0.7rem', background: 'none', border: '1px solid rgba(255,77,77,0.2)', borderRadius: 8, padding: '3px 10px', cursor: 'pointer' }}>Sıfırla</button>
            </div>

            {/* Step indicators */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {steps.map((lbl, i) => (
                <div key={lbl} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: 3, borderRadius: 2, background: step > i ? 'var(--gold)' : 'rgba(255,255,255,0.08)', marginBottom: 4 }} />
                  <span style={{ fontSize: '0.58rem', color: step === i + 1 ? 'var(--gold)' : 'rgba(255,255,255,0.3)', fontWeight: step === i + 1 ? 800 : 400 }}>{i + 1}. {lbl}</span>
                </div>
              ))}
            </div>

            {/* STEP 1 — OZEL: style + size */}
            {mode === 'ozel' && step === 1 && (
              <div style={{ ...s.card, cursor: 'default' }}>
                <span style={s.label}>Tasarım Tarzı</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                  {CUSTOM_STYLES.map(st => (
                    <button key={st.id} onClick={() => setCakeStyle(st.id)} style={s.chip(cakeStyle === st.id)}>
                      {st.emoji} {st.name}
                    </button>
                  ))}
                </div>
                {activeStyle && <div style={{ fontSize: '0.7rem', opacity: 0.55, marginBottom: 12 }}>{activeStyle.desc}</div>}
                {activeStyle?.surcharge > 0 && <div style={{ color: '#ff8c42', fontSize: '0.7rem', fontWeight: 700, marginBottom: 12 }}>⚠️ Bu şekil için +{activeStyle.surcharge}₺ ek ücret uygulanır.</div>}

                {/* Photo upload for 'photo' style */}
                {cakeStyle === 'photo' && (
                  <div style={{ marginBottom: 16, padding: '12px 14px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14 }}>
                    <span style={{ ...s.label, marginBottom: 8 }}>🖼️ Baskı Görseli Yükle</span>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(212,175,55,0.3)', borderRadius: 12, padding: '20px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}
                      onClick={() => document.getElementById('photo-upload').click()}>
                      {photoFile ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                          <Image size={16} color="var(--gold)" />
                          <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 700 }}>{photoFile}</span>
                          <button onClick={e => { e.stopPropagation(); setPhotoFile(null); }} style={{ background: 'rgba(255,77,77,0.2)', border: 'none', borderRadius: 4, color: '#ff5555', cursor: 'pointer', padding: '2px 6px', fontSize: '0.65rem' }}>
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} color="rgba(212,175,55,0.5)" style={{ marginBottom: 6 }} />
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Görseli buraya tıklayarak yükleyin</div>
                        </>
                      )}
                      <input id="photo-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                        onChange={e => { if (e.target.files[0]) setPhotoFile(e.target.files[0].name); }} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'rgba(255,200,50,0.7)', lineHeight: 1.5 }}>
                      ⚠️ Görselin baskıya uygun (min. 300 DPI) olması gerekmektedir. Yalnızca baskı görseli kabul edilmektedir.
                    </div>
                  </div>
                )}

                <span style={s.label}>Boyut</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SIZES.map(sz => {
                    const disabled = styleMinSize === '1 No' && sz.no === '0 No';
                    return (
                      <button key={sz.no} disabled={disabled} onClick={() => setCakeSize(sz.no)} style={{ ...s.sizeBtn(cakeSize === sz.no), minWidth: 70, opacity: disabled ? 0.3 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{sz.no}</div>
                        <div style={{ fontSize: '0.58rem', opacity: 0.5 }}>{sz.desc}</div>
                        {sz.added > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--gold)' }}>+{sz.added}₺</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Content */}
            {step === 2 && (
              <div style={{ ...s.card, cursor: 'default' }}>
                {/* Show selected cake info */}
                {(mode === 'catalog' && catalogCake) && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, background: 'rgba(212,175,55,0.06)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(212,175,55,0.18)' }}>
                    <img src={catalogCake.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gold)' }}>{catalogCake.name}</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.5, marginTop: 2 }}>Boyut: {cakeSize} · Görseldeki: {catalogCake.refSize}</div>
                    </div>
                  </div>
                )}
                {(mode === 'tezgah' && tezgahCake) && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, background: 'rgba(212,175,55,0.06)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(212,175,55,0.18)' }}>
                    <img src={tezgahCake.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gold)' }}>{tezgahCake.name}</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.5, marginTop: 2 }}>Boyut: {cakeSize}</div>
                    </div>
                  </div>
                )}
                <ContentStep
                  fillings={fillings} setFillings={setFillings}
                  creams={creams} setCreams={setCreams}
                  customNote={customNote} setCustomNote={setCustomNote}
                  catalogCake={mode === 'catalog' ? catalogCake : mode === 'tezgah' ? tezgahCake : null}
                />
              </div>
            )}

            {/* STEP 3: Delivery */}
            {step === 3 && (
              <div style={{ ...s.card, cursor: 'default' }}>
                <DeliveryStep
                  custName={custName} setCustName={setCustName}
                  custPhone={custPhone} setCustPhone={setCustPhone}
                  delivDate={delivDate} setDelivDate={setDelivDate}
                  delivTime={delivTime} setDelivTime={setDelivTime}
                  minDateStr={minDateStr}
                />
              </div>
            )}

          </motion.div>
        )}

        {/* ── SUCCESS ── */}
        {mode === 'success' && placed && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ ...s.card, textAlign: 'center', cursor: 'default', padding: '2rem 1.2rem' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(37,211,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={36} color="#25D366" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: 8 }}>Siparişiniz Alındı!</h2>
            <p style={{ opacity: 0.55, fontSize: '0.8rem', marginBottom: 20 }}>Ön rezervasyon oluşturuldu. Kapora ödeme onayı ile sipariş kesinleşir.</p>

            <div style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 12, padding: '12px', textAlign: 'left', marginBottom: 16 }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Kapora Bilgisi</span>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 5, lineHeight: 1.5 }}>Toplam <strong>{placed.price}₺</strong> için gerekli kapora: <strong style={{ color: 'var(--gold)' }}>{Math.round(placed.price * 0.4)}₺</strong><br />📞 İletişim: <strong>{CONTACT_PHONE}</strong></p>
            </div>

            {/* Contact note */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '12px 14px', textAlign: 'left', marginBottom: 16, fontSize: '0.73rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              💬 <strong style={{ color: '#fff' }}>Aklınızda bir soru kalırsa</strong> işletmemizle <strong>{CONTACT_PHONE}</strong> numarasından iletişime geçebilirsiniz. Olası bir durumda işletme sizinle iletişime geçecektir.
            </div>

            <pre style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '10px', fontSize: '0.62rem', textAlign: 'left', whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>{placed.slip}</pre>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(placed.slip); alert('Kopyalandı!'); }} style={{ ...s.btnGlass, flex: 1 }}>Kopyala</button>
              <button onClick={() => window.open(`https://wa.me/902165551234?text=${encodeURIComponent(placed.slip)}`, '_blank')} style={{ ...s.btnGold, flex: 1, background: '#25D366' }}>WhatsApp</button>
            </div>
            <button onClick={reset} style={{ ...s.btnGlass, width: '100%', marginTop: 10 }}>Yeni Sipariş</button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── STICKY PRICE BAR ── */}
      {mode !== 'select' && mode !== 'success' && step > 0 && (
        <div style={s.pricebar}>
          <div>
            <div style={{ fontSize: '0.58rem', opacity: 0.5, marginBottom: 2 }}>TAHMİNİ TOPLAM</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--gold)' }}>{total}₺</div>
            <div style={{ fontSize: '0.58rem', opacity: 0.5 }}>%40 Kapora: {deposit}₺</div>
          </div>
          {step < 3 ? (
            <button onClick={() => {
              if (mode === 'ozel' && step === 1 && !cakeStyle) return alert('Lütfen bir tasarım tarzı seçin.');
              setStep(step + 1);
            }} style={s.btnGold}>İleri →</button>
          ) : (
            <button onClick={submitOrder} style={{ ...s.btnGold, background: '#25D366' }}>✓ Sipariş Ver</button>
          )}
        </div>
      )}

      <ChatBot />
    </div>
  );
}
