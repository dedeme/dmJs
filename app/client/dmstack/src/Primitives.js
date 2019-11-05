// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "./Pmodule.js"; // eslint-disable-line
import Machine from "./Machine.js"; // eslint-disable-line
import {Heap, HeapEntry} from "./Heap.js"; // eslint-disable-line
import {Lib, LibEntry} from "./Lib.js"; // eslint-disable-line
import Token from "./Token.js";
import {Symbol} from "./Symbol.js";

import ModGlobal from "./primitives/ModGlobal.js";
import ModStk from "./primitives/ModStk.js";
import ModFloat from "./primitives/ModFloat.js";
import ModMath from "./primitives/ModMath.js";
import ModInt from "./primitives/ModInt.js";
import ModBlob from "./primitives/ModBlob.js";
import ModList from "./primitives/ModList.js";
import ModIt from "./primitives/ModIt.js";
import ModObj from "./primitives/ModObj.js";
import ModMap from "./primitives/ModMap.js";
import ModStr from "./primitives/ModStr.js";
import ModJs from "./primitives/ModJs.js";
import ModExc from "./primitives/ModExc.js";
import ModWrap from "./primitives/ModWrap.js";
import ModB64 from "./primitives/ModB64.js";
import ModCryp from "./primitives/ModCryp.js";
import ModPath from "./primitives/ModPath.js";
import ModClock from "./primitives/ModClock.js";
import ModTime from "./primitives/ModTime.js";
import ModSys from "./primitives/ModSys.js";
import ModChan from "./primitives/ModChan.js";
import ModFfi from "./primitives/ModFfi.js";
import ModUi from "./primitives/ModUi.js";
import ModCom from "./primitives/ModCom.js";
import ModStore from "./primitives/ModStore.js";

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

    add("stk", ModStk.mk());
    add("float", ModFloat.mk());
    add("math", ModMath.mk());
    add("int", ModInt.mk());
    add("blob", ModBlob.mk());
    add("lst", ModList.mk());
    add("it", ModIt.mk());
    add("obj", ModObj.mk());
    add("map", ModMap.mk());
    add("str", ModStr.mk());
    add("js", ModJs.mk());
    add("exc", ModExc.mk());
    add("wrap", ModWrap.mk());
    add("b64", ModB64.mk());
    add("cryp", ModCryp.mk());
    add("path", ModPath.mk());
    add("clock", ModClock.mk());
    add("time", ModTime.mk());
    add("sys", ModSys.mk());
    add("chan", ModChan.mk());
    add("ffi", ModFfi.mk());
    add("ui", ModUi.mk());
    add("com", ModCom.mk());
    add("store", ModStore.mk());
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
      const tk = Token.mkList([
        Token.mkList([Token.mkSymbol(msym), Token.mkSymbol(fnSym)]),
        Token.mkSymbol(Symbol.MRUN)
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
        const tk = Token.mkList([
          Token.mkList([
            Token.mkSymbol(module.symbol), Token.mkSymbol(fnSym)
          ]),
          Token.mkSymbol(Symbol.MRUN)
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
