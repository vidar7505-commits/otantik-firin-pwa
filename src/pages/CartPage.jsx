import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, MessageSquare, ChevronDown, ChevronUp, Plus, Sparkles, Edit2, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBoxStore } from '../store/useBoxStore';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';
import { PRODUCTS_DATA } from '../data/products';
import { getCartRecommendations } from '../utils/recommendations';

// Custom Hook for Mouse Drag Scroll with Click Capture Guard
const useDraggableScroll = (ref) => {
  React.useEffect(() => {
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

const SHOP_OPEN = 9;
const SHOP_CLOSE = 22;

const getDeliveryLimits = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  const dates = [];

  // Can we deliver today?
  // Round up to next hour only if we're at or past the half-hour mark.
  // e.g. 18:00–18:29 → earliest 20:00 | 18:30–18:59 → earliest 21:00
  const minHourToday = currentHour + 2 + (currentMin >= 30 ? 1 : 0);
  if (minHourToday < SHOP_CLOSE) {
    dates.push({
      value: 'today',
      label: `Bugün (${now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })})`,
      minHour: Math.max(SHOP_OPEN, minHourToday),
      maxHour: SHOP_CLOSE
    });
  }

  // Tomorrow is always available
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  dates.push({
    value: 'tomorrow',
    label: `Yarın (${tomorrow.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })})`,
    minHour: SHOP_OPEN,
    maxHour: SHOP_CLOSE
  });

  return dates;
};

const getTimeSlots = (minHour, maxHour) => {
  const slots = [];
  for (let h = minHour; h < maxHour; h++) {
    const hh = String(h).padStart(2, '0');
    slots.push(`${hh}:00`);
    slots.push(`${hh}:30`);
  }
  slots.push(`${String(maxHour).padStart(2, '0')}:00`);
  return slots;
};

const getFormattedDateStr = (selectedDateStr) => {
  const now = new Date();
  if (selectedDateStr === 'today') return now.toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// ─── Touch-Friendly Delivery Scheduler ──────────────────────────────────────
const DeliveryScheduler = ({ deliveryDates, selectedDateStr, setSelectedDateStr, activeSlots, selectedTimeStr, setSelectedTimeStr }) => {
  const timeScrollRef = React.useRef(null);
  const dragState = React.useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  // Auto-scroll selected chip into view
  React.useEffect(() => {
    if (!timeScrollRef.current) return;
    const chip = timeScrollRef.current.querySelector('[data-selected="true"]');
    if (chip) chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedTimeStr, activeSlots]);

  // Mouse drag-to-scroll handlers
  const onMouseDown = (e) => {
    const el = timeScrollRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };
  const onMouseLeave = () => {
    const el = timeScrollRef.current;
    if (!el) return;
    dragState.current.isDragging = false;
    el.style.cursor = 'grab';
    el.style.userSelect = '';
  };
  const onMouseUp = () => {
    dragState.current.isDragging = false;
    const el = timeScrollRef.current;
    if (el) { el.style.cursor = 'grab'; el.style.userSelect = ''; }
  };
  const onMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const el = timeScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.4;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Date pill buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {deliveryDates.map(d => {
          const isActive = selectedDateStr === d.value;
          const datePart = d.label.match(/\((.+)\)/)?.[1] || '';
          return (
            <button
              key={d.value}
              onClick={() => {
                setSelectedDateStr(d.value);
                const slots = getTimeSlots(d.minHour, d.maxHour);
                setSelectedTimeStr(slots[0] || '');
              }}
              style={{
                flex: 1,
                padding: '14px 10px',
                borderRadius: '16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                border: isActive ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {d.value === 'today' ? '📅 Bugün' : '📅 Yarın'}
              <div style={{ fontSize: '0.66rem', fontWeight: 600, opacity: 0.7, marginTop: '3px' }}>{datePart}</div>
            </button>
          );
        })}
      </div>

      {/* Time chips - draggable horizontal scroll */}
      <div>
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>SAAT SEÇİN</div>
        <div
          ref={timeScrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{
            display: 'flex', gap: '8px',
            overflowX: 'auto', paddingBottom: '6px',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
          }}
        >
          {activeSlots.map(slot => {
            const isActive = selectedTimeStr === slot;
            return (
              <button
                key={slot}
                data-selected={isActive ? 'true' : 'false'}
                onClick={() => {
                  // Only register click if not dragging
                  if (!dragState.current.isDragging) setSelectedTimeStr(slot);
                }}
                style={{
                  flexShrink: 0,
                  minWidth: '66px',
                  padding: '13px 6px',
                  borderRadius: '14px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 900 : 600,
                  border: isActive ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? 'var(--anthracite)' : 'rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  textAlign: 'center',
                  pointerEvents: 'auto',
                }}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.16)', borderRadius: '12px', padding: '10px 12px', fontSize: '0.69rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
        💡 En erken teslimat, sipariş anından itibaren <strong style={{ color: 'var(--gold)' }}>2 saat sonrası</strong> için planlanır. Siparişlerim kısmından teslim alınabilir olarak güncellendiğinde <strong>erkenden teslim alabilirsiniz</strong>.
      </div>
    </div>
  );
};


const CartPage = ({ setActiveTab }) => {
  const { cart, addToCart, removeFromCart, updateCartItem, finalizeOrder, cartCount } = useCart();
  const { specialNote, noteCategory, setNote } = useBoxStore();
  const [schedulerOpen, setSchedulerOpen] = React.useState(true);
  const [showSlip, setShowSlip] = React.useState(null);
  const [addedFeedbackId, setAddedFeedbackId] = React.useState(null);
  const [editingItem, setEditingItem] = React.useState(null);
  const [editState, setEditState] = React.useState({});

  const cartRecommendations = React.useMemo(() => {
    return getCartRecommendations(cart, PRODUCTS_DATA);
  }, [cart]);

  const cartRecsRef = React.useRef(null);
  useDraggableScroll(cartRecsRef);

  const handleStartEditItem = (item) => {
    if (item.isCustomBox) {
      const box = item.boxData;
      useBoxStore.setState({
        boxes: box.originalBoxes || { box1: box.items || [], box2: [] },
        targetWeight: Number(box.targetWeight),
        config: {
          type: box.type,
          ratio: box.ratio,
          packaging: box.packaging,
          preferences: box.preferences || ''
        },
        isBuilding: true,
        editingBoxId: item.id
      });
      if (setActiveTab) setActiveTab('search');
      return;
    }

    const isCake = item.isCake || item.category === 'yaş-pasta';
    if (isCake) {
      setEditingItem(item);
      setEditState({
        selectedSize: item.selectedSize || '0 No',
        message: item.extras?.free?.message || '',
        candle: item.extras?.free?.candle || false,
        sparkler: item.extras?.free?.sparkler || false,
        paidCandles: item.extras?.paid || { 'text-candle': 0, volcano: 0, 'num-candle': {} }
      });
      return;
    }

    if (item.boxData) {
      setEditingItem(item);
      setEditState({
        targetWeight: item.boxData.targetWeight || 500,
        preset: item.boxData.ratio || 'Yarı Yarıya (1:1)',
        packaging: item.boxData.packaging || 'mixed',
        customNote: item.boxData.preferences || ''
      });
    }
  };

  const handleSaveCakeEdits = () => {
    if (!editingItem) return;
    const baseProduct = PRODUCTS_DATA.find(p => p.id === editingItem.id);
    const basePrice = baseProduct ? baseProduct.price : (editingItem.price - (editingItem.selectedSize === '1 No' ? 100 : 0));
    const newPrice = basePrice + (editState.selectedSize === '1 No' ? 100 : 0);

    const updatedFields = {
      selectedSize: editState.selectedSize,
      price: newPrice,
      extras: {
        free: {
          message: editState.message,
          hasMessage: !!editState.message,
          candle: editState.candle,
          sparkler: editState.sparkler
        },
        paid: editState.paidCandles
      }
    };
    updateCartItem(editingItem.id, updatedFields);
    setEditingItem(null);
  };

  const handleSavePresetEdits = () => {
    if (!editingItem) return;
    const newTargetWeight = Number(editState.targetWeight);
    const newPrice = newTargetWeight === 500 ? 180 : 340;
    const name = `${editingItem.boxData.type === 'petifur' ? 'Petifür' : 'Kuru Pasta'} (${editState.preset}) - ${newTargetWeight === 500 ? '500gr' : '1kg'}`;

    const updatedFields = {
      name,
      price: newPrice,
      boxData: {
        ...editingItem.boxData,
        targetWeight: newTargetWeight,
        ratio: editState.preset,
        packaging: editState.packaging,
        preferences: editState.customNote
      }
    };
    updateCartItem(editingItem.id, updatedFields);
    setEditingItem(null);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const deliveryDates = React.useMemo(() => getDeliveryLimits(), []);
  const [selectedDateStr, setSelectedDateStr] = React.useState(() => deliveryDates[0]?.value || 'tomorrow');

  const activeSlots = React.useMemo(() => {
    const dObj = deliveryDates.find(d => d.value === selectedDateStr);
    if (!dObj) return [];
    return getTimeSlots(dObj.minHour, dObj.maxHour);
  }, [selectedDateStr, deliveryDates]);

  const [selectedTimeStr, setSelectedTimeStr] = React.useState(() => activeSlots[0] || '');

  React.useEffect(() => {
    if (activeSlots.length > 0 && !activeSlots.includes(selectedTimeStr)) {
      setSelectedTimeStr(activeSlots[0]);
    }
  }, [activeSlots, selectedTimeStr]);

  // Uses the standalone helper defined above
  const getFormattedDate = () => getFormattedDateStr(selectedDateStr);

  if (cartCount === 0) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShoppingCart size={40} style={{ opacity: 0.2 }} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Sepetin Boş</h2>
        <p style={{ opacity: 0.4 }}>Menüden lezzetli ürünler eklemeye ne dersin?</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 20px 380px', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '2rem', marginBottom: '2rem' }}>Sepetim</h1>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
        {cart.map((item, idx) => (
          <motion.div 
            key={`${item.id}-${idx}`}
            layout
            className="glass"
            style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}
          >
            <div style={{ fontSize: '2rem' }}>{item.image || '🍞'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>{(item.price * (item.quantity || 1)).toFixed(2)} ₺ {item.quantity > 1 && `(${item.quantity} Adet)`}</div>
              
              {/* Configured options details list */}
              {item.selectedSize && (
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', color: '#fff' }}>
                  📏 Boyut: {item.selectedSize}
                </div>
              )}
              {item.extras?.free?.message && (
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px', color: '#fff' }}>
                  💌 Plaka Yazısı: "{item.extras.free.message}"
                </div>
              )}
              {item.isCustomBox && item.weight && (
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', color: '#fff' }}>
                  ⚖️ Doluluk: {item.weight}g
                </div>
              )}
              {item.boxData && !item.isCustomBox && (
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', color: '#fff' }}>
                  📦 Tür: {item.boxData.ratio} ({item.boxData.targetWeight}gr)
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {(item.isCustomBox || item.isCake || item.category === 'yaş-pasta' || item.boxData) && (
                <button 
                  onClick={() => handleStartEditItem(item)} 
                  style={{ color: 'var(--gold)', opacity: 0.8, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Edit2 size={16} />
                </button>
              )}
              <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff4d4d', opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Amazon-style Cart cross-sell recommendations */}
      {cartRecommendations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--gold)' }} />
            Sepetinize Yakışacak Lezzetler
          </h3>
          {total < 1000 && (
            <p style={{ fontSize: '0.75rem', opacity: 0.6, color: 'var(--gold)', marginBottom: '1.2rem', fontWeight: 600 }}>
              💡 Sepeti 1000 ₺ barajına tamamlamak için en çok tercih edilen taze lezzetler:
            </p>
          )}
          <div 
            ref={cartRecsRef}
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
            {cartRecommendations.map(p => {
              const isAdded = addedFeedbackId === p.id;
              return (
                <div 
                  key={p.id} 
                  className="glass" 
                  style={{ 
                    flexShrink: 0, 
                    width: '130px', 
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
                    <span style={{ fontSize: '2rem' }}>{p.image}</span>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', height: '32px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.2 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 800 }}>
                      {p.price} ₺
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                      setAddedFeedbackId(p.id);
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
                    {isAdded ? 'Eklendi! ✓' : <><Plus size={10} /> Ekle</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={18} style={{ color: 'var(--gold)' }} />
            Özel İstek & Notunuz
        </h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['Arayın', 'Değiştirin', 'Özel İstek'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setNote(specialNote, cat)}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '12px', fontSize: '0.75rem', 
                    background: noteCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                    color: noteCategory === cat ? '#000' : '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 800,
                    transition: '0.3s'
                  }}
                >
                    {cat}
                </button>
            ))}
        </div>
        <textarea 
            placeholder="Siparişinizle ilgili özel bir not bırakın..."
            value={specialNote}
            onChange={(e) => setNote(e.target.value, noteCategory)}
            style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1rem', color: '#fff', resize: 'none', fontSize: '0.9rem', outline: 'none' }}
        />
      </div>

      <div className="cart-checkout-wrapper" style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', zIndex: 100, maxWidth: '720px', margin: '0 auto' }}>
        <div className="glass-gold cart-checkout-panel" style={{ background: 'rgba(12, 12, 12, 0.90)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.3rem', borderRadius: '22px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '72vh', overflowY: 'auto' }}>

          {/* Warning Banner for Minimum Purchase Limit */}
          {total < 1000 && (
            <div style={{ background: 'rgba(255, 77, 77, 0.12)', border: '1px solid rgba(255, 77, 77, 0.25)', borderRadius: '14px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '0.75rem', color: '#ff4d4d', fontWeight: 900, letterSpacing: '0.5px' }}>⚠️ MİNİMUM SİPARİŞ LİMİTİ</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.9, color: '#fff' }}>Sepetiniz 1000 ₺ altındadır. Eksik tutar: {(1000 - total).toFixed(2)} ₺.</span>
            </div>
          )}

          {/* Delivery Date & Time Picker - collapsible */}
          {total >= 1000 && (
            <div>
              {/* Toggle header */}
              <button
                onClick={() => setSchedulerOpen(o => !o)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 4px',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  🕐 Teslimat Zamanı
                  {!schedulerOpen && selectedTimeStr && (
                    <span style={{ marginLeft: '8px', color: 'var(--gold)', fontWeight: 700 }}>
                      — {selectedDateStr === 'today' ? 'Bugün' : 'Yarın'} {selectedTimeStr}
                    </span>
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 8px', transition: 'all 0.2s' }}>
                  {schedulerOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </span>
              </button>

              {/* Collapsible body */}
              {schedulerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', marginTop: '10px' }}
                >
                  <DeliveryScheduler
                    deliveryDates={deliveryDates}
                    selectedDateStr={selectedDateStr}
                    setSelectedDateStr={setSelectedDateStr}
                    activeSlots={activeSlots}
                    selectedTimeStr={selectedTimeStr}
                    setSelectedTimeStr={setSelectedTimeStr}
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* Total + Order Button — compact when scheduler is collapsed */}
          {schedulerOpen || total < 1000 ? (
            // Expanded: total on its own row, button full-width below
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Toplam</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)' }}>{total.toFixed(2)} ₺</span>
              </div>
              <button
                disabled={total < 1000}
                onClick={() => {
                  if (total < 1000) return;
                  const formattedDate = getFormattedDate();
                  const order = finalizeOrder(specialNote, noteCategory, formattedDate, selectedTimeStr);
                  setShowSlip(order.slip);
                }}
                className="btn-premium"
                style={{
                  width: '100%', padding: '1.1rem', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: total < 1000 ? 0.35 : 1,
                  cursor: total < 1000 ? 'not-allowed' : 'pointer',
                  background: total < 1000 ? 'rgba(255,255,255,0.05)' : 'var(--gold)',
                  borderColor: total < 1000 ? 'rgba(255,255,255,0.1)' : 'var(--gold)',
                  color: total < 1000 ? 'rgba(255,255,255,0.3)' : 'var(--anthracite)',
                  transition: 'all 0.3s ease'
                }}
              >
                SİPARİŞİ TAMAMLA <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
            </>
          ) : (
            // Collapsed: total Left + button right in one row
            <button
              disabled={total < 1000}
              onClick={() => {
                if (total < 1000) return;
                const formattedDate = getFormattedDate();
                const order = finalizeOrder(specialNote, noteCategory, formattedDate, selectedTimeStr);
                setShowSlip(order.slip);
              }}
              className="btn-premium"
              style={{
                width: '100%', padding: '1rem 1.4rem', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: total < 1000 ? 0.35 : 1,
                cursor: total < 1000 ? 'not-allowed' : 'pointer',
                background: total < 1000 ? 'rgba(255,255,255,0.05)' : 'var(--gold)',
                color: total < 1000 ? 'rgba(255,255,255,0.3)' : 'var(--anthracite)',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>{total.toFixed(2)} ₺</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9rem' }}>
                SİPARİŞİ TAMAMLA <ArrowRight size={16} />
              </span>
            </button>
          )}
        </div>
      </div>

      {showSlip && (
          <OrderSlipModal slip={showSlip} onClose={() => setShowSlip(null)} />
      )}
    </div>
  );
};

export default CartPage;
