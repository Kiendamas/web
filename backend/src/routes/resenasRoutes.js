import { Router } from 'express';

import {getAll, getOne, create, update, deleteResena} from '../controllers/resenasController.js'

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteResena);

export default router;
