/**
 * build-products.mjs
 *
 * Reads LiftParts_Final_MVP__1_.xlsx from ./data/, normalizes fields,
 * copies images from SOURCE_IMAGES_DIR to public/images/, and writes
 * src/data/products.json.
 *
 * Run with: node scripts/build-products.mjs
 * (or via: npm run build:data)
 */

import { writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { resolve, dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const EXCEL_PATH        = resolve(ROOT, 'data', 'LiftParts_Final_MVP__1_.xlsx');
const OUTPUT_JSON       = resolve(ROOT, 'src', 'data', 'products.json');
const PUBLIC_IMAGES     = resolve(ROOT, 'public', 'images');
/** Change this constant if the source images directory moves. */
const SOURCE_IMAGES_DIR = "C:/Users/NicoleMatus/Desktop/imgs-final";
const SHEET_NAME        = 'Hoja1';
// ─────────────────────────────────────────────────────────────────────────────

// Brand normalization: lowercase-trimmed key → canonical value
const BRAND_MAP = {
  'otis':          'Otis',
  'selcom':        'Selcom',
  'step':          'Step',
  'wittur':        'Wittur',
  'thyssen':       'ThyssenKrupp',
  'thyssenkrupp':  'ThyssenKrupp',
  'universal':     'Universal',
  'lg':            'LG',
};

// Equipo normalization: trimmed-uppercase → canonical
function normalizeEquipo(raw) {
  const t = (raw || '').trim().toUpperCase().replace(/\s+/g, ' ');
  if (t === 'ASCENSOR') return 'ASCENSOR';
  if (t.startsWith('ESCALA MECANICA')) return 'ESCALA MECANICA';
  return t;
}

function normalizeBrand(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (BRAND_MAP[lower]) return BRAND_MAP[lower];
  // Title-case
  return trimmed
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function str(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

// ── Ensure directories exist ──────────────────────────────────────────────────
mkdirSync(PUBLIC_IMAGES, { recursive: true });
mkdirSync(resolve(ROOT, 'src', 'data'), { recursive: true });

// ── Build image lookup map: SKU-UPPERCASE → { filePath, ext } ─────────────────
const imageMap = new Map();

if (existsSync(SOURCE_IMAGES_DIR)) {
  const files = readdirSync(SOURCE_IMAGES_DIR);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) continue;
    const nameNoExt = file.slice(0, file.length - ext.length).toUpperCase();
    imageMap.set(nameNoExt, { filePath: join(SOURCE_IMAGES_DIR, file), ext });
  }
  console.log(`Found ${imageMap.size} images in ${SOURCE_IMAGES_DIR}`);
} else {
  console.warn(`WARNING: Source images directory not found: ${SOURCE_IMAGES_DIR}`);
  console.warn('All products will use placeholder image.');
}

// ── Create placeholder SVG ───────────────────────────────────────────────────
const placeholderPath = resolve(PUBLIC_IMAGES, 'placeholder.svg');
if (!existsSync(placeholderPath)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#F3F4F6"/>
  <rect x="50" y="50" width="200" height="200" rx="8" fill="#E5E7EB"/>
  <text x="150" y="142" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#9CA3AF" font-weight="500">Sin imagen</text>
  <text x="150" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#D1D5DB">Imagen no disponible</text>
</svg>`;
  writeFileSync(placeholderPath, svg, 'utf8');
  console.log('Created placeholder.svg');
}

// ── Read Excel ────────────────────────────────────────────────────────────────
if (!existsSync(EXCEL_PATH)) {
  console.error(`ERROR: Excel file not found at ${EXCEL_PATH}`);
  process.exit(1);
}

const workbook = XLSX.readFile(EXCEL_PATH);
const sheet = workbook.Sheets[SHEET_NAME];
if (!sheet) {
  console.error(`ERROR: Sheet "${SHEET_NAME}" not found. Available: ${workbook.SheetNames.join(', ')}`);
  process.exit(1);
}

const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
console.log(`Read ${rows.length} rows from Excel`);

// ── Process rows ──────────────────────────────────────────────────────────────
let skipped = 0;
let noImage = 0;
const products = [];
const seenSkus = new Set();

for (const row of rows) {
  const rawSku = str(row['Códigos Lift Parts SKU']);
  if (!rawSku) { skipped++; continue; }

  // A single cell may contain multiple SKUs separated by \r\n (multi-line cell in Excel)
  const skuList = rawSku.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  const descripcion          = str(row['DESCRIPCIÓN']);
  const partNumberFabricante = str(row['Part Number Fabricante']);
  const codigoGlobe          = str(row['Código Globe Mantenciones']);
  const subNombres           = str(row['Sub Nombres']);
  const equipo               = normalizeEquipo(row['EQUIP0']);
  const marca                = normalizeBrand(row['Marca']);

  for (const sku of skuList) {
    if (seenSkus.has(sku)) { skipped++; continue; }
    seenSkus.add(sku);

    const skuUpper = sku.toUpperCase();
    // Also try with / replaced by _ (some image files use underscore for slash)
    const skuUpperAlt = skuUpper.replace(/\//g, '_');
    let imagen = '/images/placeholder.svg';
    const imgEntry = imageMap.get(skuUpper) || imageMap.get(skuUpperAlt);
    if (imgEntry) {
      // Use the sku as-is for dest filename, replacing / with _ (/ is invalid in filenames)
      const safeSku = sku.replace(/\//g, '_');
      const destName = `${safeSku}${imgEntry.ext}`;
      const destPath = resolve(PUBLIC_IMAGES, destName);
      if (!existsSync(destPath)) {
        copyFileSync(imgEntry.filePath, destPath);
      }
      imagen = `/images/${destName}`;
    } else {
      noImage++;
    }

    products.push({ sku, descripcion, partNumberFabricante, codigoGlobe, subNombres, equipo, marca, imagen });
  }
}

// ── Write output ──────────────────────────────────────────────────────────────
writeFileSync(OUTPUT_JSON, JSON.stringify(products, null, 2), 'utf8');

console.log('');
console.log('='.repeat(50));
console.log(`✓  products.json written to: src/data/products.json`);
console.log(`   Products generated : ${products.length}`);
console.log(`   Rows skipped       : ${skipped} (no SKU or duplicate)`);
console.log(`   Without image      : ${noImage} (using placeholder)`);
console.log(`   With image         : ${products.length - noImage}`);
console.log('='.repeat(50));
