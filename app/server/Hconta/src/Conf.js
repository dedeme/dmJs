// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Conf");

Conf = class {
  /**
   * @param {string} language
   * @param {!Array<number>} years
   * @param {number} year
   * @param {string} page
   * @param {string} planId
   */
  constructor (language, years, year, page, planId) {
    /** @private */
    this._language = language;
    /** @private */
    this._years = years;
    /** @private */
    this._year = year;
    /** @private */
    this._page = page;
    /** @private */
    this._planId = planId;
  }

  /** @return {string} */
  language () {
    return this._language;
  }

  /** @param {string} value */
  setLanguage (value) {
    this._language = value;
  }

  /** @return {!Array<number>} */
  years () {
    return this._years;
  }

  /** @param {!Array<number>} value */
  setYears (value) {
    this._years = value;
  }

  /** @return {number} */
  year () {
    return this._year;
  }

  /** @param {number} value */
  setYear (value) {
    this._year = value;
  }

  /** @return {string} */
  page () {
    return this._page;
  }

  /** @param {string} value */
  setPage (value) {
    this._page = value;
  }

  /** @return {string} */
  planId () {
    return this._planId;
  }

  /** @param {string} value */
  setPlanId (value) {
    this._planId = value;
  }

  /** @return {boolean} */
  isLastYear () {
    for (let i = 0; i < this._years.length; ++i) {
      if (this._years[i] > this._year) {
        return false;
      }
    }
    return true;
  }

  /** @return {string} */
  serialize () {
    return JSON.stringify([
      this._language,
      this._years,
      this._year,
      this._page,
      this._planId
    ]);
  }

  /**
   * @param {string} serial
   * @return {!Conf}
   */
  static restore (serial) {
    if (serial === "") {
      const year = DateDm.now().year();
      return new Conf("es", [year], year, "settings", "");
    }
    const pars = /** @type {!Array<?>} */(JSON.parse(serial));
    return new Conf (
      pars[0],
      pars[1],
      pars[2],
      pars[3],
      pars[4]
    );
  }
}
