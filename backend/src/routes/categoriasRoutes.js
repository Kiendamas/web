import { Router } from 'express';
import {getAll, getOne, create, update, deleteCategoria} from '../controllers/categoriasController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteCategoria);

export default router;
