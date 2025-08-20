// Card de placeholder visual igual a la real, con mensaje "Próximamente un nuevo destino"
const PlaceholderCard = () => (
  <div className="package-card shrink-0 bg-white shadow-md border border-[#f3f3f3] overflow-hidden p-0 w-[85vw] max-w-xs sm:w-[180px] md:w-[210px] lg:w-[220px] xl:w-[240px] snap-center flex flex-col">
    <div className="w-full aspect-[4/5] min-h-[140px] max-h-[220px] sm:h-32 md:h-36 lg:h-40 overflow-hidden flex items-center justify-center bg-gray-200">
      <span className="text-gray-400 text-lg font-semibold font-raleway text-center px-2">Próximamente un nuevo destino</span>
    </div>
    <div className="flex flex-col flex-1 px-3 py-2 sm:px-2 sm:py-1 justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-kiendamas-text font-raleway truncate mr-1 opacity-50">---</h4>
          <span className="text-sm font-bold text-kiendamas-text font-raleway whitespace-nowrap opacity-50">---</span>
        </div>
        <div className="text-xs text-kiendamas-text font-raleway leading-snug break-words whitespace-normal opacity-50">
          ¡Muy pronto más opciones!
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="border border-[#FF625E] text-gray-400 px-3 py-1 bg-white rounded-full cursor-not-allowed opacity-50 text-xs"
          disabled
        >
          Más info
        </button>
      </div>
    </div>
  </div>
);
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import { useState, useEffect, useRef } from 'react';

const PackageCard = ({ paquete, formatPrice, navigate }) => (
  <div className="package-card shrink-0 bg-white shadow-md border border-[#f3f3f3] overflow-hidden p-0 w-[85vw] max-w-xs sm:w-[180px] md:w-[210px] lg:w-[220px] xl:w-[240px] snap-center flex flex-col">
    <div className="w-full aspect-[4/5] min-h-[140px] max-h-[220px] sm:h-32 md:h-36 lg:h-40 overflow-hidden">
      <img
        src={paquete.imagenes?.[0] || '/placeholder-travel.jpg'}
        alt={paquete.nombre}
        className="w-full h-full p-1 object-cover"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f3f4f6'/%3E%3Ctext x='128' y='128' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>

    <div className="flex flex-col flex-1 px-3 py-2 sm:px-2 sm:py-1 justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-kiendamas-text font-raleway truncate mr-1">
            {paquete.nombre.charAt(0).toUpperCase() + paquete.nombre.slice(1).toLowerCase()}
          </h4>
          <span className="text-sm font-bold text-kiendamas-text font-raleway whitespace-nowrap">
            {formatPrice(paquete.precio)}
          </span>
        </div>
        <div className="text-xs text-kiendamas-text font-raleway leading-snug break-words whitespace-normal">
          {(() => {
            if (!paquete.descripcion) return null;
            const primerPunto = paquete.descripcion.indexOf(".");
            return primerPunto !== -1
              ? paquete.descripcion.slice(0, primerPunto + 1)
              : paquete.descripcion;
          })()}
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => navigate(`/paquete/${paquete.id}`)}
          className="border border-[#FF625E] text-gray-800 px-3 py-1 bg-white rounded-full hover:bg-[#FF625E] hover:text-white transition text-xs"
        >
          Más info
        </button>
      </div>
    </div>
  </div>
);


import { useCallback } from 'react';

const PackagesSection = ({ selectedFilter }) => {
  const navigate = useNavigate();
  const { data: allPaquetes = [], isLoading: paquetesLoading } = useGetPaquetesQuery();
  const [cardsPerView, setCardsPerView] = useState(3);
  const [carouselIndexes, setCarouselIndexes] = useState({}); // { [carouselId]: index }

  // Responsive cards per view
  const updateCardsPerView = useCallback(() => {
    if (window.innerWidth < 640) setCardsPerView(1);
    else if (window.innerWidth < 1024) setCardsPerView(2);
    else setCardsPerView(3);
  }, []);

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [updateCardsPerView]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(price);

  // Mostrar siempre todos los paquetes, sin filtrar por categoría
  const filteredPaquetes = allPaquetes;

  const categoriasOrden = [
    { nombre: 'Premium', sectionBg: 'bg-white', tituloBg: 'bg-kiendamas-beige' },
    { nombre: 'Nacionales', sectionBg: 'bg-[#3071CD]', tituloBg: 'bg-white' },
    { nombre: 'Internacionales', sectionBg: 'bg-[#F2E2CE]', tituloBg: 'bg-white' },
  ];

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

  // Carousel navigation
  const handleCarouselNav = (carouselId, direction, total) => {
    setCarouselIndexes((prev) => {
      const current = prev[carouselId] || 0;
      let next;
      if (direction === 'right') {
        next = current + cardsPerView;
        if (next >= total) next = 0;
      } else {
        next = current - cardsPerView;
        if (next < 0) next = Math.max(0, total - cardsPerView);
      }
      return { ...prev, [carouselId]: next };
    });
  };

  if (paquetesLoading) {
    return (
      <div className="py-16 bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiendamas-brown"></div>
      </div>
    );
  }

  return (
    <section id="paquetes" className="w-full m-0 p-0">
      {/* No fondo ni padding aquí, el fondo va en cada sección de categoría */}
      {categoriasOrden.map(({ nombre: categoriaNombre, sectionBg, tituloBg }) => {
        const subcategorias = paquetesAgrupados[categoriaNombre];
        if (!subcategorias || Object.values(subcategorias).flat().length === 0) return null;

        return (
          <section
            key={categoriaNombre}
            id={`categoria-${categoriaNombre.toLowerCase()}`}
            className={`w-full ${sectionBg} py-16`}
          >
            {/* Título alineado al sidebar */}
            <div className="relative mb-10">
              <div className={`${tituloBg} rounded-r-3xl pl-4 sm:pl-6 pr-8 py-3 max-w-xs sm:max-w-md shadow-[0_4px_24px_0_#89898930] border border-[#89898930]`}>
                <h2 className="font-raleway font-normal text-xl sm:text-2xl xl:text-2xl 2xl:text-3xl text-[#646464]">
                  Paquetes {categoriaNombre}
                </h2>
              </div>
            </div>

            {/* Contenido interno centrado y limitado en ancho */}
            <div className="w-full max-w-7xl mx-auto px-0 sm:px-2 md:px-4 lg:px-8">
              {Object.entries(subcategorias).map(([subcategoriaNombre, paquetes]) => {
                if (!paquetes || paquetes.length === 0) return null;
                const carouselId = `carousel-${categoriaNombre}-${subcategoriaNombre}`;
                // Eliminar declaración anterior de showCarousel (si existe)
                const startIdx = carouselIndexes[carouselId] || 0;
                const endIdx = Math.min(startIdx + cardsPerView, paquetes.length);
                // Siempre formar el carrusel: rellenar con placeholders hasta tener al menos 3 cards
                let allCards = [...paquetes];
                while (allCards.length < 3) {
                  allCards.push({ placeholder: true, key: `placeholder-${allCards.length}` });
                }
                const total = allCards.length;
                const showCarousel = total >= cardsPerView;
                const realStartIdx = carouselIndexes[carouselId] || 0;
                const realEndIdx = Math.min(realStartIdx + cardsPerView, total);
                const visiblePaquetes = allCards.slice(realStartIdx, realEndIdx).map((p, idx) =>
                  p.placeholder
                    ? <PlaceholderCard key={p.key} />
                    : <PackageCard key={p.id} paquete={p} formatPrice={formatPrice} navigate={navigate} />
                );

                // Padding izquierdo igual para subtítulo y cards, siempre
                const leftPad = 'pl-0 sm:pl-2 md:pl-8 lg:pl-16';
                return (
                  <div key={subcategoriaNombre} className="mt-4 mb-0 relative">
                    <div className="flex flex-col w-full">
                      <div className={`flex items-center mb-6 ${leftPad}`}>
                        <h3 className={`text-base sm:text-lg lg:text-base xl:text-lg font-semibold font-raleway ${categoriaNombre === 'Nacionales' ? 'text-white' : 'text-gray-600'}`}> 
                          {subcategoriaNombre.charAt(0).toUpperCase() + subcategoriaNombre.slice(1).toLowerCase()}
                        </h3>
                      </div>
                      <div className={`relative w-full flex items-center ${leftPad}`}>
                        {showCarousel && (
                          <>
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'left', paquetes.length)}
                              className="flex items-center justify-center absolute left-0 md:left-4 lg:left-6 xl:left-10 top-1/2 -translate-y-1/2 p-2 sm:p-1 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10"
                            >
                              <ChevronLeftIcon className="h-5 w-5 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'right', paquetes.length)}
                              className="flex items-center justify-center absolute right-0 md:right-4 lg:right-6 xl:right-10 top-1/2 -translate-y-1/2 p-2 sm:p-1 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10"
                            >
                              <ChevronRightIcon className="h-5 w-5 sm:h-4 sm:w-4" />
                            </button>
                          </>
                        )}
                        <div
                          className={`w-full flex items-stretch overflow-hidden ${showCarousel ? '' : 'justify-start'}`}
                        >
                          <div
                            data-track
                            className={`flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-1 w-full ${showCarousel ? 'justify-center' : 'justify-start'}`}
                          >
                            {visiblePaquetes}
                          </div>
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
      {categoriasOrden.every(({ nombre }) => {
        const subcats = paquetesAgrupados[nombre];
        return !subcats || Object.values(subcats).flat().length === 0;
      }) && (
        <div className="text-center py-12">
          <p className="text-kiendamas-text text-lg font-raleway">No hay paquetes disponibles.</p>
        </div>
      )}
    </section>
  );
};

export default PackagesSection;
