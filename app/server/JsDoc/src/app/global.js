//- app/app.js
//- dm/store.js
//- i18nData.js
//- dm/i18n.js
//- dm/Client.js
/*
 * Copyright 15-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, app, i18nData */

(() => {
  const store = dm.store;
  const i18n = dm.i18n;
  const Client = dm.Client;

  // Store keys
  const pageStore = "JsDoc__page";
  const langStore = "JsDoc__lang";

  //# Obj
  const global = {
    /// Tow spaces tabulation
    //# str
    get tab () { return "  "; },

    /// Application name
    //# str
    get app () { return "DmjsDoc"; },

    /// Application version
    //#str
    get version () { return "0.0.0"; },

    /// Page type
    //# str
    get confPage () { return "0"; },

    /// Page type
    //# str
    get indexPage () { return "1"; },

    /// Page type
    //# str
    get helpPage () { return "2"; },

    /// Page type
    //# str
    get codePage () { return "3"; },

  };
  app.global = global;

  /// Gets language
  global.getLanguage = () => store.get(langStore) || "en";

  /// Change language
  global.changeLanguage = () => {
    const lang = global.getLanguage();
    lang === "en" ? store.put(langStore, "es") : store.put(langStore, "en");
  };

  /// Intializates language
  global.initLanguage = () => {
    const lang = global.getLanguage();
    i18n.init(lang === "en" ? i18nData.en : i18nData.es);
  };

  /// Create client. If authentication fails, returns 'null'
  global.client = () => {
    const c = new Client(global.app);
    c.user = "admin";
    if (c.sessionId === "") {
      return null;
    }
    return c;
  };

/*
  /// Redirects if hostname is not 'localhost'
  # -
  ns.serverControl = ->
    if location.hostname != "localhost"
      location.assign "../default.html"

  /// Create a new Client
  # - !Client
  ns.client = ->
    c = new Client ns.app
    c.user "admin"
    c.sessionId ns.getSessionId!
    c
*/

  /// Reads page value from local store. Default global.ConfPage
  //# - str
  global.getPageType = () => {
    const r = store.get(pageStore);
    return (r === null) ? global.confPage : r;
  };

  /// Writes page value to local store
  //# str -
  global.setPageType = p => {
    store.put(pageStore, p);
  };

})();
