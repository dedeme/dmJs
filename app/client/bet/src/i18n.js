// Generate by jsi18n. Don't modify

goog.provide("I18n");

{
  let lang = {};

  const en = {
    "%0 is not a valid number":  "%0 is not a valid number",
    "%0: values must be greater than 1":  "%0: values must be greater than 1",
    "Bets":  "Bets",
    "Calculate":  "Calculate",
    "Clear":  "Clear",
    "Help & Credits":  "Help & Credits",
    "Profits":  "Profits",
    "There are missing values":  "There are missing values"
  };

  const es = {
    "%0 is not a valid number":  "%0 no es un número válido",
    "%0: values must be greater than 1":  "%0: Los valores deben ser mayores que 1",
    "Bets":  "Apuestas",
    "Calculate":  "Calcular",
    "Clear":  "Limpiar",
    "Help & Credits":  "Ayuda & Créditos",
    "Profits":  "Beneficio",
    "There are missing values":  "Faltan valores por introducir"
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
      if (ch === '%') {
        isCode = true;
      } else {
        bf += ch
      }
    }
  }
  return bf;
}
