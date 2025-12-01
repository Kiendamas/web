import Contacto from '../models/contacto.js';
import { sendMail } from '../utils/mailer.js';

export const create = async (req, res, next) => {
  try {
    const contacto = await Contacto.create(req.body);
    
    // Enviar email con nodemailer
    try {
      await sendMail({
        to: 'consultas.kiendamas@gmail.com',
        subject: 'Nuevo mensaje de contacto',
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${contacto.nombre}</p>
          <p><strong>Email:</strong> ${contacto.email}</p>
          <p><strong>Tel\u00e9fono:</strong> ${contacto.telefono || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${contacto.mensaje}</p>
        `,
        text: `Nombre: ${contacto.nombre}\nEmail: ${contacto.email}\nTel\u00e9fono: ${contacto.telefono || 'No proporcionado'}\nMensaje: ${contacto.mensaje}`,
      });
      
      console.log('Email enviado exitosamente a consultas.kiendamas@gmail.com');
      res.status(201).json({ 
        ...contacto.toJSON(), 
        emailSent: true,
        message: 'Contacto guardado y email enviado correctamente' 
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // Devolver \u00e9xito pero indicar que el email fall\u00f3
      res.status(201).json({ 
        ...contacto.toJSON(), 
        emailSent: false,
        message: 'Contacto guardado pero el email no pudo ser enviado',
        emailError: emailError.message
      });
    }
  } catch (err) {
    next(err);
  }
};



