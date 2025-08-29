import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const historia = `Kiendamas propiamente dicho nació en el año 2020, Pre pandemia. Fue un desafío muy grande… ya que literalmente el mundo se paró. Entonces aprovechamos ese tiempo para capacitarnos en muchos destinos de la mano de nuestros operadores amigos… obtuvimos muchos conocimientos y cuando la pandemia terminó estábamos listos y con muchas ganas de ofrecer a nuestros pasajeros el mejor asesoramiento.`;

const AboutHistoriaButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center">
        <span className="text-white font-raleway text-base mb-1 select-none">Nuestra Historia</span>
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center justify-center bg-kiendamas-gold hover:bg-kiendamas-darkBrown rounded-full p-2 shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kiendamas-gold focus:ring-offset-2 animate-bounce-custom"
          aria-label="Abrir historia"
        >
          <span className="block md:hidden">
            <ChevronDownIcon className="w-7 h-7 text-white group-hover:translate-y-1 transition-transform duration-200" />
          </span>
          <span className="hidden md:block">
            <ChevronRightIcon className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-3xl shadow-2xl px-8 py-10 w-full max-w-xl mx-4 animate-fade-in">
            <button
              className="absolute top-4 right-4 text-kiendamas-darkest hover:text-kiendamas-gold transition-colors text-2xl font-bold"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-kiendamas-darkest text-center mb-6 font-raleway tracking-wide">
              Nuestra Historia
            </h2>
            <p className="text-kiendamas-darkest font-raleway text-lg text-center leading-relaxed whitespace-pre-line">
              {historia}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutHistoriaButton;
