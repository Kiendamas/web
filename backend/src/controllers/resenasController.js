import Resena from '../models/resena.js';

export const getAll = async (req, res, next) => {
  try {
    const resenas = await Resena.findAll();
    res.json(resenas);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'No encontrado' });
    res.json(resena);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // Asegurar que el comentario se guarde tanto en texto como en comentario
    const resenaData = {
      ...req.body,
      texto: req.body.comentario || req.body.texto,
    };
    
    const resena = await Resena.create(resenaData);
    res.status(201).json(resena);
  } catch (err) {
    console.error('Error creating resena:', err);
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'No encontrado' });
    
    // Asegurar que el comentario se guarde tanto en texto como en comentario
    const updateData = {
      ...req.body,
      texto: req.body.comentario || req.body.texto,
    };
    
    await resena.update(updateData);
    res.json(resena);
  } catch (err) {
    console.error('Error updating resena:', err);
    next(err);
  }
};

export const deleteResena = async (req, res, next) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'No encontrado' });
    await resena.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
};


