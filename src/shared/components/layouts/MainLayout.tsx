import Header from './Header.tsx';
import Footer from './Footer.tsx';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAlertStore } from '@shared/store/useAlertStore.ts';
import { useShallow } from 'zustand/react/shallow';
import AlertModal from '@shared/components/Alertmodal.tsx';
import SidebarDrawer from '@shared/components/SidebarDrawer.tsx';

const checkMedia = () => {
  const mq = window.matchMedia('(min-width: 1024px)');
  return mq.matches;
};

const checkIsDrawerOpen = (isDesktop: boolean) => {
  if (!isDesktop) return isDesktop;

  const prevState = window.localStorage.getItem('drawerOpen');
  console.log(typeof prevState, 'prevState');
  if (prevState) return prevState === 'true';
  else return isDesktop;
};

const MainLayout = () => {
  const [isDesktop, setIsDesktop] = useState(checkMedia());
  const [drawerOpen, setDrawerOpen] = useState(checkIsDrawerOpen(isDesktop));

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
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const closeHandler = () => setDrawerOpen(false);
    window.addEventListener('close-drawer', closeHandler);

    return () => {
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
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
        onClick={() => window.dispatchEvent(new CustomEvent('close-drawer'))}
      />

      <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <section className="flex w-full">
        <SidebarDrawer
          open={drawerOpen}
          onClose={() => {
            if (isDesktop) return;
            setDrawerOpen(false);
          }}
        />
        <main
          className="bg-jd-white min-h-1/2 w-full"
          onClick={() => {
            if (drawerOpen && !isDesktop) {
              setDrawerOpen(false);
            }
          }}
        >
          <Outlet />
        </main>
      </section>
      <AlertModal {...alertState} onClose={closeAlertModal} onConfirm={closeAlertModal} />

      <Footer />
    </div>
  );
};

export default MainLayout;
