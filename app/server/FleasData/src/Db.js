// Copyright 12-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Db");

goog.require("Quote");

Db = class {
  /**
   * @param {!Object<string, ?>} d
   */
  constructor (d) {
    this._d = d;

    /**
     * @private
     * @type {string}
     */
    this._language = d["language"] || "es";

    /**
     * @private
     * @type {string}
     */
    this._page = d["page"] || "settings";

    /**
     * @private
     * @type {string}
     */
    this._bestsId = d["bestsId"] || "last";

  }

  /** @return {string} */
  language () {
    return this._language;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setLanguage (value) {
    this._language = value;
  }


  /** @return {string} */
  page () {
    return this._page;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setPage (value) {
    this._page = value;
  }

  /** @return {string} */
  bestsId () {
    return this._bestsId;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setBestsId (value) {
    this._bestsId = value;
  }

  /**
   * Returns 'n' in format of current language
   * @param {!Dec} n
   * @return {string}
   */
  fDec(n) {
    return this._language === "en" ? n.toEn() : n.toEu();
  }

  /** @return {!Object<string, ?>} */
  serialize () {
    return {
      "language" : this._language,
      "page" : this._page,
      "bestsId" : this._bestsId
    };
  }

  /**
   * @param {!Object<string, ?>} db
   * @return {!Db}
   */
  static restore (db) {
    return new Db({
      "language" : db["language"],
      "page" : db["page"],
      "bestsId" : db["bestsId"]
    });
  }

}
