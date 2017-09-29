// Generate by jsi18n. Don't modify

goog.provide("I18n");

{
  let lang = {};

  const en = {
    "%0 can not be deleted because %1":  "'%0' can not be deleted, because\nthere are %1 diarty entries which use it",
    "Accept":  "Accept",
    "Accounts":  "Accounts",
    "Cancel":  "Cancel",
    "Cash":  "Cash",
    "Change language to":  "Change language to",
    "change of count %0":  "This change will affect to %0 records.\nContinue?",
    "Change password":  "Change password",
    "Check gray squares":  "Check gray squares",
    "Click %0 to continue.":  "Click %0 to continue.",
    "Confirm password":  "Confirm password",
    "Confirm password is missing":  "'Confirm password' is missing",
    "Current password":  "Current password",
    "Current password is missing":  "'Current password' is missing",
    "Delete '%0'?":  "Delete '%0'?",
    "Description":  "Description",
    "Description is missing":  "Description is missing",
    "Diary":  "Diary",
    "Fail trying to change password":  "Fail trying to change password",
    "Grey squares checks are wrong":  "Grey squares checks are wrong",
    "Group":  "Group",
    "Group is missing":  "Group is missing",
    "Groups":  "Groups",
    "here":  "here",
    "Keep connected":  "Keep connected",
    "Login":  "Login",
    "Logout-message":  "<p>%0 has finished.</p><p><b>Good by!</b></p>",
    "New password":  "New password",
    "New password and confirm password do not match":  "New password and confirm password do not match",
    "New password is missing":  "'New password' is missing",
    "Nº":  "Nº",
    "Password":  "Password",
    "Password is missing":  "Password is missing",
    "Password successfully changed":  "Password successfully changed",
    "Plan":  "Plan",
    "Session is expired.":  "Session is expired.",
    "Settings":  "Settings",
    "Subaccounts":  "Subaccounts",
    "Subgroups":  "Subgroups",
    "User":  "User",
    "User name is missing":  "User name is missing",
    "Wrong password":  "Wrong password"
  };

  const es = {
    "%0 can not be deleted because %1":  "'%0' no se puede eliminar, porque hay %1\nentradas del diario que usan la cuenta/grupo.",
    "Accept":  "Aceptar",
    "Accounts":  "Cuentas",
    "Cancel":  "Cancelar",
    "Cash":  "Caja",
    "Change language to":  "Cambiar lenguaje a",
    "change of count %0":  "Este cambio afectará a %0 registros.\n¿Continuar?",
    "Change password":  "Cambiar contraseña",
    "Check gray squares":  "Marcar los cuadrados grises",
    "Click %0 to continue.":  "Hacer click %0 para continuar.",
    "Confirm password":  "Confirmar la contraseña",
    "Confirm password is missing":  "Falta la confirmación de la contraseña",
    "Current password":  "Contraseña actual",
    "Current password is missing":  "Falta indicar la contraseña actual",
    "Delete '%0'?":  "¿Eliminar '%0'?",
    "Description":  "Descripción",
    "Description is missing":  "Falta indicar la descripción",
    "Diary":  "Diario",
    "Fail trying to change password":  "Fallo intentando cambiar la contraseña",
    "Grey squares checks are wrong":  "Las casillas grises están mal marcadas",
    "Group":  "Grupo",
    "Group is missing":  "Falta indicar el grupo",
    "Groups":  "Grupos",
    "here":  "aquí",
    "Keep connected":  "Mantenerse conectado",
    "Login":  "Identificación",
    "Logout-message":  "<p>%0 ha terminado.</p><p><b>¡Hasta pronto!</b></p>",
    "New password":  "Nueva contraseña",
    "New password and confirm password do not match":  "La nueva contraseña y su confirmación no coinciden",
    "New password is missing":  "Falta indicar la nueva contraseña",
    "Nº":  "Nº",
    "Password":  "Contraseña",
    "Password is missing":  "Falta indicar la contraseña",
    "Password successfully changed":  "La contraseña se cambió correctamente",
    "Plan":  "Plan",
    "Session is expired.":  "La sesión ha expirado.",
    "Settings":  "Configuración",
    "Subaccounts":  "Subcuentas",
    "Subgroups":  "Subgrupos",
    "User":  "Usuario",
    "User name is missing":  "Falta indicar el nombre del usuario",
    "Wrong password":  "La contraseña es incorrecta"
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
