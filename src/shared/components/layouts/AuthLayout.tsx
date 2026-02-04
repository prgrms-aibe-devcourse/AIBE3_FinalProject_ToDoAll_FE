import AlertModal from '@shared/components/Alertmodal.tsx';
import { Outlet } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAlertStore } from '@shared/store/useAlertStore.ts';
import { useShallow } from 'zustand/react/shallow';

export default function AuthLayout() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(100%_100%_at_50%_0%,#eeeeef_0%,#dcdcdc_35%,#d6d6d6_60%,#cfcfcf_100%)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="relative z-10 grid min-h-dvh place-items-center px-4 sm:px-6 md:px-8">
        <Outlet />
      </main>

      <AlertModal {...alertState} onClose={closeAlertModal} onConfirm={closeAlertModal} />
    </div>
  );
}
