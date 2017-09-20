// Copyright 12-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Conf");

Conf = class {
  /** @private */
  constructor (h) {
    /** @private */
    this._map = h;
  }

  /** @return {string} */
  path () {
    return this._map["path"];
  }

  /** @param {string} value */
  setPath (value) {
    this._map["path"] = value;
  }

  /** @return {string} */
  lang () {
    return this._map["lang"];
  }

  /** @param {string} value */
  setLang (value) {
    this._map["lang"] = value;
  }

  /** @return {boolean} */
  showAll () {
    return this._map["showAll"] === "1";
  }

  /** @param {boolean} value */
  setShowAll (value) {
    this._map["showAll"] = value ? "1" : "0";
  }

  /** @return {string} */
  serialize () {
    return JSON.stringify(this._map);
  }

  /**
   * @param {string} serial
   * @return {!Conf}
   */
  static restore (serial) {
    let o = serial === ""
      ? {}
      : /** @type {!Object<string, string>} */(JSON.parse(serial));
    o["path"] = o["path"] || "";
    o["lang"] = o["lang"] || "es";
    o["showAll"] = o["showAll"] || "1";

    return new Conf(o);
  }
}
