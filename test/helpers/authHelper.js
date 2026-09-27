import request from 'supertest';
import app from '../../src/app.js';
import testData from './testData.js';

export async function loginAsAdmin() {
  const { email, senha } = testData.admin;

  const resposta = await request(app).post('/api/auth/login').send({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha ao logar como administrador (status ${resposta.status}): ${JSON.stringify(resposta.body)}`
    );
  }

  return { token: resposta.body.token, usuario: resposta.body.usuario };
}

export async function loginAsAluno(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha ao logar como aluno (status ${resposta.status}): ${JSON.stringify(resposta.body)}`
    );
  }

  return { token: resposta.body.token, usuario: resposta.body.usuario };
}

export default { loginAsAdmin, loginAsAluno };
