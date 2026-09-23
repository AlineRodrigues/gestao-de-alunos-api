import mongoose from 'mongoose';

/**
 * Root Hook Plugin do Mocha (https://mochajs.org/#root-hook-plugins).
 *
 * O projeto abre UMA única conexão global com o MongoDB no momento em que
 * "src/database/db.js" é importado (import de "../src/app.js" nos testes
 * dispara essa cadeia de imports). Como vários arquivos de teste importam
 * "app.js", todos compartilham essa mesma conexão.
 *
 * Por isso, o encerramento da conexão (mongoose.connection.close()) não
 * pode ficar dentro de um "after" de um arquivo de teste específico: se
 * outro arquivo de teste ainda for rodar depois, ele ficaria sem conexão
 * com o banco. Centralizamos o close aqui, em um hook de nível raiz,
 * carregado uma única vez via ".mocharc.json" (chave "require"), que só
 * roda depois que TODA a suíte de testes terminar.
 */
export const mochaHooks = {
  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  },
};
