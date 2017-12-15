// Copyright 10-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Trace");

goog.require("Quote");

Trace = class {
  /**
   * @param {!Quote} quote
   * @param {number} beforeCash
   * @param {!Object<string, number>} beforePortfolio
   * @param {string} nick
   * @param {number} cash
   * @param {number} stocks
   * @param {number} afterCash
   * @param {!Object<string, number>} afterPortfolio
   * @param {?} data
   */
  constructor (
    quote, beforeCash, beforePortfolio,
    nick, cash, stocks, afterCash, afterPortfolio, data
  ) {
    /** @private */
    this._quote = quote;
    /** @private */
    this._beforeCash = beforeCash;
    /** @private */
    this._beforePortfolio = beforePortfolio;
    /** @private */
    this._nick = nick;
    /** @private */
    this._cash = cash;
    /** @private */
    this._stocks = stocks;
    /** @private */
    this._afterCash = afterCash;
    /** @private */
    this._afterPortfolio = afterPortfolio;
    /** @private */
    this._data = data;
  }

  /** @return {!Quote} */
  quote () {
    return this._quote;
  }

  /** @return {number} */
  beforeCash () {
    return this._beforeCash;
  }

  /** @return {!Object<string, number>} */
  beforePortfolio () {
    return this._beforePortfolio;
  }

  /** @return {string} */
  nick () {
    return this._nick;
  }

  /** @return {number} */
  cash () {
    return this._cash;
  }

  /** @return {number} */
  stocks () {
    return this._stocks;
  }

  /** @return {number} */
  afterCash () {
    return this._afterCash;
  }

  /** @return {!Object<string, number>} */
  afterPortfolio () {
    return this._afterPortfolio;
  }

  /** @return {?} */
  data () {
    return this._data;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._quote,
      this._beforeCash,
      this._beforePortfolio,
      this._nick,
      this._cash,
      this._stocks,
      this._afterCash,
      this._afterPortfolio,
      this._data
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!Trace}
   */
  static restore (serial) {
    return new Trace (
      serial[0],
      serial[1],
      serial[2],
      serial[3],
      serial[4],
      serial[5],
      serial[6],
      serial[7],
      serial[8]
    );
  }
}
