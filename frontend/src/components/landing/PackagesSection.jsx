import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import { useState, useEffect, useRef, useCallback } from 'react';
import CategoryTitleAnimated from './CategoryTitleAnimated';

// Card real
const PackageCard = ({ paquete, formatPrice, navigate }) => {
  // Mostrar hasta el primer y segundo punto, cada uno en un renglón
  let renglon1 = '', renglon2 = '';
  if (paquete.descripcion) {
    const puntos = [...paquete.descripcion.matchAll(/\./g)].map(m => m.index);
    if (puntos.length >= 1) {
      renglon1 = paquete.descripcion.slice(0, puntos[0] + 1).trim();
      if (puntos.length >= 2) {
        renglon2 = paquete.descripcion.slice(puntos[0] + 1, puntos[1] + 1).trim();
      }
    } else {
      renglon1 = paquete.descripcion.trim();
    }
  }
  // Capitalizar el inicio de cada renglón
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  const moneda = paquete.moneda || 'ARS';
  return (
    <div className="package-card shrink-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden w-full max-w-[260px] flex flex-col">
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
              {formatPrice(paquete.precio, moneda)}{' '}
            </span>
          </div>
          <div className="text-xs text-kiendamas-text font-raleway leading-snug break-words whitespace-normal line-clamp-2 min-h-[2.5em] max-h-[2.5em] overflow-hidden">
            {capitalize(renglon1)}
            {renglon2 && <><br />{capitalize(renglon2)}</>}
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
};

// Card de placeholder
const PlaceholderCard = () => (
  <div className="package-card shrink-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden w-full max-w-[260px] flex flex-col">
    <div className="w-full p-1 aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-200">
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
        <div className="text-xs text-gray-400 font-raleway leading-snug break-words whitespace-normal line-clamp-2 min-h-[2.5em] max-h-[2.5em] overflow-hidden">
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
  const carruselRef = useRef(null);

  // Calcula cuántas cards caben según el ancho disponible y breakpoints, con tope máximo
  const updateCardsPerView = useCallback(() => {
    const CARD_WIDTH = 240; // px
    const GAP = 8; // px
    const FLECHA_SPACE = 56 * 2; // px, 56px por lado para flechas
    let width = window.innerWidth;
    if (carruselRef.current) {
      width = carruselRef.current.offsetWidth;
    } else {
      const mainContainer = document.getElementById('paquetes-main-container');
      if (mainContainer) width = mainContainer.offsetWidth * 0.9;
    }
    // En móvil, solo 1 card
    if (width < 640) {
      setCardsPerView(1);
      return;
    }
    // Reservar espacio para flechas
    const usableWidth = width - FLECHA_SPACE;
    let n = Math.floor((usableWidth + GAP) / (CARD_WIDTH + GAP));
    if (n < 1) n = 1;
    setCardsPerView(n);
  }, []);

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [updateCardsPerView]);

  const formatPrice = (price, moneda = 'USD') =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

  // Agrupar paquetes por categoría y subcategoría
  const categoriasMap = {};
  allPaquetes.forEach((paquete) => {
    const categoriaId = paquete.Categorium?.id?.toString() || 'sin-categoria';
    const categoriaNombre = paquete.Categorium?.nombre || 'Sin categoría';
    const subcategoriaNombre = paquete.Subcategorium?.nombre || 'Sin subcategoría';
    if (!categoriasMap[categoriaId]) {
      categoriasMap[categoriaId] = {
        nombre: categoriaNombre,
        subcategorias: {}
      };
    }
    if (!categoriasMap[categoriaId].subcategorias[subcategoriaNombre]) {
      categoriasMap[categoriaId].subcategorias[subcategoriaNombre] = [];
    }
    categoriasMap[categoriaId].subcategorias[subcategoriaNombre].push(paquete);
  });

  // Carousel navigation, always show only full cards
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
      {Object.entries(categoriasMap).map(([categoriaId, categoria]) => (
        <section
          key={categoriaId}
          id={`categoria-${categoriaId}`}
          className="w-full bg-white py-16"
        >
          {/* Título principal de categoría */}
          <CategoryTitleAnimated
            tituloBg="bg-kiendamas-beige"
            categoriaNombre={categoria.nombre}
          />

          <div id="paquetes-main-container" className="w-full">
            {Object.entries(categoria.subcategorias).map(([subcategoriaNombre, paquetes]) => {
              if (!paquetes || paquetes.length === 0) return null;
              const carouselId = `carousel-${categoriaId}-${subcategoriaNombre}`;
              const startIdx = carouselIndexes[carouselId] || 0;

              // Siempre mostrar cardsPerView cards, rellenando con placeholders a izquierda y derecha para centrar
              let allCards = [...paquetes];
              let placeholdersToAdd = 0;
              if (allCards.length < cardsPerView) {
                placeholdersToAdd = cardsPerView - allCards.length;
              }
              // Para centrar: mitad de placeholders a la izquierda, mitad a la derecha
              let leftPlaceholders = Math.floor(placeholdersToAdd / 2);
              let rightPlaceholders = placeholdersToAdd - leftPlaceholders;
              let visiblePaquetes = [];
              for (let i = 0; i < leftPlaceholders; i++) {
                visiblePaquetes.push(<PlaceholderCard key={`ph-left-${i}`} />);
              }
              // Carrusel infinito: armar el slice visible ciclando el array
              const total = allCards.length;
              for (let i = 0; i < Math.min(cardsPerView, total); i++) {
                const idx = (startIdx + i) % total;
                const p = allCards[idx];
                visiblePaquetes.push(
                  p.placeholder ? (
                    <PlaceholderCard key={p.key + '-' + idx} />
                  ) : (
                    <PackageCard
                      key={p.id + '-' + idx}
                      paquete={p}
                      formatPrice={formatPrice}
                      navigate={navigate}
                    />
                  )
                );
              }
              for (let i = 0; i < rightPlaceholders; i++) {
                visiblePaquetes.push(<PlaceholderCard key={`ph-right-${i}`} />);
              }
              const showCarousel = total > cardsPerView || allCards.length === cardsPerView;

              // Card width fijo y gap fijo para todas las pantallas (excepto móvil)
              const cardWidth = 240;
              const mobile = cardsPerView === 1;

              return (
                <div key={subcategoriaNombre} className="mt-4 mb-0">
                  {/* Wrapper centrado para subtítulo y carrusel */}
                  <div
                    className="flex flex-col"
                    style={{
                      maxWidth: '100%',
                      width: '100%'
                    }}
                  >
                    {/* Subcategoría alineada sobre la primer card */}
                    <div className="mb-2">
                      <h3
                        className="text-base sm:text-lg font-semibold font-raleway text-kiendamas-text"
                        style={{ marginLeft: 0 }}
                      >
                        {subcategoriaNombre.charAt(0).toUpperCase() +
                          subcategoriaNombre.slice(1).toLowerCase()}
                      </h3>
                    </div>

                    {/* Carrusel compacto, sin scroll ni snap */}
                    {mobile ? (
                      <div className="w-full flex flex-row justify-center items-center py-1">
                        <div className="flex flex-row items-center justify-between gap-2 w-full max-w-xs mx-auto">
                          {showCarousel && (
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'left', paquetes.length)}
                              className="flex items-center justify-center p-0.5 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown h-7 w-7"
                              style={{ minWidth: 0, minHeight: 0 }}
                            >
                              <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                          )}
                          {visiblePaquetes.map((card, idx) => (
                            <div
                              key={card.key || card.props?.paquete?.id || idx}
                              className="w-full"
                              style={{ minWidth: 0, maxWidth: '100%' }}
                            >
                              {card}
                            </div>
                          ))}
                          {showCarousel && (
                            <button
                              onClick={() => handleCarouselNav(carouselId, 'right', paquetes.length)}
                              className="flex items-center justify-center p-0.5 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown h-7 w-7"
                              style={{ minWidth: 0, minHeight: 0 }}
                            >
                              <ChevronRightIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full flex items-center">
                        <div className="w-full flex justify-center py-1">
                          <div className="relative flex items-center w-full max-w-[1480px] min-w-[320px] mx-auto">
                            {/* Flechas absolutas sobre los bordes laterales del área de las cards */}
                            {showCarousel && (
                              <>
                                <button
                                  onClick={() => handleCarouselNav(carouselId, 'left', paquetes.length)}
                                  className="flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10 h-7 w-7 sm:h-8 sm:w-8"
                                  style={{ minWidth: 0, minHeight: 0 }}
                                >
                                  <ChevronLeftIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleCarouselNav(carouselId, 'right', paquetes.length)}
                                  className="flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 bg-white border border-gray-300 rounded-full shadow hover:shadow-md transition text-kiendamas-light-brown z-10 h-7 w-7 sm:h-8 sm:w-8"
                                  style={{ minWidth: 0, minHeight: 0 }}
                                >
                                  <ChevronRightIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {/* Fila de cards sin gap entre ellas, centrada y con ancho máximo */}
                            <div
                              ref={carruselRef}
                              className="flex w-full justify-center gap-2 px-8 md:px-10 lg:px-12 xl:px-16"
                            >
                              {visiblePaquetes.map((card, idx) => (
                                <div
                                  key={card.key || card.props?.paquete?.id || idx}
                                  style={{ flex: `0 0 ${cardWidth}px`, minWidth: `${cardWidth}px`, maxWidth: `${cardWidth}px` }}
                                >
                                  {card}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
};

export default PackagesSection;
