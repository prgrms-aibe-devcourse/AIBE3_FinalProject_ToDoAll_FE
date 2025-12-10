import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 커스텀 이벤트로 Header의 드로어 상태 감지
  useEffect(() => {
    const handleDrawerChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setDrawerOpen(customEvent.detail);
    };

    window.addEventListener('drawer-state-change', handleDrawerChange);
    return () => {
      window.removeEventListener('drawer-state-change', handleDrawerChange);
    };
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className="flex-grow"
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
