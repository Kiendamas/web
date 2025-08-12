import Subcategoria from '../models/subcategoria.js';

export const getAll = async (req, res, next) => {
  try {
    const subcategorias = await Subcategoria.findAll();
    res.json(subcategorias);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const subcategoria = await Subcategoria.findByPk(req.params.id);
    if (!subcategoria) return res.status(404).json({ error: 'No encontrado' });
    res.json(subcategoria);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const subcategoria = await Subcategoria.create(req.body);
    res.status(201).json(subcategoria);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const subcategoria = await Subcategoria.findByPk(req.params.id);
    if (!subcategoria) return res.status(404).json({ error: 'No encontrado' });
    await subcategoria.update(req.body);
    res.json(subcategoria);
  } catch (err) {
    next(err);
  }
};

export const deleteSubcategoria = async (req, res, next) => {
  try {
    const subcategoria = await Subcategoria.findByPk(req.params.id);
    if (!subcategoria) return res.status(404).json({ error: 'No encontrado' });
    await subcategoria.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
};


