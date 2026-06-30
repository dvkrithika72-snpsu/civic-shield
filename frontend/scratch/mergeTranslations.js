import fs from 'fs';
import { translationDictionary } from './src/utils/data.js';

const enPath = './src/locales/en/translation.json';
const knPath = './src/locales/kn/translation.json';

const enNew = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const knNew = JSON.parse(fs.readFileSync(knPath, 'utf8'));

const enMerged = { ...translationDictionary.en, ...enNew };
const knMerged = { ...translationDictionary.kn, ...knNew };

fs.writeFileSync(enPath, JSON.stringify(enMerged, null, 2));
fs.writeFileSync(knPath, JSON.stringify(knMerged, null, 2));
