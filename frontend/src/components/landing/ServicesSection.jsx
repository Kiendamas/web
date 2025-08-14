import React from 'react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: '/src/assets/avion.png',
      title: 'VIAJES INTERNACIONALES',
      description: 'Paquetes y experiencias a destinos como Europa, Turquía, Egipto, Universo y demás continentes.',
    },
    {
      id: 2,
      icon: '/src/assets/sol.png',
      title: 'TURISMO NACIONAL',
      description: 'Paquetes dentro del territorio de todos los destinos de Argentina, con opciones grupales o individuales.',
    },
    {
      id: 3,
      icon: '/src/assets/serviciosOperador.png',
      title: 'SERVICIOS DE VIAJES',
      description: 'Vuelos, hoteles, alquiler de autos, actividades al destino y agencia integral de servicios.',
    },
  ];

  return (
    <section id="servicios" className="py-16 bg-kiendamas-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="text-center group cursor-pointer"
            >
              {/* Icono */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-kiendamas-beige rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-12 h-12 object-contain filter brightness-0"
                    style={{ filter: 'brightness(0) saturate(100%) invert(40%) sepia(8%) saturate(736%) hue-rotate(314deg) brightness(97%) contrast(88%)' }}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23F2E2CE'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23646464' font-family='Raleway' font-size='20' font-weight='bold'%3E✈%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>

              {/* Título */}
              <h3 className="font-raleway font-bold text-lg text-kiendamas-beige mb-4 leading-tight">
                {service.title}
              </h3>

              {/* Descripción */}
              <p className="font-raleway text-kiendamas-beige/90 text-sm leading-relaxed max-w-sm mx-auto">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
