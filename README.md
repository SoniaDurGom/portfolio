# Portfolio — Sonia Durán Gómez

Portfolio público de **Sonia Durán Gómez**, desarrolladora web frontend especializada en CMS, WordPress, PrestaShop e implementación UI.

## Enfoque

- Versión **pública y anonimizada**: casos de estudio sin nombres de clientes.
- Idiomas **ES / EN** con detección del navegador y preferencia guardada.
- Orientado a oportunidades **Junior Frontend** y **prácticas Full Stack** en España.

## Stack del proyecto

- HTML5 · Sass · JavaScript (ES6+)
- Webpack · GSAP · Swiper
- Git · GitHub Pages (despliegue público)

## Scripts

```bash
npm install
npm start          # desarrollo local
npm run build      # producción → /dist
npm run test:i18n  # valida paridad de claves es.js / en.js
npm test           # alias de test:i18n
npm run deploy     # build + publicación en rama gh-pages (GitHub Pages)
```

## Internacionalización (i18n)

| Archivo | Descripción |
|---------|-------------|
| `src/js/i18n/es.js` | Textos en español |
| `src/js/i18n/en.js` | Textos en inglés |
| `src/js/i18n/index.js` | Lógica de cambio de idioma |

- Atributos en HTML: `data-i18n`, `data-i18n-html`, `data-i18n-aria`, `data-case-id`, `data-exp-id`, `data-testimonial`.
- Casos de estudio: claves `cases.c1` … `cases.c13` con campos `li1`, `li2`, etc.
- URL con idioma: `?lang=es` o `?lang=en`.
- Tras añadir claves nuevas, ejecutar `npm run test:i18n` para comprobar que `es.js` y `en.js` coinciden.

## Ramas

| Rama | Uso |
|------|-----|
| `rediseño-2026` | Código fuente del rediseño (trabajo activo) |
| `gh-pages` | Sitio publicado en GitHub Pages |
| `develop` | Rama de integración / histórico |
| `main` | Rama principal del repositorio |

Flujo habitual: desarrollar en `rediseño-2026` → `npm run deploy` para publicar. No hace falta mergear a `develop` para levantar el sitio.

El comando `deploy` publica el contenido de `dist/` en la rama **`gh-pages`**, desplegado en [soniadurgom.github.io/portfolio](https://soniadurgom.github.io/portfolio).

## Contacto

- Email: soniadurgom@gmail.com
- LinkedIn: [Sonia Durán Gómez](https://www.linkedin.com/in/sonia-durán-gómez-358b73189/)
- GitHub: [SoniaDurGom](https://github.com/SoniaDurGom/)
