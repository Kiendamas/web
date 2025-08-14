import { useState } from 'react';
import {
  useGetResenasQuery,
  useCreateResenaMutation,
  useUpdateResenaMutation,
  useDeleteResenaMutation,
} from '../../features/resenas/resenasApi';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Button } from '../ui';
import Loading from '../ui/Loading';

const ResenasManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResena, setEditingResena] = useState(null);
  const [formData, setFormData] = useState({
    nombreCliente: '',
    emailCliente: '',
    paqueteId: '',
    rating: 5,
    comentario: '',
  });

  const { data: resenas = [], isLoading } = useGetResenasQuery();
  const { data: paquetes = [] } = useGetPaquetesQuery();
  const [createResena, { isLoading: isCreating }] = useCreateResenaMutation();
  const [updateResena, { isLoading: isUpdating }] = useUpdateResenaMutation();
  const [deleteResena, { isLoading: isDeleting }] = useDeleteResenaMutation();

  const handleOpenModal = (resena = null) => {
    if (resena) {
      setEditingResena(resena);
      setFormData({
        nombreCliente: resena.nombreCliente || '',
        emailCliente: resena.emailCliente || '',
        paqueteId: resena.paqueteId || '',
        rating: resena.rating || 5,
        comentario: resena.comentario || '',
      });
    } else {
      setEditingResena(null);
      setFormData({
        nombreCliente: '',
        emailCliente: '',
        paqueteId: '',
        rating: 5,
        comentario: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResena(null);
    setFormData({
      nombreCliente: '',
      emailCliente: '',
      paqueteId: '',
      rating: 5,
      comentario: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResena) {
        await updateResena({
          id: editingResena.id,
          ...formData,
        }).unwrap();
      } else {
        await createResena(formData).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar reseña:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteResena(id).unwrap();
      } catch (error) {
        console.error('Error al eliminar reseña:', error);
      }
    }
  };

  const getPaqueteName = (paqueteId) => {
    const paquete = paquetes.find(p => p.id === paqueteId);
    return paquete ? paquete.nombre : 'Paquete no encontrado';
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Reseñas</h2>
          <p className="text-gray-600">Administra las reseñas de los clientes</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Reseña
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reseñas ({resenas.length})
          </h3>
        </div>
        
        {resenas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay reseñas disponibles</p>
            <Button
              onClick={() => handleOpenModal()}
              className="mt-4"
            >
              Crear primera reseña
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resenas.map((resena) => (
              <div key={resena.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {resena.nombreCliente || 'Usuario Anónimo'}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < (resena.rating || 0) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {getPaqueteName(resena.paqueteId)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{resena.comentario}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{resena.emailCliente}</span>
                      <span>{new Date(resena.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(resena)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      disabled={isUpdating}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(resena.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={isDeleting}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingResena ? 'Editar Reseña' : 'Nueva Reseña'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paquete *
                </label>
                <select
                  value={formData.paqueteId}
                  onChange={(e) => setFormData({ ...formData, paqueteId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar paquete...</option>
                  {paquetes.map((paquete) => (
                    <option key={paquete.id} value={paquete.id}>
                      {paquete.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.nombreCliente}
                    onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.emailCliente}
                    onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating} estrella{formData.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentario *
                </label>
                <textarea
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-4 py-2"
                >
                  {isCreating || isUpdating
                    ? 'Guardando...'
                    : editingResena
                    ? 'Actualizar'
                    : 'Crear'
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResenasManager;
