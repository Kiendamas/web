import { useState } from 'react';
import {
  useGetPaquetesQuery,
  useCreatePaqueteMutation,
  useUpdatePaqueteMutation,
  useDeletePaqueteMutation,
} from '../../features/paquetes/paquetesApi';
import { useGetCategoriasQuery } from '../../features/categorias/categoriasApi';
import { useGetSubcategoriasQuery } from '../../features/subcategorias/subcategoriasApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import Loading from '../ui/Loading';

const PaquetesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaquete, setEditingPaquete] = useState(null);
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
      precio: '', // opcional
      campoVariable: '',
      moneda: '', // opcional
      categoriaId: '',
      subcategoriaId: '',
      tags: '',
    });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { data: paquetes = [], isLoading } = useGetPaquetesQuery();
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: subcategorias = [] } = useGetSubcategoriasQuery();
  const [createPaquete, { isLoading: isCreating }] = useCreatePaqueteMutation();
  const [updatePaquete, { isLoading: isUpdating }] = useUpdatePaqueteMutation();
  const [deletePaquete] = useDeletePaqueteMutation();

  const handleOpenModal = (paquete = null) => {
    if (paquete) {
      setEditingPaquete(paquete);
      setFormData({
        nombre: paquete.nombre || '',
        descripcion: paquete.descripcion || '',
        precio: (paquete.precio === null || paquete.precio === undefined) ? '' : paquete.precio,
        categoriaId: paquete.categoriaId || '',
        subcategoriaId: paquete.subcategoriaId || '',
        campoVariable: paquete.campoVariable || '',
        moneda: paquete.moneda || '',
      });
      setExistingImages(paquete.imagenes || []);
      setPreviewImages([]);
    } else {
      setEditingPaquete(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoriaId: '',
        subcategoriaId: '',
        campoVariable: '',
    moneda: '',
      });
      setExistingImages([]);
      setPreviewImages([]);
    }
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaquete(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoriaId: '',
      subcategoriaId: '',
      campoVariable: '',
    });
    setSelectedImages([]);
    setPreviewImages([]);
    setExistingImages([]);
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setSelectedImages(files);

    // Crear previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
  };

  const removePreviewImage = (index, isExisting = false) => {
    if (isExisting) {
      // Remover de imágenes existentes
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remover de imágenes nuevas (previews)
      const newSelectedImages = [...selectedImages];
      newSelectedImages.splice(index, 1);
      setSelectedImages(newSelectedImages);

      const newPreviewImages = [...previewImages];
      newPreviewImages.splice(index, 1);
      setPreviewImages(newPreviewImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    // Solo agregar los campos realmente válidos y no duplicar precio/moneda
    Object.keys(formData).forEach(key => {
      if (key === 'precio') {
        if (formData.precio !== '' && formData.precio !== null && formData.precio !== undefined) {
          formDataToSend.append('precio', formData.precio);
        }
        // Si está vacío, no lo agregamos
      } else if (key === 'moneda') {
        if (formData.moneda !== '' && formData.moneda !== null && formData.moneda !== undefined) {
          formDataToSend.append('moneda', formData.moneda);
        }
        // Si está vacío, no lo agregamos
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    selectedImages.forEach((image) => {
      formDataToSend.append('imagenes', image);
    });

    // Si estamos editando, enviamos solo las imágenes existentes que se mantienen
    if (editingPaquete && existingImages.length > 0) {
      formDataToSend.append('imagenesExistentes', JSON.stringify(existingImages));
    }

    try {
      if (editingPaquete) {
        await updatePaquete({
          id: editingPaquete.id,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createPaquete(formDataToSend).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar paquete:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      try {
        await deletePaquete(id).unwrap();
      } catch (error) {
        console.error('Error al eliminar paquete:', error);
      }
    }
  };

  const filteredSubcategorias = subcategorias.filter(
    sub => sub.categoriaId === parseInt(formData.categoriaId)
  );

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Paquetes Turísticos</h2>
          <p className="text-gray-600">Administra la oferta de paquetes turísticos</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Paquete
        </Button>
      </div>

      {/* Lista de paquetes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paquetes.map((paquete) => (
          <div key={paquete.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {paquete.imagenes && paquete.imagenes.length > 0 ? (
                <img
                  src={paquete.imagenes[0]}
                  alt={paquete.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PhotoIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {paquete.nombre}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {paquete.descripcion}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-green-600">
                  {paquete.precio !== null && paquete.precio !== undefined && paquete.precio !== '' && Number(paquete.precio) > 0 ? (
                    <>
                      {paquete.moneda === 'USD' ? 'US$' : paquete.moneda === 'ARS' ? '$' : ''}{paquete.precio}
                      {paquete.moneda ? (
                        <span className="ml-1 text-base text-gray-500">{paquete.moneda}</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-base text-gray-400">Sin precio</span>
                  )}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {paquete.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(paquete)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(paquete.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPaquete ? 'Editar Paquete Turístico' : 'Nuevo Paquete Turístico'}
              </h3>
              <button
                onClick={() => handleCloseModal()}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.precio === null || formData.precio === undefined ? '' : formData.precio}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === null) {
                        setFormData({ ...formData, precio: '', moneda: '' });
                      } else {
                        setFormData({ ...formData, precio: value });
                      }
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.moneda || ''}
                    onChange={e => setFormData({ ...formData, moneda: e.target.value })}
                    className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ARS">$ ARS</option>
                    <option value="USD">US$ USD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value, subcategoriaId: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoría *
                  </label>
                  <select
                    value={formData.subcategoriaId}
                    onChange={(e) => setFormData({ ...formData, subcategoriaId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.categoriaId}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {filteredSubcategorias.map((subcategoria) => (
                      <option key={subcategoria.id} value={subcategoria.id}>
                        {subcategoria.nombre}
                      </option>
                    ))}
                  </select>
                  {!formData.categoriaId && (
                    <p className="text-sm text-gray-500 mt-1">Primero selecciona una categoría</p>
                  )}
                  {formData.categoriaId && filteredSubcategorias.length === 0 && (
                    <p className="text-sm text-yellow-600 mt-1">No hay subcategorías para esta categoría</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *  (usa punto para separar renglones)
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ejemplo: Primer punto (15 Dias y 14 Noches). Segundo punto ( se muestra debajo de 15 dias 14 noches). "
                  required
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Que incluye?  (usa punto para separar renglones)
              </label>
              <textarea
                value={formData.campoVariable}
                onChange={e => setFormData({ ...formData, campoVariable: e.target.value })}
                rows={3}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ejemplo: Primer punto. Segundo punto. Tercer punto."
              />
              <div className="mt-1 text-xs text-gray-500">
                Escribe los renglones separados por punto (.). Al mostrar, cada línea inicia con un punto.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imágenes
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Preview de imágenes existentes */}
                {existingImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((image, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={image}
                            alt={`Existing ${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index, true)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview de imágenes nuevas */}
                {previewImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {previewImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={image}
                            alt={`New Preview ${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index, false)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    : editingPaquete
                      ? 'Actualizar Paquete'
                      : 'Crear Paquete'
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

export default PaquetesManager;
