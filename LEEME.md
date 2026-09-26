# Página del Templo La Divina Providencia

Página web sencilla (HTML, CSS y JavaScript, sin programas extra) lista para GitHub Pages.

- Funciona como una app en el celular: cada sección es su propia página y abajo hay una barra
  con **Inicio · Misas · Avisos · Catecismo · Más**. El botón "atrás" del teléfono funciona normal.
- Modo claro / oscuro (botón de la luna ☾ arriba) y botón **AA** para letra grande.
- Letra **Century Gothic**. Los celulares no la traen instalada, así que ahí se usa *Questrial*,
  que es gratuita y casi idéntica.
- Colores vino y dorado de la Parroquia del Sagrado Corazón.

```
index.html              ← estructura de la página (casi no se toca)
css/styles.css          ← colores y diseño
js/datos.js             ← ★ TODO EL CONTENIDO: horarios, avisos, eventos, contactos…
js/app.js               ← lógica (no tocar)
js/chat.js              ← asistente de preguntas (no tocar)
img/                    ← fotos y carteles
google-apps-script.gs   ← para guardar el formulario en Google Sheets (no se sube)
```

---

## 1. Actualizar la página cada semana

Todo se cambia en **`js/datos.js`**. Desde GitHub se puede hacer en el celular:

1. Entre a su repositorio → carpeta `js` → `datos.js` → ícono del lápiz ✏️.
2. Cambie lo que necesite (misas entre semana, avisos, eventos).
3. Botón verde **Commit changes**. En 1–2 minutos la página se actualiza.

Ejemplo de misa entre semana:

```js
const MISAS_ENTRE_SEMANA = [
  { fecha: "2026-09-30", hora: "19:00", lugar: "Casa de la familia Pérez",
    direccion: "Calle Fe 12, Paseos de la Providencia", mapa: "https://maps.app.goo.gl/..." },
  { fecha: "2026-10-01", hora: "19:00", lugar: "Casa de Doña Lupita",
    direccion: "Calle Esperanza 45", mapa: "" },
];
```

- Las misas y eventos que ya pasaron **se ocultan solos**.
- Para un cartel nuevo: suba la imagen a `img/` y póngala en `AVISOS` con `imagen: "img/nombre.jpg"`.
- Fotos del templo: súbalas a `img/` y agréguelas en `FOTOS`.

### Datos que faltan por llenar en `datos.js`
- [ ] Dirección completa del templo (calle y número, opcional)
- [ ] Día y hora de la **Hora Santa**
- [ ] Ubicación de **Villa Elena** y confirmar días del catecismo en Paseos y Villa Elena
- [ ] Horario de **confesiones** y **pláticas prebautismales**
- [ ] Nombres y teléfonos de las **encargadas** de cada área (`CONTACTOS`)
- [ ] Horarios de los **grupos pastorales**
- [ ] Fotos del templo

---

## 2. Subir a GitHub Pages (una sola vez)

1. Cree una cuenta en <https://github.com> (gratis).
2. **New repository** → nombre, por ejemplo `divina-providencia` → *Public* → **Create**.
3. **uploading an existing file** → arrastre TODO el contenido de esta carpeta
   (`index.html`, `css`, `js`, `img`) → **Commit changes**.
4. **Settings → Pages** → *Source: Deploy from a branch* → *Branch: main / (root)* → **Save**.
5. En 1–2 minutos su página estará en `https://SU-USUARIO.github.io/divina-providencia/`.

---

## 3. Guardar el formulario "Ofrecer mi casa" en Google Sheets (gratis)

Mientras no se haga esto, el formulario abre **WhatsApp** con los datos ya escritos
hacia el número de la encargada de "Misas en casas" en `CONTACTOS`.

Para que se guarde en una hoja de cálculo:

1. Cree una **Hoja de cálculo de Google** nueva (ej. "Misas en casas").
2. Menú **Extensiones → Apps Script**.
3. Borre lo que aparece y pegue el contenido de `google-apps-script.gs`. Guarde 💾.
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona**
   → **Implementar** → autorice con su cuenta de Google.
5. Copie la **URL de la aplicación web** (termina en `/exec`).
6. Péguela en `js/datos.js`:
   ```js
   formularioURL: "https://script.google.com/macros/s/XXXXX/exec",
   ```
Listo: cada solicitud aparecerá como un renglón nuevo en la hoja, con la columna
"¿Ya se contactó?" para ir marcando.

---

## 4. Probar en su computadora

Abra `index.html` con doble clic en el navegador.
