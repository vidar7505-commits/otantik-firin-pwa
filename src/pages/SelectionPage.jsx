import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Scale, Check, ChevronRight, ShoppingBag, Wand2, ChevronLeft, Box as BoxIcon, Star, Filter, Heart, Leaf, Wheat, Droplets, Egg, Nut, Plus, Minus, X, Sparkles, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBoxStore } from '../store/useBoxStore';
import { OrderConfigurator } from '../components/menu/OrderConfigurator';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';
import { QuantitySlider } from '../components/ui/QuantitySlider';
import { PRODUCTS_DATA } from '../data/products';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const CATEGORIES = [
  { id: 'kuru-pasta', name: 'Kuru Pasta', color: '#D4AF37', muted: 'rgba(212, 175, 55, 0.15)', accent: '#FFD700' },
  { id: 'petifur', name: 'Petifür', color: '#ba68c8', muted: 'rgba(186, 104, 200, 0.15)', accent: '#e1bee7' }
];

const SelectionPage = ({ setActiveTab }) => {
  const { confirmBox, addToCart, updateCartItem } = useCart();
  const { 
    boxes, currentBox, config, isBuilding, setBuilding, 
    addItem, removeItem, setItemQuantity, fillRemaining, 
    getBoxWeight, reset, upgradeTo1Kg,
    targetWeight, weightConfig,
  } = useBoxStore();

  const totalWeight = (boxes.box1?.length || 0) * 25 + (boxes.box2?.length || 0) * 25;
  const orderReady = totalWeight >= Number(targetWeight);

  const [activeCat, setActiveCat] = useState('kuru-pasta');
  const [subFilter, setSubFilter] = useState('all'); // 'all', 'sweet', 'salty'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [activeSlip, setActiveSlip] = useState(null);
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [isModalAtTop, setIsModalAtTop] = useState(true);
  const [isDraggingModal, setIsDraggingModal] = useState(false);

  const productsRef = React.useRef(null);
  const detailModalRef = useRef(null);

  React.useEffect(() => {
    if (isBuilding && productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isBuilding]);

  useBodyScrollLock(Boolean(viewingProduct) || Boolean(selectedProduct));

  const groupedProducts = useMemo(() => {
    let filtered = PRODUCTS_DATA.filter(p => p.category === activeCat);
    if (subFilter === 'sweet') filtered = filtered.filter(p => p.isSweet);
    if (subFilter === 'salty') filtered = filtered.filter(p => p.isSalty);
    
    return filtered.reduce((acc, p) => {
      if (!acc[p.group]) acc[p.group] = [];
      acc[p.group].push(p);
      return acc;
    }, {});
  }, [activeCat, subFilter]);

  const currentTheme = CATEGORIES.find(c => c.id === activeCat);

  const handleStartConfig = (weight) => {
    setSelectedProduct({
      id: activeCat === 'kuru-pasta' ? 999 : 998,
      name: activeCat === 'kuru-pasta' ? 'Özel Kuru Pasta Kutusu' : 'Özel Petifür Seçkisi',
      category: activeCat === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür',
      price: weight === '500gr' ? 180 : 340,
      configType: activeCat,
      isConfigurable: true,
      defaultWeight: weight
    });
  };

  const handleFinishBuilding = () => {
    const { targetWeight, config, boxes, editingBoxId } = useBoxStore.getState();
    const total = (boxes.box1?.length || 0) * 25 + (boxes.box2?.length || 0) * 25;
    
    if (total < Number(targetWeight)) {
        alert("Kutunuz henüz dolmadı! Lütfen hedef gramaja ulaşın.");
        return;
    }

    const boxData = {
        items: config.packaging === 'mixed' ? boxes.box1 : [...boxes.box1, ...boxes.box2],
        originalBoxes: { box1: [...boxes.box1], box2: [...boxes.box2] },
        targetWeight: targetWeight,
        weight: (config.packaging === 'mixed' ? boxes.box1.length : boxes.box1.length + boxes.box2.length) * 25,
        type: config.type,
        ratio: config.ratio,
        packaging: config.packaging,
        preferences: config.preferences
    };

    if (editingBoxId) {
      updateCartItem(editingBoxId, {
        weight: boxData.weight,
        boxData: { ...boxData }
      });
      useBoxStore.setState({ editingBoxId: null });
    } else {
      confirmBox(boxData);
    }
    reset();
    if (setActiveTab) {
      setActiveTab('cart');
    } else {
      window.location.href = '/cart';
    }
  };

  const orderPercentage = Math.min((totalWeight / Number(targetWeight)) * 100, 100);

  const ranges = weightConfig[targetWeight.toString()] || weightConfig['500'];
  const boxLimit = config.packaging === 'mixed' ? ranges.limit : ranges.limit / 2;

  const getProgressColor = () => {
    if (totalWeight < Number(targetWeight)) return '#D4AF37';
    if (totalWeight <= boxLimit) return '#4CAF50';
    return '#FF4D4D';
  };

  const isExceeded = totalWeight >= boxLimit;

  const BoxCard = ({ weight, label, sublabel, width }) => (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleStartConfig(weight)}
      style={{
        flex: 1, padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: currentTheme.color, opacity: 0.3 }} />
      <div style={{ width: width, height: weight === '500gr' ? '60px' : '85px', background: `linear-gradient(135deg, ${currentTheme.color} 0%, #000 100%)`, borderRadius: '12px', boxShadow: `0 10px 25px ${currentTheme.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ position: 'absolute', inset: '3px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }} />
        <span style={{ fontSize: '1.4rem' }}>📦</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: currentTheme.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>{weight}</div>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: '#fff', opacity: 0.6 }}>{weight === '500gr' ? '180,00 ₺' : '340,00 ₺'}</div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#fff', opacity: 0.4, background: 'rgba(255,255,255,0.03)', padding: '5px 12px', borderRadius: '20px', fontWeight: 600 }}>{sublabel}</div>
    </motion.button>
  );

  return (
    <div style={{ padding: 'calc(var(--header-height) + 20px) 20px 200px', minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#fff' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => window.history.back()} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem' }}>Özel Seçki</h1>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: '8px', marginBottom: '3.5rem', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', border: 'none', background: 'transparent', color: '#fff', fontSize: '0.95rem', fontWeight: 800, transition: '0.4s', position: 'relative', zIndex: 2, cursor: 'pointer', opacity: activeCat === cat.id ? 1 : 0.35, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {activeCat === cat.id && (
              <motion.div layoutId="activeTabSelection" style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${cat.color}CC 0%, ${cat.color}99 100%)`, borderRadius: '18px', zIndex: -1, boxShadow: `0 8px 15px ${cat.color}22`, overflow: 'hidden' }} transition={{ type: 'spring', bounce: 0.15, duration: 0.7 }}>
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', skewX: -20 }} />
              </motion.div>
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {!isBuilding && (
        <div style={{ marginBottom: '4.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2.5rem', textAlign: 'center', opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase' }}>Kutunuzu Kişiselleştirin</h2>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-end' }}>
            <BoxCard weight="500gr" label="Artizan Seçki" sublabel="~20-25 Adet" width="100px" />
            <BoxCard weight="1kg" label="Aile Seçkisi" sublabel="~45-50 Adet" width="130px" />
          </div>
        </div>
      )}

      {/* Sub-category Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { id: 'all', name: 'Tümü' },
          { id: 'sweet', name: 'Tatlılar' },
          { id: 'salty', name: 'Tuzlular' }
        ].map(filter => (
          <button 
            key={filter.id} 
            onClick={() => setSubFilter(filter.id)}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '14px', border: 'none', 
              background: subFilter === filter.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: subFilter === filter.id ? currentTheme.color : 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem', fontWeight: 800, transition: '0.3s'
            }}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div style={{ marginBottom: '5rem' }} ref={productsRef}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
          <Filter size={18} style={{ color: currentTheme.color }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 400, fontFamily: 'var(--font-serif)' }}>
            {isBuilding ? (
                <>Kutunuz İçin <span style={{ color: currentTheme.color }}>Lezzetler</span></>
            ) : (
                <>Dükkanımızdan <span style={{ color: currentTheme.color }}>Lezzetler</span></>
            )}
          </h2>
        </div>

        {Object.entries(groupedProducts).map(([group, items]) => (
          <div key={group} style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: currentTheme.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '25px', height: '1px', background: currentTheme.color, opacity: 0.3 }} /> {group}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              {items.map(p => {
                const countInCurrentBox = boxes[currentBox].filter(i => i.id === p.id).length;
                const autoItems = boxes[currentBox].filter(i => i.id === p.id && i.isAuto).length;
                
                return (
                  <motion.div
                    key={p.id}
                    className="glass"
                    whileHover={{ y: -5 }}
                    style={{ 
                      padding: '1.2rem', borderRadius: '28px', border: isBuilding && countInCurrentBox > 0 ? `1px solid ${currentTheme.color}` : '1px solid rgba(255,255,255,0.04)', 
                      cursor: 'pointer', background: 'rgba(255,255,255,0.01)', position: 'relative',
                      display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}
                  >
                    <div onClick={() => setViewingProduct(p)} style={{ width: '100%', position: 'relative' }}>
                      <div style={{ height: '110px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', marginBottom: '12px' }}>{p.image}</div>
                      {autoItems > 0 && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#4CAF50', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(76,175,80,0.5)' }}>
                            <Sparkles size={14} color="#fff" />
                          </div>
                      )}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px', textAlign: 'center' }}>{p.name}</h4>
                      <div style={{ fontSize: '0.65rem', opacity: 0.4, textAlign: 'center', marginBottom: '8px', fontStyle: 'italic' }}>{p.desc}</div>
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: currentTheme.color, fontWeight: 700, marginBottom: '10px' }}>{p.price} ₺</div>
                    </div>

                    {isBuilding && (
                      <QuantitySlider 
                        value={countInCurrentBox} 
                        onChange={(val) => setItemQuantity(currentBox, p, val)} 
                        themeColor={currentTheme.color}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {viewingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingProduct(null)} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', overscrollBehavior: 'none' }}>
            <motion.div
              ref={detailModalRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag={isModalAtTop ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={() => {
                setIsDraggingModal(true);
                if (detailModalRef.current) {
                  setIsModalAtTop(detailModalRef.current.scrollTop === 0);
                }
              }}
              onDragEnd={(event, info) => {
                setIsDraggingModal(false);
                if (isModalAtTop && (info.offset.y < -110 || info.offset.y > 110)) {
                  setViewingProduct(null);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => {
                if (!isDraggingModal) {
                  setIsModalAtTop(e.target.scrollTop === 0);
                }
              }}
              className="glass"
              style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem 4rem', borderTopLeftRadius: '45px', borderTopRightRadius: '45px', border: `1px solid rgba(255,255,255,0.06)`, background: '#080808', maxHeight: '92vh', overflowY: isDraggingModal ? 'hidden' : 'auto', position: 'relative', touchAction: 'pan-y', overscrollBehavior: 'contain' }}
            >
              <button 
                onClick={() => setViewingProduct(null)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              >
                <X size={20} />
              </button>
              <div style={{ width: '45px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', margin: '-1rem auto 2.5rem' }} />
              <div style={{ height: '200px', borderRadius: '35px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', marginBottom: '2rem' }}>{viewingProduct.image}</div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{viewingProduct.name}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {viewingProduct.tags?.map(tag => <span key={tag} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '10px', opacity: 0.6 }}>{tag}</span>)}
                </div>
              </div>

              {viewingProduct.masterNote && (
                  <div style={{ marginBottom: '2rem', padding: '1.2rem', background: `${currentTheme.color}11`, borderRadius: '20px', borderLeft: `4px solid ${currentTheme.color}` }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: currentTheme.color, marginBottom: '4px' }}>Ustanın Notu</div>
                    <div style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8 }}>"{viewingProduct.masterNote}"</div>
                  </div>
              )}

              <div style={{ marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px' }}>
                <h4 style={{ fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '1.2rem' }}>Alerjen Bilgisi</h4>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {['Gluten', 'Süt', 'Yumurta', 'Kuruyemiş'].map(a => (
                        <div key={a} style={{ opacity: viewingProduct.allergens?.includes(a) ? 1 : 0.2, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{a === 'Gluten' ? '🌾' : a === 'Süt' ? '🥛' : a === 'Yumurta' ? '🥚' : '🥜'}</div>
                            <div style={{ fontSize: '0.66rem' }}>{a}</div>
                        </div>
                    ))}
                </div>
              </div>

              {isBuilding ? (
                 <button onClick={() => { addItem(currentBox, viewingProduct); setViewingProduct(null); }} className="btn-premium" style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', background: currentTheme.color }}>KUTUYA EKLE</button>
              ) : (
                 <button 
                  disabled 
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed' }}
                 >
                  LÜTFEN ÖNCE KUTU AÇIN
                 </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSelectedProduct(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'flex-end' }}
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', background: '#0A0A0A', padding: '2rem', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', maxHeight: '92vh', overflowY: 'auto', borderTop: `1px solid ${currentTheme.color}44` }}
            >
              <OrderConfigurator product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Box Builder Bar */}
      <AnimatePresence>
        {isBuilding && (
          <motion.div
            initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
            style={{ position: 'fixed', bottom: 'calc(20px + var(--install-ribbon-height, 0px))', left: '15px', right: '15px', zIndex: 2000, background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(25px)', borderRadius: '35px', padding: '1.2rem', border: `1px solid ${isExceeded ? '#ff4d4d' : currentTheme.color}66`, boxShadow: '0 -15px 50px rgba(0,0,0,0.7)' }}
          >
            {config.packaging === 'separate' && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    {['box1', 'box2'].map(bk => (
                        <button key={bk} onClick={() => useBoxStore.setState({ currentBox: bk })} style={{ flex: 1, padding: '10px', borderRadius: '15px', background: currentBox === bk ? currentTheme.color : 'rgba(255,255,255,0.05)', color: currentBox === bk ? '#000' : '#fff', fontSize: '0.8rem', fontWeight: 800, transition: '0.3s' }}>{bk === 'box1' ? '1. KUTU' : '2. KUTU'} ({getBoxWeight(bk)}g)</button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BoxIcon size={20} style={{ color: isExceeded ? '#ff4d4d' : currentTheme.color }} />
                <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{targetWeight}g HEDEF</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{totalWeight}g / {targetWeight}g</div>
                </div>
              </div>
              <button 
                onClick={() => setShowAutoFill(!showAutoFill)}
                style={{ padding: '8px 15px', borderRadius: '15px', background: `${currentTheme.color}22`, border: `1px solid ${currentTheme.color}44`, color: currentTheme.color, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} /> AKILLI DOLDUR
              </button>
            </div>

            <AnimatePresence>
                {showAutoFill && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }}>
                            {['En Çok Satanlar', 'Tatlı Ağırlıklı', 'Tuzlu Ağırlıklı'].map(mode => (
                                <button key={mode} onClick={() => { fillRemaining(mode); setShowAutoFill(false); }} style={{ flex: 1, fontSize: '0.65rem', padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>{mode}</button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${orderPercentage}%` }} style={{ height: '100%', background: getProgressColor() }} />
            </div>
            
            {isExceeded && (
                <div style={{ marginBottom: '1.5rem', padding: '12px', background: 'rgba(255,77,77,0.1)', borderRadius: '15px', border: '1px solid rgba(255,77,77,0.2)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#ff4d4d', fontWeight: 700, marginBottom: '4px' }}>Kapasite Limitine Ulaşıldı</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: targetWeight === 500 ? '10px' : '0' }}>
                        {targetWeight === 500 
                          ? 'Bu kutuya daha fazla ürün ekleyemezsiniz. Lütfen bazılarını çıkarın veya 1kg seçeneğine geçin.' 
                          : 'Bu kutuya daha fazla ürün ekleyemezsiniz. Lütfen bazılarını çıkarın.'}
                    </div>
                    {targetWeight === 500 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={upgradeTo1Kg}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                background: `linear-gradient(135deg, ${currentTheme.color} 0%, #000 100%)`,
                                border: `1px solid ${currentTheme.color}66`,
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 805,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                boxShadow: `0 4px 10px ${currentTheme.color}22`,
                                marginTop: '10px'
                            }}
                        >
                            <TrendingUp size={14} style={{ color: currentTheme.color }} /> 1 KG SEÇENEĞİNE GEÇ (Ürünleri Koru)
                        </motion.button>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={reset} style={{ flex: 1, padding: '1rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>İPTAL</button>
                <button 
                  onClick={handleFinishBuilding}
                  disabled={!orderReady}
                  className="btn-premium"
                  style={{ 
                    flex: 2, padding: '1rem', borderRadius: '20px', 
                    background: orderReady ? currentTheme.color : 'rgba(255,255,255,0.1)', 
                    color: orderReady ? '#000' : '#fff',
                    opacity: orderReady ? 1 : 0.5,
                    cursor: orderReady ? 'pointer' : 'not-allowed',
                  }}
                >
                  SEPETE EKLE
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeSlip && <OrderSlipModal slip={activeSlip} onClose={() => setActiveSlip(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default SelectionPage;
