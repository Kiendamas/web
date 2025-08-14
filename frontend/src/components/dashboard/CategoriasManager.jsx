import { useState } from 'react';
import {
  useGetCategoriasQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
} from '../../features/categorias/categoriasApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import Loading from '../ui/Loading';

const CategoriasManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const { data: categorias = [], isLoading, error } = useGetCategoriasQuery();
  const [createCategoria, { isLoading: isCreating }] = useCreateCategoriaMutation();
  const [updateCategoria, { isLoading: isUpdating }] = useUpdateCategoriaMutation();
  const [deleteCategoria, { isLoading: isDeleting }] = useDeleteCategoriaMutation();

  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nombre: '',
        descripcion: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await updateCategoria({
          id: editingCategoria.id,
          ...formData,
        }).unwrap();
      } else {
        await createCategoria(formData).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await deleteCategoria(id).unwrap();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
          <p className="text-gray-600">Administra las categorías de paquetes turísticos</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Categorías ({categorias.length})
          </h3>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">Error al cargar categorías: {error.message}</p>
          </div>
        )}

        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay categorías creadas aún</p>
            <Button
              onClick={() => handleOpenModal()}
              className="mt-4"
            >
              Crear primera categoría
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {categoria.nombre}
                  </h4>
                  {categoria.descripcion && (
                    <p className="text-gray-600 mt-1">
                      {categoria.descripcion}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                    Creada: {new Date(categoria.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(categoria)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    disabled={isUpdating}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(categoria.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    disabled={isDeleting}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
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
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    : editingCategoria
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

export default CategoriasManager;
