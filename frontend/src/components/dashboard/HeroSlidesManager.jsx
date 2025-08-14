import { useState } from 'react';
import {
  useGetAllHeroSlidesQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useToggleHeroSlideActiveMutation,
} from '../../features/heroSlides/heroSlidesApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import Loading from '../ui/Loading';

const HeroSlidesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Más info',
    buttonLink: '#servicios',
    mediaType: 'image',
    order: 0,
  });
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [previewMedia, setPreviewMedia] = useState('');
  const [previewPoster, setPreviewPoster] = useState('');

  const { data: slides = [], isLoading } = useGetAllHeroSlidesQuery();
  const [createSlide, { isLoading: isCreating }] = useCreateHeroSlideMutation();
  const [updateSlide, { isLoading: isUpdating }] = useUpdateHeroSlideMutation();
  const [deleteSlide] = useDeleteHeroSlideMutation();
  const [toggleActive] = useToggleHeroSlideActiveMutation();

  const handleOpenModal = (slide = null) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        buttonText: slide.buttonText || 'Más info',
        buttonLink: slide.buttonLink || '#servicios',
        mediaType: slide.mediaType || 'image',
        order: slide.order || 0,
      });
      setPreviewMedia(slide.mediaUrl || '');
      setPreviewPoster(slide.posterUrl || '');
    } else {
      setEditingSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        buttonText: 'Más info',
        buttonLink: '#servicios',
        mediaType: 'image',
        order: slides.length,
      });
      setPreviewMedia('');
      setPreviewPoster('');
    }
    setSelectedMedia(null);
    setSelectedPoster(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      buttonText: 'Más info',
      buttonLink: '#servicios',
      mediaType: 'image',
      order: 0,
    });
    setSelectedMedia(null);
    setSelectedPoster(null);
    setPreviewMedia('');
    setPreviewPoster('');
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      setPreviewMedia(URL.createObjectURL(file));
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPoster(file);
      setPreviewPoster(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (selectedMedia) {
      formDataToSend.append('media', selectedMedia);
    }
    
    if (selectedPoster) {
      formDataToSend.append('poster', selectedPoster);
    }

    try {
      if (editingSlide) {
        await updateSlide({
          id: editingSlide.id,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createSlide(formDataToSend).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar slide:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este slide?')) {
      try {
        await deleteSlide(id).unwrap();
      } catch (error) {
        console.error('Error al eliminar slide:', error);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleActive(id).unwrap();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Hero Slides</h2>
          <p className="text-gray-600">Administra las imágenes y videos del carousel principal</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Slide
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Slides ({slides.length})
          </h3>
        </div>
        
        {slides.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No hay slides disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slide
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img
                            className="h-16 w-24 object-cover rounded"
                            src={slide.posterUrl || slide.mediaUrl}
                            alt={slide.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {slide.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slide.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {slide.mediaType === 'video' ? (
                          <VideoCameraIcon className="h-5 w-5 text-purple-500 mr-2" />
                        ) : (
                          <PhotoIcon className="h-5 w-5 text-blue-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900 capitalize">
                          {slide.mediaType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(slide.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          slide.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {slide.isActive ? (
                          <>
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="h-3 w-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slide.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(slide)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Media
                  </label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlace del Botón
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#servicios"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.mediaType === 'video' ? 'Video' : 'Imagen'} Principal
                </label>
                <input
                  type="file"
                  accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleMediaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewMedia && (
                  <div className="mt-2">
                    {formData.mediaType === 'video' ? (
                      <video
                        src={previewMedia}
                        className="w-full h-32 object-cover rounded border"
                        controls
                      />
                    ) : (
                      <img
                        src={previewMedia}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                )}
              </div>

              {formData.mediaType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen de Portada (Poster)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {previewPoster && (
                    <div className="mt-2">
                      <img
                        src={previewPoster}
                        alt="Poster Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              )}

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
                    : editingSlide
                    ? 'Actualizar Slide'
                    : 'Crear Slide'
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

export default HeroSlidesManager;
