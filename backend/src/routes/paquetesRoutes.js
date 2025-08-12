import { Router } from 'express';
import { getAll, getOne, create, update, deletePaquete } from '../controllers/paquetesController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', upload.array('imagenes', 10), create);
router.put('/:id', upload.array('imagenes', 10), update);
router.delete('/:id', deletePaquete);

export default router;
