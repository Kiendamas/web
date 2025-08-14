import HeroSlide from '../models/heroSlide.js';
import { uploadImage } from '../config/cloudinary.js';

export const getAll = async (req, res, next) => {
  try {
    const slides = await HeroSlide.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
    });
    res.json(slides);
  } catch (err) {
    next(err);
  }
};

export const getAllAdmin = async (req, res, next) => {
  try {
    const slides = await HeroSlide.findAll({
      order: [['order', 'ASC']],
    });
    res.json(slides);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide no encontrado' });
    res.json(slide);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    let mediaUrl = req.body.mediaUrl;
    let posterUrl = req.body.posterUrl;

    // Si se subió un archivo de media
    if (req.files && req.files['media'] && req.files['media'][0]) {
      const mediaResult = await uploadImage(req.files['media'][0].path, 'hero');
      mediaUrl = mediaResult.secure_url;
    }

    // Si se subió un archivo de poster (para videos)
    if (req.files && req.files['poster'] && req.files['poster'][0]) {
      const posterResult = await uploadImage(req.files['poster'][0].path, 'hero/posters');
      posterUrl = posterResult.secure_url;
    }

    const slideData = {
      ...req.body,
      mediaUrl,
      posterUrl,
    };

    const slide = await HeroSlide.create(slideData);
    res.status(201).json(slide);
  } catch (err) {
    console.error('Error creating hero slide:', err);
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide no encontrado' });

    let mediaUrl = req.body.mediaUrl || slide.mediaUrl;
    let posterUrl = req.body.posterUrl || slide.posterUrl;

    // Si se subió un nuevo archivo de media
    if (req.files && req.files['media'] && req.files['media'][0]) {
      const mediaResult = await uploadImage(req.files['media'][0].path, 'hero');
      mediaUrl = mediaResult.secure_url;
    }

    // Si se subió un nuevo archivo de poster
    if (req.files && req.files['poster'] && req.files['poster'][0]) {
      const posterResult = await uploadImage(req.files['poster'][0].path, 'hero/posters');
      posterUrl = posterResult.secure_url;
    }

    const updateData = {
      ...req.body,
      mediaUrl,
      posterUrl,
    };

    await slide.update(updateData);
    res.json(slide);
  } catch (err) {
    console.error('Error updating hero slide:', err);
    next(err);
  }
};

export const deleteSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide no encontrado' });
    
    await slide.destroy();
    res.json({ message: 'Slide eliminado' });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { slides } = req.body; // Array de { id, order }
    
    const updatePromises = slides.map(slideData => 
      HeroSlide.update(
        { order: slideData.order },
        { where: { id: slideData.id } }
      )
    );

    await Promise.all(updatePromises);
    
    const updatedSlides = await HeroSlide.findAll({
      order: [['order', 'ASC']],
    });
    
    res.json(updatedSlides);
  } catch (err) {
    next(err);
  }
};

export const toggleActive = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide no encontrado' });
    
    await slide.update({ isActive: !slide.isActive });
    res.json(slide);
  } catch (err) {
    next(err);
  }
};
