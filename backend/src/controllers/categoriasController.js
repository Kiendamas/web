
import Categoria from '../models/categoria.js';

export const createUser = async (req, res, next) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    res.json(categoria);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    await categoria.update(req.body);
    res.json(categoria);
  } catch (err) {
    next(err);
  }
};

export const deleteCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'No encontrado' });
    await categoria.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
};


