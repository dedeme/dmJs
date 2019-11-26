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
    /** @type {number} */
    this._source = Symbol.mk(source);
    /** @type {number} */
    this._nline = 1;
    this._prg = prg;
    /** @type {number} */
    this._prgIx = 0;
    /** @type {Token} */
    this._nextTk = null;
    /** @type {!List<!SymbolKv>} */
    this._syms = new List();
    /** @type {!Array<string>} Paths wihout extension. */
    this._imports = [];
    this._stkCounter = 0;
  }

  /**
    Constructor from another reader.
    @param {!Reader} parent
    @param {string} prg
    @param {number} nline
    @return {!Reader}
  **/
  static fromReader (parent, prg, nline) {
    const r = new Reader(Symbol.toStr(parent._source), prg);
    r._isFile = false;
    r._nline = nline;
    r._syms = parent._syms;
    return r;
  }

  /** @return {boolean} */
  get isFile () { return this._isFile }

  /** @return {number} */
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

  /** @return {!Array<string>} nline:Path wihout extension. */
  get imports () { return this._imports }

  /**
    @return {!Token} Token type LIST containing a program.
  **/
  process () {
    const nline = this._nline;
    /** @type !Array<!Token> */
    const r = [];
    let tk = TkReader.next(this);

    while (tk !== null) {
      if (tk.type === Token.SYMBOL) {
        for (const t of this.symbolId(r, tk))
          r.push(t);
      } else if (tk.type === Token.STRING) {
        for (const t of this.interpolation(tk))
          r.push(t);
      } else {
        r.push(tk);
      }
      tk = TkReader.next(this);
    }

    return Token.mkListPos(r, this._source, nline);
  }

  /**
    @param {!Array<!Token>} prg
    @param {!Token} tk
    @return {!Array<!Token>} tk
  **/
  symbolId (prg, tk) {
    const sym = tk.symbolValue;
    const symStr = Symbol.toStr(sym);
    const symChar = symStr.charAt(0);
    if (sym === Symbol.IMPORT) {
      if (prg.length === 0) this.fail("Import source is missing");
      const t = prg[prg.length - 1];
      const eSymKv = Imports.readSymbol(t);
      if (eSymKv.left !== "") this.fail(eSymKv.left);

      const symKv = eSymKv.right;
      const sym = symKv.value;
      const f = Symbol.toStr(sym);

      const fc = Path.canonical(Path.cat(
        [Path.parent(Symbol.toStr(this._source)), f + ".dms"]
      ));

      const fid = fc.substring(0, fc.length - 4);
      if (tk.pos !== null)
        this._imports.push(tk.pos.line + ":" + fid);
      else
        this._imports.push("0:" + fid);
      const newSym = Symbol.mk(fc.substring(0, fc.length - 4));

      let key = symKv.key;
      if (key === -1) key = Symbol.mk(Path.name(f));
      this._syms = this._syms.cons(new SymbolKv(key, newSym));
    } else if (sym === Symbol.THIS) {
      if (tk.pos !== null)
        return [Token.mkSymbolPos(this._source, this._source, tk.pos.line)];
      throw new Error("tk.pos is null");
    } else if (symChar === "." && symStr !== ".") {
      return [
        Token.mkStringPos(symStr.substring(1), this._source, tk.pos.line),
        Token.mkSymbolPos(Symbol.mk("map"), this._source, tk.pos.line),
        Token.mkSymbolPos(Symbol.mk("get"), this._source, tk.pos.line)
      ];
    } else if (symChar === "!" && symStr !== "!") {
      const ns = symStr.substring(1);
      if (isNaN(ns)) return [tk];
      const n = Number(ns);
      return [
        Token.mkIntPos(n, this._source, tk.pos.line),
        Token.mkSymbolPos(Symbol.mk("lst"), this._source, tk.pos.line),
        Token.mkSymbolPos(Symbol.mk("get"), this._source, tk.pos.line)
      ];
    } else if (symChar === "@") {
      if (tk.pos === null) throw new Error("tk.pos is null");
      const line = tk.pos.line;
      if (symStr.charAt(1) === "?") {
        return [
          Token.mkListPos([Token.mkSymbolPos(
            Symbol.mk(symStr.substring(2)),
            this._source, line
          )], this._source, line),
          Token.mkSymbolPos(Symbol.STACK_CHECK, this._source, line)
        ];
      }
      if (symStr.charAt(1) === "+") {
        ++this._stkCounter;
        return [
          Token.mkListPos([Token.mkSymbolPos(
            Symbol.mk(symStr.substring(2)),
            this._source, line
          )], this._source, line),
          Token.mkSymbolPos(Symbol.STACK_OPEN, this._source, line)
        ];
      }
      if (symStr.charAt(1) === "-") {
        --this._stkCounter;
        return [
          Token.mkListPos([Token.mkSymbolPos(
            Symbol.mk(symStr.substring(2)),
            this._source, line
          )], this._source, line),
          Token.mkSymbolPos(Symbol.STACK_CLOSE, this._source, line)
        ];
      }
      if (Args.debug) {
        return [
          Token.mkListPos([Token.mkSymbolPos(
            Symbol.mk(symStr.substring(1)), this._source, line
          )], this._source, line),
          Token.mkSymbolPos(Symbol.STACK, this._source, line)
        ];
      }
      return [];
    } else {
      let syms = this._syms;
      while (!syms.isEmpty() && this._prg.charAt(this._prgIx) === ",") {
        if (syms.head.key === sym) {
          if (tk.pos === null) throw new Error("tk.pos is null");
          return [
            Token.mkSymbolPos(syms.head.value, this._source, tk.pos.line)
          ];
        }
        syms = syms.tail;
      }
    }
    return [tk];
  }

  /**
    @param {!Token} tk
    @return {!Array<!Token>}
  **/
  interpolation (tk) {
    const s = tk.stringValue;
    if (tk.pos === null) throw new Error("tk.pos is null");
    let nline = tk.pos.line;

    const r = [];
    let pos = 0;
    let ix = s.indexOf("${");
    while(ix !== -1) {
      r.push(Token.mkStringPos(s.substring(pos, ix), this._source, nline));
      if (pos !== 0)
        r.push(Token.mkSymbolPos(Symbol.PLUS, this._source, nline));

      let p = pos;
      while (p < ix) if (s.charAt(p++) === "\n") ++nline;

      const ix2 = s.indexOf("}", ix);
      if (ix2 === -1)
        this.fail("Interpolation '}' not found");

      const subr = Reader.fromReader(
        this, s.substring(ix + 2, ix2), nline
      );
      /** @type !Array<!Token> */
      const prg = subr.process().listValue;

      p = ix + 2;
      while (p < ix2) if (s.charAt(p++) === "\n") ++nline;

      if (prg.length > 0) {
        r.push(Token.mkListPos(prg, this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.DATA, this._source, nline));
        r.push(Token.mkIntPos(0, this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.LST, this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.GET, this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.TO_STR, this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.PLUS, this._source, nline));
      } else {
        r.push(Token.mkStringPos("", this._source, nline));
        r.push(Token.mkSymbolPos(Symbol.PLUS, this._source, nline));
      }

      pos = ix2 + 1;
      ix = s.indexOf("${", pos);
    }

    r.push(Token.mkStringPos(s.substring(pos, s.length), this._source, nline));

    if (r.length > 1) {
      let p = pos;
      const pEnd = s.length;
      while (p < pEnd) if (s.charAt(p++) === "\n") ++nline;
      r.push(Token.mkSymbolPos(Symbol.PLUS, this._source, nline));
    }

    return r;
  }

  /**
    @param {string} msg
  **/
  fail (msg) {
    // eslint-disable-next-line
    console.log(
      Symbol.toStr(this._source) + ".dms:" + this._nline + ": " + msg
    );
    throw ("");
  }
}
