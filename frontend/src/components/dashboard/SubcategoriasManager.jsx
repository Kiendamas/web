import { useState } from 'react';
import {
  useGetSubcategoriasQuery,
  useCreateSubcategoriaMutation,
  useUpdateSubcategoriaMutation,
  useDeleteSubcategoriaMutation,
} from '../../features/subcategorias/subcategoriasApi';
import { useGetCategoriasQuery } from '../../features/categorias/categoriasApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import Loading from '../ui/Loading';

const SubcategoriasManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategoria, setEditingSubcategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoriaId: '',
  });

  const { data: subcategorias = [], isLoading, error } = useGetSubcategoriasQuery();
  const { data: categorias = [] } = useGetCategoriasQuery();
  const [createSubcategoria, { isLoading: isCreating }] = useCreateSubcategoriaMutation();
  const [updateSubcategoria, { isLoading: isUpdating }] = useUpdateSubcategoriaMutation();
  const [deleteSubcategoria, { isLoading: isDeleting }] = useDeleteSubcategoriaMutation();

  const handleOpenModal = (subcategoria = null) => {
    if (subcategoria) {
      setEditingSubcategoria(subcategoria);
      setFormData({
        nombre: subcategoria.nombre || '',
        descripcion: subcategoria.descripcion || '',
        categoriaId: subcategoria.categoriaId || '',
      });
    } else {
      setEditingSubcategoria(null);
      setFormData({
        nombre: '',
        descripcion: '',
        categoriaId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubcategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoriaId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategoria) {
        await updateSubcategoria({
          id: editingSubcategoria.id,
          ...formData,
        }).unwrap();
      } else {
        await createSubcategoria(formData).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar subcategoría:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      try {
        await deleteSubcategoria(id).unwrap();
      } catch (error) {
        console.error('Error al eliminar subcategoría:', error);
      }
    }
  };

  const getCategoriaName = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Subcategorías</h2>
          <p className="text-gray-600">Administra las subcategorías organizadas por categorías</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
          disabled={categorias.length === 0}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Subcategoría
        </Button>
      </div>

      {/* Alerta si no hay categorías */}
      {categorias.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Atención:</strong> Necesitas crear al menos una categoría antes de poder agregar subcategorías.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de subcategorías */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Subcategorías ({subcategorias.length})
          </h3>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">Error al cargar subcategorías: {error.message}</p>
          </div>
        )}

        {subcategorias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay subcategorías creadas aún</p>
            {categorias.length > 0 && (
              <Button
                onClick={() => handleOpenModal()}
                className="mt-4"
              >
                Crear primera subcategoría
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {subcategorias.map((subcategoria) => (
              <div key={subcategoria.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      {subcategoria.nombre}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoriaName(subcategoria.categoriaId)}
                    </span>
                  </div>
                  {subcategoria.descripcion && (
                    <p className="text-gray-600 mt-1">
                      {subcategoria.descripcion}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                    Creada: {new Date(subcategoria.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(subcategoria)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    disabled={isUpdating}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategoria.id)}
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
                {editingSubcategoria ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
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
                  Categoría *
                </label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

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
                    : editingSubcategoria
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

export default SubcategoriasManager;
