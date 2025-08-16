import { useState } from "react";
import { useGetCategoriasQuery } from "../../features/categorias/categoriasApi";
import { useGetSubcategoriasQuery } from "../../features/subcategorias/subcategoriasApi";
import { useGetPaquetesQuery } from "../../features/paquetes/paquetesApi";
import { useGetResenasQuery } from "../../features/resenas/resenasApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { useAuth } from "../../hooks/useAuth";
import {
  FolderIcon,
  TagIcon,
  MapIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowUpIcon,
  EyeIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const DashboardStats = ({ onTabChange }) => {
  const { isAdmin } = useAuth();

  // Queries para obtener datos
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: subcategorias = [] } = useGetSubcategoriasQuery();
  const { data: paquetes = [] } = useGetPaquetesQuery();
  const { data: resenas = [] } = useGetResenasQuery();
  const { data: users = [], error: usersError } = useGetUsersQuery(undefined, {
    skip: !isAdmin, // Solo cargar si es admin
  });

  const [showAllActivities, setShowAllActivities] = useState(false);

  // Calcular estadísticas
  const stats = [
    {
      name: "Categorías",
      value: categorias.length || 0,
      icon: FolderIcon,
      color: "bg-blue-500",
      change: "+4.75%",
      changeType: "positive",
    },
    {
      name: "Subcategorías",
      value: subcategorias.length || 0,
      icon: TagIcon,
      color: "bg-green-500",
      change: "+5.4%",
      changeType: "positive",
    },
    {
      name: "Paquetes Turísticos",
      value: paquetes.length || 0,
      icon: MapIcon,
      color: "bg-purple-500",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      name: "Reseñas",
      value: resenas.length || 0,
      icon: StarIcon,
      color: "bg-yellow-500",
      change: "+12.5%",
      changeType: "positive",
    },
  ];

  // Solo agregar usuarios si es admin
  if (isAdmin && !usersError) {
    stats.push({
      name: "Usuarios",
      value: users.length || 0,
      icon: UsersIcon,
      color: "bg-red-500",
      change: "+2.3%",
      changeType: "positive",
    });
  }

  // Generar actividades recientes basadas en datos reales
  const generateRecentActivity = () => {
    const activities = [];

    // Últimos paquetes creados
    const recentPaquetes = [...paquetes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);

    recentPaquetes.forEach((paquete) => {
      activities.push({
        id: `paquete-${paquete.id}`,
        action: "Nuevo paquete creado",
        target: paquete.nombre,
        time: formatTimeAgo(paquete.createdAt),
        icon: MapIcon,
        color: "bg-blue-500",
      });
    });

    // Últimas reseñas
    const recentResenas = [...resenas]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);

    recentResenas.forEach((resena) => {
      const paquete = paquetes.find((p) => p.id === resena.paqueteId);
      activities.push({
        id: `resena-${resena.id}`,
        action: "Nueva reseña agregada",
        target: paquete ? paquete.nombre : "Paquete desconocido",
        time: formatTimeAgo(resena.createdAt),
        icon: StarIcon,
        color: "bg-yellow-500",
      });
    });

    // Últimas categorías
    const recentCategorias = [...categorias]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1);

    recentCategorias.forEach((categoria) => {
      activities.push({
        id: `categoria-${categoria.id}`,
        action: "Categoría actualizada",
        target: categoria.nombre,
        time: formatTimeAgo(categoria.createdAt),
        icon: FolderIcon,
        color: "bg-green-500",
      });
    });

    // Últimos usuarios (solo si es admin)
    if (isAdmin && users.length > 0) {
      const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1);

      recentUsers.forEach((user) => {
        activities.push({
          id: `user-${user.id}`,
          action: "Usuario registrado",
          target: user.email,
          time: formatTimeAgo(user.createdAt),
          icon: UsersIcon,
          color: "bg-purple-500",
        });
      });
    }

    return activities.slice(0, showAllActivities ? activities.length : 4); // Máximo 4 actividades o todas
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Fecha desconocida";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24)
      return `Hace ${diffInHours} hora${diffInHours !== 1 ? "s" : ""}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `Hace ${diffInDays} día${diffInDays !== 1 ? "s" : ""}`;

    return date.toLocaleDateString();
  };

  const recentActivity = generateRecentActivity();

  const quickActions = [
    {
      name: "Crear Paquete",
      description: "Agregar nuevo paquete turístico",
      icon: MapIcon,
      color: "bg-blue-500",
      action: () => onTabChange && onTabChange("paquetes"),
    },
    {
      name: "Nueva Categoría",
      description: "Crear categoría de paquetes",
      icon: FolderIcon,
      color: "bg-green-500",
      action: () => onTabChange && onTabChange("categorias"),
    },
    {
      name: "Ver Reseñas",
      description: "Gestionar reseñas de clientes",
      icon: StarIcon,
      color: "bg-yellow-500",
      action: () => onTabChange && onTabChange("resenas"),
    },
    {
      name: "Usuarios",
      description: "Gestionar usuarios del sistema",
      icon: UsersIcon,
      color: "bg-purple-500",
      action: () => isAdmin && onTabChange && onTabChange("usuarios"),
      disabled: !isAdmin,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Notificaciones importantes */}
      {(paquetes.length === 0 || categorias.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Configuración Pendiente
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {categorias.length === 0 &&
                    "No tienes categorías configuradas. "}
                  {paquetes.length === 0 &&
                    "No tienes paquetes turísticos creados. "}
                  Utiliza las acciones rápidas para comenzar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Estadísticas Generales
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
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
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                            <span className="sr-only">
                              {stat.changeType === "positive"
                                ? "Increased"
                                : "Decreased"}{" "}
                              by
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
            <h3 className="text-lg font-medium text-gray-900">
              Actividad Reciente
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center`}
                      >
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
                      <div className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-8 text-center">
                <ClockIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  No hay actividad reciente
                </p>
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-center">
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {showAllActivities
                ? "Mostrar menos"
                : `Ver todas las actividades (${
                    generateRecentActivity().length
                  })`}
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Acciones Rápidas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left ${
                      action.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-3`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {action.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                    {!action.disabled && (
                      <div className="mt-2">
                        <PlusIcon className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumen de calificaciones */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Calificaciones Promedio
            </h3>
          </div>
          <div className="p-6">
            {resenas.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Promedio General
                  </span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-yellow-600">
                      {(
                        resenas.reduce((acc, r) => acc + r.rating, 0) /
                        resenas.length
                      ).toFixed(1)}
                    </span>
                    <StarIcon className="h-5 w-5 text-yellow-400 ml-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = resenas.filter(
                      (r) => r.rating === rating
                    ).length;
                    const percentage =
                      resenas.length > 0 ? (count / resenas.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center text-sm">
                        <span className="w-3 text-gray-600">{rating}</span>
                        <StarIcon className="h-3 w-3 text-yellow-400 mx-1" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <StarIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  No hay reseñas disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Paquetes más populares */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Paquetes Populares
            </h3>
          </div>
          <div className="p-6">
            {paquetes.length > 0 ? (
              <div className="space-y-3">
                {paquetes.slice(0, 3).map((paquete, index) => {
                  const paqueteResenas = resenas.filter(
                    (r) => r.paqueteId === paquete.id
                  );
                  const avgRating =
                    paqueteResenas.length > 0
                      ? paqueteResenas.reduce((acc, r) => acc + r.rating, 0) /
                        paqueteResenas.length
                      : 0;

                  return (
                    <div
                      key={paquete.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {paquete.nombre}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {paqueteResenas.length} reseña
                            {paqueteResenas.length !== 1 ? "s" : ""}
                          </span>
                          {avgRating > 0 && (
                            <>
                              <StarIcon className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs text-gray-600 ml-1">
                                {avgRating.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">
                        S/ {paquete.precio}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <MapIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  No hay paquetes disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Estado del Sistema
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de Datos</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Operativo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Última Actualización
              </span>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors"
              >
                Actualizar Dashboard
              </button>
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
