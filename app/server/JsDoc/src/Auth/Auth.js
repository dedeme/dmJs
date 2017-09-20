// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Auth");

goog.require("Global");
goog.require("I18n");
goog.require("AuthV");

Auth = class {
  constructor () {
    if (Global.language() == "en") I18n.en(); else I18n.es();

    /**
     * @private
     * @type {!AuthV}
     */
    this._view = new AuthV(this);
  }

  run () {
    this._view.show();
  }

  /** Change language selected */
  changeLanguage (ev) {
    Global.setLanguage(Global.language() === "en" ? "es" : "en");
    new Auth().run();
  }

  /**
   * Accept button pressed
   * @param {string} user
   * @param {string} pass
   * @param {boolean} persistent
   */
  accept (user, pass, persistent) {
    if (user == "") {
      alert(_("User name is missing"));
      return;
    }
    if (pass == "") {
      alert(_("Password is missing"));
      return;
    }
    Global.client().authentication(user, pass, !persistent, (ok) => {
      if (ok) {
        this._view.captcha().resetCounter();
        location.assign("../index.html");
      } else {
        this._view.captcha().incCounter();
        new Auth().run();
      }
    })
  }
}
new Auth().run();

