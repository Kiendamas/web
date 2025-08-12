import PaqueteTuristico from '../models/paqueteTuristico.js';
import { uploadImage } from '../config/cloudinary.js';

export const getAll = async (req, res, next) => {
  try {
    const paquetes = await PaqueteTuristico.findAll();
    res.json(paquetes);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);
    if (!paquete) return res.status(404).json({ error: 'No encontrado' });
    res.json(paquete);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    let imagenesUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImage(file.path, 'paquetes'));
      const results = await Promise.all(uploadPromises);
      imagenesUrls = results.map(r => r.secure_url);
    }
    const paqueteData = {
      ...req.body,
      imagenes: imagenesUrls,
    };
    const paquete = await PaqueteTuristico.create(paqueteData);
    res.status(201).json(paquete);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);
    if (!paquete) return res.status(404).json({ error: 'No encontrado' });
    let imagenesUrls = paquete.imagenes || [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImage(file.path, 'paquetes'));
      const results = await Promise.all(uploadPromises);
      imagenesUrls = imagenesUrls.concat(results.map(r => r.secure_url));
    }
    await paquete.update({
      ...req.body,
      imagenes: imagenesUrls,
    });
    res.json(paquete);
  } catch (err) {
    next(err);
  }
};

export const deletePaquete = async (req, res, next) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);
    if (!paquete) return res.status(404).json({ error: 'No encontrado' });
    await paquete.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
};


