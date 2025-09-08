import { useEffect, useState } from 'react';
import {
  XMarkIcon,
  HomeIcon,
  CogIcon,
  StarIcon,
  BriefcaseIcon,
  UsersIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import ServiciosModal from './ServiciosModal';
import MediosPagoModal from './MediosPagoModal';

const LandingSidebar = ({ isOpen, onClose, onSectionClick, activeSection }) => {
  const navigationItems = [
    { id: 'inicio', label: 'INICIO', icon: HomeIcon },
    { id: 'servicios', label: 'SERVICIOS', icon: CogIcon },
    { id: 'paquetes', label: 'PAQUETES', icon: BriefcaseIcon },
    { id: 'nosotros', label: 'NOSOTROS', icon: UsersIcon },
    { id: 'resenas', label: 'RESEÑAS', icon: ChatBubbleLeftRightIcon },
    { id: 'contacto', label: 'CONTACTO', icon: PhoneIcon },
    { id: 'mediospago', label: 'MEDIOS DE PAGO', icon: StarIcon },
  ];

  const [showServiciosModal, setShowServiciosModal] = useState(false);
  const [showMediosPagoModal, setShowMediosPagoModal] = useState(false);

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
      <div className={`sidebar fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-kiendamas-beige shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header del Sidebar */}
          <div className="flex items-center mt-10 justify-between px-6 py-6 bg-kiendamas-darkBrown border-b border-kiendamas-brown/30">
            <div className="flex items-center space-x-3">
              <img
                src="/kiendamas.png"
                alt="Kiendamas"
                className="h-12 w-12 rounded-full object-cover border-2 border-kiendamas-beige/30"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23E6AF32'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23646464' font-family='Raleway' font-size='18' font-weight='bold'%3EK%3C/text%3E%3C/svg%3E";
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-kiendamas-beige font-raleway">
                  Kiendamas
                </h2>
                <p className="text-sm text-kiendamas-beige/80 font-raleway">
                  Agencia de Viajes
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-kiendamas-beige hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
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
                if (item.id === 'servicios') {
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowServiciosModal(true);
                      }}
                      className={`w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-200 group ${
                        activeSection === item.id
                          ? 'bg-kiendamas-cream text-kiendamas-darkBrown shadow-sm border-l-4 border-kiendamas-gold'
                          : 'text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mr-4 transition-colors ${
                        activeSection === item.id 
                          ? 'text-kiendamas-gold' 
                          : 'text-kiendamas-text group-hover:text-kiendamas-gold'
                      }`} />
                      <span className="font-raleway font-semibold text-sm tracking-wide">
                        {item.label}
                      </span>
                    </button>
                  );
                }
                if (item.id === 'mediospago') {
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMediosPagoModal(true);
                      }}
                      className={`w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-200 group text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown hover:shadow-sm`}
                    >
                      <Icon className="h-6 w-6 mr-4 transition-colors text-kiendamas-gold" />
                      <span className="font-raleway font-semibold text-sm tracking-wide">
                        {item.label}
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionClick(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-200 group ${
                      activeSection === item.id
                        ? 'bg-kiendamas-cream text-kiendamas-darkBrown shadow-sm border-l-4 border-kiendamas-gold'
                        : 'text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mr-4 transition-colors ${
                      activeSection === item.id 
                        ? 'text-kiendamas-gold' 
                        : 'text-kiendamas-text group-hover:text-kiendamas-gold'
                    }`} />
                    <span className="font-raleway font-semibold text-sm tracking-wide">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer del Sidebar */}
          <div className="border-t border-kiendamas-darkBrown/30 px-6 py-6 bg-kiendamas-cream/50">
            <div className="text-center">
              <p className="text-sm text-kiendamas-text font-raleway font-medium mb-3">
                Tu aventura comienza aquí
              </p>
              <div className="flex justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-kiendamas-gold rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-kiendamas-gold rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-kiendamas-gold rounded-full animate-pulse delay-150"></div>
              </div>
              <div className="text-xs text-kiendamas-text/80 font-raleway">
                <p>📧 info@kiendamas.com</p>
                <p className="mt-1">📱 +54 9 11 1234-5678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  <ServiciosModal open={showServiciosModal} onClose={() => setShowServiciosModal(false)} />
  <MediosPagoModal open={showMediosPagoModal} onClose={() => setShowMediosPagoModal(false)} />
    </>
  );
};

export default LandingSidebar;
