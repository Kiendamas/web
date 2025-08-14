import { useGetCategoriasQuery } from '../../features/categorias/categoriasApi';
import { useGetSubcategoriasQuery } from '../../features/subcategorias/subcategoriasApi';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import { useGetResenasQuery } from '../../features/resenas/resenasApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import { useAuth } from '../../hooks/useAuth';
import {
  FolderIcon,
  TagIcon,
  MapIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const DashboardStats = () => {
  const { isAdmin } = useAuth();
  
  // Queries para obtener datos
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: subcategorias = [] } = useGetSubcategoriasQuery();
  const { data: paquetes = [] } = useGetPaquetesQuery();
  const { data: resenas = [] } = useGetResenasQuery();
  const { data: users = [], error: usersError } = useGetUsersQuery(undefined, {
    skip: !isAdmin, // Solo cargar si es admin
  });

  // Calcular estadísticas
  const stats = [
    {
      name: 'Categorías',
      value: categorias.length || 0,
      icon: FolderIcon,
      color: 'bg-blue-500',
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Subcategorías',
      value: subcategorias.length || 0,
      icon: TagIcon,
      color: 'bg-green-500',
      change: '+5.4%',
      changeType: 'positive',
    },
    {
      name: 'Paquetes Turísticos',
      value: paquetes.length || 0,
      icon: MapIcon,
      color: 'bg-purple-500',
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      name: 'Reseñas',
      value: resenas.length || 0,
      icon: StarIcon,
      color: 'bg-yellow-500',
      change: '+12.5%',
      changeType: 'positive',
    },
  ];

  // Solo agregar usuarios si es admin
  if (isAdmin && !usersError) {
    stats.push({
      name: 'Usuarios',
      value: users.length || 0,
      icon: UsersIcon,
      color: 'bg-red-500',
      change: '+2.3%',
      changeType: 'positive',
    });
  }

  const recentActivity = [
    {
      id: 1,
      action: 'Nuevo paquete creado',
      target: 'Tour a Machu Picchu',
      time: 'Hace 2 horas',
      icon: MapIcon,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      action: 'Reseña agregada',
      target: 'City Tour Lima',
      time: 'Hace 4 horas',
      icon: StarIcon,
      color: 'bg-yellow-500',
    },
    {
      id: 3,
      action: 'Categoría actualizada',
      target: 'Aventura',
      time: 'Hace 6 horas',
      icon: FolderIcon,
      color: 'bg-green-500',
    },
    {
      id: 4,
      action: 'Usuario registrado',
      target: 'juan.perez@email.com',
      time: 'Hace 1 día',
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
  ];

  const quickActions = [
    {
      name: 'Crear Paquete',
      description: 'Agregar nuevo paquete turístico',
      icon: MapIcon,
      color: 'bg-blue-500',
      href: '#paquetes',
    },
    {
      name: 'Nueva Categoría',
      description: 'Crear categoría de paquetes',
      icon: FolderIcon,
      color: 'bg-green-500',
      href: '#categorias',
    },
    {
      name: 'Ver Reseñas',
      description: 'Gestionar reseñas de clientes',
      icon: StarIcon,
      color: 'bg-yellow-500',
      href: '#resenas',
    },
    {
      name: 'Analytics',
      description: 'Ver estadísticas detalladas',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      href: '#analytics',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Estadísticas principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas Generales</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                            <span className="sr-only">
                              {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                            </span>
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actividad reciente */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.target}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Ver todas las actividades
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {action.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de resumen (placeholder) */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Resumen del Mes</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Gráficos y análisis detallados próximamente...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
