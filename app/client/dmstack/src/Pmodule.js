// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Machine from "./Machine.js"; // eslint-disable-line

/** Array de PmoduleEntry. */
export class Pmodule {
  /** return {!Array<!PmoduleEntry>} */
  static mk () {
    return [];
  }

  /**
    @param {!Array<!PmoduleEntry>} pmodule
    @param {number} symbol
    @param {function (!Machine):void} fn
  **/
  static add (pmodule, symbol, fn) {
    pmodule.push(new PmoduleEntry(symbol, fn)); // eslint-disable-line
  }

  /**
    @param {!Array<!PmoduleEntry>} pmodule
    @param {number} symbol
    @return {function (!Machine):void | null}
  **/
  static take (pmodule, symbol) {
    for (const e of pmodule)
      if (e.symbol === symbol) return e.fn;
    return null;
  }
}

/** Pmodule entry */
export class PmoduleEntry {
  /**
    @private
    @param {number} symbol
    @param {function (!Machine):void} fn
  **/
  constructor (symbol, fn) {
    this._symbol = symbol;
    this._fn = fn;
  }

  /** @return {number} */
  get symbol () { return this._symbol }

  /** @return {function (!Machine):void} */
  get fn () { return this._fn }
}

