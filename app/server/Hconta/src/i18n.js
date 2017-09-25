// Generate by jsi18n. Don't modify

goog.provide("I18n");

{
  let lang = {};

  const en = {
    "Accept":  "Accept",
    "Accounts":  "Accounts",
    "Cancel":  "Cancel",
    "Cash":  "Cash",
    "Change language to":  "Change language to",
    "Change password":  "Change password",
    "Check gray squares":  "Check gray squares",
    "Confirm password":  "Confirm password",
    "Confirm password is missing":  "'Confirm password' is missing",
    "Current password":  "Current password",
    "Current password is missing":  "'Current password' is missing",
    "Description":  "Description",
    "Fail trying to change password":  "Fail trying to change password",
    "Grey squares checks are wrong":  "Grey squares checks are wrong",
    "Group":  "Group",
    "Groups":  "Groups",
    "Keep connected":  "Keep connected",
    "Login":  "Login",
    "Logout-message":  "<p>%0 has finished.</p><p><b>Good by!</b></p>",
    "New password":  "New password",
    "New password is missing":  "'New password' is missing",
    "Nº":  "Nº",
    "Password":  "Password",
    "Password is missing":  "Password is missing",
    "Password successfully changed":  "Password successfully changed",
    "Plan":  "Plan",
    "Settings":  "Settings",
    "Subaccounts":  "Subaccounts",
    "Subgroups":  "Subgroups",
    "User":  "User",
    "User name is missing":  "User name is missing",
    "Wrong password":  "Wrong password"
  };

  const es = {
    "Accept":  "Aceptar",
    "Accounts":  "Cuentas",
    "Cancel":  "Cancelar",
    "Cash":  "Caja",
    "Change language to":  "Cambiar lenguaje a",
    "Change password":  "Cambiar contraseña",
    "Check gray squares":  "Marcar los cuadrados grises",
    "Confirm password":  "Confirmar la contraseña",
    "Confirm password is missing":  "Falta la confirmación de la contraseña",
    "Current password":  "Contraseña actual",
    "Current password is missing":  "Falta por indicar la contraseña actual",
    "Description":  "Descripción",
    "Fail trying to change password":  "Fallo intentando cambiar la contraseña",
    "Grey squares checks are wrong":  "Las casillas grises están mal marcadas",
    "Group":  "Grupo",
    "Groups":  "Grupos",
    "Keep connected":  "Mantenerse conectado",
    "Login":  "Identificación",
    "Logout-message":  "<p>%0 ha terminado.</p><p><b>¡Hasta pronto!</b></p>",
    "New password":  "Nueva contraseña",
    "New password is missing":  "Falta por indicar la nueva contraseña",
    "Nº":  "Nº",
    "Password":  "Contraseña",
    "Password is missing":  "Falta por indicar la contraseña",
    "Password successfully changed":  "La contraseña se cambió correctamente",
    "Plan":  "Plan",
    "Settings":  "Configuración",
    "Subaccounts":  "Subcuentas",
    "Subgroups":  "Subgrupos",
    "User":  "Usuario",
    "User name is missing":  "Falta por indicar el nombre del usuario",
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
