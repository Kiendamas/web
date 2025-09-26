import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useGetHeroSlidesQuery } from '../../features/heroSlides/heroSlidesApi';
import { 
  setCurrentSlide, 
  nextSlide, 
  prevSlide, 
  setVideoPlaying 
} from '../../features/heroSlides/heroSlidesSlice';

const HeroSection = () => {
  const dispatch = useDispatch();
  const { currentSlide, isVideoPlaying } = useSelector(state => state.heroSlides);
  const { data: heroSlides = [], isLoading, error } = useGetHeroSlidesQuery();

  
  const defaultSlides = [
    {
      id: 1,
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Descubre Peru',
      subtitle: 'Aventuras inolvidables te esperan',
      buttonText: 'Más info',
      buttonLink: '#servicios'
    },
    {
      id: 2,
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
      title: 'Machu Picchu',
      subtitle: 'La ciudadela perdida de los Incas',
      buttonText: 'Explorar',
      buttonLink: '#experiencias'
    }
  ];

  const slides = heroSlides.length > 0 ? heroSlides : defaultSlides;

  // Auto-slide cada 5 segundos, pero pausar si hay video reproduciéndose
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const currentSlideData = slides[currentSlide];
    const isCurrentSlideVideo = currentSlideData?.mediaType === 'video';
    
    const interval = setInterval(() => {
      // No cambiar slide si es video y está reproduciéndose
      if (!isCurrentSlideVideo || !isVideoPlaying) {
        dispatch(nextSlide(slides.length));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isVideoPlaying, slides.length, dispatch, currentSlide, slides]);

  // Manejar reproducción automática de videos
  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData?.mediaType === 'video') {
      // Iniciar video automáticamente cuando se muestre el slide
      dispatch(setVideoPlaying(true));
    } else {
      // Parar video si cambiamos a imagen
      dispatch(setVideoPlaying(false));
    }
  }, [currentSlide, slides, dispatch]);

  const handleNextSlide = () => {
    dispatch(nextSlide(slides.length));
  };

  const handlePrevSlide = () => {
    dispatch(prevSlide(slides.length));
  };

  const handleGoToSlide = (index) => {
    dispatch(setCurrentSlide(index));
  };

  const handleButtonClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(link, '_blank');
    }
  };

  const currentSlideData = slides[currentSlide] || slides[0];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">Error al cargar las imágenes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden ">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.mediaType === 'image' ? (
              <div
                className="h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.mediaUrl})` }}
              />
            ) : (
              <div className="relative h-full">
                <video
                  className="h-full w-full object-cover"
                  src={slide.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => {
                    if (index === currentSlide) {
                      dispatch(setVideoPlaying(true));
                    }
                  }}
                  onError={(e) => {
                    console.error('Error loading video:', e);
                    dispatch(setVideoPlaying(false));
                  }}
                  style={{ 
                    display: index === currentSlide && isVideoPlaying ? 'block' : 'none' 
                  }}
                />
                
                {/* Fallback poster/thumbnail */}
                {(!isVideoPlaying || index !== currentSlide) && (
                  <div className="h-full bg-gray-800 bg-cover bg-center bg-no-repeat absolute inset-0 flex items-center justify-center">
                    {/* Intentar mostrar poster si existe */}
                    {slide.posterUrl && (
                      <img 
                        src={slide.posterUrl}
                        alt="Video preview"
                        className="h-full w-full object-cover absolute inset-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Video preview (primer frame) */}
                    <video
                      className="h-full w-full object-cover absolute inset-0"
                      src={slide.mediaUrl}
                      preload="metadata"
                      muted
                      style={{ display: slide.posterUrl ? 'none' : 'block' }}
                      onError={() => {
                        console.warn('No se pudo cargar preview del video');
                      }}
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                      <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 transform hover:scale-110">
                        <PlayIcon className="h-8 w-8 text-gray-900 ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Content Overlay - left-aligned, vertically centered */}
    <div className="absolute inset-0 flex items-center">
  <div className="flex flex-col items-center justify-center h-full px-4 text-white max-w-2xl w-full mt-12 sm:mt-20 md:mt-28">
    {/* Texto superior */}
    <p className="text-lg sm:text-xl font-raleway font-bold tracking-wide  animate-fade-in text-center">
      BIENVENIDOS A
    </p>

    {/* Línea que abarca el ancho del h1 */}
    <div className="w-full flex justify-center">
      <div className="h-[2px] bg-white/80 w-[50%] sm:w-[60%] md:w-[50%] lg:w-[43%]" />
    </div>

    {/* Título principal */}
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-raleway font-bold mb-8 leading-tight animate-slide-up text-center">
      KIENDAMAS
    </h1>

    {/* Botón */}
    <button
      onClick={() => handleButtonClick(currentSlideData.buttonLink)}
      className="inline-flex items-center px-4 py-2 bg-white text-kiendamas-brown font-semibold rounded-full border-2 border-kiendamas-rosa hover:bg-kiendamas-rosa hover:text-white transition-all duration-200 transform hover:scale-105 animate-slide-up delay-300 shadow-lg"
    >
      {currentSlideData.buttonText}
    </button>
  </div>
</div>


      {/* Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => handleGoToSlide(index)}
            className={`relative w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            title={slide.mediaType === 'video' ? 'Video' : 'Imagen'}
          >
            {slide.mediaType === 'video' && (
              <PlayIcon className="absolute -top-1 -right-1 h-2 w-2 text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
