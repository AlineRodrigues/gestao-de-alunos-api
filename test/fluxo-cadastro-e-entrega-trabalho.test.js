import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import testData from './helpers/testData.js';
import { loginAsAdmin, loginAsAluno } from './helpers/authHelper.js';

const execucaoId = Date.now();

const dadosNovoAluno = {
  nome: testData.novoAluno.nome,
  email: `${testData.novoAluno.emailPrefixo}.${execucaoId}@example.com`,
  matricula: `${testData.novoAluno.matriculaPrefixo}-${execucaoId}`,
  senha: testData.novoAluno.senha,
};

describe('Fluxo: Admin cadastra aluno -> aluno loga -> aluno entrega trabalho', () => {
  let adminToken;
  let alunoId;
  let alunoToken;

  before(async () => {
    const { token } = await loginAsAdmin();
    adminToken = token;
  });

  it('1) Deve logar como administrador e obter um token válido', () => {
    expect(adminToken).to.be.a('string').and.not.empty;
  });

  it('2) Admin deve cadastrar um novo aluno', async () => {
    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(dadosNovoAluno);

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      nome: dadosNovoAluno.nome,
      email: dadosNovoAluno.email,
      matricula: dadosNovoAluno.matricula,
    });
    expect(resposta.body).to.have.property('id');
    expect(resposta.body).to.not.have.property('senha');

    alunoId = resposta.body.id;
  });

  it('3) Admin deve matricular o aluno recém-cadastrado na disciplina de teste', async () => {
    const resposta = await request(app)
      .post(`/api/admin/disciplinas/${testData.disciplinaId}/matriculas`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ alunoId });

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      alunoId,
      disciplinaId: testData.disciplinaId,
    });
  });

  it('4) O novo aluno deve logar com sucesso usando a senha definida pelo admin', async () => {
    const { token, usuario } = await loginAsAluno(dadosNovoAluno.email, dadosNovoAluno.senha);

    expect(token).to.be.a('string').and.not.empty;
    expect(usuario.role).to.equal('aluno');
    expect(usuario.id).to.equal(alunoId);

    alunoToken = token;
  });

  it('5) O aluno deve registrar a entrega de um trabalho na disciplina em que está matriculado', async () => {
    const resposta = await request(app)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${alunoToken}`)
      .send({
        disciplinaId: testData.disciplinaId,
        titulo: testData.trabalho.titulo,
        descricao: testData.trabalho.descricao,
      });

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      alunoId,
      disciplinaId: testData.disciplinaId,
      titulo: testData.trabalho.titulo,
      status: 'entregue',
    });
    expect(resposta.body).to.have.property('id');
  });

  it('6) O trabalho registrado deve aparecer na listagem de trabalhos do aluno', async () => {
    const resposta = await request(app)
      .get(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${alunoToken}`);

    expect(resposta.status).to.equal(200);
    const titulos = resposta.body.map((trabalho) => trabalho.titulo);
    expect(titulos).to.include(testData.trabalho.titulo);
  });
});
