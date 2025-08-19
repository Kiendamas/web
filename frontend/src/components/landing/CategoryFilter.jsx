import { useState, useEffect } from 'react';

const CategoryFilter = ({ onFilterChange, activeFilter = 'premium', userMenuOpen = false }) => {
  const [isSticky, setIsSticky] = useState(false);

  const categories = [
    { id: 'premium', label: 'Premium', bg: 'bg-[#8B5E3C]', activeText: 'text-white', inactiveText: 'text-white' },
    { id: 'internacionales', label: 'Internacional', bg: 'bg-gray-200', activeText: 'text-dark', inactiveText: 'text-dark' },
    { id: 'nacionales', label: 'Nacional', bg: 'bg-white', activeText: 'text-dark', inactiveText: 'text-dark' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.6;
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Scroll con offset para no tapar el título con el header sticky
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // altura del header sticky
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleFilterClick = (categoryId) => {
    if (onFilterChange) {
      onFilterChange(categoryId);
    }

    const sectionId = `categoria-${categoryId}`;
    scrollToSection(sectionId);
  };

  return (
    <div
      className={`transition-all duration-300 ${isSticky ? 'z-30' : 'z-20'} ${
        isSticky
          ? `fixed top-16 left-0 right-0 ${userMenuOpen ? 'pointer-events-none' : 'pointer-events-auto'}`
          : 'absolute top-32 left-1/2 transform -translate-x-1/2'
      }`}
    >
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200">
          {categories.map((category, index) => {
            const isActive = activeFilter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleFilterClick(category.id)}
                className={`flex-1 px-4 py-3 text-xs sm:text-sm font-medium transition-all duration-200 relative font-raleway 
                  ${isActive ? `${category.bg} ${category.activeText} shadow-md` : `${category.bg} ${category.inactiveText}`}
                  ${index === 0 ? 'rounded-l-full' : index === categories.length - 1 ? 'rounded-r-full' : ''}`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
