import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import logoImg from '../../assets/logog.png';

const RIBBON_HEIGHT = 44;

const isStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const isDismissed = () =>
  localStorage.getItem('installPromptDismissed') === 'true';

export const getInstallRibbonHeight = () =>
  isDismissed() || isStandaloneMode() ? 0 : RIBBON_HEIGHT;

const InstallPromptRibbon = () => {
  const [visible, setVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    if (isDismissed() || isStandaloneMode()) return;
    setVisible(true);
    document.documentElement.style.setProperty('--install-ribbon-height', `${RIBBON_HEIGHT}px`);

    const onInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      document.documentElement.style.removeProperty('--install-ribbon-height');
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem('installPromptDismissed', 'true');
    setVisible(false);
    setShowHint(false);
    document.documentElement.style.setProperty('--install-ribbon-height', '0px');
    window.dispatchEvent(new Event('install-ribbon-dismissed'));
  };

  const handleInstall = async (e) => {
    e.stopPropagation();
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') dismiss();
      deferredPrompt.current = null;
      setCanInstall(false);
      return;
    }
    setShowHint((prev) => !prev);
  };

  if (!visible) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <>
      <div
        role="banner"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          minHeight: RIBBON_HEIGHT,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          backgroundColor: '#111111',
          color: '#D4AF37',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingLeft: '10px',
          paddingRight: '6px',
          paddingTop: '4px',
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(212, 175, 55, 0.18)',
        }}
      >
        <img
          src={logoImg}
          alt=""
          aria-hidden="true"
          style={{
            width: 24,
            height: 24,
            objectFit: 'contain',
            flexShrink: 0,
            borderRadius: 5,
          }}
        />

        <p
          style={{
            flex: 1,
            margin: 0,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            lineHeight: 1.25,
            userSelect: 'none',
            minWidth: 0,
          }}
        >
          Hızlı sipariş için Ana Ekranına ekle
        </p>

        <button
          type="button"
          onClick={handleInstall}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '100px',
            background: '#D4AF37',
            border: 'none',
            color: '#111111',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={12} strokeWidth={3} />
          EKLE
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Kapat"
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#D4AF37',
            opacity: 0.65,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      </div>

      {showHint && !canInstall && (
        <div
          onClick={() => setShowHint(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1099,
            background: 'rgba(0,0,0,0.55)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: `calc(${RIBBON_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 8px)`,
              left: '12px',
              right: '12px',
              background: '#1a1a1a',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '16px',
              padding: '16px',
              color: '#D4AF37',
              fontSize: '0.78rem',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Ana Ekrana Nasıl Eklenir?
            </strong>
            {isIOS ? (
              <span>
                Safari'de alt menüden <strong>Paylaş</strong> simgesine dokunun,
                ardından <strong>Ana Ekrana Ekle</strong> seçeneğini seçin.
              </span>
            ) : (
              <span>
                Tarayıcı menüsünden (⋮) <strong>Ana ekrana ekle</strong> veya{' '}
                <strong>Kısayol oluştur</strong> seçeneğini kullanın.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPromptRibbon;
