import { es } from '../src/js/i18n/es.js';
import { en } from '../src/js/i18n/en.js';

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

const esKeys = new Set(flattenKeys(es));
const enKeys = new Set(flattenKeys(en));

const missingInEn = [...esKeys].filter((key) => !enKeys.has(key));
const missingInEs = [...enKeys].filter((key) => !esKeys.has(key));

if (missingInEn.length || missingInEs.length) {
  if (missingInEn.length) {
    console.error('Keys missing in en.js:', missingInEn.join(', '));
  }
  if (missingInEs.length) {
    console.error('Keys missing in es.js:', missingInEs.join(', '));
  }
  process.exit(1);
}

console.log(`i18n OK: ${esKeys.size} keys matched in es.js and en.js`);
