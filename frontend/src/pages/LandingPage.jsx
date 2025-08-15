import { useState, useEffect } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingSidebar from '../components/landing/LandingSidebar';
import CompactSidebar from '../components/landing/CompactSidebar';
import HeroSection from '../components/landing/HeroSection';
import CategoryFilter from '../components/landing/CategoryFilter';
import ServicesSection from '../components/landing/ServicesSection';
import PackagesSection from '../components/landing/PackagesSection';
import AboutSection from '../components/landing/AboutSection';
import ContactSection from '../components/landing/ContactSection';
import SocialMediaFixed from '../components/landing/SocialMediaFixed';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Para móviles

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Ajustar el scroll para compensar el header
      const headerHeight = 64; // h-16 = 64px
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
    setMobileSidebarOpen(false); // Cerrar sidebar móvil al navegar
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Sidebar para desktop (lg y superior) */}
      <div className="hidden lg:block">
        <CompactSidebar 
          onSectionClick={scrollToSection}
          activeSection={activeSection}
          onExpandedChange={setSidebarExpanded}
        />
      </div>

      {/* Sidebar móvil (menor a lg) */}
      <div className="lg:hidden">
        <LandingSidebar 
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onSectionClick={scrollToSection}
          activeSection={activeSection}
        />
      </div>

      {/* Header responsive */}
      <LandingHeader 
        onMenuClick={() => setMobileSidebarOpen(true)} // Solo para móviles
        onSectionClick={scrollToSection}
        activeSection={activeSection}
      />

      {/* Contenido principal con margen responsive */}
      <main className={`transition-all duration-300 ${
        sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'
      }`}>
        <HeroSection />
        <CategoryFilter 
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />
        
        {/* Sección de Servicios */}
        <div id="servicios">
          <ServicesSection />
        </div>
        
        {/* Sección de Paquetes */}
        <div id="paquetes">
          <PackagesSection selectedFilter={activeFilter} />
        </div>
        
        {/* Sección de Nosotros */}
        <div id="nosotros">
          <AboutSection />
        </div>
        
        {/* Sección de Contacto */}
        <div id="contacto">
          <ContactSection />
        </div>
        
        {/* Secciones adicionales */}
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
      </main>

      {/* Redes Sociales Fijas */}
      <SocialMediaFixed />
    </div>
  );
};

export default LandingPage;
