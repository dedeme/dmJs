// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Symbols management */

let sharp = 0;

/** @type {!Array<string>} */
const syms = [];

let i = 0;
const IMPORT = ++i;
const IF = ++i;
const ELIF = ++i;
const ELSE = ++i;
const BREAK = ++i;
const EQUALS = ++i;
const FUNCTION = ++i;
const AMPERSAND = ++i;
const NOP = ++i;
const EVAL = ++i;
const RUN = ++i;
const MRUN = ++i;
const DATA = ++i;
const SYNC = ++i;
const LOOP = ++i;
const WHILE = ++i;
const FOR = ++i;
const CONTINUE = ++i;
const RECURSIVE = ++i;
const ASSERT = ++i;
const EXPECT = ++i;
const THIS = ++i;
const STACK = ++i;
const STACK_CHECK = ++i;
const STACK_OPEN = ++i;
const STACK_CLOSE = ++i;
const STACK_STOP = ++i;

const PLUS = ++i;
const TO_STR = ++i;
const LST = ++i;
const GET = ++i;

const REF_ = ++i;
const OPTION_ = ++i;
const EITHER_ = ++i;
const MAP_ = ++i;
const BLOB_ = ++i;
const ITERATOR_ = ++i;
const EXC_ = ++i;
const DATE_ = ++i;
const TIMER_ = ++i;
const ELEMENT_ = ++i;
const EVENT_ = ++i;
const CLOSURE_ = ++i;

const SYSTEM_COUNT = ++i;

/** Symbols management. */
export class Symbol {

  /** @return {number} Symbol identifier. */
  static get IMPORT () { return IMPORT }

  /** @return {number} Symbol identifier. */
  static get IF () { return IF }

  /** @return {number} Symbol identifier. */
  static get ELIF () { return ELIF }

  /** @return {number} Symbol identifier. */
  static get ELSE () { return ELSE }

  /** @return {number} Symbol identifier. */
  static get BREAK () { return BREAK }

  /** @return {number} Symbol identifier. */
  static get EQUALS () { return EQUALS }

  /** @return {number} Symbol identifier. */
  static get FUNCTION () { return FUNCTION }

  /** @return {number} Symbol identifier. */
  static get AMPERSAND () { return AMPERSAND }

  /** @return {number} Symbol identifier. */
  static get NOP () { return NOP }

  /** @return {number} Symbol identifier. */
  static get EVAL () { return EVAL }

  /** @return {number} Symbol identifier. */
  static get RUN () { return RUN }

  /** @return {number} Symbol identifier. */
  static get MRUN () { return MRUN }

  /** @return {number} Symbol identifier. */
  static get DATA () { return DATA }

  /** @return {number} Symbol identifier. */
  static get SYNC () { return SYNC }

  /** @return {number} Symbol identifier. */
  static get LOOP () { return LOOP }

  /** @return {number} Symbol identifier. */
  static get WHILE () { return WHILE }

  /** @return {number} Symbol identifier. */
  static get FOR () { return FOR }

  /** @return {number} Symbol identifier. */
  static get CONTINUE () { return CONTINUE }

  /** @return {number} Symbol identifier. */
  static get RECURSIVE () { return RECURSIVE }

  /** @return {number} Symbol identifier. */
  static get ASSERT () { return ASSERT }

  /** @return {number} Symbol identifier. */
  static get EXPECT () { return EXPECT }

  /** @return {number} Symbol identifier. */
  static get THIS () { return THIS }

  /** @return {number} Symbol identifier. */
  static get STACK () { return STACK }

  /** @return {number} Symbol identifier. */
  static get STACK_CHECK () { return STACK_CHECK }

  /** @return {number} Symbol identifier. */
  static get STACK_OPEN () { return STACK_OPEN }

  /** @return {number} Symbol identifier. */
  static get STACK_CLOSE () { return STACK_CLOSE }

  /** @return {number} Symbol identifier. */
  static get STACK_STOP () { return STACK_STOP }

  // ---------------------------------------------

  /** @return {number} Symbol identifier. */
  static get PLUS () { return PLUS }

  /** @return {number} Symbol identifier. */
  static get TO_STR () { return TO_STR }

  /** @return {number} Symbol identifier. */
  static get LST () { return LST }

  /** @return {number} Symbol identifier. */
  static get GET () { return GET }

  // ---------------------------------------------

  /** @return {number} Symbol identifier. */
  static get REF_ () { return REF_ }

  /** @return {number} Symbol identifier. */
  static get OPTION_ () { return OPTION_ }

  /** @return {number} Symbol identifier. */
  static get EITHER_ () { return EITHER_ }

  /** @return {number} Symbol identifier. */
  static get MAP_ () { return MAP_ }

  /** @return {number} Symbol identifier. */
  static get BLOB_ () { return BLOB_ }

  /** @return {number} Symbol identifier. */
  static get ITERATOR_ () { return ITERATOR_ }

  /** @return {number} Symbol identifier. */
  static get EXC_ () { return EXC_ }

  /** @return {number} Symbol identifier. */
  static get DATE_ () { return DATE_ }

  /** @return {number} Symbol identifier. */
  static get TIMER_ () { return TIMER_ }

  /** @return {number} Symbol identifier. */
  static get ELEMENT_ () { return ELEMENT_ }

  /** @return {number} Symbol identifier. */
  static get EVENT_ () { return EVENT_ }

  /** @return {number} Symbol identifier. */
  static get CLOSURE_ () { return CLOSURE_ }

  // ---------------------------------------------

  /** @return {number} Symbol identifier. */
  static get SYSTEM_COUNT () { return SYSTEM_COUNT }

  // ---------------------------------------------
  // ---------------------------------------------

  /** @return {void} */
  static init () {
    for (let i = 0; i < SYSTEM_COUNT; ++i) syms.push("");

    syms[IMPORT] = "import";
    syms[IF] = "if";
    syms[ELIF] = "elif";
    syms[ELSE] = "else";
    syms[BREAK] = "break";
    syms[EQUALS] = "=";
    syms[FUNCTION] = "=>";
    syms[AMPERSAND] = "&";
    syms[NOP] = "nop";
    syms[EVAL] = "eval";
    syms[RUN] = "run";
    syms[MRUN] = "mrun";
    syms[DATA] = "data";
    syms[SYNC] = "sync";
    syms[LOOP] = "loop";
    syms[WHILE] = "while";
    syms[FOR] = "for";
    syms[CONTINUE] = "continue";
    syms[RECURSIVE] = "recursive";
    syms[ASSERT] = "assert";
    syms[EXPECT] = "expect";
    syms[THIS] = "this";

    syms[STACK] = "= @";
    syms[STACK_CHECK] = "= @?";
    syms[STACK_OPEN] = "= @+";
    syms[STACK_CLOSE] = "= @-";
    syms[STACK_STOP] = "= @!";

    syms[PLUS] = "+";
    syms[TO_STR] = "toStr";
    syms[LST] = "lst";
    syms[GET] = "get";

    syms[REF_] = "= Ref";
    syms[OPTION_] = "= Option";
    syms[EITHER_] = "= Either";
    syms[MAP_] = "= Map";
    syms[BLOB_] = "= Blob";
    syms[ITERATOR_] = "= Iterator";
    syms[EXC_] = "= Exc";
    syms[DATE_] = "= Date";
    syms[TIMER_] = "= Timer";
    syms[ELEMENT_] = "= Element";
    syms[EVENT_] = "= Event";
    syms[CLOSURE_] = "= Closure";
  }

  /**
    Creates a new symbol if 'name' does not exists. Otherwise returns the
    corresponding identifier.
    @param {string} name Symbol name.
    @return {number} Symbol identifier.
  **/
  static mk (name) {
    if (name === "#") {
      ++sharp;
      return Symbol.NOP;
    }
    if (name.endsWith("#")) {
      name = name + "·" + String(sharp);
    }
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
