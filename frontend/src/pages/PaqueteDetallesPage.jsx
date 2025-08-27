import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useGetPaqueteByIdQuery } from '../features/paquetes/paquetesApi';
import Loading from '../components/ui/Loading';

const PaqueteDetallesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: paquete, isLoading, error } = useGetPaqueteByIdQuery(id);
  
  const [activeTab, setActiveTab] = useState('descripcion');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (paquete?.imagenes?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === paquete.imagenes.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [paquete?.imagenes?.length]);

  const nextImage = () => {
    if (paquete?.imagenes?.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === paquete.imagenes.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (paquete?.imagenes?.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? paquete.imagenes.length - 1 : prevIndex - 1
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleWhatsAppContact = () => {
    const message = `Hola! Me interesa el paquete "${paquete.nombre}" por ${formatPrice(paquete.precio)}. ¿Podrían darme más información?`;
    const phoneNumber = "5493512345678"; // Reemplazar con el número real de WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (isLoading) return <Loading />;
  
  if (error || !paquete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Paquete no encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="text-kiendamas-brown hover:text-kiendamas-dark-brown"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de cerrar */}
      <div className="bg-kiendamas-cream shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-kiendamas-text font-raleway uppercase">
              {paquete.nombre}
            </h1>
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sección de imagen - Ocupa la mitad izquierda, sin recorte */}
            <div className="lg:w-1/2 w-full flex items-center justify-center bg-white">
              <div className="relative w-full h-64 lg:h-[32rem] flex items-center justify-center">
                {paquete.imagenes && paquete.imagenes.length > 0 ? (
                  <>
                    <img
                      src={paquete.imagenes[currentImageIndex]}
                      alt={`${paquete.nombre} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {paquete.imagenes.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-all"
                        >
                          <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-all"
                        >
                          <ChevronRightIcon className="h-4 w-4 text-gray-700" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                          {paquete.imagenes.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">No hay imágenes disponibles</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de contenido */}
            <div className="lg:w-1/2 w-full p-6 flex flex-col justify-between">
              {/* Pestañas */}
              <div className="mb-4">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('descripcion')}
                    className={`px-4 py-2 font-medium font-raleway transition-colors border-b-2 ${
                      activeTab === 'descripcion'
                        ? 'border-kiendamas-coral text-kiendamas-coral'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Descripción
                  </button>
                  <button
                    onClick={() => setActiveTab('incluye')}
                    className={`px-4 py-2 font-medium font-raleway transition-colors border-b-2 ${
                      activeTab === 'incluye'
                        ? 'border-kiendamas-coral text-kiendamas-coral'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Qué Incluye
                  </button>
                </div>
              </div>

              {/* Contenido de las pestañas */}
              <div className="min-h-[250px] mb-6">
                {activeTab === 'descripcion' && (
                  <div className="text-gray-700 leading-relaxed font-raleway text-sm break-words flex flex-col">
                    {/* Mostrar cada punto en un renglón, mayúscula inicial. Si no hay punto, solo un renglón que hace wrap */}
                    {paquete.descripcion
                      ? (() => {
                          const frases = paquete.descripcion.split('.').filter(f => f.trim().length > 0);
                          if (frases.length === 0) {
                            return <span>{paquete.descripcion.trim().charAt(0).toUpperCase() + paquete.descripcion.trim().slice(1)}</span>;
                          } else {
                            return frases.map((frase, idx, arr) => (
                              <span key={idx} style={{ marginBottom: idx < arr.length - 1 ? 2 : 0, wordBreak: 'break-word' }}>
                                {frase.trim().charAt(0).toUpperCase() + frase.trim().slice(1)}{idx < arr.length - 1 ? '.' : ''}
                              </span>
                            ));
                          }
                        })()
                      : 'Sin descripción disponible.'}
                  </div>
                )}
                
                {activeTab === 'incluye' && (
                  <div className="space-y-4">
                    {/* Título de sección como en la imagen */}
                    <div className="bg-kiendamas-beige p-3 rounded">
                      <h3 className="font-bold text-kiendamas-text text-sm font-raleway uppercase tracking-wide">
                        DESCRIPCIÓN
                      </h3>
                    </div>
                    {/* Contenido de qué incluye */}
                    <div className="text-gray-700 leading-relaxed font-raleway text-sm flex flex-col">
                      {paquete.campoVariable ? (
                        (() => {
                          const frases = paquete.campoVariable.split('.').filter(f => f.trim().length > 0);
                          if (frases.length === 0) {
                            return <span>{paquete.campoVariable.trim().charAt(0).toUpperCase() + paquete.campoVariable.trim().slice(1)}</span>;
                          } else {
                            return frases.map((frase, idx, arr) => (
                              <span key={idx} style={{ marginBottom: idx < arr.length - 1 ? 2 : 0, wordBreak: 'break-word' }}>
                                {frase.trim().charAt(0).toUpperCase() + frase.trim().slice(1)}{idx < arr.length - 1 ? '.' : ''}
                              </span>
                            ));
                          }
                        })()
                      ) : (
                        'No hay información sobre qué incluye este paquete.'
                      )}
                    </div>

                    {/* Sección de beneficios premium si existe información adicional */}
                    {(paquete.duracion || paquete.fechas_disponibles) && (
                      <>
                        <div className="bg-kiendamas-beige p-3 rounded mt-4">
                          <h3 className="font-bold text-kiendamas-text text-sm font-raleway uppercase tracking-wide">
                            BENEFICIOS PREMIUM
                          </h3>
                        </div>
                        <div className="text-gray-700 leading-relaxed font-raleway text-sm space-y-1">
                          {paquete.duracion && (
                            <div>• Duración: {paquete.duracion}</div>
                          )}
                          {paquete.fechas_disponibles && (
                            <div>• Fechas disponibles: {paquete.fechas_disponibles}</div>
                          )}
                          <div>• Asistencia personalizada antes y durante tu viaje</div>
                          <div>• Prioridad en reservas de experiencias y restaurantes</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Precio debajo de la descripción */}
              <div className="mb-4">
                <span className="inline-block text-lg font-bold text-green-700 bg-green-50 rounded px-3 py-1 mt-2">
                  {paquete.precio !== null && paquete.precio !== undefined && paquete.precio !== '' && Number(paquete.precio) > 0
                    ? (
                        <>
                          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: paquete.moneda || 'ARS' }).format(paquete.precio)}
                          <span className="ml-2 text-base text-gray-500">{paquete.moneda || 'ARS'}</span>
                        </>
                      )
                    : 'Consultar Precio'}
                </span>
              </div>
              {/* Botón de contratar */}
              <button
                onClick={handleWhatsAppContact}
                className="w-1/2 bg-kiendamas-brown text-white py-3 px-6 rounded-full hover:bg-kiendamas-dark-brown transition-all duration-200 font-medium font-raleway shadow-lg hover:shadow-xl"
              >
                Contratar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaqueteDetallesPage;
