// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import List from "./util/List.js";
import Token from "./Token.js";
import {Symbol, SymbolKv} from "./Symbol.js"; // eslint-disable-line
import TkReader from "./TkReader.js";
import Imports from "./Imports.js";
import Path from "./util/Path.js";
import Args from "./Args.js";

/** Code reader. */
export default class Reader {
  /**
    @param {string} source
    @param {string} prg
  **/
  constructor (source, prg) {
    /** @type {boolean} */
    this._isFile = true;
    this._source = source;
    /** @type {number} */
    this._nline = 1;
    this._prg = prg;
    /** @type {number} */
    this._prgIx = 0;
    /** @type {Token} */
    this._nextTk = null;
    /** @type {List<SymbolKv>} */
    this._syms = new List();
  }

  /**
    Constructor from another reader.
    @param {!Reader} parent
    @param {string} prg
    @param {number} nline
    @return {!Reader}
  **/
  static fromReader (parent, prg, nline) {
    const r = new Reader(parent._source, prg);
    r._isFile = false;
    r._nline = nline;
    r._syms = parent._syms;
    return r;
  }

  /** @return {boolean} */
  get isFile () { return this._isFile }

  /** @return {string} */
  get source () { return this._source }

  /** @return {string} */
  get prg () { return this._prg }

  /** @return {number} */
  get prgIx () { return this._prgIx }

  /** @param {number} value */
  set prgIx (value) { this._prgIx = value }

  /**
    Used to pass an extra token.
    @return {Token}
  **/
  get nextTk () { return this._nextTk }

  /** @param {Token} value */
  set nextTk (value) { this._nextTk = value }

  /** @return {number} */
  get nline () { return this._nline }

  /** @param {number} value */
  set nline (value) { this._nline = value }

  /**
    @param {!Array<!Token>} prg
    @param {!Token} tk
  **/
  symbolId (prg, tk) {
    const sym = tk.symbolValue;
    if (sym === Symbol.IMPORT) {
      if (prg.length === 0) this.fail("Import source is missing");
      const t = prg[prg.length - 1];
      const eSymKv = Imports.readSymbol(t);
      if (eSymKv.left !== "") this.fail(eSymKv.left);

      const symKv = eSymKv.right;
      const sym = symKv.value;
      const f = sym.toString();
      const fc = Path.canonical(Path.cat(
        [Path.parent(this._source), f + ".dms"]
      ));

      const newSym = Symbol.mk(fc.substring(0, fc.length - 4));
      let key = symKv.key;
      if (key === -1) key = Symbol.mk(Path.name(f));
      this._syms = this._syms.cons(new SymbolKv(key, newSym));
    } else if (sym === Symbol.THIS) {
      return Token.mkSymbol(tk.line, Symbol.mk(this._source));
    } else if (sym.toString().charAt(0) === "@") {
      const line = tk.line;
      const name = sym.toString();
      if (name.charAt(name.length - 1) === "?") {
        this._nextTk = Token.mkSymbol(line, Symbol.STACK_CHECK);
        return Token.mkList(line, [Token.mkSymbol(
          line, Symbol.mk(name.substring(1, name.length - 1))
        )]);
      }
      if (Args.debug) {
        this._nextTk = Token.mkSymbol(line, Symbol.STACK);
        return Token.mkList(line, [Token.mkSymbol(
          line, Symbol.mk(name.substring(1))
        )]);
      }
      return Token.mkSymbol(line, Symbol.NOP);
    } else {
      let syms = this._syms;
      while (!syms.isEmpty()) {
        if (syms.head.key === sym)
          return Token.mkSymbol(tk.line, syms.head.value);
        syms = syms.tail;
      }
    }
    return tk;
  }

  /**
    @return {!Token} Token type LIST containing a program.
  **/
  process () {
    const nline = this._nline;
    /** @type !Array<!Token> */
    const r = [];
    let tk = TkReader.next(this);

    while (tk !== null) {
      if (tk.type === Token.SYMBOL) tk = this.symbolId(r, tk);
      r.push(tk);
      tk = TkReader.next(this);
    }

    return Token.mkList(nline, r);
  }

  /**
    @param {string} msg
  **/
  fail (msg) {
    // eslint-disable-next-line
    console.log(this._source + ".dms:" + this._nline + ": " + msg);
    throw ("");
  }
}
