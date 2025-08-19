import React from 'react';
import marianaImg from '../../assets/MARIANA.png';
import diegoImg from '../../assets/DIEGO.png';
import virginiaImg from '../../assets/VIRGINIA.png';

const AboutSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'MARIANA',
      image: marianaImg,
      subtitle: 'mariana@kiendamas.com.ar'
    },
    {
      id: 2,
      name: 'DIEGO',
      image: diegoImg,
      subtitle: 'diego@kiendamas.com.ar'
    },
    {
      id: 3,
      name: 'VIRGINIA',
      image: virginiaImg,
      subtitle: 'virginia@kiendamas.com.ar'
    }
  ];

  return (
    <section className="py-16 bg-kiendamas-rosa" id="nosotros">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de la sección desde el lado izquierdo */}
        <div className="relative mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="bg-white rounded-r-3xl pl-4 sm:pl-6 lg:pl-8 pr-12 py-4 max-w-md">
            <h2 className="text-3xl font-normal text-kiendamas-text font-raleway leading-none">
              Nosotros
            </h2>
          </div>
        </div>

        {/* Grid de miembros del equipo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center"
            >
              {/* Card con imagen */}
              <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-64 h-64 flex items-center justify-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 object-contain"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f3f4f6'/%3E%3Ctext x='80' y='80' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3E" + member.name + "%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Nombre del miembro */}
              <h3 className="text-2xl font-bold text-white font-raleway mb-2">
                {member.name}
              </h3>

              {/* Subtítulo */}
              <p className="text-white font-raleway text-sm opacity-90">
                {member.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
