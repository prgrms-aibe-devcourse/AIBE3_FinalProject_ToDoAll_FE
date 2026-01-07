import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
        className="min-h-1/2"
        onClick={() => {
          if (drawerOpen) {
            window.dispatchEvent(new CustomEvent('close-drawer'));
          }
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
