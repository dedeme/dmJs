// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** @type {!Array<string>} */
const syms = [];

/** Symbols management. */
export class Symbol {

  /** @return {number} Symbol identifier. */
  static get IMPORT () { return 0 }

  /** @return {number} Symbol identifier. */
  static get IF () { return Symbol.IMPORT + 1 }

  /** @return {number} Symbol identifier. */
  static get ELIF () { return Symbol.IF + 1 }

  /** @return {number} Symbol identifier. */
  static get ELSE () { return Symbol.ELIF + 1 }

  /** @return {number} Symbol identifier. */
  static get BREAK () { return Symbol.ELSE + 1 }

  /** @return {number} Symbol identifier. */
  static get EQUALS () { return Symbol.BREAK + 1 }

  /** @return {number} Symbol identifier. */
  static get FUNCTION () { return Symbol.EQUALS + 1 }

  /** @return {number} Symbol identifier. */
  static get AMPERSAND () { return Symbol.FUNCTION + 1 }

  /** @return {number} Symbol identifier. */
  static get NOP () { return Symbol.AMPERSAND + 1 }

  /** @return {number} Symbol identifier. */
  static get EVAL () { return Symbol.NOP + 1 }

  /** @return {number} Symbol identifier. */
  static get RUN () { return Symbol.EVAL + 1 }

  /** @return {number} Symbol identifier. */
  static get MRUN () { return Symbol.RUN + 1 }

  /** @return {number} Symbol identifier. */
  static get DATA () { return Symbol.MRUN + 1 }

  /** @return {number} Symbol identifier. */
  static get SYNC () { return Symbol.DATA + 1 }

  /** @return {number} Symbol identifier. */
  static get LOOP () { return Symbol.SYNC + 1 }

  /** @return {number} Symbol identifier. */
  static get WHILE () { return Symbol.LOOP + 1 }

  /** @return {number} Symbol identifier. */
  static get FOR () { return Symbol.WHILE + 1 }

  /** @return {number} Symbol identifier. */
  static get ASSERT () { return Symbol.FOR + 1 }

  /** @return {number} Symbol identifier. */
  static get EXPECT () { return Symbol.ASSERT + 1 }

  /** @return {number} Symbol identifier. */
  static get THIS () { return Symbol.EXPECT + 1 }

  /** @return {number} Symbol identifier. */
  static get STACK () { return Symbol.THIS + 1 }

  /** @return {number} Symbol identifier. */
  static get STACK_CHECK () { return Symbol.STACK + 1 }

  // ---------------------------------------------

  /** @return {number} Symbol identifier. */
  static get BLOB_ () { return Symbol.STACK_CHECK + 1 }

  /** @return {number} Symbol identifier. */
  static get ITERATOR_ () { return Symbol.BLOB_ + 1 }

  // ---------------------------------------------

  /** @return {number} Symbol identifier. */
  static get SYSTEM_COUNT () { return Symbol.ITERATOR_ + 1 }

  // ---------------------------------------------
  // ---------------------------------------------

  /** @return {void} */
  static init () {
    for (let i = 0; i < Symbol.SYSTEM_COUNT; ++i) syms.push("");

    syms[Symbol.IMPORT] = "import";
    syms[Symbol.IF] = "if";
    syms[Symbol.ELIF] = "elif";
    syms[Symbol.ELSE] = "else";
    syms[Symbol.BREAK] = "break";
    syms[Symbol.EQUALS] = "=";
    syms[Symbol.FUNCTION] = "=>";
    syms[Symbol.AMPERSAND] = "&";
    syms[Symbol.NOP] = "nop";
    syms[Symbol.EVAL] = "eval";
    syms[Symbol.RUN] = "run";
    syms[Symbol.MRUN] = "mrun";
    syms[Symbol.DATA] = "data";
    syms[Symbol.SYNC] = "sync";
    syms[Symbol.LOOP] = "loop";
    syms[Symbol.WHILE] = "while";
    syms[Symbol.FOR] = "for";
    syms[Symbol.ASSERT] = "assert";
    syms[Symbol.EXPECT] = "expect";
    syms[Symbol.THIS] = "this";

    syms[Symbol.STACK] = "= @";
    syms[Symbol.STACK_CHECK] = "= @?";

    syms[Symbol.BLOB_] = "= Blob";
    syms[Symbol.ITERATOR_] = "= Iterator";
  }

  /**
    Creates a new symbol if 'name' does not exists. Otherwise returns the
    corresponding identifier.
    @param {string} name Symbol name.
    @return {number} Symbol identifier.
  **/
  static mk (name) {
    const len = syms.length;
    for (let i = 0; i < len; ++i)
      if (syms[i] === name) return i;

    syms.push(name);
    return len;
  }

  /**
    @param {number} sym1
    @param {number} sym2
  **/
  static eq (sym1, sym2) {
    return sym1 === sym2;
  }

  /**
    @param {number} sym
    @return {string} The name of 'sym'
  **/
  static toStr (sym) {
    return syms[sym];
  }
}

export class SymbolKv {
  /**
    @param {number} key
    @param {number} value
  **/
  constructor (key, value) {
    this._key = key;
    this._value = value;
  }

  /** @return {number} */
  get key () { return this._key }

  /** @return {number} */
  get value () { return this._value }
}
