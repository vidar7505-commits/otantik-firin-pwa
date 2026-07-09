import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBranch } from '../context/BranchContext';

import logoImg       from '../assets/logog.png';
import imgBahcesehir from '../assets/branch_bahcesehir.png';
import imgE5         from '../assets/branch_e5.png';
import imgDubai      from '../assets/product_dubai.png';
import imgBelcika    from '../assets/product_belcika.png';
import imgLotus      from '../assets/product_lotus.png';
import imgTartlet    from '../assets/product_tartlet.png';
import imgHavuc      from '../assets/product_havuc.png';
import imgPetifur    from '../assets/product_petifur.png';

gsap.registerPlugin(ScrollTrigger);

// ─── BRAND TOKENS ────────────────────────────────────────────────
const C = {
  gold:        '#D4AF37',
  goldLight:   '#E8C84A',
  goldMuted:   'rgba(212,175,55,0.15)',
  goldBorder:  'rgba(212,175,55,0.28)',
  goldGlow:    'rgba(212,175,55,0.22)',
  goldGlow2:   'rgba(212,175,55,0.08)',
  cream:       '#F5EFEB',
  creamMuted:  '#C9B89A',
  bg:          '#0B0704',
  bgWarm:      '#180F08',
  textMid:     '#B8A896',
  textDim:     '#6B5A4A',
  border:      'rgba(255,255,255,0.055)',
  borderWarm:  'rgba(212,175,55,0.20)',
};

// ─── SHOWCASE DATA ────────────────────────────────────────────────
const SHOWCASE = [
  {
    img: imgDubai,
    name: 'Dubai Çikolatası',
    sub: 'Dünya Trendi',
    price: '85 ₺',
    stars: 5,
    new: true,
    hot: true,
    badge: '🔥 TRENDİNG',
    badgeBg: 'linear-gradient(135deg,#FF6B35,#FF3B00)',
    desc: 'Kadaifli pistachio dolgulu, gerçek Belçika çikolatası kaplı viral lezzet.',
  },
  {
    img: imgBelcika,
    name: 'Belçika Doğum Günü Pastası',
    sub: 'Şefin İmzası',
    price: '450 ₺',
    stars: 5,
    badge: '✦ ŞEF İMZASI',
    badgeBg: `linear-gradient(135deg,${C.gold},#A07820)`,
    desc: '%70 Belçika ganajı, altın yaprak, kavrulmuş fıstık drajesi.',
  },
  {
    img: imgLotus,
    name: 'Lotus Biscoff Bomb',
    sub: 'En Çok Satan',
    price: '35 ₺',
    stars: 5,
    badge: '★ EN ÇOK SATAN',
    badgeBg: 'linear-gradient(135deg,#F59E0B,#B45309)',
    desc: 'Akışkan karamel-Biscoff kreması, çıtır bisküvi kabuk.',
  },
  {
    img: imgTartlet,
    name: 'Çilekli Tartlet',
    sub: 'Günlük Taze',
    price: '45 ₺',
    stars: 5,
    badge: '🌿 GÜNLÜK TAZE',
    badgeBg: 'linear-gradient(135deg,#10B981,#065F46)',
    desc: 'Kıtır artizan tart, ipeksi pastacı kreması, taze bal çilek.',
  },
  {
    img: imgHavuc,
    name: 'Havuçlu Tarçınlı Kek',
    sub: 'Anne Usulü',
    price: '45 ₺',
    stars: 4,
    badge: '♥ KLASİK FAVORİ',
    badgeBg: 'linear-gradient(135deg,#92400E,#451A03)',
    desc: 'Organik havuç, taze çekilmiş tarçın, ceviz, ev keki sıcaklığı.',
  },
  {
    img: imgPetifur,
    name: 'Artizan Petifür Seçkisi',
    sub: 'Gurme Koleksiyon',
    price: '45 ₺/adet',
    stars: 5,
    badge: '◈ KOLEKSIYON',
    badgeBg: 'linear-gradient(135deg,#6D28D9,#2E1065)',
    desc: 'Red velvet, meyveli tartlet, fıstık trüfü, mini ekler.',
  },
];

const BRANCHES = [
  { id: 5, name: 'Bahçeşehir Şubesi', address: 'Bahçeşehir Gölet Bölgesi, İstanbul', image: imgBahcesehir },
  { id: 6, name: 'E-5 Şubesi',         address: 'E-5 Karayolu Üzeri, İstanbul',       image: imgE5 },
];

const VALUES = [
  { icon: '🫓', title: 'Taş Fırın Sıcaklığı', desc: 'Günde 3 kez ısınan geleneksel taş fırınımız her lokmanın ruhunu oluşturur.' },
  { icon: '🍫', title: '%70 Belçika Kakao',    desc: 'Her ganaj ve kaplama için yalnızca en saf Belçika çikolata yağı.' },
  { icon: '🤖', title: 'AI Şef Asistanı',      desc: 'Pastanızı kat kat inşa edin, krem seçin, yazı tasarlayın.' },
  { icon: '🚫', title: 'Katkı Maddesi Yok',    desc: 'Tüm ürünlerimiz katkısız, her gün taze, sıfır yapay koruyucu.' },
];

// ─── FLOATING PARTICLES & STARS ──────────────────────────────────
function SparksAndParticles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Background depth stars (twinkling) */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{
            duration: 4 + (i % 3) * 1.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: `${(i * 17) % 95}%`,
            left: `${(i * 23) % 95}%`,
            width: (i % 3 === 0) ? 3 : 2,
            height: (i % 3 === 0) ? 3 : 2,
            borderRadius: '50%',
            background: C.gold,
            boxShadow: `0 0 6px ${C.gold}`,
          }}
        />
      ))}

      {/* Warm rising ambient steam particles (very subtle and behind) */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`steam-${i}`}
          initial={{ y: 150, opacity: 0, scale: 0.5 }}
          animate={{ y: -380, opacity: [0, 0.08, 0], scale: [0.5, 2, 3] }}
          transition={{ duration: 12 + (i % 3) * 2, repeat: Infinity, delay: i * 2.8, ease: 'linear' }}
          style={{
            position: 'absolute',
            bottom: `${(i * 9) % 25}%`,
            left: `${10 + (i * 21) % 80}%`,
            width: 16, height: 16, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 60%)',
          }}
        />
      ))}
    </div>
  );
}

// ─── 3D CAROUSEL ─────────────────────────────────────────────────
function PastaDisplay({ onBranchSelect }) {
  const total = SHOWCASE.length;
  const angle = 360 / total;
  const radius = 260; // translateZ distance

  const currentAngleRef = useRef(0);
  const angleMotion = useMotionValue(0);
  const smoothAngle = useSpring(angleMotion, { stiffness: 60, damping: 18 });

  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const autoRef = useRef(null);

  // Auto-rotate: only active when user is not dragging
  useEffect(() => {
    if (isDragging) return;

    autoRef.current = setInterval(() => {
      // Rotate by one facet angle (clockwise, equivalent to index advancing)
      const nextAngle = currentAngleRef.current - angle;
      currentAngleRef.current = nextAngle;
      angleMotion.set(nextAngle);

      const targetIdx = Math.round(-nextAngle / angle);
      setActive(((targetIdx % total) + total) % total);
    }, 4500);

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [isDragging, angle, angleMotion, total]);

  const rotateTo = (idx) => {
    // Find the closest target angle representing the clicked index, avoiding massive spin-backs
    const baseTarget = -idx * angle;
    const diff = currentAngleRef.current - baseTarget;
    // Round difference to the nearest multiplier of 360 degrees
    const k = Math.round(diff / 360);
    const targetAngle = baseTarget + k * 360;

    currentAngleRef.current = targetAngle;
    angleMotion.set(targetAngle);
    setActive(idx);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragStartAngle.current = currentAngleRef.current;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = x - dragStartX.current;
    
    // Apply soft dampening on the drag
    const newAngle = dragStartAngle.current + dx * 0.35;
    currentAngleRef.current = newAngle;
    angleMotion.set(newAngle);

    const idx = Math.round(-newAngle / angle);
    setActive(((idx % total) + total) % total);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Round current accumulated rotation to the nearest item facet angle
    const snappedAngle = Math.round(currentAngleRef.current / angle) * angle;
    currentAngleRef.current = snappedAngle;
    angleMotion.set(snappedAngle);

    const idx = Math.round(-snappedAngle / angle);
    setActive(((idx % total) + total) % total);
  };

  const item = SHOWCASE[active];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>

      {/* 3D Stage */}
      <div
        style={{
          width: '100%', height: 380,
          perspective: 1100,
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          userSelect: 'none',
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={e => handlePointerDown(e.touches[0])}
        onTouchMove={e => handlePointerMove(e.touches[0])}
        onTouchEnd={handlePointerUp}
      >
        {/* Turntable surface glow */}
        <div style={{
          position: 'absolute', bottom: 10, left: '50%',
          transform: 'translateX(-50%)',
          width: 420, height: 24,
          background: `radial-gradient(ellipse, ${C.goldGlow} 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(8px)',
          pointerEvents: 'none',
        }} />

        {/* Rotating cylinder */}
        <motion.div
          style={{
            width: '100%', height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateY: smoothAngle,
          }}
        >
          {SHOWCASE.map((prod, i) => {
            const itemAngle = i * angle;
            const isActive = i === active;
            return (
              <div
                key={i}
                onClick={() => !isDragging && rotateTo(i)}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: 200, height: 280,
                  marginLeft: -100, marginTop: -140,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${isActive ? C.goldBorder : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isActive
                    ? `0 0 40px rgba(212,175,55,0.25), 0 20px 60px rgba(0,0,0,0.6)`
                    : `0 8px 30px rgba(0,0,0,0.5)`,
                  transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                  cursor: 'pointer',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Product image */}
                <img
                  src={prod.img}
                  alt={prod.name}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: isActive ? 1 : 0.5,
                    transition: 'opacity 0.5s ease',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    filter: isActive ? 'none' : 'brightness(0.5)',
                  }}
                />

                {/* Badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  padding: '4px 10px', borderRadius: 100,
                  background: prod.badgeBg,
                  fontSize: 8, fontWeight: 800, letterSpacing: '0.08em',
                  color: '#fff', textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                }}>
                  {prod.badge}
                </div>

                {/* Bottom overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '32px 14px 14px',
                  background: 'linear-gradient(to top, rgba(11,7,4,0.95) 0%, transparent 100%)',
                }}>
                  <div style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {prod.sub}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.cream, lineHeight: 1.25 }}>
                    {prod.name}
                  </div>
                  <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginTop: 6 }}>
                    {prod.price}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Active product detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45 }}
          style={{
            maxWidth: 440, width: '100%',
            background: 'linear-gradient(135deg, rgba(30,20,12,0.88) 0%, rgba(14,10,6,0.92) 100%)',
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 24, padding: '28px 28px',
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: C.textDim, textTransform: 'uppercase', marginBottom: 8 }}>
            {item.sub}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.4rem',
            color: C.cream, fontWeight: 400, margin: '0 0 10px',
          }}>{item.name}</h3>
          <p style={{ fontSize: 12.5, color: C.textMid, lineHeight: 1.75, margin: '0 0 16px', fontWeight: 300 }}>
            {item.desc}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: C.gold }}>{item.price}</span>
            <span style={{ color: C.gold, letterSpacing: 2 }}>
              {'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot navigator */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {SHOWCASE.map((_, i) => (
          <button
            key={i}
            onClick={() => rotateTo(i)}
            style={{
              width: i === active ? 24 : 8, height: 8,
              borderRadius: 100,
              background: i === active ? C.gold : 'rgba(255,255,255,0.12)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          document.getElementById('branch-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        style={{
          padding: '13px 36px', borderRadius: 100, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.borderWarm}`,
          color: C.cream, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          transition: 'all 0.35s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#0B0704'; e.currentTarget.style.borderColor = C.gold; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = C.cream; e.currentTarget.style.borderColor = C.borderWarm; }}
      >
        Şube Seçip Tümünü Keşfet →
      </button>
    </div>
  );
}

// ─── GOLD DIVIDER ─────────────────────────────────────────────────
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, maxWidth: 160, margin: '0 auto' }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
    <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
  </div>
);

// ─── BRANCH BUTTON ────────────────────────────────────────────────
function BranchBtn({ branch, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(branch)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hovered
          ? 'linear-gradient(135deg, rgba(35,22,12,0.96) 0%, rgba(20,14,8,0.98) 100%)'
          : 'rgba(18,12,8,0.72)',
        border: `1px solid ${hovered ? C.goldBorder : C.border}`,
        borderRadius: 20, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: hovered ? `0 14px 45px -12px rgba(212,175,55,0.25)` : 'none',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s ease',
        outline: 'none',
      }}
    >
      <div style={{
        width: 80, height: 56, borderRadius: 14, flexShrink: 0,
        overflow: 'hidden',
        border: `1px solid ${hovered ? C.goldBorder : C.border}`,
        transition: 'transform 0.4s ease, border-color 0.4s ease',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
      }}>
        <img
          src={branch.image}
          alt={branch.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 55%',
            display: 'block',
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.08rem',
          color: C.cream, fontWeight: 500, display: 'block',
        }}>{branch.name}</span>
        <p style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontWeight: 300 }}>
          {branch.address}
        </p>
      </div>

      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: hovered ? C.gold : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? C.gold : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: hovered ? '#0B0704' : C.textDim,
        transition: 'all 0.35s ease',
        fontWeight: 700,
      }}>→</div>
    </motion.button>
  );
}

// ─── SECTION REVEAL WRAPPER ───────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────
export default function LandingPage() {
  const { selectBranch } = useBranch();
  const heroRef   = useRef(null);
  const showcaseRef = useRef(null);
  const branchRef = useRef(null);
  const logoRef   = useRef(null);
  const taglineRef = useRef(null);

  const [logoReady, setLogoReady] = useState(true);

  // GSAP hero entrance timeline
  useEffect(() => {
    if (!logoReady) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(logoRef.current, {
        scale: 0.4, opacity: 0, rotation: -12,
        duration: 1.4,
      })
      .from(taglineRef.current?.children ?? [], {
        opacity: 0, y: 30, stagger: 0.18, duration: 0.9,
      }, '-=0.6');
    });
    return () => ctx.revert();
  }, [logoReady]);

  // GSAP scroll-triggered reveals for sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 50,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 55%',
            scrub: false,
            once: true,
          },
          duration: 0.9,
          ease: 'power3.out',
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div style={{
      background: `radial-gradient(ellipse at 50% 0%, #1F1108 0%, ${C.bg} 55%)`,
      minHeight: '100dvh', overflowX: 'hidden',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      boxSizing: 'border-box',
      color: C.cream,
      paddingBottom: 'calc(var(--install-ribbon-height, 0px) + 12px)',
    }}>
      <SparksAndParticles />

      {/*══════════════════════ HERO ══════════════════════════*/}
      <section ref={heroRef} style={{
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'relative', zIndex: 10,
        textAlign: 'center',
      }}>
        {/* Top label */}
        <div style={{ paddingTop: 32 }}>
          <span style={{
            fontSize: 9.5, letterSpacing: '0.38em', fontWeight: 700,
            color: C.gold, textTransform: 'uppercase', opacity: 0.85,
          }}>
            OTANTİK FIRIN · ARTISAN BAKERY · EST. 2006
          </span>
        </div>

        {/* Center block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 42, maxWidth: 580 }}>

          <div ref={logoRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Proportional static logo image */}
            <div style={{ width: 310, height: 310 }}>
              <img
                src={logoImg}
                alt="Otantik Fırın Logo"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'contain', display: 'block',
                  filter: 'drop-shadow(0 8px 30px rgba(212,175,55,0.22))',
                }}
              />
            </div>

            {/* Brand text positioned directly underneath with minimal margin */}
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.1rem',
              fontWeight: 300,
              color: C.cream,
              letterSpacing: '0.24em',
              margin: '6px 0 0 0',
              textTransform: 'uppercase',
              textShadow: '0 4px 18px rgba(0, 0, 0, 0.65)',
              textAlign: 'center',
            }}>
              Otantik <span style={{ color: C.gold, fontWeight: 400 }}>Fırın</span>
            </h2>
          </div>

          {/* Taglines */}
          <div ref={taglineRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 100,
              background: C.goldMuted, border: `1px solid ${C.goldBorder}`,
              margin: '0 auto',
            }}>
              <span style={{ fontSize: 13 }}>🔥</span>
              <span style={{ fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, color: C.cream, textTransform: 'uppercase' }}>
                Her Sabah Sevgiyle Taze Fırınlanmış
              </span>
            </div>

            {/* Main headline */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 6vw, 3.2rem)',
              fontWeight: 300, color: C.cream,
              lineHeight: 1.2, margin: 0,
            }}>
              "Zamanı değil,{' '}
              <em style={{ color: C.gold, fontStyle: 'italic' }}>lezzeti dondurduk."</em>
            </h1>

            {/* Sub */}
            <p style={{
              fontSize: 13.5, color: C.textMid, fontWeight: 300,
              lineHeight: 1.85, maxWidth: 420, margin: '0 auto',
            }}>
              Geleneksel artizan mayalama ve premium Belçika kakao ustalığıyla harmanlanan benzersiz pastacılık deneyimine hoş geldiniz.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              <button
                onClick={() => scrollTo('branch-section')}
                style={{
                  padding: '15px 34px', borderRadius: 100, cursor: 'pointer',
                  background: `linear-gradient(135deg, ${C.gold} 0%, #A87E18 100%)`,
                  border: 'none', color: '#0B0704',
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 45px rgba(212,175,55,0.55)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.35)'}
              >
                Şube Seçip Başla ✦
              </button>
              <button
                onClick={() => scrollTo('showcase-section')}
                style={{
                  padding: '15px 34px', borderRadius: 100, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.055)',
                  border: `1px solid ${C.border}`,
                  color: C.cream, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.borderColor = C.goldBorder; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = C.border; }}
              >
                Vitrine Bak
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          onClick={() => scrollTo('showcase-section')}
          style={{ paddingBottom: 30, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}
        >
          <span style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700 }}>
            Lezzet Turu
          </span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ fontSize: 18, color: C.gold }}
          >↓</motion.span>
        </motion.div>
      </section>


      {/*══════════════════ SHOWCASE / PASTA DOLABI ═══════════════*/}
      <section id="showcase-section" ref={showcaseRef} style={{
        padding: '100px 24px', position: 'relative', zIndex: 10,
      }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span style={{
              fontSize: 9.5, letterSpacing: '0.32em', fontWeight: 800,
              color: C.gold, textTransform: 'uppercase',
            }}>DETAYLARDA USTALИК · DÖNEN VİTRİN</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
              fontWeight: 300, color: C.cream, margin: 0,
            }}>
              <em>"Şefin İmza Seçkisi"</em>
            </h2>
            <Divider />
            <p style={{ fontSize: 13, color: C.textMid, maxWidth: 400, fontWeight: 300, lineHeight: 1.8 }}>
              Dönen pasta dolabımızdaki her ürün; özenli malzeme seçimi, zaman ve sevgiyle şekil bulur.
            </p>
            {/* Drag hint */}
            <span style={{ fontSize: 10, color: C.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>☜</span> Sürükle ya da noktalara tıkla <span>☞</span>
            </span>
          </div>
        </Reveal>

        <PastaDisplay onBranchSelect={selectBranch} />
      </section>


      {/*══════════════════════ CRAFT / VALUES ════════════════════*/}
      <section style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(20,13,8,0.9) 15%, rgba(20,13,8,0.9) 85%, transparent 100%)',
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: '100px 24px', position: 'relative', zIndex: 10,
      }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 72 }}>

          {/* Promise + AI */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 48, alignItems: 'center',
          }}>
            {/* Promise */}
            <Reveal>
              <div className="gsap-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '0.3em', fontWeight: 800, color: C.gold, textTransform: 'uppercase' }}>
                  2006'DAN BERİ GÜVENLE
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.65rem, 3.8vw, 2.3rem)',
                  fontWeight: 300, color: C.cream, margin: 0, lineHeight: 1.35,
                }}>
                  Hamurumuzda <em style={{ color: C.gold }}>Samimiyet,</em><br />
                  aklımızda <em style={{ color: C.gold }}>Mükemmellik</em> var.
                </h2>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.85, fontWeight: 300, maxWidth: 400 }}>
                  Fırıncılık bizim için sadece un ve su değil; özel günlerinizi taçlandıran, ailenizle paylaştığınız masalara tat katan bir sanattır.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                  {['Artizan Mayalama', '%70 Belçika Kakao', 'Yapay Koruyucu Yok', 'Günlük Taze Üretim', 'AI Şef Asistanı', 'Hızlı Şube Teslimatı'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 19, height: 19, borderRadius: '50%',
                        background: C.goldMuted, border: `1px solid ${C.goldBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, color: C.gold, flexShrink: 0, fontWeight: 900,
                      }}>✓</div>
                      <span style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* AI Box */}
            <Reveal delay={0.15}>
              <div className="gsap-reveal" style={{
                background: 'linear-gradient(210deg, #241810 0%, #130D09 100%)',
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 28, padding: 38,
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
              }}>
                <div style={{
                  position: 'absolute', top: -35, right: -35,
                  width: 130, height: 130, borderRadius: '50%',
                  background: C.goldGlow, filter: 'blur(45px)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 54, height: 54, borderRadius: 17,
                  background: C.goldMuted, border: `1px solid ${C.goldBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 22,
                }}>🤖</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: C.cream, fontWeight: 400, marginBottom: 14 }}>
                  AI Şef Tasarımcısı
                </h3>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.82, fontWeight: 300, marginBottom: 28 }}>
                  Standartların dışına çıkın. Kat kat inşa edin, kremayı seçin, üzerine yazıyı tasarlayın — sipariş tamamen size özel olsun.
                </p>
                <button
                  onClick={() => scrollTo('branch-section')}
                  style={{
                    width: '100%', padding: '14px 0', borderRadius: 14, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
                    color: C.cream, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    transition: 'all 0.38s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#0B0704'; e.currentTarget.style.borderColor = C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = C.cream; e.currentTarget.style.borderColor = C.border; }}
                >
                  Şube Seçip Tasarlamaya Başla
                </button>
              </div>
            </Reveal>
          </div>

          {/* Values */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {VALUES.map((v, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5, borderColor: C.goldBorder }}
                  style={{
                    background: 'rgba(22,15,10,0.65)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 22, padding: '24px 22px',
                    display: 'flex', flexDirection: 'column', gap: 13,
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.35s ease',
                    cursor: 'default',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{v.icon}</span>
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.cream, margin: 0 }}>{v.title}</h4>
                  <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.72, fontWeight: 300, margin: 0 }}>{v.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/*══════════════════ BRANCH SELECTION ══════════════════════*/}
      <section id="branch-section" ref={branchRef} style={{
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', position: 'relative', zIndex: 10,
        textAlign: 'center',
      }}>
        <Reveal>
          <div style={{ marginBottom: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 9.5, letterSpacing: '0.32em', fontWeight: 800, color: C.gold, textTransform: 'uppercase' }}>
              KONUMUMUZ & GİRİŞ
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 300, color: C.cream, margin: 0,
            }}>
              Lezzet Durağınızı Seçin
            </h2>
            <Divider />
            <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.82, maxWidth: 340, fontWeight: 300 }}>
              Size en taze hizmeti sunabilmemiz için yakın şubeye giriş yapın.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {BRANCHES.map((b) => <BranchBtn key={b.id} branch={b} onSelect={selectBranch} />)}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{
            marginTop: 38, display: 'inline-flex', alignItems: 'center', gap: 18,
            padding: '14px 30px', borderRadius: 100,
            background: C.goldMuted, border: `1px solid ${C.goldBorder}`,
          }}>
            <span style={{ fontSize: 14 }}>🕗</span>
            <span style={{ fontSize: 11, color: C.cream, letterSpacing: '0.12em', fontWeight: 600 }}>
              Hergün 06:00 – 00.00 hizmetinizdeyiz
            </span>
          </div>
        </Reveal>

        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.32 }}>
          <span style={{ color: C.gold, fontSize: 10 }}>♥</span>
          <span style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Sevgiyle Fırınlandı · Sadece Size Özel
          </span>
        </div>
      </section>


      {/*════════════════════════ FOOTER ══════════════════════════*/}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '22px 24px', textAlign: 'center',
        position: 'relative', zIndex: 10,
      }}>
        <span style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          © Otantik Bakery System · Est. 2006 · İstanbul
        </span>
      </footer>
    </div>
  );
}
