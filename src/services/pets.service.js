import Pet from '../models/pet.model.js';
import ApiError from '../utils/ApiError.js';

export async function listar() {
  return Pet.find().sort({ createdAt: -1 });
}

export async function criar(dados, usuarioId) {
  const { nome, especie, raca, idade } = dados;
  if (!nome || !especie) {
    throw new ApiError(400, 'Os campos "nome" e "especie" são obrigatórios.');
  }
  if (idade !== undefined && idade !== null && (!Number.isInteger(idade) || idade < 0)) {
    throw new ApiError(400, 'O campo "idade" deve ser um número inteiro maior ou igual a zero.');
  }

  const pet = new Pet({ nome, especie, raca, idade, criadoPor: usuarioId });
  await pet.save();
  return pet;
}

export default { listar, criar };
