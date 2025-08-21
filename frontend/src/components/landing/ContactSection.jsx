import React, { useState } from 'react';
import { HiOutlineMapPin, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { useCreateContactoMutation } from '../../features/contacto/contactoApi';

const ContactSection = () => {
  const [createContacto, { isLoading }] = useCreateContactoMutation();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContacto(formData).unwrap();
      setShowSuccess(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error al enviar contacto:', error);
    }
  };

  return (
    <section className="py-16 bg-kiendamas-lightBeige w-full" id="contacto">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        {/* Título de la sección */}
        <div className="relative mb-10 -ml-10">
          <div className="bg-kiendamas-beige rounded-r-3xl pl-10 sm:pl-6  pr-8 py-3 max-w-xs sm:max-w-md shadow-[0_4px_24px_0_#89898930] border border-[#89898930]">
            <h2 className="text-xl sm:text-2xl xl:text-2xl 2xl:text-3xl font-normal text-kiendamas-text font-raleway leading-none">
              Contacto
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Lado izquierdo - Mapa e información */}
          <div className="space-y-8">
            {/* Mapa */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.905930348507!2d-60.66821244353273!3d-32.927083531455835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b654ad065c3ef5%3A0x8ca54d59f7e0e56d!2sThedy%20158%2C%20S2000%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1755742396661!5m2!1ses-419!2sar"
                width="100%"
                height="530"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Kiendamas"
              ></iframe>
            </div>

            {/* Información de contacto */}
            {/* Información de contacto estilo barra */}
            <div className="rounded-xl overflow-hidden shadow-lg">
              {/* Fila de títulos */}
              <div className="grid grid-cols-3 bg-kiendamas-brown text-white rounded-t-xl">
                <div className="flex items-center justify-center gap-2 px-2 py-3 border-r border-kiendamas-beige/40">
                  <HiOutlineMapPin size={20} color="#F6DFA9" />
                  <span className="font-bold font-raleway text-base">Nuestra Oficina</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-2 py-3 border-r border-kiendamas-beige/40">
                  <FaWhatsapp size={20} color="#F6DFA9" />
                  <span className="font-bold font-raleway text-base">Teléfono</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-2 py-3">
                  <HiOutlineGlobeAlt size={20} color="#F6DFA9" />
                  <span className="font-bold font-raleway text-base">Redes</span>
                </div>
              </div>
              {/* Fila de datos */}
              <div className="grid grid-cols-3 bg-white text-kiendamas-text rounded-b-xl shadow px-2 py-2 text-sm font-semibold font-raleway">
                <div className="flex flex-col items-center justify-center text-center">
                  Thedy 158 bis PB 04<br />
                  Puerto Norte - Rosario
                </div>
                <div className="flex items-center justify-center text-center">
                  +54 9 3415858303
                </div>
                <div className="flex items-center justify-center text-center">
                  kiendamas_viajes
                </div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Formulario */}
          <div>
            <div className="bg-white rounded-2xl p-7 shadow-lg">
              {/* Título del formulario */}
              <div className="bg-kiendamas-brown text-white rounded-full px-6 py-2 inline-block mb-6">
                <h3 className="font-bold text-lg font-raleway">Dejanos tu consulta</h3>
              </div>

              {/* Mensaje de éxito */}
              {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  ¡Mensaje enviado correctamente! Te contactaremos pronto.
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre y Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-kiendamas-text mb-2 font-raleway">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre y Apellido"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-kiendamas-beige focus:ring-2 focus:ring-kiendamas-brown focus:border-transparent font-normal font-raleway"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-kiendamas-text mb-2 font-raleway">
                    Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Mail"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-kiendamas-beige focus:ring-2 focus:ring-kiendamas-brown focus:border-transparent font-raleway"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-kiendamas-text mb-2 font-raleway">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-kiendamas-beige focus:ring-2 focus:ring-kiendamas-brown focus:border-transparent font-raleway"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-semibold text-kiendamas-text mb-2 font-raleway">
                    Tu Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    placeholder="Texto"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-kiendamas-beige focus:ring-2 focus:ring-kiendamas-brown focus:border-transparent font-raleway resize-none"
                  ></textarea>
                </div>

                {/* Botón enviar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-kiendamas-brown hover:bg-kiendamas-darkBrown text-white font-bold py-2 px-8 rounded-full transition-colors duration-200 font-raleway disabled:opacity-50 justify-items-center"
                >
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
