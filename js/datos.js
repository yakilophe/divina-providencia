/* ==========================================================================
   DATOS DEL TEMPLO — ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR CADA SEMANA
   --------------------------------------------------------------------------
   • Escriba entre comillas "así".
   • Fechas con formato "AAAA-MM-DD"  (ej. "2026-10-03").
   • Horas con formato de 24 h "HH:MM"  (ej. "19:30" = 7:30 PM).
   • Teléfonos a 10 dígitos, sin espacios (ej. "4491234567").
   • Si un dato todavía no se sabe, déjelo vacío: ""  (la página lo oculta).
   • Lo que ya pasó (misas, eventos, avisos con fecha) se oculta solo.
   ========================================================================== */

const TEMPLO = {
  nombre: "La Divina Providencia",
  comunidad: "Paseos de la Providencia",
  parroquia: "Parroquia del Sagrado Corazón",
  parroquiaLugar: "J. Gómez Portugal, Jesús María, Ags.",   // dónde está la parroquia (no el templo)
  ciudad: "San Francisco de los Romo, Ags.",               // municipio del templo
  direccion: "Fracc. Paseos de la Providencia",           // ← escriba calle y número si lo desea
  mapa: "https://maps.app.goo.gl/kMy21ymo3sFazY686",
  coordenadas: "22.0237917,-102.2723295",
  facebook: "https://www.facebook.com/profile.php?id=100070700807123",

  /* Formulario "Ofrecer mi casa para la misa".
     Pegue aquí la URL de Google Apps Script (ver LEEME.md).
     Mientras esté vacío, la solicitud se envía por WhatsApp a la encargada de "Misas en casas". */
  formularioURL: "",
};

/* --------------------------------------------------------------------------
   MISAS FIJAS EN EL TEMPLO   dia: 0=domingo, 1=lunes … 6=sábado
   -------------------------------------------------------------------------- */
const MISAS_FIJAS = [
  { dia: 4, hora: "19:30", nota: "Misa y Hora Santa" },
  { dia: 6, hora: "19:30" },
  { dia: 0, hora: "09:30" },
  { dia: 0, hora: "12:30" },
  { dia: 0, hora: "18:00" },
];

/* Jueves: misa y después Hora Santa (con confesiones) */
const HORA_SANTA = {
  dia: "Jueves",
  hora: "19:30",
  lugar: "En el templo",
  detalle: "Misa a las 7:30 PM y después la Hora Santa. Durante la Hora Santa hay confesiones.",
};

/* --------------------------------------------------------------------------
   MISAS ENTRE SEMANA — CAMBIAN CADA SEMANA (en casas de familias)
   Copie un bloque { … }, cambie los datos y ponga una coma entre bloques.
   -------------------------------------------------------------------------- */
const MISAS_ENTRE_SEMANA = [
  {
    fecha: "2026-09-28",
    hora: "",             // ← falta la hora, ej. "19:00"
    lugar: "Calle San Antonio #130",
    direccion: "",
    mapa: "",
  },
  {
    fecha: "2026-09-30",
    hora: "",             // ← falta la hora
    lugar: "Calle San Felipe #111",
    direccion: "Urbi Villa del Vergel",
    mapa: "",
  },
  {
    fecha: "2026-10-02",
    hora: "",             // ← falta la hora
    lugar: "Calle San Francisco de Asís #132",
    direccion: "",
    mapa: "",
  },
  // {
  //   fecha: "2026-09-30",
  //   hora: "19:00",
  //   lugar: "Casa de la familia Hernández",
  //   direccion: "Calle Ejemplo 123, Paseos de la Providencia",
  //   mapa: "",           // link de Google Maps (opcional)
  // },
];

/* --------------------------------------------------------------------------
   AVISOS   (importante: true = se muestra resaltado y también en Inicio)
   -------------------------------------------------------------------------- */
const AVISOS = [
  {
    titulo: "Horarios de misa en Paseos de la Providencia",
    texto: "Sábado 7:30 PM. Domingo 9:30 AM, 12:30 PM y 6:00 PM. ¡Los esperamos con su familia!",
    imagen: "img/horarios-paseos.jpg",
    importante: false,
    hasta: "",              // fecha en que el aviso deja de mostrarse (opcional)
  },
  {
    titulo: "Te invitamos a la Misa del sábado",
    texto: "Todos los sábados a las 7:30 PM en el Templo La Divina Providencia.",
    imagen: "img/cartel-misa-sabado.jpg",
    importante: true,
    hasta: "",
  },
];

/* --------------------------------------------------------------------------
   EVENTOS PRÓXIMOS
   -------------------------------------------------------------------------- */
const EVENTOS = [
  {
    fecha: "2026-10-11",
    hora: "10:30",
    titulo: "Pláticas prebautismales",
    lugar: "Templo La Divina Providencia",
    descripcion: "De 10:30 AM a 2:30 PM. Incluye misa. Para padres y padrinos.",
  },
  // {
  //   fecha: "2026-10-12",
  //   hora: "18:00",
  //   titulo: "Rosario a la Virgen",
  //   lugar: "Templo La Divina Providencia",
  //   descripcion: "Traiga una flor para la Virgen.",
  // },
];

/* --------------------------------------------------------------------------
   CATECISMO
   -------------------------------------------------------------------------- */
const CATECISMO = [
  {
    sede: "Urbi Villa del Vergel",
    lugar: "Parque y gimnasio público Urbi",
    horarios: ["Viernes 6:30 PM"],
    mapa: "https://maps.app.goo.gl/u426KSvV8nRhCYG16",
  },
  {
    sede: "Paseos de la Providencia",
    lugar: "Templo La Divina Providencia",
    horarios: ["Sábado 10:00 AM", "Sábado 5:00 PM"],   // ← confirmar día
    mapa: "https://maps.app.goo.gl/kMy21ymo3sFazY686",
  },
  {
    sede: "Villa Elena",
    lugar: "Ubicación por confirmar",
    horarios: ["Sábado 9:00 AM"],                      // ← confirmar día
    mapa: "",                                          // ← pegar link cuando se tenga
  },
];

/* --------------------------------------------------------------------------
   SELLOS DE BOLETA DEL CATECISMO
   -------------------------------------------------------------------------- */
const SELLOS = {
  cuando: [
    "Misa de precepto: sábado 7:30 PM",
    "Misas del domingo: 9:30 AM, 12:30 PM y 6:00 PM",
  ],
  noHay: "Sólo se sella en esas misas. Las misas entre semana NO tienen sello.",
  horaSanta: "Los niños deben ir a la Hora Santa UNA VEZ AL MES para su sello. Es los jueves: misa a las 7:30 PM y después la Hora Santa.",
  reglas: [
    "Espere a que termine la misa. Antes no se sella.",
    "Fórmese por los LATERALES del templo y espere hasta que se le indique.",
    "NO pase por el altar. Camine con orden y sin correr.",
  ],
};

/* --------------------------------------------------------------------------
   SACRAMENTOS Y SERVICIOS
   encargada: debe coincidir con un "area" de CONTACTOS (o dejarse vacío)
   -------------------------------------------------------------------------- */
const SERVICIOS = [
  {
    id: "confesiones",
    titulo: "Confesiones",
    horario: "Jueves, en la Hora Santa",
    texto: "Los jueves, después de la misa de 7:30 PM, durante la Hora Santa puede confesarse.",
    encargada: "",
  },
  {
    id: "enfermos",
    titulo: "Comunión a enfermos",
    horario: "Se agenda por teléfono",
    texto: "Si un familiar no puede venir al templo, le llevamos la Sagrada Comunión a su casa.",
    encargada: "Ministros de la Comunión",
  },
  {
    id: "bautizos",
    titulo: "Pláticas prebautismales",
    horario: "2.º domingo de cada mes · 10:30 AM a 2:30 PM",
    texto: "Padres y padrinos deben tomar las pláticas antes del bautizo. Incluye la misa.",
    encargada: "Pláticas prebautismales",
  },
  {
    id: "intenciones",
    titulo: "Intenciones de misa",
    horario: "Antes de cada misa",
    texto: "Ofrezca la misa por un difunto, un enfermo o en acción de gracias. Déjela en la mesa de la entrada.",
    encargada: "",
  },
];

/* --------------------------------------------------------------------------
   GRUPOS PASTORALES  (agregue o quite los que necesite)
   -------------------------------------------------------------------------- */
const PASTORALES = [
  { nombre: "Coro",                     cuando: "", descripcion: "Anima con cantos las misas del templo." },
  { nombre: "Monaguillos",              cuando: "", descripcion: "Niños y jóvenes que ayudan en el altar." },
  { nombre: "Ministros de la Comunión", cuando: "", descripcion: "Llevan la Comunión en misa y a los enfermos." },
  { nombre: "Catequistas",              cuando: "", descripcion: "Preparan a niños para Primera Comunión y Confirmación." },
  { nombre: "Pastoral Juvenil",         cuando: "", descripcion: "Jóvenes que se reúnen a convivir y crecer en la fe." },
  { nombre: "Pastoral Familiar",        cuando: "", descripcion: "Acompaña a matrimonios y familias." },
];

/* --------------------------------------------------------------------------
   CONTACTOS — ENCARGADAS DE CADA ÁREA
   -------------------------------------------------------------------------- */
const CONTACTOS = [
  { area: "Catecismo",                nombre: "", whatsapp: "", telefono: "" },
  { area: "Pláticas prebautismales",  nombre: "", whatsapp: "", telefono: "" },
  { area: "Ministros de la Comunión", nombre: "", whatsapp: "", telefono: "" },
  { area: "Misas en casas",           nombre: "", whatsapp: "", telefono: "" },
];

/* --------------------------------------------------------------------------
   DONATIVOS (sólo en persona por ahora)
   -------------------------------------------------------------------------- */
const DONATIVOS = {
  texto: "Su generosidad sostiene el templo y sus obras. Puede dejar su donativo en la colecta de cada misa. Dios le bendiga.",
};

/* --------------------------------------------------------------------------
   FOTOS DEL TEMPLO — suba las fotos a la carpeta img/ y escríbalas aquí
   -------------------------------------------------------------------------- */
const FOTOS = [
  // { src: "img/templo-fachada.jpg", texto: "Fachada del templo" },
];

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   -------------------------------------------------------------------------- */
const PREGUNTAS = [
  { p: "¿A qué hora es la misa del fin de semana?",
    r: "Sábado 7:30 PM. Domingo 9:30 AM, 12:30 PM y 6:00 PM, en el Templo La Divina Providencia." },
  { p: "¿Cuándo es la Hora Santa?",
    r: "Los jueves. Hay misa a las 7:30 PM y después la Hora Santa. Durante la Hora Santa puede confesarse." },
  { p: "¿Cuándo puedo confesarme?",
    r: "Los jueves durante la Hora Santa, después de la misa de 7:30 PM." },
  { p: "¿Hay misa entre semana?",
    r: "Sí, pero cambia de lugar cada semana porque se celebra en casas de familias. Revise la página \"Misas\" o nuestro Facebook." },
  { p: "¿Cómo ofrezco mi casa para una misa?",
    r: "En la página \"Misas\" toque \"Ofrecer mi casa\" y deje su nombre, teléfono y dirección. La encargada se comunicará con usted." },
  { p: "¿Qué necesito para bautizar a mi hijo?",
    r: "Papás y padrinos deben tomar las pláticas prebautismales: el segundo domingo de cada mes, de 10:30 AM a 2:30 PM (incluye misa)." },
  { p: "¿Cuándo sellan la boleta del catecismo?",
    r: "Sólo en la misa de precepto (sábado 7:30 PM) y en las misas del domingo, al terminar la misa. Las misas entre semana no tienen sello. Además, los niños deben ir una vez al mes a la Hora Santa del jueves (7:30 PM) para su sello. Espere a que termine la misa, fórmese por los laterales del templo hasta que se le indique y no pase por el altar." },
  { p: "¿Cuándo es el catecismo?",
    r: "Urbi Villa del Vergel: viernes 6:30 PM. Paseos de la Providencia: 10:00 AM y 5:00 PM. Villa Elena: 9:00 AM." },
  { p: "¿Pueden llevarle la Comunión a un enfermo?",
    r: "Sí. Comuníquese con los Ministros de la Comunión para agendar la visita." },
  { p: "¿Cómo puedo apoyar al templo?",
    r: "Con su donativo en la colecta de cada misa, o participando en algún grupo pastoral." },
];
