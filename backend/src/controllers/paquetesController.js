import PaqueteTuristico from '../models/paqueteTuristico.js';
import Categoria from '../models/categoria.js';
import Subcategoria from '../models/subcategoria.js';
import { uploadImage } from '../config/cloudinary.js';

export const getAll = async (req, res, next) => {
  try {
    const paquetes = await PaqueteTuristico.findAll({
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        },
        {
          model: Subcategoria,
          attributes: ['id', 'nombre']
        }
      ]
    });
    res.json(paquetes);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id, {
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        },
        {
          model: Subcategoria,
          attributes: ['id', 'nombre']
        }
      ]
    });
    if (!paquete) return res.status(404).json({ error: 'No encontrado' });
    res.json(paquete);
  } catch (err) {
    next(err);
  }
};

export const getByCategoria = async (req, res, next) => {
  try {
    const { categoriaId } = req.params;
    const paquetes = await PaqueteTuristico.findAll({
      where: { categoriaId },
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        },
        {
          model: Subcategoria,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['subcategoriaId', 'ASC'], ['nombre', 'ASC']]
    });
    res.json(paquetes);
  } catch (err) {
    next(err);
  }
};

export const getBySubcategoria = async (req, res, next) => {
  try {
    const { subcategoriaId } = req.params;
    const paquetes = await PaqueteTuristico.findAll({
      where: { subcategoriaId },
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        },
        {
          model: Subcategoria,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json(paquetes);
  } catch (err) {
    next(err);
  }
};

export const getFiltered = async (req, res, next) => {
  try {
    const { categoria, subcategoria, tipo } = req.query;
    const whereClause = {};
    
    if (categoria) whereClause.categoriaId = categoria;
    if (subcategoria) whereClause.subcategoriaId = subcategoria;
    if (tipo) whereClause.tipo = tipo;
    
    const paquetes = await PaqueteTuristico.findAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        },
        {
          model: Subcategoria,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json(paquetes);
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
    let moneda = req.body.moneda;
    if (Array.isArray(moneda)) {
      moneda = moneda[0];
    }
    if (typeof moneda === 'string' && moneda.trim() === '') {
      moneda = null;
    }
    if (moneda && !['ARS', 'USD'].includes(moneda)) {
      moneda = null;
    }
    // Parsear tags si viene como string
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [];
      }
    }
    if (!Array.isArray(tags)) tags = [];
    const paqueteData = {
      ...req.body,
      imagenes: imagenesUrls,
      moneda,
      tags,
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
    
    // Manejar imágenes existentes que se quieren mantener
    let imagenesUrls = [];
    if (req.body.imagenesExistentes) {
      try {
        imagenesUrls = JSON.parse(req.body.imagenesExistentes);
      } catch (e) {
        imagenesUrls = paquete.imagenes || [];
      }
    } else {
      imagenesUrls = paquete.imagenes || [];
    }
    
    // Agregar nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImage(file.path, 'paquetes'));
      const results = await Promise.all(uploadPromises);
      imagenesUrls = imagenesUrls.concat(results.map(r => r.secure_url));
    }
    
    // Forzar moneda válida o null
    let moneda = req.body.moneda;
    if (Array.isArray(moneda)) {
      moneda = moneda[0];
    }
    console.log('[UPDATE PAQUETE] Moneda recibida en body:', req.body.moneda);
    if (typeof moneda === 'string' && moneda.trim() === '') {
      moneda = null;
    }
    if (moneda && !['ARS', 'USD'].includes(moneda)) {
      moneda = null;
    }
    // Parsear tags si viene como string
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [];
      }
    }
    if (!Array.isArray(tags)) tags = [];
    await paquete.update({
      ...req.body,
      imagenes: imagenesUrls,
      moneda,
      tags,
    });
    console.log('[UPDATE PAQUETE] Moneda guardada en modelo:', paquete.moneda, '| Nueva:', moneda);
    
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


