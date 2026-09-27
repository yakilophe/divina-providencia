/* Templo La Divina Providencia — lógica de la página.
   El contenido se edita en js/datos.js; aquí no hace falta tocar nada. */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  /* ---------- utilidades ---------- */
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icono = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const capital = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const soloDigitos = (t) => String(t || "").replace(/\D/g, "");

  function hora12(hhmm) {
    if (!hhmm) return "";
    const [h, m] = hhmm.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }
  function fechaLocal(aaaammdd, hhmm) {
    const [a, mo, d] = aaaammdd.split("-").map(Number);
    const [h, mi] = (hhmm || "23:59").split(":").map(Number);
    return new Date(a, mo - 1, d, h, mi);
  }
  function inicioDeHoy() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function fechaTexto(d) { return `${capital(DIAS[d.getDay()])} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`; }
  function linkWhatsApp(num, texto) {
    let n = soloDigitos(num);
    if (!n) return "";
    if (n.length === 10) n = "52" + n;
    return `https://wa.me/${n}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;
  }
  function contactoDe(area) {
    return area ? CONTACTOS.find((c) => c.area.toLowerCase() === String(area).toLowerCase()) : null;
  }
  function botonesContacto(area, mensaje) {
    const c = contactoDe(area);
    if (!c || (!c.whatsapp && !c.telefono)) return "";
    let h = "";
    if (c.whatsapp) h += `<a class="boton boton--wa" href="${linkWhatsApp(c.whatsapp, mensaje)}" target="_blank" rel="noopener">${icono("whatsapp")} WhatsApp</a>`;
    if (c.telefono) h += `<a class="boton boton--borde" href="tel:${soloDigitos(c.telefono)}">${icono("telefono")} Llamar</a>`;
    return h;
  }
  function vacio(texto) {
    const fb = TEMPLO.facebook ? `<br><a href="${esc(TEMPLO.facebook)}" target="_blank" rel="noopener">Ver Facebook</a>` : "";
    return `<div class="vacio">${texto}${fb}</div>`;
  }
  function bloqueFecha(d) {
    return `<div class="fecha" aria-hidden="true"><small>${DIAS[d.getDay()].slice(0, 3)}</small><strong>${d.getDate()}</strong><small>${MESES[d.getMonth()]}</small></div>`;
  }
  const horasDe = (dia) => MISAS_FIJAS.filter((m) => m.dia === dia).map((m) => m.hora);

  /* ================= CONTENIDO ================= */

  function pintarGenerales() {
    $("#portadaSub").textContent = TEMPLO.comunidad;
    $("#pieDatos").innerHTML = `${esc(TEMPLO.comunidad)}, ${esc(TEMPLO.ciudad)}<br>` +
      `<small>Pertenece a la ${esc(TEMPLO.parroquia)} · ${esc(TEMPLO.parroquiaLugar)}</small>`;
    $$("[data-facebook]").forEach((a) => { if (TEMPLO.facebook) a.href = TEMPLO.facebook; else a.remove(); });
  }

  function pintarHorarios() {
    const li = (h) => `<li>${hora12(h)}</li>`;
    $("#horasSabado").innerHTML = horasDe(6).map(li).join("");
    $("#horasDomingo").innerHTML = horasDe(0).map(li).join("");
    $("#horaSanta").innerHTML = HORA_SANTA.hora
      ? `<li>${hora12(HORA_SANTA.hora)}<small>Misa y Hora Santa</small></li>`
      : `<li class="pendiente">Por confirmar</li>`;
    $("#resSabado").textContent = horasDe(6).map(hora12).join(" · ");
    $("#resDomingo").innerHTML = horasDe(0).map(hora12).join("<br>");
    $("#horaSantaNota").textContent = HORA_SANTA.hora ? HORA_SANTA.detalle || "" : "";
    $("#resJueves").textContent = HORA_SANTA.hora ? `${hora12(HORA_SANTA.hora)} · Misa y Hora Santa` : "Hora Santa por confirmar";
  }

  function misasEntreSemanaVigentes() {
    const hoy = inicioDeHoy();
    return MISAS_ENTRE_SEMANA.map((m) => ({ ...m, _f: fechaLocal(m.fecha, m.hora) }))
      .filter((m) => m._f >= hoy).sort((a, b) => a._f - b._f);
  }
  function pintarEntreSemana() {
    const lista = misasEntreSemanaVigentes();
    $("#listaEntreSemana").innerHTML = lista.length
      ? lista.map((m) => `
        <article class="renglon">
          ${bloqueFecha(m._f)}
          <div>
            <h3>${esc(m.lugar || "Misa")}</h3>
            <p class="hora">${fechaTexto(m._f)} · ${m.hora ? hora12(m.hora) : "Hora por confirmar"}</p>
            ${m.direccion ? `<p>${esc(m.direccion)}</p>` : ""}
            ${m.mapa ? `<a class="enlace-mapa" href="${esc(m.mapa)}" target="_blank" rel="noopener">${icono("pin")} Cómo llegar</a>` : ""}
          </div>
        </article>`).join("")
      : vacio("Las misas de esta semana se publicarán pronto.");
  }

  function proximaMisa() {
    const ahora = new Date();
    const candidatas = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date(ahora); d.setDate(d.getDate() + i);
      horasDe(d.getDay()).forEach((hora) => {
        const [h, mi] = hora.split(":").map(Number);
        candidatas.push({ f: new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, mi), lugar: "Templo La Divina Providencia", hora });
      });
    }
    misasEntreSemanaVigentes().filter((m) => m.hora).forEach((m) => candidatas.push({ f: m._f, lugar: m.lugar, hora: m.hora }));
    // una misa se sigue mostrando hasta 45 minutos después de empezar
    return candidatas.filter((c) => c.f.getTime() + 45 * 60000 > ahora.getTime()).sort((a, b) => a.f - b.f)[0];
  }
  function pintarProxima() {
    const p = proximaMisa();
    if (!p) return;
    const dias = Math.round((new Date(p.f.getFullYear(), p.f.getMonth(), p.f.getDate()) - inicioDeHoy()) / 86400000);
    const cuando = dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : capital(DIAS[p.f.getDay()]);
    $("#proximaCuando").textContent = `${cuando} · ${hora12(p.hora)}`;
    $("#proximaDonde").textContent = (p.f <= new Date() ? "Está comenzando · " : "") + p.lugar;
    window.PROXIMA_MISA = { cuando, hora: hora12(p.hora), lugar: p.lugar };
  }

  function avisoHTML(a) {
    return `
      <article class="aviso ${a.importante ? "aviso--imp" : ""}">
        ${a.imagen ? `<button class="aviso__img" type="button" data-foto="${esc(a.imagen)}" data-texto="${esc(a.titulo)}" aria-label="Ver imagen en grande"><img src="${esc(a.imagen)}" alt="${esc(a.titulo)}" loading="lazy"></button>` : ""}
        <div class="aviso__txt">
          ${a.importante ? `<p class="aviso__etq">${icono("campana")} Importante</p>` : ""}
          <h3>${esc(a.titulo)}</h3>
          <p>${esc(a.texto)}</p>
        </div>
      </article>`;
  }
  function pintarAvisos() {
    const hoy = inicioDeHoy();
    const lista = AVISOS.filter((a) => !a.hasta || fechaLocal(a.hasta) >= hoy);
    $("#listaAvisos").innerHTML = lista.length ? lista.map(avisoHTML).join("") : vacio("Por ahora no hay avisos nuevos.");
    const destacado = lista.find((a) => a.importante);
    $("#avisoInicio").innerHTML = destacado ? avisoHTML(destacado) : "";
  }

  function pintarEventos() {
    const hoy = inicioDeHoy();
    const lista = EVENTOS.map((e) => ({ ...e, _f: fechaLocal(e.fecha, e.hora) }))
      .filter((e) => e._f >= hoy).sort((a, b) => a._f - b._f);
    $("#listaEventos").innerHTML = lista.length
      ? lista.map((e) => `
        <article class="renglon">
          ${bloqueFecha(e._f)}
          <div>
            <h3>${esc(e.titulo)}</h3>
            <p class="hora">${fechaTexto(e._f)}${e.hora ? " · " + hora12(e.hora) : ""}</p>
            ${e.lugar ? `<p>${esc(e.lugar)}</p>` : ""}
            ${e.descripcion ? `<p>${esc(e.descripcion)}</p>` : ""}
          </div>
        </article>`).join("")
      : vacio("Próximamente publicaremos nuevos eventos.");
  }

  function pintarCatecismo() {
    $("#listaCatecismo").innerHTML = CATECISMO.map((c) => `
      <article class="tarjeta">
        <div class="tarjeta__cab"><span class="tarjeta__ico">${icono("libro")}</span>
          <div><h3>${esc(c.sede)}</h3><p class="sub">${esc(c.lugar)}</p></div></div>
        <div class="etiquetas">${c.horarios.map((h) => `<span class="etiqueta">${icono("reloj")} ${esc(h)}</span>`).join("")}</div>
        <div class="tarjeta__pie">
          ${c.mapa ? `<a class="boton" href="${esc(c.mapa)}" target="_blank" rel="noopener">${icono("pin")} Cómo llegar</a>` : `<span class="nota">Ubicación próximamente</span>`}
          ${botonesContacto("Catecismo", `Hola, quisiera información del catecismo en ${c.sede}.`)}
        </div>
      </article>`).join("");
  }

  function pintarSellos() {
    $("#cajaSellos").innerHTML = `
      <div class="sellos__cuando">
        ${SELLOS.cuando.map((t) => `<p>${icono("reloj")} ${esc(t)}</p>`).join("")}
      </div>
      <p class="sellos__no">${esc(SELLOS.noHay)}</p>
      ${SELLOS.horaSanta ? `<div class="sellos__hs">${icono("cruz")}<p><strong>Hora Santa · una vez al mes</strong>${esc(SELLOS.horaSanta)}</p></div>` : ""}
      <div class="sellos__reglas">
        <p class="aviso__etq">${icono("campana")} Importante</p>
        <ol>${SELLOS.reglas.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
      </div>`;
  }

  const ICONO_SERVICIO = { confesiones: "cruz", enfermos: "corazon", bautizos: "gente", intenciones: "libro" };
  function pintarServicios() {
    $("#listaServicios").innerHTML = SERVICIOS.map((s) => `
      <article class="tarjeta">
        <div class="tarjeta__cab"><span class="tarjeta__ico">${icono(ICONO_SERVICIO[s.id] || "cruz")}</span><h3>${esc(s.titulo)}</h3></div>
        <div class="etiquetas"><span class="etiqueta">${icono("reloj")} ${esc(s.horario)}</span></div>
        <p class="sub">${esc(s.texto)}</p>
        ${botonesContacto(s.encargada, `Hola, quisiera información sobre: ${s.titulo}.`) ? `<div class="tarjeta__pie">${botonesContacto(s.encargada, `Hola, quisiera información sobre: ${s.titulo}.`)}</div>` : ""}
      </article>`).join("");
  }

  function pintarPastorales() {
    $("#listaPastorales").innerHTML = PASTORALES.map((p) => `
      <article class="pastoral">
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.descripcion)}</p>
        ${p.cuando ? `<p class="cuando">${icono("reloj")} ${esc(p.cuando)}</p>` : ""}
      </article>`).join("");
  }

  function pintarGaleria() {
    $("#galeria").innerHTML = FOTOS.length
      ? FOTOS.map((f) => `
        <button class="foto" type="button" data-foto="${esc(f.src)}" data-texto="${esc(f.texto)}" aria-label="Ver foto: ${esc(f.texto)}">
          <img src="${esc(f.src)}" alt="${esc(f.texto)}" loading="lazy">
        </button>`).join("")
      : ["Fachada", "Altar", "Comunidad", "Celebraciones"].map((t) => `
        <div class="foto foto--vacia"><div>${icono("foto")}${t}<br><span>Próximamente</span></div></div>`).join("");
  }

  function pintarUbicacion() {
    $("#direccionTemplo").textContent = [TEMPLO.direccion, TEMPLO.ciudad].filter(Boolean).join(", ");
    $("#btnComoLlegar").href = TEMPLO.mapa;
  }
  function cargarMapa() { // sólo se carga al abrir la página "Cómo llegar"
    const m = $("#mapa");
    if (m.firstChild) return;
    m.innerHTML = `<iframe title="Mapa del templo" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(TEMPLO.coordenadas)}&z=16&output=embed"></iframe>`;
  }

  function pintarDonativos() { $("#textoDonativos").textContent = DONATIVOS.texto; }

  function pintarPreguntas() {
    $("#listaPreguntas").innerHTML = PREGUNTAS.map((q) => `
      <details><summary>${esc(q.p)} ${icono("flecha")}</summary><p class="resp">${esc(q.r)}</p></details>`).join("");
  }

  function pintarContactos() {
    const conDatos = CONTACTOS.filter((c) => c.whatsapp || c.telefono);
    $("#listaContactos").innerHTML = conDatos.length
      ? conDatos.map((c) => `
        <div class="contacto">
          <div class="contacto__txt"><strong>${esc(c.area)}</strong><small>${esc(c.nombre)}</small></div>
          <div class="contacto__acc">
            ${c.whatsapp ? `<a class="redondo redondo--wa" href="${linkWhatsApp(c.whatsapp, "Hola, le escribo desde la página del templo.")}" target="_blank" rel="noopener" aria-label="WhatsApp de ${esc(c.area)}">${icono("whatsapp")}</a>` : ""}
            ${c.telefono ? `<a class="redondo" href="tel:${soloDigitos(c.telefono)}" aria-label="Llamar a ${esc(c.area)}">${icono("telefono")}</a>` : ""}
          </div>
        </div>`).join("")
      : `<div class="vacio">Muy pronto publicaremos los teléfonos de cada encargada.<br>Mientras tanto, escríbanos por Facebook.</div>`;
  }

  /* ================= INTERACCIÓN ================= */

  // Visor de imágenes (carteles y fotos)
  function activarVisor() {
    const visor = $("#visor");
    if (!visor || typeof visor.showModal !== "function") return;
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-foto]");
      if (!b) return;
      $("#visorImg").src = b.dataset.foto;
      $("#visorImg").alt = b.dataset.texto || "";
      $("#visorTxt").textContent = b.dataset.texto || "";
      visor.showModal();
    });
    visor.addEventListener("click", (e) => { if (e.target === visor || e.target.closest(".visor__cerrar")) visor.close(); });
  }

  // Formulario "Ofrecer mi casa"
  function activarFormulario() {
    const form = $("#formCasa"), msg = $("#formMsg");
    const aviso = (t, ok) => { msg.textContent = t; msg.className = "formulario__msg " + (ok ? "ok" : "mal"); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(form).entries());
      Object.keys(datos).forEach((k) => (datos[k] = datos[k].trim()));

      let falta = null;
      [["nombre", 5], ["telefono", 10], ["direccion", 8]].forEach(([campo, min]) => {
        const el = form.elements[campo];
        const valor = campo === "telefono" ? soloDigitos(datos[campo]) : datos[campo];
        const mal = valor.length < min;
        el.classList.toggle("error", mal);
        if (mal && !falta) falta = el;
      });
      if (falta) { aviso("Por favor revise los campos marcados en rojo.", false); falta.focus(); return; }

      const boton = form.querySelector("button[type=submit]");
      boton.disabled = true;
      datos.fecha = new Date().toLocaleString("es-MX");

      if (TEMPLO.formularioURL) {
        try {
          await fetch(TEMPLO.formularioURL, { method: "POST", mode: "no-cors", body: new URLSearchParams(datos) });
          form.reset();
          aviso("¡Gracias! Recibimos sus datos. La encargada se comunicará con usted. Dios le bendiga.", true);
        } catch {
          aviso("No se pudo enviar. Revise su internet e intente de nuevo.", false);
        }
      } else {
        const numero = (contactoDe("Misas en casas") || {}).whatsapp;
        const texto = `Hola, quiero ofrecer mi casa para una misa entre semana.\n\nNombre: ${datos.nombre}\nTeléfono: ${datos.telefono}\nDirección: ${datos.direccion}\nFraccionamiento: ${datos.colonia}` +
          (datos.preferencia ? `\nDía preferido: ${datos.preferencia}` : "") + (datos.intencion ? `\nIntención: ${datos.intencion}` : "");
        if (numero) {
          window.open(linkWhatsApp(numero, texto), "_blank", "noopener");
          aviso("Se abrió WhatsApp con sus datos. Sólo toque «Enviar».", true);
        } else {
          aviso("El formulario aún no está activo. Por favor escríbanos por Facebook.", false);
        }
      }
      boton.disabled = false;
    });
  }

  // Letra grande y modo oscuro
  function activarAjustes() {
    const raiz = document.documentElement;
    const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };

    const letra = $("#btnLetra");
    letra.setAttribute("aria-pressed", String(raiz.classList.contains("letra-grande")));
    letra.addEventListener("click", () => {
      const on = raiz.classList.toggle("letra-grande");
      letra.setAttribute("aria-pressed", String(on));
      guardar("letraGrande", on ? "1" : "0");
    });

    const oscuroAhora = () => raiz.dataset.theme
      ? raiz.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    $("#btnTema").addEventListener("click", () => {
      const nuevo = oscuroAhora() ? "light" : "dark";
      raiz.dataset.theme = nuevo;
      guardar("tema", nuevo);
    });
  }

  /* ================= PÁGINAS (#/misas, #/avisos, …) ================= */
  const paginas = {};
  $$(".pagina").forEach((p) => (paginas[p.dataset.pagina] = p));
  // qué pestaña de la barra se ilumina en cada página
  const PESTANA = { ofrecer: "misas", sacramentos: "mas", grupos: "mas", fotos: "mas", ubicacion: "mas", donativos: "mas", preguntas: "mas", contacto: "mas" };

  function mostrarPagina() {
    let ruta = location.hash.replace(/^#\/?/, "") || "inicio";
    if (!paginas[ruta]) ruta = "inicio";
    Object.entries(paginas).forEach(([nombre, el]) => (el.hidden = nombre !== ruta));
    const pestana = PESTANA[ruta] || ruta;
    $$("[data-ruta]").forEach((a) => {
      const activo = a.dataset.ruta === pestana || (a.closest(".nav-escritorio") && a.dataset.ruta === ruta);
      a.classList.toggle("activo", activo);
      if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.title = (ruta === "inicio" ? "" : paginas[ruta].dataset.titulo + " · ") + "Templo La Divina Providencia";
    if (ruta === "ubicacion") cargarMapa();
    window.scrollTo(0, 0);
    $("#contenido").focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", mostrarPagina);

  /* ================= ARRANQUE ================= */
  pintarGenerales();
  pintarHorarios();
  pintarEntreSemana();
  pintarProxima();
  pintarAvisos();
  pintarEventos();
  pintarCatecismo();
  pintarSellos();
  pintarServicios();
  pintarPastorales();
  pintarGaleria();
  pintarUbicacion();
  pintarDonativos();
  pintarPreguntas();
  pintarContactos();
  activarVisor();
  activarFormulario();
  activarAjustes();
  mostrarPagina();
  setInterval(pintarProxima, 60000);

  // utilidades para el asistente (chat.js)
  window.UTIL = { hora12, linkWhatsApp, contactoDe, misasEntreSemanaVigentes, fechaTexto, esc };
})();
