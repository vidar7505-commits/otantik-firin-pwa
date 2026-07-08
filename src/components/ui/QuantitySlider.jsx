import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export const QuantitySlider = ({ value, onChange, themeColor }) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    onChange(val);
  };

  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', justifyContent: 'space-between' }}>
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Minus size={18} />
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: themeColor }}>{value}</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block', textTransform: 'uppercase' }}>Adet</span>
        </div>

        <button 
          onClick={() => onChange(Math.min(20, value + 1))}
          style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
        <input 
          type="range" 
          min="0" 
          max="20" 
          value={value} 
          onChange={handleChange}
          style={{
            width: '100%',
            height: '4px',
            WebkitAppearance: 'none',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <style>
          {`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: ${themeColor};
              cursor: pointer;
              box-shadow: 0 0 15px ${themeColor}66;
              border: 3px solid #000;
            }
          `}
        </style>
      </div>
    </div>
  );
};
