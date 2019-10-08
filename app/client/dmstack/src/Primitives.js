// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "./Pmodule.js"; // eslint-disable-line
import Machine from "./Machine.js"; // eslint-disable-line
import {Heap, HeapEntry} from "./Heap.js"; // eslint-disable-line
import {Lib, LibEntry} from "./Lib.js"; // eslint-disable-line
import Token from "./Token.js";
import {Symbol} from "./Symbol.js";

import ModGlobal from "./primitives/ModGlobal.js";
import ModFloat from "./primitives/ModFloat.js";
import ModMath from "./primitives/ModMath.js";

/** @type {!Array<!PrimitivesEntry>} */
const modules = [];

/** Primitive symbols management. */
export default class Primitives {
  /** @return {void} */
  static init () {
    /**
      @param {string} name
      @param {!Array<!PmoduleEntry>} pmodule
    **/
    function add (name, pmodule) {
      // eslint-disable-next-line
      modules.push(new PrimitivesEntry(Symbol.mk(name), pmodule));
    }

    add("", ModGlobal.mk()); // Must go at the first position!!!

    add("float", ModFloat.mk());
    add("math", ModMath.mk());
  }

  /**
    @param {number} module Symbol of a module.
    @param {number} fn Sumbol of a function (!Module):void.
    @return {function (!Machine):void | null}
  **/
  static take (module, fn) {
    for (const m of modules) {
      if (m.symbol === module) {
        const f = Pmodule.take(m.pmodule, fn);
        return f ? f : null;
      }
    }
    return null;
  }

  /**
    @param {!Array<!HeapEntry>} base
    @return {void}
  */
  static addBase (base) {
    const msym = Symbol.mk("");
    const global = modules[0];
    if (global.symbol !== msym)
      throw ("'global.symbol' is not Symbol.mk(\"\")");

    for (const e of global.pmodule) {
      const fnSym = e.symbol;
      const tk = Token.mkList(0, [
        Token.mkList(0, [Token.mkSymbol(0, msym), Token.mkSymbol(0, fnSym)]),
        Token.mkSymbol(0, Symbol.MRUN)
      ]);
      Heap.add(base, fnSym, tk);
    }
  }

  /**
    @param {!Array<!LibEntry>} lib
    @return {void}
  */
  static addLib (lib) {
    for (let i = 1; i < modules.length; ++i) {
      const module = modules[i];
      const heap = Heap.mk();

      for (const e of module.pmodule) {
        const fnSym = e.symbol;
        const tk = Token.mkList(0, [
          Token.mkList(0, [
            Token.mkSymbol(0, module.symbol), Token.mkSymbol(0, fnSym)
          ]),
          Token.mkSymbol(0, Symbol.MRUN)
        ]);
        Heap.add(heap, fnSym, tk);
      }

      Lib.add(lib, module.symbol, heap);
    }
  }

}

/** Primitives entry */
class PrimitivesEntry {
  /**
    @param {number} symbol
    @param {!Array<!PmoduleEntry>} pmodule
  **/
  constructor (symbol, pmodule) {
    this._symbol = symbol;
    this._pmodule = pmodule;
  }

  /** @return {number} */
  get symbol () { return this._symbol }

  /** @return {!Array<!PmoduleEntry>} */
  get pmodule () { return this._pmodule }

}
