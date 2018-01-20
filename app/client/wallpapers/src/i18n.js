// Generate by jsi18n. Don't modify

goog.provide("I18n");

{
  let lang = {};

  const en = {
    "Coordinates": "Coordinates",
    "Download": "Download",
    "Draw": "Draw",
    "File name": "File name",
    "Gallery": "Gallery",
    "Go back": "Go Back",
    "Language": "Language",
    "Load Functions": "Load Functions",
    "Off": "Off",
    "On": "On",
    "Only can be uploaded one file": "Only can be uploaded one file",
    "Precode": "Precode",
    "Preview": "Preview",
    "Save Functions": "Save Functions"
  };

  const es = {
    "Coordinates": "Coordenadas",
    "Download": "Descargar",
    "Draw": "Dibujar",
    "File name": "Nombre del archivo",
    "Gallery": "Galería",
    "Go back": "Volver",
    "Language": "Lenguaje",
    "Load Functions": "Cargar Funciones",
    "Off": "Off",
    "On": "On",
    "Only can be uploaded one file": "Solo se puede subir un arhivo",
    "Precode": "Precódigo",
    "Preview": "Vista Previa",
    "Save Functions": "Guardar funciones"
  };

  I18n = class {
  /** @return {void} */
  static en () {
    lang = en;
  }

  /** @return {void} */
  static es () {
    lang = es;
  }

  /**
   * @private
   * @return {!Object<string, string>}
   */
  static lang () {
    return lang;
  }
}}

function _(key) {
  let v = I18n.lang()[key];
  if (v !== undefined) {
    return v;
  }
  return key;
}

function _args(key, ...args) {
  let bf = "";
  let v = _(key);
  let isCode = false;
  for (let i = 0; i < v.length; ++i) {
    let ch = v.charAt(i);
    if (isCode) {
      bf += ch === "0" ? args[0]
        : ch === "1" ? args[1]
        : ch === "2" ? args[2]
        : ch === "3" ? args[3]
        : ch === "4" ? args[4]
        : ch === "5" ? args[5]
        : ch === "6" ? args[6]
        : ch === "7" ? args[7]
        : ch === "8" ? args[8]
        : ch === "9" ? args[9]
        : ch === "%" ? "%"
        : "%" + ch;
      isCode = false;
    } else {
      if (ch === "%") {
        isCode = true;
      } else {
        bf += ch
      }
    }
  }
  return bf;
}
