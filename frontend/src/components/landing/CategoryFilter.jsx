import { useState, useEffect } from 'react';
import { useGetCategoriasQuery } from '../../features/categorias/categoriasApi';

const CategoryFilter = ({ onFilterChange, activeFilter = null, userMenuOpen = false }) => {
  const [isSticky, setIsSticky] = useState(false);

  // Obtener categorías del backend
  const { data: categorias = [], isLoading } = useGetCategoriasQuery();
  // Adaptar datos para el filtro (usa id y nombre del backend)
  const categories = [
    { id: null, label: 'Todos' },
    ...categorias.map(cat => ({ id: cat.id?.toString(), label: cat.nombre }))
  ];

  // Calcular el nombre más largo para el ancho de los botones en desktop
  const longestLabel = categories.reduce((max, cat) =>
    cat.label.length > max.length ? cat.label : max, ''
  );

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
    // Si es null (Todos), scrollea al top de la sección
    const sectionId = categoryId ? `categoria-${categoryId}` : 'paquetes';
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
  <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-2">
        <div className="flex bg-white rounded-full shadow-2xl overflow-hidden border border-kiendamas-text/20">
          {isLoading ? (
            <div className="flex-1 text-center py-3 text-xs text-gray-400">Cargando...</div>
          ) : (
            <>
              {/* Mostrar solo el desplegable si hay más de 3 categorías, en todas las vistas */}
              <div className={`w-full flex justify-center ${isSticky ? 'gap-0 sm:gap-0' : 'gap-0.5 sm:gap-1'} max-w-full overflow-x-auto px-0 sm:px-1 ${isSticky ? 'sm:rounded-full' : ''}`}>
                {/* Si hay más de 3 categorías, mostrar 'Todos' y 3 categorías, si no, solo las categorías */}
                {categories.length > 4 ? (
                  <>
                    <div className={`relative min-w-[70px] max-w-[100px] w-full sm:min-w-[90px] sm:max-w-[140px] sm:w-full ${isSticky ? 'sm:grow sm:basis-0' : ''} ${isSticky ? 'rounded-l-full' : ''} ${activeFilter === null ? 'bg-[#8B5E3C] text-white' : ''}`}>
                      <select
                        className={`py-1.5 text-[11px] font-medium rounded-l-full border border-gray-300 outline-none shadow w-full sm:py-3 sm:text-sm
                          ${activeFilter === null ? 'bg-[#8B5E3C] text-white' : 'bg-white text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown'}`}
                        onChange={e => handleFilterClick(e.target.value)}
                        value={categories[0].id}
                      >
                        <option value={categories[0].id}>Todos</option>
                        {categories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label
                              ? category.label.charAt(0).toUpperCase() + category.label.slice(1).toLowerCase()
                              : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    {categories.slice(1, 4).map((category, index, arr) => {
                      const isActive = activeFilter === category.id;
                      const isLast = index === arr.length - 1;
                      // Cuando sticky, el último se estira hasta el borde
                      const stickyGrow = isSticky && isLast ? 'sm:grow sm:basis-0' : '';
                      const stickyRound = isSticky && isLast ? 'rounded-none rounded-r-full' : '';
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleFilterClick(category.id)}
                          className={`grow basis-0 py-1.5 text-[11px] font-medium transition-all duration-200 relative font-raleway text-center
                            sm:py-3 sm:text-sm
                            ${stickyGrow}
                            ${isActive
                              ? `bg-[#8B5E3C] text-white shadow-md ${stickyRound}`
                              : 'text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown hover:shadow-sm'}
                            ${!isActive && isLast ? 'rounded-r-full' : ''}`}
                          style={{
                            minWidth: '70px',
                            maxWidth: '100px',
                            flex: '1 1 0',
                            ...(window.innerWidth >= 640 ? {
                              minWidth: `${longestLabel.length + 2}ch`,
                              maxWidth: `${longestLabel.length + 2}ch`,
                            } : {})
                          }}
                        >
                          <span className="block w-full truncate px-0.5 sm:px-2">{
                            category.label
                              ? category.label.charAt(0).toUpperCase() + category.label.slice(1).toLowerCase()
                              : ''
                          }</span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  categories.slice(1).map((category, index, arr) => {
                    const isActive = activeFilter === category.id;
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    // Cuando sticky, el primero y el último se estiran hasta el borde
                    const stickyGrow = isSticky && (isFirst || isLast) ? 'sm:grow sm:basis-0' : '';
                    const stickyRound = isSticky && isFirst ? 'rounded-none rounded-l-full' : isSticky && isLast ? 'rounded-none rounded-r-full' : '';
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleFilterClick(category.id)}
                        className={`grow basis-0 py-1.5 text-[11px] font-medium transition-all duration-200 relative font-raleway text-center
                          sm:py-3 sm:text-sm
                          ${stickyGrow}
                          ${isActive
                            ? `bg-[#8B5E3C] text-white shadow-md ${stickyRound}`
                            : 'text-kiendamas-text hover:bg-kiendamas-cream/50 hover:text-kiendamas-darkBrown hover:shadow-sm'}
                          ${!isActive && isLast ? 'rounded-r-full' : ''}
                          ${!isActive && isFirst ? 'rounded-none' : ''}`}
                        style={{
                          minWidth: '70px',
                          maxWidth: '100px',
                          flex: '1 1 0',
                          ...(window.innerWidth >= 640 ? {
                            minWidth: `${longestLabel.length + 2}ch`,
                            maxWidth: `${longestLabel.length + 2}ch`,
                          } : {})
                        }}
                      >
                        <span className="block w-full truncate px-0.5 sm:px-2">{
                          category.label
                            ? category.label.charAt(0).toUpperCase() + category.label.slice(1).toLowerCase()
                            : ''
                        }</span>
                      </button>
                    );
                  })
                )}
              </div>
              {/* Mobile: mismo comportamiento, solo el desplegable si hay más de 3 */}
              {/* Ya cubierto por el bloque anterior */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
