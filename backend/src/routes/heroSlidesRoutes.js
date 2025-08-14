import { Router } from 'express';
import { getAll, getAllAdmin, getOne, create, update, deleteSlide, updateOrder, toggleActive } from '../controllers/heroSlidesController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';
import multer from 'multer';

// Configurar multer con límites más grandes para videos
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit para videos
  },
  fileFilter: (req, file, cb) => {
    // Permitir imágenes y videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen y video'), false);
    }
  }
});

const router = Router();

// Rutas públicas
router.get('/', getAll);
router.get('/:id', getOne);

// Rutas protegidas (admin)
router.get('/admin/all', authenticateToken, isAdmin, getAllAdmin);
router.post('/', 
  authenticateToken, 
  isAdmin, 
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
  ]), 
  create
);
router.put('/:id', 
  authenticateToken, 
  isAdmin, 
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
  ]), 
  update
);
router.delete('/:id', authenticateToken, isAdmin, deleteSlide);
router.put('/:id/toggle-active', authenticateToken, isAdmin, toggleActive);
router.put('/admin/update-order', authenticateToken, isAdmin, updateOrder);

export default router;
