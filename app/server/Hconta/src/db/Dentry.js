// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Diary entry */
goog.provide("db_Dentry");

db_Dentry = class {
  /**
   * @param {number} id
   * @param {number} number
   * @param {!DateDm} date
   * @param {string} description
   * @param {!Array<!Tp<string,!Dec>>} debits
   * @param {!Array<!Tp<string,!Dec>>} credits
   */
  constructor (id, number, date, description, debits, credits) {
    /** @private */
    this._id = id;
    /** @private */
    this._number = number;
    /** @private */
    this._date = date;
    /** @private */
    this._description = description;
    /** @private */
    this._debits = debits;
    /** @private */
    this._credits = credits;
  }

  /** @return {number} */
  id () {
    return this._id;
  }

  /** @return {number} */
  number () {
    return this._number;
  }

  /** @return {!DateDm} */
  date () {
    return this._date;
  }

  /** @return {string} */
  description () {
    return this._description;
  }

  /** @return {!Array<!Tp<string,!Dec>>} */
  debits () {
    return this._debits;
  }

  /** @return {!Array<!Tp<string,!Dec>>} */
  credits () {
    return this._credits;
  }
}
