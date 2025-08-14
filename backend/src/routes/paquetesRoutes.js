import { Router } from 'express';
import { getAll, getOne, getByCategoria, getBySubcategoria, getFiltered, create, update, deletePaquete } from '../controllers/paquetesController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getFiltered); // Usar getFiltered como principal que maneja filtros opcionales
router.get('/categoria/:categoriaId', getByCategoria);
router.get('/subcategoria/:subcategoriaId', getBySubcategoria);
router.get('/all', getAll); // Endpoint específico para obtener todos sin filtros
router.get('/:id', getOne);
router.post('/', upload.array('imagenes', 10), create);
router.put('/:id', upload.array('imagenes', 10), update);
router.delete('/:id', deletePaquete);

export default router;
