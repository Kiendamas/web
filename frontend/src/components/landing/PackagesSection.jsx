import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import { useState, useEffect, useCallback } from 'react';

// Card real
const PackageCard = ({ paquete, formatPrice, navigate }) => (
  <div className="package-card shrink-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden w-full max-w-[260px] snap-center flex flex-col">
    <div className="w-full p-1 aspect-[4/3] overflow-hidden flex items-center justify-center bg-white">
      <img
        src={paquete.imagenes?.[0] || '/placeholder-travel.jpg'}
        alt={paquete.nombre}
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f3f4f6'/%3E%3Ctext x='128' y='128' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>

    <div className="flex flex-col flex-1 px-4 py-3 justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-kiendamas-text font-raleway truncate mr-1">
            {paquete.nombre.charAt(0).toUpperCase() + paquete.nombre.slice(1).toLowerCase()}
          </h4>
          <span className="text-sm font-bold text-kiendamas-text font-raleway whitespace-nowrap">
            {formatPrice(paquete.precio)}
          </span>
        </div>
        <div className="text-xs text-kiendamas-text font-raleway leading-snug break-words whitespace-normal line-clamp-2 max-h-[2.5em] overflow-hidden">
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
          className="border border-[#FF625E] text-gray-700 px-3 py-1 bg-white rounded-full hover:bg-[#FF625E] hover:text-white transition text-xs"
        >
          Más info
        </button>
      </div>
    </div>
  </div>
);

// Card de placeholder
const PlaceholderCard = () => (
  <div className="package-card shrink-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden w-full max-w-[260px] snap-center flex flex-col">
    <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-200">
      <span className="text-gray-400 text-lg font-semibold font-raleway text-center px-2">
        Próximamente un nuevo destino
      </span>
    </div>
    <div className="flex flex-col flex-1 px-4 py-3 justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-gray-400 font-raleway truncate mr-1">---</h4>
          <span className="text-sm font-bold text-gray-400 font-raleway whitespace-nowrap">---</span>
        </div>
        <div className="text-xs text-gray-400 font-raleway leading-snug line-clamp-2 max-h-[2.5em] overflow-hidden">
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

const PackagesSection = ({ selectedFilter }) => {
  const navigate = useNavigate();
  const { data: allPaquetes = [], isLoading: paquetesLoading } = useGetPaquetesQuery();
  const [cardsPerView, setCardsPerView] = useState(3);
  const [carouselIndexes, setCarouselIndexes] = useState({});

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
      {categoriasOrden.map(({ nombre: categoriaNombre, sectionBg, tituloBg }) => {
        const subcategorias = paquetesAgrupados[categoriaNombre];
        if (!subcategorias || Object.values(subcategorias).flat().length === 0) return null;

        return (
          <section
            key={categoriaNombre}
            id={`categoria-${categoriaNombre.toLowerCase()}`}
            className={`w-full ${sectionBg} py-16`}
          >
            {/* Título principal de categoría */}
            <div className="relative mb-10">
              <div
                className={`${tituloBg} rounded-r-3xl pl-4 sm:pl-6 pr-8 py-3 max-w-xs sm:max-w-md shadow-[0_4px_24px_0_#89898930] border border-[#89898930]`}
              >
                <h2 className="font-raleway font-normal text-xl sm:text-2xl text-[#646464]">
                  Paquetes {categoriaNombre}
                </h2>
              </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-0 sm:px-2 md:px-4 lg:px-8">
              {Object.entries(subcategorias).map(([subcategoriaNombre, paquetes]) => {
                if (!paquetes || paquetes.length === 0) return null;
                const carouselId = `carousel-${categoriaNombre}-${subcategoriaNombre}`;
                const startIdx = carouselIndexes[carouselId] || 0;
                let allCards = [...paquetes];
                while (allCards.length < 3) {
                  allCards.push({ placeholder: true, key: `placeholder-${allCards.length}` });
                }
                const total = allCards.length;
                const showCarousel = total >= cardsPerView;
                const realEndIdx = Math.min(startIdx + cardsPerView, total);
                const visiblePaquetes = allCards.slice(startIdx, realEndIdx).map((p, idx) =>
                  p.placeholder ? (
                    <PlaceholderCard key={p.key} />
                  ) : (
                    <PackageCard
                      key={p.id}
                      paquete={p}
                      formatPrice={formatPrice}
                      navigate={navigate}
                    />
                  )
                );

                return (
                  <div key={subcategoriaNombre} className="mt-4 mb-0">
                    {/* Wrapper centrado para subtítulo y carrusel */}
                    <div
                      className="flex flex-col items-start mx-auto"
                      style={{
                        maxWidth: `calc(${cardsPerView} * 260px + ${(cardsPerView - 1) * 32}px)`
                      }}
                    >
                      {/* Subcategoría alineada sobre la primer card */}
                      <div className="mb-2">
                        <h3
                          className={`text-base sm:text-lg font-semibold font-raleway ${
                            categoriaNombre === 'Nacionales' ? 'text-white' : 'text-kiendamas-text'
                          }`}
                          style={{ marginLeft: 0 }}
                        >
                          {subcategoriaNombre.charAt(0).toUpperCase() +
                            subcategoriaNombre.slice(1).toLowerCase()}
                        </h3>
                      </div>

                      {/* Carrusel */}
                      <div className="relative w-full flex items-center">
                        {showCarousel && (
                          <>
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'left', paquetes.length)}
                              className="flex items-center justify-center absolute -left-10 sm:-left-10 md:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10"
                            >
                              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'right', paquetes.length)}
                              className="flex items-center justify-center absolute -right-10 sm:-right-10 md:-right-12 lg:-right-14 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10"
                            >
                              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </>
                        )}

                        <div className={`flex items-stretch w-full ${cardsPerView === 1 ? '' : 'overflow-x-auto scrollbar-hide'}`}>
                          <div className={`flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 py-1 justify-start min-w-fit w-full ${cardsPerView === 1 ? 'flex-col' : ''}`}>
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
    </section>
  );
};

export default PackagesSection;
