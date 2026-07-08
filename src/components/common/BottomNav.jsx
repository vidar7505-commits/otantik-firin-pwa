import React from 'react';
import { motion } from 'framer-motion';
import { Home, Package, MessageSquare, ShoppingCart, Clock } from 'lucide-react';

const navItems = [
  { id: 'menu', icon: Home, label: 'Menü' },
  { id: 'search', icon: Package, label: 'Özel Kutu' },
  { id: 'special', icon: MessageSquare, label: 'Özel Pasta', highlight: true },
  { id: 'cart', icon: ShoppingCart, label: 'Sepet' },
  { id: 'orders', icon: Clock, label: 'Siparişlerim' },
];

const BottomNav = ({ activeTab, setActiveTab }) => {
  const [hasActiveDraft, setHasActiveDraft] = React.useState(false);
  const [ribbonOffset, setRibbonOffset] = React.useState(0);

  React.useEffect(() => {
    const syncRibbonOffset = () => {
      const dismissed = localStorage.getItem('installPromptDismissed') === 'true';
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setRibbonOffset(dismissed || standalone ? 0 : 44);
    };

    syncRibbonOffset();
    window.addEventListener('install-ribbon-dismissed', syncRibbonOffset);
    return () => window.removeEventListener('install-ribbon-dismissed', syncRibbonOffset);
  }, []);

  React.useEffect(() => {
    const checkDraft = () => {
      const draft = localStorage.getItem('otantik_special_cake_draft');
      const active = localStorage.getItem('otantik_special_cake_active_draft');
      setHasActiveDraft(active === 'true' || !!draft);
    };
    checkDraft();
    window.addEventListener('storage', checkDraft);
    const interval = setInterval(checkDraft, 800);
    return () => {
      window.removeEventListener('storage', checkDraft);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      bottom: ribbonOffset,
      left: '0',
      right: '0',
      height: 'var(--nav-height)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
      transition: 'bottom 0.25s ease',
    }}>
      <div className="glass" style={{
        width: '94%',
        maxWidth: '500px',
        height: '65px',
        marginBottom: '10px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        pointerEvents: 'all',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              width: '20%',
              color: activeTab === item.id ? 'var(--gold)' : 'rgba(245, 245, 245, 0.3)',
              transition: 'var(--transition-smooth)',
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {item.highlight ? (
              <div 
                className={hasActiveDraft ? "pulse-gold-glow" : ""}
                style={{
                  position: 'absolute',
                  top: '-42px',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold) 0%, #B8860B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
                  color: 'var(--anthracite)',
                  border: '4px solid var(--anthracite)'
                }}
              >
                <item.icon size={28} />
              </div>
            ) : (
              <>
                <div style={{
                  padding: '6px',
                  borderRadius: '12px',
                  backgroundColor: activeTab === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  transition: 'var(--transition-smooth)'
                }}>
                  <item.icon size={22} />
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, opacity: activeTab === item.id ? 1 : 0.6 }}>{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
