import { useState } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CogIcon,
  StarIcon,
  BriefcaseIcon,
  UsersIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const CompactSidebar = ({ onSectionClick, activeSection, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems = [
    { id: 'inicio', label: 'INICIO', icon: HomeIcon },
    { id: 'servicios', label: 'SERVICIOS', icon: CogIcon },
    { id: 'paquetes', label: 'PAQUETES', icon: BriefcaseIcon },
    { id: 'nosotros', label: 'NOSOTROS', icon: UsersIcon },
    { id: 'resenas', label: 'RESEÑAS', icon: ChatBubbleLeftRightIcon },
    { id: 'contacto', label: 'CONTACTO', icon: PhoneIcon },
  ];

  const handleSectionClick = (sectionId) => {
    onSectionClick(sectionId);
    setIsExpanded(false);
    if (onExpandChange) onExpandChange(false);
  };

  const toggleExpanded = (expanded) => {
    setIsExpanded(expanded);
    if (onExpandChange) onExpandChange(expanded);
  };

  return (
    <>
      {/* Overlay cuando está expandido */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => toggleExpanded(false)}
        />
      )}

      {/* Sidebar principal que cambia según el estado */}
      <div className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        <div className="bg-kiendamas-beige h-full shadow-lg">
          {!isExpanded ? (
            // Vista compacta - solo iconos
            <div className="flex flex-col items-center py-4">
              {/* Botón hamburguesa */}
              <button
                onClick={() => toggleExpanded(true)}
                className="p-3 rounded-lg text-kiendamas-text hover:bg-white/30 transition-colors mb-4 border border-kiendamas-text/20"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Iconos de navegación */}
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-kiendamas-brown text-white'
                          : 'text-kiendamas-text hover:bg-kiendamas-lightBeige hover:text-kiendamas-brown'
                      }`}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Vista expandida - panel completo
            <div className="flex h-full flex-col overflow-y-auto">
              {/* Header del panel expandido */}
              <div className="flex items-center justify-between px-4 py-6 border-b border-kiendamas-brown/20">
                <div className="flex items-center space-x-3">
                  <img
                    src="/src/assets/logo.jpg"
                    alt="Kiendamas"
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23B8860B'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EK%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-bold text-kiendamas-text font-raleway">
                      Kiendamas
                    </h2>
                    <p className="text-sm text-kiendamas-brown">
                      Agencia de Viajes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-kiendamas-text hover:text-kiendamas-brown transition-colors p-2"
                  onClick={() => toggleExpanded(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation expandida */}
              <div className="flex-1 px-4 py-6">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSectionClick(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-kiendamas-brown text-white'
                            : 'text-kiendamas-text hover:bg-kiendamas-lightBeige hover:text-kiendamas-brown'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mr-3 ${
                          activeSection === item.id ? 'text-white' : 'text-kiendamas-brown'
                        }`} />
                        <span className="font-medium font-raleway">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Footer del panel expandido */}
              <div className="border-t border-kiendamas-brown/20 px-4 py-4">
                <div className="text-center">
                  <p className="text-sm text-kiendamas-text font-raleway">
                    Tu aventura comienza aquí
                  </p>
                  <div className="mt-2 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-kiendamas-gold rounded-full"></div>
                    <div className="w-2 h-2 bg-kiendamas-gold rounded-full"></div>
                    <div className="w-2 h-2 bg-kiendamas-gold rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompactSidebar;
