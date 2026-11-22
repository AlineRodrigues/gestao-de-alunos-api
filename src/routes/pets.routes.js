import { Router } from 'express';
import { criar, listar } from '../controllers/pets.controller.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

// As consultas e o cadastro de pets exigem login e token JWT válido.
router.use(authenticate);
router.get('/', listar);
router.post('/', criar);

export default router;
