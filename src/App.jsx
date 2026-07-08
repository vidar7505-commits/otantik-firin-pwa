import React, { useState } from 'react';
import { BranchProvider, useBranch } from './context/BranchContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SelectionPage from './pages/SelectionPage';
import OrdersPage from './pages/OrdersPage';
import CartPage from './pages/CartPage';
import SpecialCakePage from './pages/SpecialCakePage';
import ProfilePage from './pages/ProfilePage';

// Layout
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import InstallPromptRibbon from './components/common/InstallPromptRibbon';

import { AnimatePresence, motion } from 'framer-motion';

// ─── Tab content placeholders ──────────────────────────────────────────────
const PagePlaceholder = ({ title }) => (
  <div style={{ padding: '120px 20px 20px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--anthracite)' }}>
    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--off-white)' }}>{title}</h2>
    <p style={{ opacity: 0.4, marginTop: '1rem' }}>Sizin için hazırlanıyor...</p>
  </div>
);

const TAB_PAGES = {
  menu: HomePage,
  search: SelectionPage,
  special: SpecialCakePage,
  cart: CartPage,
  orders: OrdersPage,
  profile: ProfilePage,
};

const AppShell = ({ activeTab, setActiveTab }) => {
  const ActivePage = TAB_PAGES[activeTab] || HomePage;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--anthracite)', position: 'relative' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ActivePage setActiveTab={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const AppContent = () => {
  const { selectedBranch, isInitializing } = useBranch();
  const [activeTab, setActiveTab] = useState('menu');

  if (isInitializing) return null;

  return (
    <div style={{ backgroundColor: 'var(--anthracite)', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {!selectedBranch ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage />
          </motion.div>
        ) : (
          <AppShell activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </AnimatePresence>
      <InstallPromptRibbon />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BranchProvider>
        <AppContent />
      </BranchProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
