import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';

const PackagesSection = ({ selectedFilter }) => {
  const navigate = useNavigate();
  const { data: allPaquetes = [], isLoading: paquetesLoading } = useGetPaquetesQuery();

  // Filtrar paquetes según el filtro seleccionado
  const filteredPaquetes = allPaquetes.filter(paquete => {
    if (selectedFilter === 'todos') return true;
    if (selectedFilter === 'premium') return paquete.Categorium?.nombre?.toLowerCase() === 'premium';
    if (selectedFilter === 'nacionales') return paquete.Categorium?.nombre?.toLowerCase() === 'nacionales';
    if (selectedFilter === 'internacionales') return paquete.Categorium?.nombre?.toLowerCase() === 'internacionales';
    return true;
  });

  // Agrupar paquetes por categoría y subcategoría
  const paquetesAgrupados = {};
  
  filteredPaquetes.forEach(paquete => {
    const categoriaNombre = paquete.Categorium?.nombre || 'Sin categoría';
    const subcategoriaNombre = paquete.Subcategorium?.nombre || 'Sin subcategoría';
    
    if (!paquetesAgrupados[categoriaNombre]) {
      paquetesAgrupados[categoriaNombre] = {};
    }
    
    if (!paquetesAgrupados[categoriaNombre][subcategoriaNombre]) {
      paquetesAgrupados[categoriaNombre][subcategoriaNombre] = [];
    }
    
    paquetesAgrupados[categoriaNombre][subcategoriaNombre].push(paquete);
  });

  const scroll = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 280; // Ancho de una tarjeta cuadrada + gap
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (paquetesLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiendamas-brown"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="paquetes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {Object.entries(paquetesAgrupados).map(([categoriaNombre, subcategorias]) => (
          <div key={categoriaNombre} className="mb-16">
            {/* Título de categoría con el estilo exacto de la imagen */}
            <div className="relative mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="bg-kiendamas-beige rounded-r-3xl pl-4 sm:pl-6 lg:pl-8 pr-12 py-4 max-w-md">
                <h2 className="text-3xl font-normal text-kiendamas-text font-raleway leading-none">
                  Paquetes {categoriaNombre}
                </h2>
              </div>
            </div>

            {/* Subcategorías */}
            {Object.entries(subcategorias).map(([subcategoriaNombre, paquetes]) => (
              <div key={subcategoriaNombre} className="mb-12">
                {/* Título de subcategoría */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 font-raleway pl-4">
                    {subcategoriaNombre}
                  </h3>
                  
                  {/* Controles de navegación */}
                  {paquetes.length > 4 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => scroll(`carousel-${categoriaNombre}-${subcategoriaNombre}`, 'left')}
                        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-primary"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => scroll(`carousel-${categoriaNombre}-${subcategoriaNombre}`, 'right')}
                        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-primary"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Carousel de paquetes con diseño cuadrado */}
                <div className="relative">
                  <div
                    id={`carousel-${categoriaNombre}-${subcategoriaNombre}`}
                    className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {paquetes.map((paquete) => (
                      <div
                        key={paquete.id}
                        className="flex-none w-64 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Imagen cuadrada del paquete */}
                        <div className="relative w-full h-64 overflow-hidden">
                          <img
                            src={paquete.imagenes?.[0] || '/placeholder-travel.jpg'}
                            alt={paquete.nombre}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f3f4f6'/%3E%3Ctext x='128' y='128' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>

                        {/* Contenido de la tarjeta rectangular */}
                        <div className="p-4">
                          {/* Nombre del paquete */}
                          <h4 className="text-lg font-bold text-kiendamas-text mb-2 font-raleway">
                            {paquete.nombre}
                          </h4>
                          
                          {/* Precio */}
                          <div className="mb-4">
                            <span className="text-lg font-bold text-kiendamas-text font-raleway">
                              {formatPrice(paquete.precio)}
                            </span>
                          </div>

                          {/* Botón Más info */}
                          <button 
                            onClick={() => navigate(`/paquete/${paquete.id}`)}
                            className="w-full border-2 border-kiendamas-brown text-kiendamas-brown hover:bg-kiendamas-brown rounded-full hover:text-white py-2 px-4 transition-all duration-200 font-medium font-raleway"
                          >
                            Más info
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {Object.keys(paquetesAgrupados).length === 0 && (
          <div className="text-center py-12">
            <p className="text-kiendamas-text text-lg font-raleway">
              No hay paquetes disponibles para el filtro "{selectedFilter}".
            </p>
          </div>
        )}
      </div>
      
      {/* Estilos para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default PackagesSection;
