import { useEffect } from 'react';
import {
  XMarkIcon,
  HomeIcon,
  CogIcon,
  StarIcon,
  BriefcaseIcon,
  UsersIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const LandingSidebar = ({ isOpen, onClose, onSectionClick, activeSection }) => {
  const navigationItems = [
    { id: 'inicio', label: 'INICIO', icon: HomeIcon },
    { id: 'servicios', label: 'SERVICIOS', icon: CogIcon },
    { id: 'experiencias', label: 'EXPERIENCIAS', icon: StarIcon },
    { id: 'comercial', label: 'COMERCIAL', icon: BriefcaseIcon },
    { id: 'nosotros', label: 'NOSOTROS', icon: UsersIcon },
    { id: 'contacto', label: 'CONTACTO', icon: PhoneIcon },
  ];

  // Prevenir scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between px-6 py-6 bg-gradient-to-r from-amber-500 to-amber-600">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Kiendamas"
                className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23FFFFFF'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23B8860B' font-family='Arial' font-size='20' font-weight='bold'%3EK%3C/text%3E%3C/svg%3E";
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Kiendamas
                </h2>
                <p className="text-sm text-amber-100">
                  Agencia de Viajes
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-white hover:text-amber-200 transition-colors p-2 rounded-full hover:bg-white/10"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionClick(item.id);
                      onClose(); // Cerrar sidebar al hacer click
                    }}
                    className={`w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-200 group ${
                      activeSection === item.id
                        ? 'bg-amber-50 text-amber-700 shadow-sm border-l-4 border-amber-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mr-4 transition-colors ${
                      activeSection === item.id 
                        ? 'text-amber-500' 
                        : 'text-gray-400 group-hover:text-amber-500'
                    }`} />
                    <span className="font-semibold text-sm tracking-wide">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer del Sidebar */}
          <div className="border-t border-gray-200 px-6 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium mb-3">
                Tu aventura comienza aquí
              </p>
              <div className="flex justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <div className="text-xs text-gray-500">
                <p>📧 info@kiendamas.com</p>
                <p className="mt-1">📱 +54 9 11 1234-5678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingSidebar;
