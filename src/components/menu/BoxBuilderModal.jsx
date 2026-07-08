import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Send, AlertCircle, Box } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const BoxBuilderModal = ({ isOpen, onClose }) => {
  const { currentBox, removeBoxItem, confirmBox } = useCart();
  
  if (!currentBox.isBuilding || !isOpen) return null;

  const percentage = (currentBox.weight / currentBox.targetWeight) * 100;
  const isFull = currentBox.weight >= currentBox.targetWeight;
  const isKuruPasta = currentBox.type === 'kuru-pasta';
  const themeColor = isKuruPasta ? '#D4AF37' : '#ba68c8';

  const handleConfirm = () => {
    confirmBox();
    onClose();
  };

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
        />
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2001,
                background: 'var(--anthracite)',
                borderTopLeftRadius: '32px',
                borderTopRightRadius: '32px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `1px solid ${themeColor}44`
            }}
        >
            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '12px auto' }} />
            
            <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', color: themeColor, fontFamily: 'var(--font-serif)' }}>
                            {currentBox.type === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür'} Kutum
                        </h2>
                        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{currentBox.weight}g / {currentBox.targetWeight}g</div>
                    </div>
                    <button onClick={onClose} style={{ color: '#fff', opacity: 0.5 }}><X size={24} /></button>
                </div>

                <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        style={{ height: '100%', background: isFull ? '#ff4d4d' : themeColor, boxShadow: `0 0 15px ${isFull ? '#ff4d4d' : themeColor}66` }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }} className="no-scrollbar">
                    {currentBox.items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.2 }}>
                            <Box size={64} style={{ margin: '0 auto 20px' }} />
                            <p style={{ fontSize: '1.1rem' }}>Kutunuz henüz boş.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {currentBox.items.map((item) => (
                                <motion.div 
                                    key={item.instanceId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        padding: '16px', 
                                        borderRadius: '20px', 
                                        background: 'rgba(255,255,255,0.03)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{ fontSize: '1.8rem' }}>{item.image}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: themeColor }}>25 gr</div>
                                    </div>
                                    <button 
                                        onClick={() => removeBoxItem(item.instanceId)}
                                        style={{ color: '#ff4d4d', opacity: 0.4, padding: '8px' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,60,60,0.02)', border: '1px solid rgba(255,60,60,0.1)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <AlertCircle size={18} style={{ color: '#ff4d4d', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                            <strong>Not:</strong> Ürünler taze üretildiği için gramajlarda +/- %15 sapma olabilir. Fiyat sepete eklendiğinde netleşir.
                        </p>
                    </div>
                </div>

                <button 
                    disabled={currentBox.items.length === 0}
                    onClick={handleConfirm}
                    className="btn-premium"
                    style={{ 
                        width: '100%', 
                        background: isFull ? themeColor : 'rgba(255,255,255,0.05)', 
                        borderColor: isFull ? themeColor : 'rgba(255,255,255,0.1)',
                        color: isFull ? '#000' : '#fff',
                        borderRadius: '24px',
                        padding: '20px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        opacity: currentBox.items.length > 0 ? 1 : 0.3
                    }}
                >
                    {isFull ? 'KUTUYU TAMAMLA' : 'KUTUYU BU HALİYLE EKLE'} <Send size={18} style={{ marginLeft: '8px' }} />
                </button>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
