import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/AuthContext.ts';
import MainLayout from '@shared/components/layouts/MainLayout.tsx';

export default function AuthRouteGuard() {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <MainLayout />;
}
