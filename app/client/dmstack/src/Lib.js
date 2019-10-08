// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Heap, HeapEntry} from "./Heap.js" // eslint-disable-line

/** Heap library entry. */
export class Lib {
  /** return {!Array<!LibEntry>} */
  static mk () {
    return [];
  }

  /**
    @param {!Array<!LibEntry>} lib
    @param {number} symbol
    @param {!Array<!HeapEntry>} heap
  **/
  static add (lib, symbol, heap) {
    lib.push(new LibEntry(symbol, heap)); // eslint-disable-line
  }

  /**
    @param {!Array<!LibEntry>} lib
    @param {number} symbol
    @return {Array<!HeapEntry>}
  **/
  static take (lib, symbol) {
    for (const e of lib)
      if (e.symbol === symbol) return e.heap;
    return null;
  }
}

/** Heap library entry. */
export class LibEntry {
  /**
    @param {number} symbol
    @param {!Array<!HeapEntry>} heap
  **/
  constructor (symbol, heap) {
    this._symbol = symbol;
    this._heap = heap;
  }

  /** @return {number} */
  get symbol () { return this._symbol }

  /** @return {!Array<!HeapEntry>} */
  get heap () { return this._heap }
}
