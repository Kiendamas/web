import { Router } from 'express';

import {getAll, getOne, create, update, deleteSubcategoria} from '../controllers/subcategoriasController.js'


const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteSubcategoria);

export default router;
