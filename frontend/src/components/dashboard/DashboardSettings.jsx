import { useAuth } from '../../hooks/useAuth';
import { CogIcon } from '@heroicons/react/24/outline';

const DashboardSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-gray-600">Ajustes y configuración del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del usuario */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mi Perfil</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Usuario</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Rol</label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      {/* Acciones */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Acciones</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left">
              <CogIcon className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Configurar API</h4>
              <p className="text-sm text-gray-500">Ajustar configuración de endpoints</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left">
              <CogIcon className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Exportar Datos</h4>
              <p className="text-sm text-gray-500">Descargar backup del sistema</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left">
              <CogIcon className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Logs del Sistema</h4>
              <p className="text-sm text-gray-500">Ver registros de actividad</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
