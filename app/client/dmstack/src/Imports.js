// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Heap, HeapEntry} from "./Heap.js"; // eslint-disable-line
import {Lib, LibEntry} from "./Lib.js"; // eslint-disable-line
import Primitives from "./Primitives.js";
import Token from "./Token.js";
import Either from "./util/Either.js";
import {Symbol, SymbolKv} from "./Symbol.js";

/** @type {!Array<LibEntry>} */
const imports = Lib.mk();

/** @type {!Array<number>} */
let onway = [];

/** @type {!Array<!HeapEntry>} */
const _base = Heap.mk();

/** Imports management. */
export default class Imports {
  /** @return {void} */
  static init () {
    Primitives.addBase(_base);
    Primitives.addLib(imports);
  }

  /** @param {number} symbol */
  static putOnWay (symbol) {
    onway.push(symbol);
  }

  /** @param {number} symbol */
  static quitOnWay (symbol) {
    const r = [];
    for (const sym of onway)
      if (sym !== symbol) r.push(sym);
    onway = r;
  }

  /**
    @param {number} symbol
    @return {boolean}
  **/
  static isOnWay (symbol) {
    for (const sym of onway)
      if (sym === symbol) return true;
    return false;
  }

  /**
    @param {number} symbolKey
    @param {!Array<!HeapEntry>} heap
    @return {void}
  **/
  static add (symbolKey, heap) {
    Lib.add(imports, symbolKey, heap);
  }

  /**
    @param {number} symbolKey
    @return {Array<!HeapEntry>}
  **/
  static take (symbolKey) {
    return Lib.take(imports, symbolKey);
  }

  /** @return {!Array<!HeapEntry>} */
  static base () {
    return _base;
  }

  /**
    @param {!Token} tk
    return {!Either<!SymbolKv>}
  **/
  static readSymbol (tk) {
    if (tk.type === Token.STRING)
      return Either.mkRight(new SymbolKv(-1, Symbol.mk(tk.stringValue)));

    if (tk.type !== Token.LIST) {
      return Either.mkLeft(
        "Stack pop: Expected token of type ['" +
        Token.typeToString(Token.STRING) + "' or '" +
        Token.typeToString(Token.LIST) + "], found type '" +
        Token.typeToString(tk.type) + "'"
      );
    }

    const a = tk.listValue;
    if (a.length !== 2)
      return Either.mkLeft(
        "List " + tk.toString() +
        "\nExpected size:2, actual size: " + a.length
      );
    const tk1 = a[0];
    if (tk1.type !== Token.STRING)
      return Either.mkLeft("Expected String as first list element in import");
    const tk2 = a[1];
    if (tk2.type !== Token.STRING)
      return Either.mkLeft(
        "Expected String as second list element in import"
      );
    return Either.mkRight(new SymbolKv(
      tk2.symbolValue, Symbol.mk(tk1.stringValue)
    ));
  }

  /**
    @param {string} f
    @return {!Promise}
  **/
  static load (f) {
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      request.onload = () => {
        if (request.status === 200) {
          resolve(request.responseText.trim());
        } else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = () => {
        reject(Error("Network Error"));
      };

      request.open("GET", f, true);
      request.setRequestHeader(
        "Content-Type"
        , "text/plain"
      );

      request.send();
    });
  }
}
