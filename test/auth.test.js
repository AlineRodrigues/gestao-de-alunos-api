import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

// Observação: a conexão do Mongoose é global (compartilhada por todos os
// arquivos de teste) e é fechada uma única vez, após toda a suíte rodar,
// em test/hooks/rootHooks.js — por isso não fazemos isso aqui.
describe('POST /api/auth/login', () => {
  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'admin123' });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'senha-incorreta' });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });
});
