# Globe Lift Parts — Catálogo de Productos

Catálogo de repuestos para ascensores y escaleras mecánicas con carrito de cotización.
Construido con **React + Vite + TypeScript + Tailwind CSS**.

---

## Instalación

```bash
npm install
```

---

## Regenerar datos desde el Excel

El archivo Excel debe estar en `data/LiftParts_Final_MVP__1_.xlsx`.

```bash
npm run build:data
```

El script:
- Lee la hoja `Hoja1` del Excel.
- Normaliza los campos `EQUIP0` y `Marca` (elimina duplicados por mayúsculas/espacios).
- Lee las imágenes desde `SOURCE_IMAGES_DIR` (ver nota más abajo) y las copia a `public/images/`.
- Genera `src/data/products.json`.

> **Nota sobre imágenes:** las imágenes de los productos se leen desde:
> ```
> C:\Users\NicoleMatus\Desktop\imgs-final
> ```
> Si la carpeta cambia de ubicación, edita la constante `SOURCE_IMAGES_DIR` al inicio de
> `scripts/build-products.mjs`. El script es idempotente: puede ejecutarse múltiples veces
> sin duplicar archivos.

---

## Levantar el servidor de desarrollo

```bash
npm run dev
```

La app quedará disponible en [http://localhost:5173](http://localhost:5173).

---

## Build de producción

```bash
npm run build:data   # Regenerar JSON + copiar imágenes
npm run build        # Compilar para producción → dist/
npm run preview      # Previsualizar el build
```

---

## Estructura de datos

Cada producto en `src/data/products.json` tiene los campos:

| Campo | Descripción |
|-------|-------------|
| `sku` | Código único del producto |
| `descripcion` | Nombre/descripción del producto |
| `partNumberFabricante` | Part number del fabricante original |
| `codigoGlobe` | Código interno Globe Mantenciones |
| `subNombres` | Sinónimos / nombres alternativos |
| `equipo` | Tipo de equipo (ASCENSOR / ESCALA MECANICA) |
| `marca` | Marca del producto (normalizada) |
| `imagen` | Ruta de imagen relativa a `public/` |

---

## Stack

- **React 19 + Vite 8** — SPA con hot reload
- **TypeScript** — tipado estricto
- **Tailwind CSS 3** — estilos con paleta de marca `brand-{50..950}`
- **lucide-react** — íconos
- **xlsx** — lectura de Excel (solo en build:data)
- **Context API + useReducer** — estado del carrito (sin persistencia)
