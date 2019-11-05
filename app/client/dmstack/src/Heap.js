// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js"; // eslint-disable-line

/** Array of HeapEntries. */
export class Heap {
  /** return {!Array<!HeapEntry>} */
  static mk () {
    return [];
  }

  /**
    @param {!Array<!HeapEntry>} heap
    @param {number} symbol
    @param {!Token} token
  **/
  static add (heap, symbol, token) {
    heap.unshift(new HeapEntry(symbol, token)); // eslint-disable-line
  }

  /**
    @param {!Array<!HeapEntry>} heap
    @param {number} symbol
    @return {Token}
  **/
  static take (heap, symbol) {
    for (const e of heap) if (e.symbol === symbol) return e.token;
    return null;
  }
}

/** Heap entry. */
export class HeapEntry {
  /**
    @param {number} symbol
    @param {!Token} token
  **/
  constructor (symbol, token) {
    this._symbol = symbol;
    this._token = token;
  }

  /** return {number} */
  get symbol () { return this._symbol }

  /** return {!Token} */
  get token () { return this._token }

}
