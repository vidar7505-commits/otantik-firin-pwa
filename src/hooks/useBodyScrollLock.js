import { useEffect } from 'react';

let lockCount = 0;
let lastScrollY = 0;
let previousBodyStyles = null;
let previousHtmlStyles = null;

const lockBodyScroll = () => {
  if (lockCount === 0) {
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      touchAction: document.body.style.touchAction,
    };
    previousHtmlStyles = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lastScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = previousBodyStyles?.overflow || '';
      document.body.style.position = previousBodyStyles?.position || '';
      document.body.style.top = previousBodyStyles?.top || '';
      document.body.style.width = previousBodyStyles?.width || '';
      document.body.style.touchAction = previousBodyStyles?.touchAction || '';
      document.documentElement.style.overflow = previousHtmlStyles?.overflow || '';
      document.documentElement.style.overscrollBehavior = previousHtmlStyles?.overscrollBehavior || '';
      window.scrollTo(0, lastScrollY);
      previousBodyStyles = null;
      previousHtmlStyles = null;
    }
  };
};

export const useBodyScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return undefined;

    return lockBodyScroll();
  }, [isLocked]);
};
