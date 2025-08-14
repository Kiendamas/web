import { useState, useEffect } from 'react';

const CategoryFilter = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeCategory, setActiveCategory] = useState('premium');

  const categories = [
    { id: 'premium', label: 'PREMIUM', color: 'bg-amber-600' },
    { id: 'internacional', label: 'INTERNACIONAL', color: 'bg-blue-600' },
    { id: 'nacional', label: 'NACIONAL', color: 'bg-green-600' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.6; // Aproximadamente donde termina el hero
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (categoryId) => {
    setActiveCategory(categoryId);
    // Aquí puedes agregar lógica para scroll a secciones específicas
    const sectionElement = document.getElementById(`section-${categoryId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div 
      className={`transition-all duration-300 z-40 ${
        isSticky 
          ? 'fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md' 
          : 'absolute top-32 left-1/2 transform -translate-x-1/2'
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => scrollToSection(category.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                activeCategory === category.id
                  ? `${category.color} text-white shadow-lg`
                  : 'text-gray-700 hover:bg-gray-50'
              } ${
                index === 0 ? 'rounded-l-full' : 
                index === categories.length - 1 ? 'rounded-r-full' : ''
              }`}
            >
              {category.label}
              {activeCategory === category.id && (
                <div className="absolute inset-0 bg-black/10 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Indicador visual cuando está sticky */}
        {isSticky && (
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
