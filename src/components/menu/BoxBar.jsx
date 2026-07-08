import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ChevronUp, Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const BoxBar = ({ onOpen }) => {
  const { activeBox, cancelBox } = useCart();

  if (!activeBox) return null;

  const percentage = (activeBox.currentWeight / activeBox.targetWeight) * 100;
  const isFull = activeBox.currentWeight >= activeBox.targetWeight;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '15px',
        right: '15px',
        zIndex: 1000,
      }}
    >
      <div 
        className="glass-gold"
        style={{
          padding: '12px 20px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--gold-muted)'
        }}
        onClick={onOpen}
      >
        <div style={{ position: 'relative', width: '45px', height: '45px' }}>
          <svg width="45" height="45" viewBox="0 0 45 45">
            <circle cx="22.5" cy="22.5" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <motion.circle 
              cx="22.5" cy="22.5" r="20" fill="none" 
              stroke="var(--gold)" strokeWidth="3"
              strokeDasharray="125.6"
              animate={{ strokeDashoffset: 125.6 - (125.6 * Math.min(percentage, 100)) / 100 }}
              style={{ rotate: -90, transformOrigin: 'center' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box size={18} style={{ color: 'var(--gold)' }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {activeBox.type === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür'} Kutum
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)' }}>
              {activeBox.currentWeight} / {activeBox.targetWeight} gr
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              style={{ height: '100%', background: isFull ? '#4CAF50' : 'var(--gold)' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                onClick={(e) => { e.stopPropagation(); cancelBox(); }}
                style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)' }}
            >
                <X size={14} style={{ opacity: 0.5 }} />
            </button>
            <div style={{ color: 'var(--gold)' }}>
                <ChevronUp size={20} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};
