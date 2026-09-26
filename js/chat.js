/* Asistente sencillo: responde preguntas comunes con los datos de js/datos.js.
   No usa inteligencia artificial ni internet: busca palabras clave. */
(function () {
  "use strict";

  const U = window.UTIL;
  const $ = (s) => document.querySelector(s);
  const btn = $("#chatBtn"), chat = $("#chat"), cuerpo = $("#chatCuerpo"), opciones = $("#chatOpciones");
  const form = $("#chatForm"), input = $("#chatInput");

  const ir = (id, texto) => `<a href="#/${id}" data-cerrar-chat>${texto}</a>`;
  function contactoHTML(area, pregunta) {
    const c = U.contactoDe(area);
    if (c && c.whatsapp) return `<br><a class="boton boton--wa" href="${U.linkWhatsApp(c.whatsapp, pregunta)}" target="_blank" rel="noopener">Escribir a ${U.esc(c.nombre || area)}</a>`;
    if (c && c.telefono) return `<br><a class="boton" href="tel:${c.telefono}">Llamar a ${U.esc(c.nombre || area)}</a>`;
    return `<br>Para esto, pregunte con la encargada de <b>${U.esc(area)}</b> (${ir("contacto", "ver contactos")}).`;
  }

  /* Cada tema: palabras clave → respuesta */
  const TEMAS = [
    {
      id: "misa", boton: "¿Cuándo es la misa?",
      claves: ["misa", "misas", "horario", "hora", "domingo", "sabado", "sábado", "celebracion"],
      resp: () => {
        const p = window.PROXIMA_MISA;
        return (p ? `La próxima misa es <b>${p.cuando} a las ${p.hora}</b> en ${U.esc(p.lugar)}.<br><br>` : "") +
          `En el templo:<br>• <b>Sábado</b> 7:30 PM<br>• <b>Domingo</b> 9:30 AM, 12:30 PM y 6:00 PM<br><br>${ir("misas", "Ver horarios")}`;
      },
    },
    {
      id: "semana", boton: "Misa entre semana",
      claves: ["entre semana", "lunes", "martes", "miercoles", "miércoles", "jueves", "viernes", "casa", "casas"],
      resp: () => {
        const l = U.misasEntreSemanaVigentes();
        const lista = l.length
          ? l.slice(0, 4).map((m) => `• <b>${U.fechaTexto(m._f)}</b>, ${U.hora12(m.hora)} — ${U.esc(m.lugar)}`).join("<br>")
          : "Todavía no se publican las de esta semana.";
        return `Las misas entre semana cambian de casa cada semana.<br><br>${lista}<br><br>${ir("misas", "Ver misas entre semana")} · ${ir("ofrecer", "Ofrecer mi casa")}`;
      },
    },
    {
      id: "catecismo", boton: "Catecismo",
      claves: ["catecismo", "catequesis", "primera comunion", "primera comunión", "confirmacion", "confirmación", "niños", "ninos"],
      resp: () => CATECISMO.map((c) => `• <b>${U.esc(c.sede)}</b>: ${c.horarios.map(U.esc).join(", ")}`).join("<br>") +
        `<br><br>${ir("catecismo", "Ver sedes y cómo llegar")}`,
    },
    {
      id: "hora-santa", boton: "Hora Santa",
      claves: ["hora santa", "adoracion", "adoración", "santisimo", "santísimo"],
      resp: () => HORA_SANTA.hora
        ? `La Hora Santa es el <b>${U.esc(HORA_SANTA.dia)} a las ${U.hora12(HORA_SANTA.hora)}</b>, ${U.esc(HORA_SANTA.lugar).toLowerCase()}.`
        : `El horario de la Hora Santa está por confirmarse. Le avisaremos en ${ir("avisos", "Avisos")} y en Facebook.`,
    },
    {
      id: "confesion", boton: "Confesiones",
      claves: ["confes", "confesar", "confesión", "confesion", "perdon"],
      resp: () => { const s = SERVICIOS.find((x) => x.id === "confesiones"); return `<b>Confesiones:</b> ${U.esc(s.horario)}.<br>${U.esc(s.texto)}<br>${ir("sacramentos", "Ver sacramentos")}`; },
    },
    {
      id: "bautizo", boton: "Bautizos",
      claves: ["bautiz", "bautismo", "prebautismal", "padrino", "madrina"],
      resp: () => { const s = SERVICIOS.find((x) => x.id === "bautizos"); return `<b>Pláticas prebautismales:</b> ${U.esc(s.horario)}.<br>${U.esc(s.texto)}` + contactoHTML(s.encargada, "Hola, quisiera información sobre las pláticas prebautismales."); },
    },
    {
      id: "enfermos", boton: "Comunión a enfermos",
      claves: ["enfermo", "enferma", "enfermos", "comunion a", "comunión a", "llevar la comunion", "visita"],
      resp: () => { const s = SERVICIOS.find((x) => x.id === "enfermos"); return `${U.esc(s.texto)}` + contactoHTML(s.encargada, "Hola, quisiera solicitar la Comunión para un enfermo."); },
    },
    {
      id: "ubicacion", boton: "¿Dónde está?",
      claves: ["donde", "dónde", "ubicacion", "ubicación", "direccion", "dirección", "llegar", "mapa"],
      resp: () => `El Templo La Divina Providencia está en ${U.esc(TEMPLO.direccion)}, ${U.esc(TEMPLO.ciudad)}.<br>${ir("ubicacion", "Ver mapa")}<br><a class="boton" href="${TEMPLO.mapa}" target="_blank" rel="noopener">Abrir en Google Maps</a>`,
    },
    {
      id: "donativo", boton: "Donativos",
      claves: ["donativo", "donar", "dono", "apoyar", "apoyo", "ofrenda", "colecta", "limosna", "dinero", "transferencia", "diezmo"],
      resp: () => `Por ahora los donativos se reciben <b>en persona</b>, en la colecta de cada misa. ¡Dios le bendiga!`,
    },
    {
      id: "eventos", boton: "Eventos y avisos",
      claves: ["evento", "eventos", "aviso", "avisos", "fiesta", "kermes", "novena", "rosario"],
      resp: () => `Revise los ${ir("avisos", "avisos importantes")} y los ${ir("avisos", "próximos eventos")}.` +
        (TEMPLO.facebook ? `<br>También publicamos todo en <a href="${TEMPLO.facebook}" target="_blank" rel="noopener">Facebook</a>.` : ""),
    },
    {
      id: "grupos", boton: "Grupos pastorales",
      claves: ["grupo", "pastoral", "coro", "monaguillo", "servir", "participar", "juvenil"],
      resp: () => `Tenemos varios grupos: ${PASTORALES.map((p) => U.esc(p.nombre)).join(", ")}.<br>${ir("grupos", "Conocer los grupos")}`,
    },
    {
      id: "persona", boton: "Hablar con una persona",
      claves: ["persona", "hablar", "telefono", "teléfono", "whatsapp", "contacto", "padre", "sacerdote", "encargada"],
      resp: () => `Con gusto. Para dudas específicas, comuníquese con la encargada de cada área:<br>${ir("contacto", "Ver contactos")}` +
        (TEMPLO.facebook ? `<br><a class="boton" href="${TEMPLO.facebook}" target="_blank" rel="noopener">Escribir por Facebook</a>` : ""),
    },
  ];

  const quitarAcentos = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function buscarTema(texto) {
    const t = quitarAcentos(texto);
    let mejor = null, puntos = 0;
    TEMAS.forEach((tema) => {
      const p = tema.claves.reduce((s, c) => s + (t.includes(quitarAcentos(c)) ? c.length : 0), 0);
      if (p > puntos) { puntos = p; mejor = tema; }
    });
    return mejor;
  }

  function burbuja(html, quien) {
    const b = document.createElement("div");
    b.className = "burbuja burbuja--" + quien;
    b.innerHTML = html;
    cuerpo.appendChild(b);
    cuerpo.scrollTop = cuerpo.scrollHeight;
  }

  function responder(texto, tema) {
    burbuja(U.esc(texto), "yo");
    tema = tema || buscarTema(texto);
    setTimeout(() => {
      burbuja(tema ? tema.resp()
        : `Disculpe, no encontré una respuesta para eso. Para dudas muy específicas le recomendamos hablar con la encargada del área. ${ir("contacto", "Ver contactos")}`, "bot");
    }, 350);
  }

  // botones de preguntas rápidas
  opciones.innerHTML = TEMAS.map((t) => `<button type="button" data-tema="${t.id}">${t.boton}</button>`).join("");
  opciones.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tema]");
    if (b) responder(b.textContent, TEMAS.find((t) => t.id === b.dataset.tema));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = input.value.trim();
    if (!t) return;
    input.value = "";
    responder(t);
  });

  let saludado = false;
  function abrir() {
    chat.hidden = false;
    btn.classList.add("oculto");
    btn.setAttribute("aria-expanded", "true");
    if (!saludado) {
      burbuja("¡Bienvenido! Dios le bendiga. 🙏<br>Toque una de las preguntas de abajo o escriba la suya.", "bot");
      saludado = true;
    }
  }
  function cerrar() {
    chat.hidden = true;
    btn.classList.remove("oculto");
    btn.setAttribute("aria-expanded", "false");
    btn.focus({ preventScroll: true });
  }
  btn.addEventListener("click", abrir);
  $("#chatCerrar").addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) cerrar(); });
  cuerpo.addEventListener("click", (e) => { if (e.target.closest("[data-cerrar-chat]")) cerrar(); });
})();
