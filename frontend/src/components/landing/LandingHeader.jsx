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
    <header className="fixed top-0 left-0 right-0 z-30 bg-kiendamas-beige shadow-sm lg:left-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Botón hamburguesa solo en móviles */}
          <div className="lg:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-kiendamas-text hover:text-kiendamas-darkBrown hover:bg-white/20 transition-colors"
            >
              <Bars3Icon className="h-2 w-2" />
            </button>
          </div>

          {/* Logo y Título */}
          <div className="flex items-center space-x-3 flex-1 lg:justify-center">
            {/* Título con estilos específicos */}
            <div className="text-center lg:text-center">
              <h1 className="font-raleway font-bold text-kiendamas-title leading-none tracking-none text-kiendamas-text hidden sm:block">
                Kiendamas Agencia de Viajes
              </h1>
              <h1 className="font-raleway font-bold text-xl leading-none tracking-none text-kiendamas-text sm:hidden">
                Kiendamas
              </h1>
            </div>
          </div>

          {/* Icono de Login */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className="p-2 rounded-full text-kiendamas-text hover:text-kiendamas-darkBrown hover:bg-white/20 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
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
