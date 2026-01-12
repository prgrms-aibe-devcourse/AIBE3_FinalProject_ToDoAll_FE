import { Routes, Route, Navigate } from 'react-router-dom';
import { mainRoutes, noLayoutRoutes } from './routes';

import NoLayout from '@shared/components/layouts/NoLayout';
import AuthRouteGuard from '@/router/AuthRouteGuard.tsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
