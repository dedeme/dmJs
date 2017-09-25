// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Conf");

{
  /** @type {string} */
  let language = "";
  /** @type {!Array<number>} */
  let years = [];
  /** @type {number} */
  let year = 0;
  /** @type {string} */
  let page = "";
  /** @type {number} */
  let diaryId = 0;
  /** @type {string} */
  let planId = "";


Conf = class {

  /** @return {string} */
  static language () {
    return language;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  static setLanguage (value) {
    language = value;
  }

  /** @return {!Array<number>} */
  static years () {
    return years;
  }

  /** @return {number} */
  static year () {
    return year;
  }

  /**
   * @param {number} value
   * @return {void}
   */
  static setYear (value) {
    year = value;
  }

  /** @return {string} */
  static page () {
    return page;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  static setPage (value) {
    page = value;
  }

  /** @return {number} */
  static diaryId () {
    return diaryId;
  }

  /**
   * @param {number} value
   * @return {void}
   */
  static setDiaryId (value) {
    diaryId = value;
  }

  /** @return {string} */
  static planId () {
    return planId;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  static setPlanId (value) {
    planId = value;
  }

  /** @return {boolean} */
  static isLastYear () {
    for (let i = 0; i < years.length; ++i) {
      if (years[i] > year) {
        return false;
      }
    }
    return true;
  }

  /**
   * @return {string}
   */
  static serialize () {
    return language + "\n" +
      JSON.stringify(years) + "\n" +
      year + "\n" +
      page + "\n" +
      diaryId + "\n" +
      planId;
  }

  /**
   * @param {string} serial
   * @return {void}
   */
  static restore (serial) {
    if (serial !== "") {
      const vals = serial.split("\n");
      language = vals[0];
      years = /** @type {!Array<number>} */(JSON.parse(vals[1]));
      year = +vals[2];
      page = vals[3];
      diaryId = +vals[4];
      planId = vals[5];
    } else {
      language = "es";
      page = "settings";
      year = DateDm.now().year();
      years = [year];
      diaryId = 0;
      planId = "";
    }
  }
}}
