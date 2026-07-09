import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Copy, Calendar, Hash, FileText, MessageCircle, Clock, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderSlipModal } from '../components/menu/OrderSlipModal';

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  received: {
    label: 'Sipariş Alındı',
    icon: <Clock size={12} />,
    bg: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.4)',
    color: '#a5b4fc',
    next: 'preparing',
    nextLabel: '→ Hazırlanıyor',
  },
  preparing: {
    label: 'Hazırlanıyor',
    icon: <Package size={12} />,
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.4)',
    color: '#fbbf24',
    next: 'ready',
    nextLabel: '→ Teslim Alınabilir',
  },
  ready: {
    label: 'Teslim Alabilirsiniz',
    icon: <CheckCircle size={12} />,
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.4)',
    color: '#4ade80',
    next: null,
    nextLabel: null,
  },
};

const ACTIVE_STATUSES = ['received', 'preparing', 'ready'];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.received;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '30px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontSize: '0.68rem', fontWeight: 800,
      letterSpacing: '0.3px',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, onViewSlip, onAdvanceStatus, isActive }) => {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
  const borderColor = isActive ? cfg.border : 'rgba(255,255,255,0.05)';
  const glowShadow = isActive ? `0 0 20px ${cfg.bg}` : 'none';

  return (
    <motion.div
      key={order.id}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass"
      style={{ padding: '1.5rem', borderRadius: '24px', border: `1px solid ${borderColor}`, boxShadow: glowShadow }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '0.65rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Hash size={11} /> {order.id}
          </div>
          <StatusBadge status={order.status || 'received'} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold)' }}>{order.price?.toFixed(2)} ₺</div>
          <div style={{ fontSize: '0.62rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Calendar size={10} /> {new Date(order.date).toLocaleDateString('tr-TR')}
          </div>
          {order.deliveryDate && order.deliveryTime && (
            <div style={{ fontSize: '0.62rem', color: 'var(--gold)', opacity: 0.7, marginTop: '2px' }}>
              🕐 {order.deliveryDate.split('-').reverse().join('.')} - {order.deliveryTime}
            </div>
          )}
        </div>
      </div>

      {/* Items summary */}
      {order.items?.length > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {order.items.slice(0, 3).map((item, i) => (
            <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '30px', padding: '3px 10px', color: 'rgba(255,255,255,0.6)' }}>
              {item.image || '🍞'} {item.name}
            </span>
          ))}
          {order.items.length > 3 && (
            <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '30px', padding: '3px 10px', color: 'rgba(255,255,255,0.4)' }}>
              +{order.items.length - 3} daha
            </span>
          )}
        </div>
      )}

      {/* Status advancement (visible only for staff simulation, active orders) */}
      {isActive && cfg.next && (
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => onAdvanceStatus(order.id, cfg.next)}
            style={{
              width: '100%', padding: '10px', borderRadius: '12px',
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              color: cfg.color, fontSize: '0.75rem', fontWeight: 800,
              cursor: 'pointer', letterSpacing: '0.3px',
            }}
          >
            {cfg.nextLabel}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button
          onClick={() => onViewSlip(order.slip)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <FileText size={14} /> FİŞİ GÖR
        </button>
        <button
          onClick={() => { navigator.clipboard.writeText(order.slip); }}
          style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)' }}
          title="Kopyala"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={() => { const t = encodeURIComponent(order.slip); window.open(`https://wa.me/?text=${t}`, '_blank'); }}
          style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)' }}
          title="WhatsApp"
        >
          <MessageCircle size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const { orders, updateOrderStatus } = useCart();
  const [selectedSlip, setSelectedSlip] = useState(null);

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status || 'received') && o.status !== 'completed');
  const historyOrders = orders.filter(o => !ACTIVE_STATUSES.includes(o.status || 'received') || o.status === 'completed');

  // For demo: orders without explicit status that are recent (< 24h) count as active
  const recentActive = orders.filter(o => {
    if (o.status && o.status !== 'received') return false;
    const hoursSince = (Date.now() - new Date(o.date).getTime()) / (1000 * 60 * 60);
    return hoursSince < 24;
  });

  const displayActive = orders.filter(o => {
    const st = o.status || 'received';
    return st === 'received' || st === 'preparing' || st === 'ready';
  });
  const displayHistory = orders.filter(o => {
    const st = o.status;
    return st === 'completed' || st === 'done';
  });

  const isEmpty = orders.length === 0;

  return (
    <div style={{ padding: '120px 20px 120px', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--off-white)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Siparişlerim</h1>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Aktif ve geçmiş siparişleriniz.</p>
      </div>

      {isEmpty ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={40} style={{ opacity: 0.2 }} />
          </div>
          <p style={{ opacity: 0.4 }}>Henüz bir siparişiniz bulunmuyor.</p>
        </div>
      ) : (
        <>
          {/* ── Active Orders ── */}
          {displayActive.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>Aktif Siparişler</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
                <span style={{ fontSize: '0.68rem', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
                  {displayActive.length}
                </span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <AnimatePresence>
                  {displayActive.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isActive
                      onViewSlip={setSelectedSlip}
                      onAdvanceStatus={updateOrderStatus}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {displayHistory.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase' }}>Geçmiş Siparişler</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {displayHistory.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isActive={false}
                    onViewSlip={setSelectedSlip}
                    onAdvanceStatus={updateOrderStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Edge-case: all orders are active, show them even without history section */}
          {displayHistory.length === 0 && displayActive.length === 0 && orders.length > 0 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isActive
                  onViewSlip={setSelectedSlip}
                  onAdvanceStatus={updateOrderStatus}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedSlip && <OrderSlipModal slip={selectedSlip} onClose={() => setSelectedSlip(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
