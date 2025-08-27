
import React, { useRef, useEffect } from 'react';
import { useGetPaquetesQuery } from '../../features/paquetes/paquetesApi';
import { useNavigate } from 'react-router-dom';
import CategoryTitleAnimated from './CategoryTitleAnimated';
import './card-shadow.css';
import './scrollbar-hide.css';
const TagHighlightSection = () => {
    const { data: allPaquetes = [], isLoading } = useGetPaquetesQuery();
    const navigate = useNavigate();
    // Filtrar paquetes con tags no vacíos
    const taggedPaquetes = allPaquetes.filter(p => Array.isArray(p.tags) && p.tags.length > 0);

    // Scroll infinito duplicando el array (3 sets)
    const infiniteCards = [...taggedPaquetes, ...taggedPaquetes, ...taggedPaquetes];
    const carouselRef = useRef(null);

    // Al montar, scrollea al primer set
    useEffect(() => {
        if (carouselRef.current && taggedPaquetes.length > 0) {
            const cardWidth = 256; // 240px + gap
            carouselRef.current.scrollLeft = cardWidth * taggedPaquetes.length;
        }
    }, [taggedPaquetes.length]);

    // Al hacer scroll, si llega al final/inicio, resetea
    const handleInfiniteScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        const cardWidth = 256; // 240px + gap
        const total = taggedPaquetes.length;
        // El array tiene 3 sets: [0..n-1][n..2n-1][2n..3n-1]
        if (el.scrollLeft <= cardWidth * 0.5) {
            // Al inicio, salta al set del medio
            el.scrollLeft = cardWidth * total + el.scrollLeft;
        } else if (el.scrollLeft >= cardWidth * (total * 2.5)) {
            // Al final, salta al set del medio
            el.scrollLeft = cardWidth * total + (el.scrollLeft - cardWidth * total * 2);
        }
    };


    // Drag scroll helpers (mouse y touch)
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
    const handleDragStart = (e) => {
        const container = e.currentTarget;
        dragState.current.isDown = true;
        dragState.current.startX = (e.touches ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
        dragState.current.scrollLeft = container.scrollLeft;
    };
    const handleDragMove = (e) => {
        if (!dragState.current.isDown) return;
        const container = e.currentTarget;
        const x = (e.touches ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
        const walk = x - dragState.current.startX;
        container.scrollLeft = dragState.current.scrollLeft - walk;
    };
    const handleDragEnd = () => {
        dragState.current.isDown = false;
    };

    // Flecha funcional
    const handleArrowClick = () => {
        if (!carouselRef.current) return;
        const cardWidth = 256;
        carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    };

    if (isLoading || taggedPaquetes.length === 0) return null;
    return (
        <section className="py-12 bg-kiendamas-lightBeige w-full" id="destacado">
            <div className="w-full px-2 sm:px-0 lg:px-0 overflow-x-hidden">
                <div className="ml-0">
                    <CategoryTitleAnimated tituloBg="bg-kiendamas-beige" categoriaNombre="Destacados" />
                                    </div>
                                </div>
                <div style={{ overflow: 'visible', paddingBottom: '48px', minHeight: '380px' }}>
                  <div className="w-full flex flex-col items-center mt-2 relative group">
                    {/* Flecha indicadora a la derecha */}
                    <button
                        type="button"
                        aria-label="Siguiente"
                        onClick={handleArrowClick}
                        className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-transparent border-none outline-none cursor-pointer group-hover:animate-bounce"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right-circle">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 16 16 12 12 8" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    </button>
                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto pb-2 w-full scrollbar-hide cursor-grab active:cursor-grabbing select-none px-1 sm:px-0"
                        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', margin: '0 auto', padding: '1rem', overflowX: 'auto', overflowY: 'visible', scrollBehavior: 'smooth', maxWidth: '100vw', position: 'relative' }}
                        onMouseDown={e => { if (!isTouchDevice()) handleDragStart(e); }}
                        onMouseMove={e => { if (!isTouchDevice()) handleDragMove(e); }}
                        onMouseUp={e => { if (!isTouchDevice()) handleDragEnd(e); }}
                        onMouseLeave={e => { if (!isTouchDevice()) handleDragEnd(e); }}
                        onTouchStart={e => { if (isTouchDevice()) handleDragStart(e); }}
                        onTouchMove={e => { if (isTouchDevice()) handleDragMove(e); }}
                    >
                        {infiniteCards.map((paquete, idx) => {
                            // Dos renglones de descripción como en PackagesSection
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
                            const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
                            const moneda = paquete.moneda || 'ARS';
                            return (
                                <div
                                    key={paquete.id + '-' + idx}
                                    className="min-w-[90vw] max-w-[90vw] mx-auto sm:min-w-[240px] sm:max-w-[240px] h-[340px] bg-white border-2 border-kiendamas-gold rounded-lg flex flex-col overflow-visible relative hover:scale-105 hover:z-30 transition-transform duration-200 card-shadow p-1"
                                    style={{ display: 'flex', flexDirection: 'column', scrollSnapAlign: 'center' }}
                                >
                                    {/* Tags destacadas */}
                                    <div className="flex flex-wrap gap-2 absolute top-0 left-0 z-10">
                                        {paquete.tags.map((tag, i) => (
                                            <span key={i} className="bg-kiendamas-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-tag mr-1 mb-1 uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                        <div className="w-full" style={{ height: '180px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={paquete.imagenes?.[0] || '/placeholder-travel.jpg'}
                                                alt={paquete.nombre}
                                                className="w-full h-full object-cover object-center"
                                                style={{ maxHeight: '180px', minHeight: '180px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col p-3" style={{ minHeight: '60px', maxHeight: '60px', justifyContent: 'space-between' }}>
                                        <h3 className="text-sm font-semibold text-kiendamas-text mb-1 truncate font-raleway">
                                            {paquete.nombre.charAt(0).toUpperCase() + paquete.nombre.slice(1).toLowerCase()}
                                        </h3>
                                        <div className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2.5em] max-h-[2.5em]">
                                            {capitalize(renglon1)}
                                            {renglon2 && <><br />{capitalize(renglon2)}</>}
                                        </div>
                                        <span className="text-xs font-bold text-kiendamas-text font-raleway whitespace-nowrap mb-2">
                                            {paquete.precio !== null && paquete.precio !== undefined && paquete.precio !== '' && Number(paquete.precio) > 0
                                                ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(paquete.precio)
                                                : 'Consultar'}{' '}
                                        </span>
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
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


export default TagHighlightSection;
