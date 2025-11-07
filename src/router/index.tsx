import { Routes, Route } from 'react-router-dom';
import { mainRoutes, noLayoutRoutes } from './routes';

import MainLayout from '../components/layouts/MainLayout';
import NoLayout from '../components/layouts/NoLayout';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<NoLayout />}>
        {noLayoutRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<MainLayout />}>
        {mainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}
