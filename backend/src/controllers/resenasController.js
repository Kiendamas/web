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
    const resena = await Resena.create(req.body);
    res.status(201).json(resena);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'No encontrado' });
    await resena.update(req.body);
    res.json(resena);
  } catch (err) {
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


