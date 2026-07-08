import React from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Send, CheckCircle, Store, Calendar, Printer, AlertTriangle } from 'lucide-react';
import { useBoxStore } from '../../store/useBoxStore';

export const OrderSlipModal = ({ slip, onClose }) => {
  const { specialNote, noteCategory } = useBoxStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(slip);
    alert("Mağaza fişi kopyalandı!");
  };

  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ width: '100%', maxWidth: '380px', position: 'relative' }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '-40px', right: '0', color: '#fff', opacity: 0.7 }}
        >
          <X size={28} />
        </button>

        <div style={{ 
          background: '#fff', 
          color: '#333', 
          padding: '2rem 1.5rem', 
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          fontFamily: "'Courier New', Courier, monospace",
          position: 'relative',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* STAFF NOTICE RED LABEL */}
          {specialNote && (
              <div style={{ background: '#ff4d4d', color: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '1.5rem', border: '3px solid #b30000', boxShadow: '0 5px 15px rgba(255,77,77,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <AlertTriangle size={20} />
                    <strong style={{ fontSize: '1rem', letterSpacing: '1px' }}>{noteCategory.toUpperCase()}</strong>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.2 }}>{specialNote}</div>
              </div>
          )}

          <div style={{ textAlign: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#000' }}>
              <Store size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', color: '#000' }}>OTANTİK</h2>
            <p style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Artizan Fırın & Pastane</p>
          </div>

          <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span>NO: #OT-{(Math.random() * 10000).toFixed(0)}</span>
            <span>{today}</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '0.9rem', fontWeight: 900, borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Sipariş Detayı</h3>
             <p style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#444' }}>
               {slip.replace(/\*/g, '')}
             </p>
          </div>

          <div style={{ textAlign: 'center', borderTop: '2px dashed #eee', paddingTop: '1.5rem', marginTop: '2rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.5rem', opacity: 0.6 }}>TÜM ÜRÜNLERİMİZ EL YAPIMIDIR</p>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>TEŞEKKÜR EDERİZ</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleCopy} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              padding: '1rem', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Copy size={18} /> KOPYALA
          </button>
          <button 
            className="btn-premium"
            style={{ borderRadius: '12px', padding: '1rem', fontSize: '0.9rem' }}
            onClick={() => window.print()}
          >
            <Printer size={18} /> YAZDIR
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
