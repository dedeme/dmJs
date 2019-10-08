// Generate by jsi18n. Don't modify

/** I18n management. */

let lang = {};

const en = {
  "<br>View-mkEndMenu.%0%1%2<br>": "<br>Congratulations!!!<br>Sudoku successfully solved in<br>%0h, %1m and %2s.<br><br>",
  "Accept": "Accept",
  "Cancel": "Cancel",
  "Change language": "Change language",
  "Change to pen": "Change to pen",
  "Change to pencil": "Change to pencil",
  "Clear all": "Clear all",
  "Clear all.\nContinue?": "Clear all.\nContinue?",
  "Clear pencil": "Clear pencil",
  "Clear pencil.\nContinue?": "Clear pencil.\nContinue?",
  "Continue": "Continue",
  "Copy": "Copy",
  "Copy external sudoku": "Copy an external sudoku",
  "Down level": "Down level",
  "Help & Credits": "Help & Credits",
  "New": "New",
  "New sudoku": "New sudoku",
  "Open": "Load",
  "Open sudoku": "Load sudoku",
  "Save": "Save",
  "Search mistakes": "Search mistakes",
  "Solve": "Solve",
  "Solve sudoku.\nContinue?": "Solve sudoku.\nContinue?",
  "Solved sudoku": "Solved sudoku",
  "Sudoku has been saved": "Sudoku has been saved",
  "Sudoku has more than one solution.\nContinue?": "Sudoku has more than one solution.\nContinue?",
  "Sudoku has no sulution": "Sudoku has no sulution",
  "There are %0 errors in data": "There are %0 errors in data",
  "Up level": "Up level",
  "Without records": "Without records"
};

const es = {
  "<br>View-mkEndMenu.%0%1%2<br>": "<br>¡¡¡Felicidades!!!<br>Sudoku correctamente resuelto en<br>%0h, %1m y %2s.<br><br>",
  "Accept": "Aceptar",
  "Cancel": "Cancelar",
  "Change language": "Cambiar el lenguaje",
  "Change to pen": "Cambiar a bolígrafo",
  "Change to pencil": "Cambiar a lápiz",
  "Clear all": "Limpiar todo",
  "Clear all.\nContinue?": "Limplar todo.\n¿Continuar?",
  "Clear pencil": "Borrar el lapiz",
  "Clear pencil.\nContinue?": "Borrar el lápiz.\n¿Continuar?",
  "Continue": "Continuar",
  "Copy": "Copiar",
  "Copy external sudoku": "Copiar un sudoku externo",
  "Down level": "Bajar un nivel",
  "Help & Credits": "Ayuda & Créditos",
  "New": "Nuevo",
  "New sudoku": "Nuevo sudoku",
  "Open": "Recuperar",
  "Open sudoku": "Recuperar sudoku",
  "Save": "Guardar",
  "Search mistakes": "Buscar errores",
  "Solve": "Soluccionar",
  "Solve sudoku.\nContinue?": "Soluccionar el sudoku.\n¿Continuar?",
  "Solved sudoku": "Sudoky resuelto",
  "Sudoku has been saved": "El sudoku ha sido guardado",
  "Sudoku has more than one solution.\nContinue?": "El sudoku tiene más de una solucción.\n¿Continuar?",
  "Sudoku has no sulution": "El sudoku no tiene solución",
  "There are %0 errors in data": "Hay %0 errores en los datos",
  "Up level": "Subir un nivel",
  "Without records": "Sin registros"
};

export class I18n {
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
   * @return {!Object<string, string>} Dictionary
   */
  static lang () {
    return lang;
  }
}


/**
 * @param {string} key Value
 * @return {string} Translation
 */
export function _ (key) {
  const v = I18n.lang()[key];
  if (v !== undefined) {
    return v;
  }
  return key;
}

/**
 * @param {string} key Template
 * @param {...string} args Values
 * @return {string} Translation
 */
export function _args (key, ...args) {
  let bf = "";
  const v = _(key);
  let isCode = false;
  for (let i = 0; i < v.length; ++i) {
    const ch = v.charAt(i);
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
    } else if (ch === "%") {
      isCode = true;
    } else {
      bf += ch;
    }
  }
  return bf;
}
