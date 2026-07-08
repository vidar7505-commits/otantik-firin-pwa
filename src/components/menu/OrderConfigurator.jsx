import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Box, Send, Plus, ChevronLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useBoxStore } from '../../store/useBoxStore';

const KURU_PASTA_PRESETS = [
  { id: 'all-sweet', label: 'Sadece Tatlı', icon: '🍩' },
  { id: 'all-salty', label: 'Sadece Tuzlu', icon: '🥨' },
  { id: 'half-half', label: 'Yarı Yarıya (1:1)', icon: '🌓' },
  { id: 'manual', label: 'Özel Seçki (Usta Notlu)', icon: '✨' },
];

export const OrderConfigurator = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { setConfig, reset } = useBoxStore();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    weight: product.defaultWeight || '500gr',
    preset: 'half-half',
    packaging: 'mixed',
    customNote: '',
    agreedToVariance: false,
  });

  const isPetifur = product.category === 'Petifür';
  const themeColor = isPetifur ? '#ba68c8' : '#D4AF37';
  const themeMuted = isPetifur ? 'rgba(186, 104, 200, 0.15)' : 'rgba(212, 175, 55, 0.15)';

  const handleAction = () => {
    if (selections.preset === 'manual') {
        // Start building custom box
        setConfig({
            type: isPetifur ? 'petifur' : 'kuru-pasta',
            weight: selections.weight,
            packaging: selections.packaging,
            ratio: 'Özel Seçki',
            preferences: selections.customNote
        });
        onClose();
    } else {
        // Direct add to cart for preset options
        const label = KURU_PASTA_PRESETS.find(p => p.id === selections.preset)?.label;
        const boxProduct = {
            id: `box-${Date.now()}`,
            name: `${isPetifur ? 'Petifür' : 'Kuru Pasta'} (${label}) - ${selections.weight}`,
            price: selections.weight === '500gr' ? 180 : 340,
            image: '📦',
            quantity: 1,
            isCustomBox: false, // Treat as regular product for now
            boxData: {
                targetWeight: selections.weight === '1kg' ? 1000 : 500,
                packaging: selections.packaging,
                ratio: label,
                type: isPetifur ? 'petifur' : 'kuru-pasta'
            }
        };
        addToCart(boxProduct);
        onClose();
    }
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fff', fontWeight: 600 }}>Gramaj ve Seçim</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['500gr', '1kg'].map(w => (
          <button
            key={w}
            onClick={() => setSelections({...selections, weight: w})}
            style={{
              flex: 1, padding: '1.25rem', borderRadius: '20px',
              border: selections.weight === w ? `2px solid ${themeColor}` : '1px solid rgba(255,255,255,0.05)',
              background: selections.weight === w ? themeMuted : 'rgba(255,255,255,0.02)',
              color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
            }}
          >
            <Box size={24} style={{ color: selections.weight === w ? themeColor : 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontWeight: 700 }}>{w}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '2.5rem' }}>
        {KURU_PASTA_PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelections({...selections, preset: p.id})}
            style={{
              padding: '1.2rem 1rem', borderRadius: '18px', fontSize: '0.85rem',
              border: selections.preset === p.id ? `2px solid ${themeColor}` : '1px solid rgba(255,255,255,0.05)',
              background: selections.preset === p.id ? themeMuted : 'rgba(255,255,255,0.02)',
              color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.3s',
              opacity: selections.preset === p.id ? 1 : 0.5
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
            <span style={{ fontWeight: 800, textAlign: 'center' }}>{p.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontWeight: 600 }}>Paketleme Düzeni</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['mixed', 'separate'].map(p => (
            <button
              key={p}
              onClick={() => setSelections({...selections, packaging: p})}
              style={{
                flex: 1, padding: '1.2rem 1rem', borderRadius: '18px', fontSize: '0.85rem',
                border: selections.packaging === p ? `2px solid ${themeColor}` : '1px solid rgba(255,255,255,0.05)',
                background: selections.packaging === p ? themeMuted : 'rgba(255,255,255,0.02)',
                color: '#fff', display: 'flex', flexDirection: 'column', gap: '6px'
              }}
            >
              <span style={{ fontWeight: 800 }}>{p === 'mixed' ? 'Tek Kutu' : 'Ayrı Kutular'}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                {p === 'mixed' ? 'Tüm çeşitler bir arada' : (selections.weight === '500gr' ? '250g + 250g' : '500g + 500g')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button 
        className="btn-premium" 
        style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', background: themeColor, borderColor: themeColor }}
        onClick={() => setStep(2)}
      >
        ÖZELLEŞTİRMEYE DEVAM ET
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fff', fontWeight: 600 }}>Onay ve Not</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <textarea
          placeholder="Özel istekleriniz..."
          value={selections.customNote}
          onChange={(e) => setSelections({...selections, customNote: e.target.value})}
          style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1rem', color: '#fff', resize: 'none' }}
        />
      </div>

      <div 
        onClick={() => setSelections({...selections, agreedToVariance: !selections.agreedToVariance})}
        style={{ 
          display: 'flex', gap: '12px', padding: '1.2rem', background: 'rgba(255,100,100,0.05)', borderRadius: '20px', border: selections.agreedToVariance ? '1px solid #ff4d4d' : '1px solid rgba(255,100,100,0.1)', cursor: 'pointer', marginBottom: '2rem'
        }}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4d', flexShrink: 0 }}>
          {selections.agreedToVariance && <Check size={14} />}
        </div>
        <p style={{ fontSize: '0.75rem', opacity: 0.8 }}><strong>GRAMAJ SAPMASI:</strong> Ürünler el yapımı olduğu için +/-%15 sapma olabilir. Fark kapıda veya tartımda netleşir.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>GERİ</button>
        <button 
          disabled={!selections.agreedToVariance}
          onClick={handleAction}
          className="btn-premium" 
          style={{ flex: 2, borderRadius: '20px', opacity: selections.agreedToVariance ? 1 : 0.5, background: themeColor, borderColor: themeColor }}
        >
          {selections.preset === 'manual' ? 'KUTUYU İNŞA ET' : 'SEPETE EKLE'} 
          {selections.preset === 'manual' ? <Sparkles size={18} style={{ marginLeft: '8px' }} /> : <ShoppingBag size={18} style={{ marginLeft: '8px' }} />}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: themeColor }}>{isPetifur ? 'Petifür' : 'Kuru Pasta'} Seçkisi</h2>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: 'none', 
            color: '#fff', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>
      </div>
      <AnimatePresence mode="wait">
        {step === 1 ? renderStep1() : renderStep2()}
      </AnimatePresence>
    </div>
  );
};
