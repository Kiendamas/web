import { Router } from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import paquetesRoutes from './paquetesRoutes.js';
import categoriasRoutes from './categoriasRoutes.js';
import subcategoriasRoutes from './subcategoriasRoutes.js';
import resenasRoutes from './resenasRoutes.js';
import contactoRoutes from './contactoRoutes.js';
import heroSlidesRoutes from './heroSlidesRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/paquetes', paquetesRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/subcategorias', subcategoriasRoutes);
router.use('/resenas', resenasRoutes);
router.use('/contacto', contactoRoutes);
router.use('/hero-slides', heroSlidesRoutes);

export default router;