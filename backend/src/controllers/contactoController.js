import Contacto from '../models/contacto.js';
import { sendMail } from '../utils/mailer.js';

export const create = async (req, res, next) => {
  try {
    const contacto = await Contacto.create(req.body);
    // Enviar email con nodemailer
    await sendMail({
      to: 'consultas.kiendamas@gmail.com',
      subject: 'Nuevo mensaje de contacto',
      text: `Nombre: ${contacto.nombre}\nEmail: ${contacto.email}\nMensaje: ${contacto.mensaje}`,
    });
    res.status(201).json(contacto);
  } catch (err) {
    next(err);
  }
};



