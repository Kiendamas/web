import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import Loading from '../components/ui/Loading';

const PaqueteDetallesPage = lazy(() => import('../pages/PaqueteDetallesPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UsersPage = lazy(() => import('../pages/UsersPage'));

const LazyPage = ({ children }) => (
  <Suspense fallback={<Loading text="Cargando..." />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/paquete/:id',
    element: <LazyPage><PaqueteDetallesPage /></LazyPage>,
  },
  {
    path: '/login',
    element: <LazyPage><LoginPage /></LazyPage>,
  },
  {
    path: '/register',
    element: <LazyPage><RegisterPage /></LazyPage>,
  },
  {
    path: '/forgot-password',
    element: <LazyPage><ForgotPasswordPage /></LazyPage>,
  },
  {
    path: '/reset-password',
    element: <LazyPage><ResetPasswordPage /></LazyPage>,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <LazyPage><DashboardPage /></LazyPage>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute adminOnly>
        <LazyPage><UsersPage /></LazyPage>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
], {
  future: {
    v7_startTransition: true,
  },
});