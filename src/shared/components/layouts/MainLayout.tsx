import Header from './Header.tsx';
import Footer from './Footer.tsx';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAlertStore } from '@shared/store/useAlertStore.ts';
import { useShallow } from 'zustand/react/shallow';
import AlertModal from '@shared/components/Alertmodal.tsx';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const alertState = useAlertStore(
    useShallow((s) => ({
      open: s.open,
      type: s.type,
      title: s.title,
      message: s.message,
      onClose: s.onClose,
      confirmText: s.confirmText,
      onConfirm: s.onConfirm,
    }))
  );
  const closeAlertModal = useAlertStore((s) => s.action.closeAlertModal);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setDrawerOpen(custom.detail);
    };
    const closeHandler = () => setDrawerOpen(false);

    window.addEventListener('drawer-state-change', handler);
    window.addEventListener('close-drawer', closeHandler);

    return () => {
      window.removeEventListener('drawer-state-change', handler);
      window.removeEventListener('close-drawer', closeHandler);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop && drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, isDesktop]);

  return (
    <div
      className={`relative flex h-full flex-col transition-[padding-left] duration-300 ${drawerOpen && isDesktop ? 'pl-[240px]' : ''}`}
    >
      {/* 모바일 전용 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
        onClick={() => window.dispatchEvent(new CustomEvent('close-drawer'))}
      />

      <Header />
      <main
        className="bg-jd-white min-h-1/2"
        onClick={() => {
          if (drawerOpen) {
            window.dispatchEvent(new CustomEvent('close-drawer'));
          }
        }}
      >
        <Outlet />
      </main>
      <AlertModal {...alertState} onClose={closeAlertModal} onConfirm={closeAlertModal} />

      <Footer />
    </div>
  );
};

export default MainLayout;
