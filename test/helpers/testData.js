import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'data', 'testData.json');
const testData = JSON.parse(readFileSync(dataPath, 'utf8'));

export default testData;
