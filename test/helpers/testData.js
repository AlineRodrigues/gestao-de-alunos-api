import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Carregamos o JSON via fs + JSON.parse (em vez de "import ... with { type: 'json' }")
// de propósito: essa sintaxe de import de JSON nativo do Node ainda varia
// entre versões (18/20/22), e essa abordagem funciona em qualquer uma delas
// sem flags experimentais — importante para não quebrar o pipeline do
// GitHub Actions caso a versão do Node do runner mude.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'data', 'testData.json');

/**
 * Dados usados pelos testes de API (Data-Driven Testing).
 * Fonte única: test/data/testData.json
 */
const testData = JSON.parse(readFileSync(dataPath, 'utf8'));

export default testData;
