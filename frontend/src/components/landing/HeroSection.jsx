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

  // Slides de ejemplo por defecto si no hay datos del backend
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

  // Auto-slide cada 5 segundos
  useEffect(() => {
    if (slides.length <= 1) return; // No hacer auto-slide si hay 1 o menos slides
    
    const interval = setInterval(() => {
      if (!isVideoPlaying) {
        dispatch(nextSlide(slides.length));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isVideoPlaying, slides.length, dispatch]);

  const handleNextSlide = () => {
    dispatch(nextSlide(slides.length));
    dispatch(setVideoPlaying(false));
  };

  const handlePrevSlide = () => {
    dispatch(prevSlide(slides.length));
    dispatch(setVideoPlaying(false));
  };

  const handleGoToSlide = (index) => {
    dispatch(setCurrentSlide(index));
    dispatch(setVideoPlaying(false));
  };

  const handleVideoPlay = () => {
    dispatch(setVideoPlaying(true));
  };

  const handleVideoEnd = () => {
    dispatch(setVideoPlaying(false));
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
    <div className="relative h-screen overflow-hidden">
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
                {!isVideoPlaying ? (
                  <div
                    className="h-full bg-cover bg-center bg-no-repeat cursor-pointer relative"
                    style={{ backgroundImage: `url(${slide.posterUrl || slide.mediaUrl})` }}
                    onClick={handleVideoPlay}
                  >
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 transform hover:scale-110">
                        <PlayIcon className="h-8 w-8 text-gray-900 ml-1" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <video
                    className="h-full w-full object-cover"
                    src={slide.mediaUrl}
                    autoPlay
                    muted
                    loop
                    onEnded={handleVideoEnd}
                  />
                )}
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-lg sm:text-xl mb-4 opacity-90 animate-fade-in">
            BIENVENIDOS A
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            KIENDAMAS
          </h1>
          
          <div className="mb-8 animate-slide-up delay-200">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
              {currentSlideData.title}
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              {currentSlideData.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleButtonClick(currentSlideData.buttonLink)}
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 animate-slide-up delay-300"
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
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleGoToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
