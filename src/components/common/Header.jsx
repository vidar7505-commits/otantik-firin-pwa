import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBranch } from '../../context/BranchContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, User, LogOut, MapPin } from 'lucide-react';
import logog from '../../assets/logog.png';

const Header = ({ activeTab, setActiveTab }) => {
  const { selectedBranch, clearBranch } = useBranch();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { scrollY } = useScroll();

  // Optimized scroll transforms (fewer calculations)
  const headerBg = useTransform(scrollY, [0, 50], ['rgba(13, 13, 13, 0)', 'rgba(13, 13, 13, 0.95)']);
  const blur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(25px)']);
  const borderOpacity = useTransform(scrollY, [0, 50], ['rgba(212, 175, 55, 0)', 'rgba(212, 175, 55, 0.15)']);

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 2000, // Higher z-index to stay on top
        backgroundColor: headerBg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        borderBottom: `1px solid ${borderOpacity}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Brand */}
      <button
        onClick={clearBranch}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0
        }}
      >
        <div
          style={{
            height: '84px', // Increased by 50% from 56px
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '2px' // Maximum proximity as requested
          }}
        >
          <img 
            src={logog}
            alt="Otantik Logo"
            style={{
              height: '84px',
              width: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            color: '#fff',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.65)',
          }}>
            Otantik <span style={{ color: '#fff' }}>Fırın</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <MapPin size={11} style={{ color: 'var(--gold)' }} />
            <p style={{
              fontSize: '0.65rem',
              color: '#f8d86b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 800,
              opacity: 1,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)'
            }}>
              {selectedBranch?.name || 'Seçilmedi'}
            </p>
          </div>
        </div>
      </button>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        {user && (
          <button
            className="glass"
            onClick={logout}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold)',
            }}
            title="Çıkış"
          >
            <LogOut size={18} />
          </button>
        )}

        <button
          className={activeTab === 'profile' ? "" : "glass"}
          onClick={() => setActiveTab?.('profile')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'profile' ? 'var(--anthracite)' : 'var(--gold)',
            backgroundColor: activeTab === 'profile' ? 'var(--gold)' : 'transparent',
            border: activeTab === 'profile' ? 'none' : '1px solid rgba(255,255,255,0.05)',
            boxShadow: activeTab === 'profile' ? 'var(--shadow-gold)' : 'none',
            cursor: 'pointer',
            transition: 'var(--transition-premium)'
          }}
          title="Profilim"
        >
          <User size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="btn-premium"
            onClick={() => setActiveTab?.('cart')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              gap: '0.4rem',
              boxShadow: 'none',
              borderRadius: '12px',
              background: activeTab === 'cart' ? 'var(--off-white)' : 'var(--gold)',
              borderColor: activeTab === 'cart' ? 'var(--off-white)' : 'var(--gold)',
              color: 'var(--anthracite)',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={18} />
            <span className="hide-mobile">Sepet</span>
          </button>
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: '#FFD700',
            color: '#000',
            fontSize: '0.65rem',
            fontWeight: 900,
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0D0D0D',
            zIndex: 5
          }}>
            {cartCount}
          </span>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 480px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
