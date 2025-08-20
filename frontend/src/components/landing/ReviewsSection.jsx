import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetResenasQuery } from '../../features/resenas/resenasApi';

const ReviewsSection = () => {
  const { data: resenas = [], isLoading } = useGetResenasQuery();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-rotate reviews every 8 seconds
  useEffect(() => {
    if (resenas.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => 
          prevIndex === resenas.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [resenas.length]);

  const nextReview = () => {
    if (resenas.length > 1) {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === resenas.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevReview = () => {
    if (resenas.length > 1) {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === 0 ? resenas.length - 1 : prevIndex - 1
      );
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-5 w-5">
            <StarOutlineIcon className="h-5 w-5 text-yellow-400 absolute" />
            <StarIcon className="h-5 w-5 text-yellow-400 fill-current absolute" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-kiendamas-cream to-white" id="resenas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!resenas.length) {
    return (
      <section className="py-16 bg-gradient-to-br from-kiendamas-cream to-white" id="resenas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-kiendamas-text mb-4 font-raleway">
              Próximamente: Reseñas de Clientes
            </h2>
            <p className="text-kiendamas-brown font-raleway">
              Pronto podrás ver las experiencias de nuestros viajeros
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentReview = resenas[currentReviewIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-kiendamas-cream to-white w-full" id="resenas">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 -ml-10">
          <div className="relative mb-6">
            <div className="bg-kiendamas-lightBeige rounded-r-3xl pl-4 sm:pl-6 pr-8 py-3 max-w-xs sm:max-w-md">
              <h2 className="text-xl sm:text-2xl xl:text-2xl 2xl:text-3xl font-normal text-kiendamas-text font-raleway leading-none">
                Lo que dicen nuestros clientes
              </h2>
            </div>
          </div>
          <p className="text-kiendamas-brown text-base sm:text-lg font-raleway max-w-2xl mx-auto">
            Conoce las experiencias reales de quienes han viajado con nosotros
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-6xl text-kiendamas-beige font-serif">"</div>
            <div className="absolute bottom-4 right-4 text-6xl text-kiendamas-beige font-serif rotate-180">"</div>
            
            {/* Review Content */}
            <div className="relative z-10 text-center">
              {/* Stars */}
              <div className="flex justify-center items-center mb-6">
                {renderStars(currentReview.calificacion)}
              </div>
              
              {/* Review Text */}
              <blockquote className="text-lg md:text-xl text-gray-700 font-raleway leading-relaxed mb-8 min-h-[120px] flex items-center justify-center">
                <p className="italic">"{currentReview.comentario}"</p>
              </blockquote>
              
              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-kiendamas-brown to-kiendamas-dark-brown rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg font-raleway">
                      {currentReview.User?.nombre?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-kiendamas-text font-raleway">
                      {currentReview.User?.nombre || 'Cliente Verificado'}
                    </p>
                    <p className="text-sm text-gray-500 font-raleway">
                      {formatDate(currentReview.createdAt)}
                    </p>
                  </div>
                </div>
                
                {/* Package Info if available */}
                {currentReview.PaqueteTuristico && (
                  <div className="text-sm text-kiendamas-brown font-raleway">
                    <span className="bg-kiendamas-beige px-3 py-1 rounded-full">
                      {currentReview.PaqueteTuristico.nombre}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {resenas.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-200 hover:scale-110 text-kiendamas-brown hover:text-kiendamas-dark-brown"
                aria-label="Reseña anterior"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextReview}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-200 hover:scale-110 text-kiendamas-brown hover:text-kiendamas-dark-brown"
                aria-label="Siguiente reseña"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Review Indicators */}
          {resenas.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {resenas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentReviewIndex 
                      ? 'bg-kiendamas-brown scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a reseña ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

       
      </div>
    </section>
  );
};

export default ReviewsSection;
