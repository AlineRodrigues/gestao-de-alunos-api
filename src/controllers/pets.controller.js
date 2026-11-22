import asyncHandler from '../utils/asyncHandler.js';
import { listar as listarService, criar as criarService } from '../services/pets.service.js';

export const listar = asyncHandler(async (_req, res) => {
  res.json(await listarService());
});

export const criar = asyncHandler(async (req, res) => {
  res.status(201).json(await criarService(req.body, req.user.id));
});
