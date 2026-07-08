import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Copy, ChevronRight, Calendar, Hash, FileText, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';

const OrdersPage = () => {
  const { orders } = useCart();
  const [selectedSlip, setSelectedSlip] = useState(null);

  return (
    <div style={{ padding: '120px 20px 100px', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--off-white)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Siparişlerim</h1>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Geçmiş siparişleriniz ve hazırlık fişleriniz.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={40} style={{ opacity: 0.2 }} />
          </div>
          <p style={{ opacity: 0.4 }}>Henüz bir siparişiniz bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <Hash size={12} /> {order.id}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700 }}>{order.productName}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{order.price.toFixed(2)} ₺</div>
                   <div style={{ fontSize: '0.65rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                     <Calendar size={10} /> {new Date(order.date).toLocaleDateString('tr-TR')}
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button 
                  onClick={() => setSelectedSlip(order.slip)}
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem', 
                    borderRadius: '12px', 
                    background: 'rgba(212,175,55,0.1)', 
                    color: 'var(--gold)', 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    border: '1px solid rgba(212,175,55,0.1)'
                  }}
                >
                  <FileText size={16} /> FİŞİ GÖR
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(order.slip);
                    alert("Fiş kopyalandı!");
                  }}
                  style={{ 
                    padding: '0.8rem', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    color: '#fff', 
                    border: '1px solid rgba(255,255,255,0.05)' 
                  }}
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={() => {
                    const text = encodeURIComponent(order.slip);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  style={{ 
                    padding: '0.8rem', 
                    borderRadius: '12px', 
                    background: 'rgba(37, 211, 102, 0.1)', 
                    color: '#25D366', 
                    border: '1px solid rgba(37, 211, 102, 0.2)' 
                  }}
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedSlip && <OrderSlipModal slip={selectedSlip} onClose={() => setSelectedSlip(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
