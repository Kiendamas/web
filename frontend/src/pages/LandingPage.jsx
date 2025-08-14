import { useState, useEffect } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingSidebar from '../components/landing/LandingSidebar';
import HeroSection from '../components/landing/HeroSection';
import CategoryFilter from '../components/landing/CategoryFilter';
import ServicesSection from '../components/landing/ServicesSection';
import PackagesSection from '../components/landing/PackagesSection';
import SocialMediaFixed from '../components/landing/SocialMediaFixed';

const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeFilter, setActiveFilter] = useState('todos');

  // Cerrar sidebar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <LandingHeader 
        onMenuClick={() => setSidebarOpen(true)}
        onSectionClick={scrollToSection}
        activeSection={activeSection}
      />

      {/* Sidebar */}
      <LandingSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSectionClick={scrollToSection}
        activeSection={activeSection}
      />

      {/* Hero Section */}
      <main>
        <HeroSection />
        <CategoryFilter 
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />
        
        {/* Sección de Servicios */}
        <ServicesSection />
        
        {/* Sección de Paquetes */}
        <PackagesSection selectedFilter={activeFilter} />
        
        {/* Secciones de contenido */}
        <div className="min-h-screen">
          {/* Secciones principales */}
          <div id="inicio" className="min-h-screen pt-16">
            {/* Hero ya está incluido arriba */}
          </div>

          <div id="experiencias" className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Experiencias Únicas</h2>
              <p className="text-gray-600">Vive aventuras inolvidables...</p>
            </div>
          </div>

          <div id="comercial" className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Información Comercial</h2>
              <p className="text-gray-600">Conoce nuestros paquetes y promociones...</p>
            </div>
          </div>

          <div id="nosotros" className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nosotros</h2>
              <p className="text-gray-600">Conoce nuestra historia y misión...</p>
            </div>
          </div>

          <div id="contacto" className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h2>
              <p className="text-gray-600">Ponte en contacto con nosotros...</p>
            </div>
          </div>
        </div>
      </main>

      {/* Redes Sociales Fijas */}
      <SocialMediaFixed />
    </div>
  );
};

export default LandingPage;
