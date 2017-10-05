// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Conf");

Conf = class {
  /**
   * @param {string} language
   * @param {!Array<number>} years
   * @param {number} year
   * @param {string} page
   * @param {string} planId Last group/account selected
   * @param {number} diaryIx Index of diary list. 0 means no edited entry.
   * @param {string} diaryId Last account selected for help
   */
  constructor (language, years, year, page, planId, diaryIx, diaryId) {
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
    /** @private */
    this._diaryIx = diaryIx;
    /** @private */
    this._diaryId = diaryId;
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

  /** @return {number} */
  diaryIx () {
    return this._diaryIx;
  }

  /** @param {number} value */
  setDiaryIx (value) {
    this._diaryIx = value;
  }

  /** @return {string} */
  diaryId () {
    return this._diaryId;
  }

  /** @param {string} value */
  setDiaryId (value) {
    this._diaryId = value;
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
      this._planId,
      this._diaryIx,
      this._diaryId
    ]);
  }

  /**
   * @param {string} serial
   * @return {!Conf}
   */
  static restore (serial) {
    if (serial === "") {
      const year = DateDm.now().year();
      return new Conf("es", [year], year, "settings", "", 0, "572");
    }
    const pars = /** @type {!Array<?>} */(JSON.parse(serial));
    return new Conf (
      pars[0],
      pars[1],
      pars[2],
      pars[3],
      pars[4],
      pars[5],
      pars[6]
    );
  }
}
