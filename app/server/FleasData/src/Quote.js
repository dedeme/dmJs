// Copyright 12-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Quote");

Quote = class {
  /**
   * @param {string} date
   * @param {number} open
   * @param {number} close
   * @param {number} max
   * @param {number} min
   * @param {number} vol
   */
  constructor (date, open, close, max, min, vol) {
    /** @private */
    this._date = date;
    /** @private */
    this._open = open;
    /** @private */
    this._close = close;
    /** @private */
    this._max = max;
    /** @private */
    this._min = min;
    /** @private */
    this._vol = vol;
  }

  /** @return {string} */
  date () {
    return this._date;
  }

  /** @return {number} */
  open () {
    return this._open;
  }

  /** @return {number} */
  close () {
    return this._close;
  }

  /** @return {number} */
  max () {
    return this._max;
  }

  /** @return {number} */
  min () {
    return this._min;
  }

  /** @return {number} */
  vol () {
    return this._vol;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._date,
      this._open,
      this._close,
      this._max,
      this._min,
      this._vol
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!Quote}
   */
  static restore (serial) {
    return new Quote (
      serial[0],
      serial[1],
      serial[2],
      serial[3],
      serial[4],
      serial[5]
    );
  }
}
