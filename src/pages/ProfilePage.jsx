import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBranch } from '../context/BranchContext';
import {
  User, Phone, MapPin, LogOut, Smartphone, Check, MessageSquare, Zap
} from 'lucide-react';

const CONTACT_PHONE = '+90 216 555 12 34';

// ─── Demo user ─────────────────────────────────────────────────────────────────
const DEMO_USER = { phone: '05301234567', name: 'Ayşe Hanım' };

const s = {
  page: {
    padding: 'calc(var(--header-height) + 20px) 18px calc(var(--nav-height) + 32px)',
    minHeight: '100vh',
    backgroundColor: 'var(--anthracite)',
    color: '#fff',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '22px',
    padding: '1.4rem',
    marginBottom: '14px',
    position: 'relative',
    overflow: 'hidden'
  },
  label: {
    fontSize: '0.62rem',
    color: 'var(--gold)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: '10px',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '13px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  chip: (active) => ({
    padding: '7px 14px',
    borderRadius: '18px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: active ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.01)',
    color: active ? 'var(--gold)' : 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }),
  btnGold: {
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    borderRadius: '14px',
    padding: '13px 22px',
    fontWeight: 800,
    fontSize: '0.88rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    width: '100%'
  },
  btnGlass: {
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '11px 18px',
    fontWeight: 700,
    fontSize: '0.83rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    transition: 'all 0.2s',
    flex: 1
  }
};

const PREFS = [
  { id: 'chocolate', label: '🍫 Çikolatalı' },
  { id: 'fruit', label: '🍓 Meyveli' },
  { id: 'pistachio', label: '🥜 Fıstıklı' },
  { id: 'caramel', label: '🍯 Karamelli' },
  { id: 'diet', label: '🌱 Şekersiz' },
  { id: 'gluten-free', label: '🌾 Glutensiz' }
];

// ─── Persist session across hot-reloads / logout ───────────────────────────────
const LS_SESSION = 'otantik_profile_session';
const LS_NAME    = 'otantik_profile_name';
const LS_PREFS   = 'otantik_profile_preferences';

function loadSession() {
  try { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); } catch { return null; }
}

export default function ProfilePage({ setActiveTab }) {
  const { user, login, logout } = useAuth();
  const { selectedBranch, clearBranch } = useBranch();

  // form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName]   = useState('');
  const [loginError, setLoginError] = useState('');

  // profile state
  const [userName, setUserName]     = useState('');
  const [isEditing, setIsEditing]   = useState(false);
  const [tempName, setTempName]     = useState('');
  const [preferences, setPrefs]     = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [savedSession, setSaved]    = useState(null); // { phone, name } previously used

  // On mount — restore remembered session hint & preferences
  useEffect(() => {
    const sess = loadSession();
    setSaved(sess);

    const prefs = localStorage.getItem(LS_PREFS);
    if (prefs) try { setPrefs(JSON.parse(prefs)); } catch {}

    // count orders
    try {
      const o = JSON.parse(localStorage.getItem('otantik_orders') || '[]');
      setOrderCount(o.length);
    } catch {}
  }, []);

  // Sync userName when auth state changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(LS_NAME);
      const display = saved || user.name || user.phone;
      setUserName(display);
      setTempName(display);
    }
  }, [user]);

  // ── helpers ──
  const doLogin = (phone, name) => {
    const display = name || phone;
    login(phone, display);
    setUserName(display);
    setTempName(display);
    localStorage.setItem(LS_NAME, display);
    localStorage.setItem(LS_SESSION, JSON.stringify({ phone, name: display }));
    setLoginError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.replace(/\D/g, '').length < 10) {
      setLoginError('Lütfen geçerli bir telefon numarası girin.');
      return;
    }
    doLogin(loginPhone.trim(), loginName.trim() || undefined);
  };

  const handleDemoLogin = () => doLogin(DEMO_USER.phone, DEMO_USER.name);

  const handleQuickLogin = () => doLogin(savedSession.phone, savedSession.name);

  const handleLogout = () => {
    logout();
    setUserName('');
    setTempName('');
    localStorage.removeItem(LS_NAME);
    // Keep LS_SESSION so "son kullanıcı" still appears
  };

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem(LS_NAME, tempName.trim());
      if (savedSession) localStorage.setItem(LS_SESSION, JSON.stringify({ ...savedSession, name: tempName.trim() }));
    }
    setIsEditing(false);
  };

  const togglePref = (id) => {
    const next = preferences.includes(id) ? preferences.filter(x => x !== id) : [...preferences, id];
    setPrefs(next);
    localStorage.setItem(LS_PREFS, JSON.stringify(next));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '1.6rem', margin: '0 0 1.6rem' }}>
        Profilim
      </h1>

      <AnimatePresence mode="wait">
        {/* ── NOT LOGGED IN ── */}
        {!user ? (
          <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Quick re-login with previous session */}
            {savedSession && (
              <div style={s.card}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 100%)', borderRadius: '0 0 0 80px', pointerEvents: 'none' }} />
                <span style={{ ...s.label, marginBottom: 12 }}>Son Giriş</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold) 0%, #A48B24 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#000', flexShrink: 0 }}>
                    {savedSession.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{savedSession.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: 2 }}>{savedSession.phone}</div>
                  </div>
                </div>
                <button onClick={handleQuickLogin} style={{ ...s.btnGold }}>
                  <Zap size={15} /> Hızlı Giriş Yap
                </button>
              </div>
            )}

            {/* Demo login banner */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                marginBottom: 14,
                padding: '14px 18px',
                borderRadius: 18,
                border: '1px solid rgba(212,175,55,0.25)',
                background: 'rgba(212,175,55,0.06)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                👩‍🍳
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Demo ile Giriş Et</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 2 }}>Ayşe Hanım hesabıyla uygulamayı keşfet</div>
              </div>
            </motion.button>

            {/* Manual login form */}
            <div style={s.card}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--gold)' }}>
                  <User size={26} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0 0 4px' }}>Giriş Yap</h2>
                <p style={{ fontSize: '0.78rem', opacity: 0.45 }}>Telefon numaranızla üye girişi yapın.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={s.label}>Ad Soyad (isteğe bağlı)</label>
                  <input style={s.input} type="text" placeholder="İsim Soyisim" value={loginName} onChange={e => setLoginName(e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Telefon</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input style={{ ...s.input, paddingLeft: 34 }} type="tel" placeholder="0530 000 00 00" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} required />
                  </div>
                </div>
                {loginError && <div style={{ color: '#ff6666', fontSize: '0.75rem', fontWeight: 600 }}>⚠️ {loginError}</div>}
                <button type="submit" style={{ ...s.btnGold, marginTop: 4 }}>
                  <Smartphone size={15} /> Devam Et
                </button>
              </form>
            </div>
          </motion.div>

        ) : (
          /* ── LOGGED IN ── */
          <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* User card */}
            <div style={s.card}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)', borderRadius: '0 0 0 100px', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold) 0%, #A48B24 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: '#000', flexShrink: 0 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input style={{ ...s.input, height: 34, padding: '0 10px', fontSize: '0.85rem' }} value={tempName} onChange={e => setTempName(e.target.value)} onBlur={saveName} onKeyDown={e => e.key === 'Enter' && saveName()} autoFocus />
                      <button onClick={saveName} style={{ ...s.btnGold, width: 34, height: 34, padding: 0, borderRadius: 8 }}><Check size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{userName}</span>
                      <button onClick={() => setIsEditing(true)} style={{ fontSize: '0.68rem', color: 'var(--gold)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Düzenle</button>
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={11} /> {user.phone}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: '1.1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.58rem', opacity: 0.38, letterSpacing: 1 }}>TOPLAM SİPARİŞ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold)', marginTop: 2 }}>{orderCount}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.58rem', opacity: 0.38, letterSpacing: 1 }}>ÜYELİK</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#e5d5b8', marginTop: 4, letterSpacing: 0.5 }}>GOLD ARTISAN</div>
                </div>
              </div>
            </div>

            {/* Selected branch */}
            <div style={s.card}>
              <span style={s.label}>Aktif Şube</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedBranch?.name || 'Seçilmedi'}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: 2 }}>{selectedBranch?.address || '—'}</div>
                  </div>
                </div>
                <button onClick={clearBranch} style={{ ...s.btnGlass, flex: 'none', padding: '7px 12px', fontSize: '0.7rem', borderRadius: 10 }}>
                  Değiştir
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div style={s.card}>
              <span style={s.label}>Lezzet Tercihleri</span>
              <p style={{ fontSize: '0.73rem', opacity: 0.45, marginBottom: 12, lineHeight: 1.5 }}>
                Şef asistanı pasta önerilerinde bu tercihlerinizi dikkate alır.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {PREFS.map(p => {
                  const on = preferences.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => togglePref(p.id)} style={s.chip(on)}>
                      {p.label}
                      {on && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Support */}
            <div style={s.card}>
              <span style={s.label}>Destek</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.open(`https://wa.me/902165551234?text=Merhaba,%20${encodeURIComponent(userName)}%20siparişim%20hakkında%20bilgi%20almak%20istiyorum.`, '_blank')}
                  style={{ ...s.btnGlass, background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.2)', color: '#25D366' }}
                >
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button onClick={() => window.open(`tel:${CONTACT_PHONE.replace(/\s/g, '')}`)} style={s.btnGlass}>
                  Şubeyi Ara
                </button>
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} style={{ ...s.btnGlass, width: '100%', flex: 'none', borderColor: 'rgba(255,60,60,0.15)', color: '#ff7070' }}>
              <LogOut size={15} /> Oturumu Kapat
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
