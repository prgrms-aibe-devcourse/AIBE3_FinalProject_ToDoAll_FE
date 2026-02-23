import { Routes, Route, Navigate } from 'react-router-dom';
import { authLayoutRoutes, mainRoutes, noLayoutRoutes } from './routes';

import AuthRouteGuard from '@/router/AuthRouteGuard.tsx';
import AuthLayout from '@shared/components/layouts/AuthLayout.tsx';
import NoLayout from '@shared/components/layouts/NoLayout.tsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AuthLayout />}>
        {authLayoutRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route element={<NoLayout />}>
        {noLayoutRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<AuthRouteGuard />}>
        {mainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}
