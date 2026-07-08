import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranch } from '../context/BranchContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, LogIn, ChevronRight, PieChart, ShieldCheck, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const branches = [
  { id: 1, name: 'Kandilli Şubesi', address: 'Kandilli Cd. No:45, Üsküdar', status: 'open' },
  { id: 2, name: 'Çengelköy Şubesi', address: 'Çengelköy Cd. No:12, Üsküdar', status: 'open' },
  { id: 3, name: 'Nişantaşı Şubesi', address: 'Abdi İpekçi Cd. No:8, Şişli', status: 'busy' },
];

const LandingPage = () => {
  const { selectBranch } = useBranch();
  const { user, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      login(phone);
      setShowLogin(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--anthracite)', color: 'var(--off-white)', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ marginBottom: '2rem', position: 'relative' }}
        >
          <motion.img 
            src={logo} 
            alt="Otantik Logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ width: '160px', height: '160px', filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-serif"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1rem', textAlign: 'center' }}
        >
          Otantik <em className="text-gold">Fırın</em>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ color: 'var(--gold)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '3rem' }}
        >
          Taş Fırından Geleneksel Lezzetler
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem' }}
        >
          <button className="btn-premium" onClick={() => document.getElementById('branches').scrollIntoView({ behavior: 'smooth' })}>
            Şimdi Keşfet
          </button>
          {!user && (
            <button 
              className="glass"
              style={{ padding: '1.2rem 2rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={20} className="text-gold" />
              Üye Girişi
            </button>
          )}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '2rem', opacity: 0.3 }}
        >
          Aşağı Kaydır
        </motion.div>
      </section>

      {/* About Section */}
      <section className="landing-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Emeğimiz <em className="text-gold">Sizin İçin</em></h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem' }}>
              2006 yılından bu yana, her sabah günün ilk ışıklarıyla fırınımızı yakıyoruz. 
              Hibritleşen dünyada yanık hamur kokusunun, gerçek tereyağının ve el emeğinin
              modern duruşunu sergiliyoruz. Otantik Fırın sadece bir pastane değil, bir aile hikayesidir.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-gold" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <Heart className="text-gold" style={{ marginBottom: '1rem' }} />
                <h4>Doğal İçerik</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Katkısız, yerli üretim malzemeler.</p>
              </div>
              <div className="glass-gold" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <ShieldCheck className="text-gold" style={{ marginBottom: '1rem' }} />
                <h4>Günlük Taze</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Her gün taze, her gün aynı lezzet.</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
             <div className="glass" style={{ width: '100%', aspectRatio: '4/5', borderRadius: '32px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800" 
                  alt="Pastry" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.9), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem' }}>Ustalıkla Hazırlanan</h3>
                  <p className="text-gold">Artisan Lezzetler</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* System Explanation Section */}
      <section style={{ backgroundColor: '#121212', padding: '4rem 0' }}>
        <div className="landing-section">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>Nasıl <em className="text-gold">Sipariş Verilir?</em></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Şube Seçimi', desc: 'Size en yakın şubeyi belirleyin.' },
              { step: '02', title: 'Ürünleri İncele', desc: 'Taze fırın ve pasta çeşitlerimize göz atın.' },
              { step: '03', title: 'Sipariş Ayarla', desc: 'İsterseniz hemen, isterseniz ileri tarihli.' },
              { step: '04', title: 'Mağazadan Al', desc: 'Sıra beklemeden, paketiniz hazır olsun.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div className="text-gold font-serif" style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '-1.5rem' }}>{item.step}</div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch Selection Section */}
      <section id="branches" className="landing-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Mağaza <em className="text-gold">Seçimi</em></h2>
          <p style={{ opacity: 0.6 }}>Siparişinizin hazırlanacağı şubeyi seçerek devam edin.</p>
        </div>

        <div style={{ display: 'grid', gap: '1.2rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {branches.map((branch, idx) => (
            <motion.button
              key={branch.id}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => selectBranch(branch)}
              className="glass"
              style={{
                padding: '2rem',
                borderRadius: '24px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                transition: 'var(--transition-smooth)'
              }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--gold)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ 
                padding: '1rem', 
                borderRadius: '16px', 
                background: 'rgba(212, 175, 55, 0.1)',
                color: 'var(--gold)'
              }}>
                <MapPin size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--off-white)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{branch.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>{branch.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '99px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: `1px solid ${branch.status === 'open' ? '#4CAF50' : '#FF9800'}`,
                  color: branch.status === 'open' ? '#4CAF50' : '#FF9800',
                  marginBottom: '0.5rem'
                }}>
                  {branch.status === 'open' ? 'Açık' : 'Yoğun'}
                </div>
                <ChevronRight size={20} className="text-gold" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Footer / System Info */}
      <footer style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', mt: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 className="font-serif" style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Otantik Fırın</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>
              Sizlere en taze lezzetleri sunmak için her gün yenileniyoruz. Akıllı sipariş sistemimiz ile artık çok daha yakınız.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Kurumsal</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.9rem', opacity: 0.6, display: 'grid', gap: '0.8rem' }}>
              <li>Biz kimiz?</li>
              <li>Sürdürülebilirlik</li>
              <li>Kariyer</li>
              <li>İletişim</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Gizlilik</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.9rem', opacity: 0.6, display: 'grid', gap: '0.8rem' }}>
              <li>KVKK Metni</li>
              <li>Çerez Politikası</li>
              <li>Kullanım Koşulları</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', opacity: 0.3 }}>
          © 2026 Otantik Fırın. Tüm Hakları Saklıdır.
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              backgroundColor: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass"
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem 2rem',
                borderRadius: '32px',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '2rem' }} />
              <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hoş Geldiniz</h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>Telefon numaranız ile hızlıca giriş yapın veya kayıt olun.</p>
              
              <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
                <input 
                  type="tel" 
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}
                />
                <button type="submit" className="btn-premium" style={{ width: '100%' }}>
                  Devam Et
                </button>
              </form>
              
              <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.4 }}>
                Giriş yaparak kullanım koşullarını kabul etmiş olursunuz.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
