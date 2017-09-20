// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Global");

goog.require("github.dedeme");

{
  // Store keys
  const langStore = "JsDoc__lang";

  const app = "JsDoc";
  const version = "201709";

  const client = new Client(
    app,
    () => {
  //    location.assign("../Expired/index.html");
      alert("Global. Fail pageId");
    }
  );

Global = class {

  /** @return {string} */
  static language () {
    return Store.get(langStore) || "en"
  }

  /** @param {string} lang */
  static setLanguage (lang) {
    Store.put(langStore, lang);
  }

  /** @return {string} */
  static app () {
    return app;
  }

  /** @return {string} */
  static version () {
    return version;
  }

  /** @return {!Client} */
  static client () {
    return client;
  }
}}
