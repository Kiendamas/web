import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';

const PackageCard = ({ paquete, formatPrice, navigate }) => (
  <div
    className="package-card p-1 shrink-0 w-[280px] sm:w-[300px] md:w-[340px] bg-white shadow-md border border-[#f3f3f3] overflow-hidden"
  >
    {/* Imagen */}
    <div className="w-full h-44 overflow-hidden">
      <img
        src={paquete.imagenes?.[0] || '/placeholder-travel.jpg'}
        alt={paquete.nombre}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f3f4f6'/%3E%3Ctext x='128' y='128' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>

    {/* Contenido */}
    <div className="flex flex-col px-3 py-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-base font-semibold text-gray-800 font-raleway truncate mr-2">
          {paquete.nombre}
        </h4>
        <span className="text-base font-bold text-gray-800 font-raleway whitespace-nowrap">
          {formatPrice(paquete.precio)}
        </span>
      </div>

      <div className="text-xs text-gray-600 font-raleway leading-snug whitespace-normal break-words">
        {(() => {
          if (!paquete.descripcion) return null;
          const primerPunto = paquete.descripcion.indexOf(".");
          return primerPunto !== -1
            ? paquete.descripcion.slice(0, primerPunto + 1) // incluye el punto
            : paquete.descripcion;
        })()}
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => navigate(`/paquete/${paquete.id}`)}
          className="border border-[#FF625E] text-gray-800 px-4 py-1 bg-white rounded-full hover:bg-[#FF625E] hover:text-white transition text-xs"
        >
          Más info
        </button>
      </div>
    </div>
  </div>
);

const PackagesSection = ({ selectedFilter }) => {
  const navigate = useNavigate();
  const { data: allPaquetes = [], isLoading: paquetesLoading } = useGetPaquetesQuery();

  // Formato de precio
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(price);

  // Filtrar por categoría seleccionada
  const filteredPaquetes = allPaquetes.filter((paquete) => {
    const cat = paquete.Categorium?.nombre?.toLowerCase();
    if (selectedFilter === 'premium') return cat === 'premium';
    if (selectedFilter === 'nacionales') return cat === 'nacionales';
    if (selectedFilter === 'internacionales') return cat === 'internacionales';
    return true; // 'todos'
  });

  // Orden de categorías a renderizar
  const categoriasOrden = [
    { nombre: 'Premium', sectionBg: 'bg-white', tituloBg: 'bg-kiendamas-beige' },
    { nombre: 'Nacionales', sectionBg: 'bg-[#3071CD]', tituloBg: 'bg-white' },
    { nombre: 'Internacionales', sectionBg: 'bg-[#F2E2CE]', tituloBg: 'bg-white' },
  ];

  // Agrupar por categoría y subcategoría (usando los filtrados)
  const paquetesAgrupados = { Premium: {}, Nacionales: {}, Internacionales: {} };
  filteredPaquetes.forEach((paquete) => {
    const categoriaNombre = paquete.Categorium?.nombre || 'Sin categoría';
    const subcategoriaNombre = paquete.Subcategorium?.nombre || 'Sin subcategoría';
    if (['Premium', 'Nacionales', 'Internacionales'].includes(categoriaNombre)) {
      if (!paquetesAgrupados[categoriaNombre][subcategoriaNombre]) {
        paquetesAgrupados[categoriaNombre][subcategoriaNombre] = [];
      }
      paquetesAgrupados[categoriaNombre][subcategoriaNombre].push(paquete);
    }
  });

  // Scroll por el ancho de una card + gap (dinámico)
  const scroll = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const track = container.querySelector('[data-track]');
    if (!track) return;
    const firstItem = track.querySelector('.package-card');
    const styles = window.getComputedStyle(track);
    const gap =
      parseInt(styles.columnGap || styles.gap || '24', 10) || 24; // gap-6 ≈ 24px
    const cardWidth = firstItem ? firstItem.getBoundingClientRect().width : 320;
    const amount = cardWidth + gap;
    container.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
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
    <section className="m-0 p-0" id="paquetes">
      <div className="max-w-7xl mx-auto p-0">
        {categoriasOrden.map(({ nombre: categoriaNombre, sectionBg, tituloBg }) => {
          const subcategorias = paquetesAgrupados[categoriaNombre];
          const seccionId = `categoria-${categoriaNombre.toLowerCase()}`;
          if (!subcategorias || Object.values(subcategorias).flat().length === 0) return null;

          return (
            <section key={categoriaNombre} className={`w-full m-0 p-0 ${sectionBg} py-16`} id={seccionId}>
              {/* Título de categoría */}
              <div className="relative mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className={`${tituloBg} rounded-r-3xl pl-4 sm:pl-6 lg:pl-8 pr-12 py-4 max-w-md shadow-[0_4px_24px_0_#89898930] border border-[#89898930]`}>
                  <h2
                    className="font-raleway font-normal"
                    style={{
                      fontSize: '25px',
                      color: '#646464',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      marginLeft: '8px',
                    }}
                  >
                    Paquetes {categoriaNombre}
                  </h2>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-0">
                {Object.entries(subcategorias).map(([subcategoriaNombre, paquetes], idx, arr) => {
                  const carouselId = `carousel-${categoriaNombre}-${subcategoriaNombre}`;
                  if (!paquetes || paquetes.length === 0) return null;

                  return (
                    <div key={subcategoriaNombre} className="mt-4 mb-0">
                      {/* Header subcategoría */}
                      <div className="flex items-center justify-between mb-6 pl-8">
                        <h3 className="text-lg font-semibold text-gray-600 font-raleway">
                          {subcategoriaNombre}
                        </h3>
                      </div>

                      {/* Carrusel */}
                      <div className="relative px-6 md:px-10">
                        {paquetes.length > 3 && (
                          <>
                            <button
                              onClick={() => scroll(carouselId, 'left')}
                              aria-label="Anterior"
                              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-gray-600 z-10"
                            >
                              <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => scroll(carouselId, 'right')}
                              aria-label="Siguiente"
                              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-gray-600 z-10"
                            >
                              <ChevronRightIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        <div
                          id={carouselId}
                          className="overflow-x-auto scrollbar-hide scroll-smooth"
                          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                        >
                          <div
                            data-track
                            className="flex gap-6 py-1 "
                          >
                            {paquetes.map((paquete) => (
                              <PackageCard
                                key={paquete.id}
                                paquete={paquete}
                                formatPrice={formatPrice}
                                navigate={navigate}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Si no hay ningún paquete en ninguna categoría */}
        {categoriasOrden.every(({ nombre }) => {
          const subcats = paquetesAgrupados[nombre];
          return !subcats || Object.values(subcats).flat().length === 0;
        }) && (
            <div className="text-center py-12">
              <p className="text-kiendamas-text text-lg font-raleway">No hay paquetes disponibles.</p>
            </div>
          )}
      </div>

      {/* Estilos para ocultar scrollbar (webkit) */}
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
