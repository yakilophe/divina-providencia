/**
 * Guarda las solicitudes de "Ofrecer mi casa" en una Hoja de Google.
 * Instrucciones paso a paso en LEEME.md (sección 3).
 * Este archivo NO se sube a la página; se pega en Google Apps Script.
 */
const COLUMNAS = ["fecha", "nombre", "telefono", "direccion", "colonia", "preferencia", "intencion"];

function doPost(e) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Solicitudes")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Solicitudes");

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(["Fecha", "Nombre completo", "Teléfono", "Dirección", "Colonia", "Día preferido", "Intención", "¿Ya se contactó?"]);
    hoja.setFrozenRows(1);
  }

  const p = e.parameter || {};
  // evita que una celda empiece con "=" (fórmulas)
  const limpiar = (v) => String(v || "").slice(0, 500).replace(/^[=+\-@]/, "'$&");
  hoja.appendRow(COLUMNAS.map((c) => limpiar(p[c])).concat([""]));

  return ContentService.createTextOutput("ok");
}
