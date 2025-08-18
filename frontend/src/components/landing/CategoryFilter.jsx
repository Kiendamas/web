import { useState, useEffect } from 'react';

const CategoryFilter = ({ onFilterChange, activeFilter = 'todos' }) => {
  const [isSticky, setIsSticky] = useState(false);

  const categories = [
    { id: 'premium', label: 'PREMIUM', color: 'bg-accent' },
    { id: 'internacionales', label: 'INTERNACIONAL', color: 'bg-secondary' },
    { id: 'nacionales', label: 'NACIONAL', color: 'bg-brown' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.6; // Aproximadamente donde termina el hero
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterClick = (categoryId) => {
    if (onFilterChange) {
      onFilterChange(categoryId);
    }
    // Scroll suave hacia la sección de la categoría
    const sectionId = `categoria-${categoryId}`;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div 
      className={`transition-all duration-300 z-40 ${
        isSticky 
          ? 'fixed top-16 left-0 right-0' 
          : 'absolute top-32 left-1/2 transform -translate-x-1/2'
      }`}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleFilterClick(category.id)}
              className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-all duration-200 relative font-raleway ${
                activeFilter === category.id
                  ? `${category.color} text-white shadow-lg`
                  : 'text-dark hover:bg-cream'
              } ${
                index === 0 ? 'rounded-l-full' : 
                index === categories.length - 1 ? 'rounded-r-full' : ''
              }`}
            >
              {category.label}
              {activeFilter === category.id && (
                <div className="absolute inset-0 bg-black/10 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Indicador visual cuando está sticky */}
        {isSticky && (
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-accent rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
