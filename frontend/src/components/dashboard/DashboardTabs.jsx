import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  FolderIcon,
  TagIcon,
  MapIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

// Componentes de cada sección
import DashboardStats from './DashboardStats';
import CategoriasManager from './CategoriasManager';
import SubcategoriasManager from './SubcategoriasManager';
import PaquetesManager from './PaquetesManager';
import ResenasManager from './ResenasManager';
import UsersManager from './UsersManager';
import DashboardSettings from './DashboardSettings';
import HeroSlidesManager from './HeroSlidesManager';

const tabs = [
  { id: 'overview', name: 'Resumen', icon: HomeIcon },
  { id: 'hero-slides', name: 'Hero Slides', icon: PhotoIcon, adminOnly: true },
  { id: 'categorias', name: 'Categorías', icon: FolderIcon },
  { id: 'subcategorias', name: 'Subcategorías', icon: TagIcon },
  { id: 'paquetes', name: 'Paquetes', icon: MapIcon },
  { id: 'resenas', name: 'Reseñas', icon: StarIcon },
  { id: 'users', name: 'Usuarios', icon: UsersIcon, adminOnly: true },
  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, adminOnly: true },
  { id: 'settings', name: 'Configuración', icon: CogIcon },
];

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAdmin } = useAuth();

  const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardStats onTabChange={setActiveTab} />;
      case 'hero-slides':
        return <HeroSlidesManager />;
      case 'categorias':
        return <CategoriasManager />;
      case 'subcategorias':
        return <SubcategoriasManager />;
      case 'paquetes':
        return <PaquetesManager />;
      case 'resenas':
        return <ResenasManager />;
      case 'users':
        return <UsersManager />;
      case 'usuarios':
        return <UsersManager />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-500">Próximamente: Gráficos detallados y métricas avanzadas</p>
          </div>
        );
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardStats onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido, {user?.username} • {user?.role}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Sistema Activo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DashboardTabs;
