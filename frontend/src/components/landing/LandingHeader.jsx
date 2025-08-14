import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const LandingHeader = ({ onMenuClick, onSectionClick, activeSection }) => {
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navigationItems = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'servicios', label: 'SERVICIOS' },
    { id: 'experiencias', label: 'EXPERIENCIAS' },
    { id: 'comercial', label: 'COMERCIAL' },
    { id: 'nosotros', label: 'NOSOTROS' },
    { id: 'contacto', label: 'CONTACTO' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Título */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="menu-button p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/logo.png" // Aquí puedes poner tu logo
                  alt="Kiendamas"
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23B8860B'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EK%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              {/* Título */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Kiendamas Agencia de Viajes
                </h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">
                  Kiendamas
                </h1>
              </div>
            </div>
          </div>

          {/* Icono de Login */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className="p-2 rounded-full text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
              </button>

              {/* Dropdown de Login */}
              {showLoginMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        Hola, {user?.nombre || user?.email}
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowLoginMenu(false)}
                      >
                        Panel de Control
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowLoginMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowLoginMenu(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowLoginMenu(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {showLoginMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLoginMenu(false)}
        />
      )}
    </header>
  );
};

export default LandingHeader;
