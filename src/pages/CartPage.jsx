import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBoxStore } from '../store/useBoxStore';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';

const CartPage = () => {
  const { cart, removeFromCart, finalizeOrder, cartCount } = useCart();
  const { specialNote, noteCategory, setNote } = useBoxStore();
  const [showSlip, setShowSlip] = React.useState(null);

  const total = cart.reduce((acc, item) => acc + item.price, 0);

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
    <div style={{ padding: '120px 20px 280px', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
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
              <div style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>{item.price.toFixed(2)} ₺</div>
            </div>
            <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff4d4d', opacity: 0.5 }}>
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

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

      <div style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', zIndex: 100 }}>
        <div className="glass-gold" style={{ padding: '1.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ opacity: 0.6 }}>Toplam</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)' }}>{total.toFixed(2)} ₺</span>
          </div>
          <button 
            onClick={() => {
                const order = finalizeOrder(specialNote, noteCategory);
                setShowSlip(order.slip);
            }}
            className="btn-premium"
            style={{ width: '100%', padding: '1.2rem', borderRadius: '16px' }}
          >
            SİPARİŞİ TAMAMLA <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>

      {showSlip && (
          <OrderSlipModal slip={showSlip} onClose={() => setShowSlip(null)} />
      )}
    </div>
  );
};

export default CartPage;
