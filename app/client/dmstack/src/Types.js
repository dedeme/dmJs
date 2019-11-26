// Copyright 05-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js";
import Machine from "./Machine.js"; // eslint-disable-line
import {Symbol} from "./Symbol.js";
import Tk from "./Tk.js";

let i = 0;
const PUT = i++;
const REMOVE = i++;
const CHECK = i++;
const FAIL = i++;

/**
  @param {number} check
  @return {string}
**/
function checkToStr (check) {
  switch (check) {
  case PUT: return "@+";
  case CHECK: return "@?";
  case REMOVE: return "@-";
  case FAIL: return "@";
  default: throw Error("switch not exhaustive");
  }
}

/**
  @param {!Token} tk
  @return {string}
**/
function typeTk (tk) {
  switch (tk.type) {
  case Token.INT: return "i";
  case Token.FLOAT: return "f";
  case Token.STRING: return "s";
  case Token.SYMBOL: return tk.symbolValue === Symbol.STACK_STOP ? "|" : "y";
  case Token.LIST: return "l";
  case Token.NATIVE: {
    const sym = tk.nativeSymbol;
    switch (sym) {
    case Symbol.MAP_: return "m";
    case Symbol.REF_: return "r";
    case Symbol.OPTION_: return "o";
    case Symbol.EITHER_: return "e";
    default: return "<" + Symbol.toStr(sym) + ">";
    }
  }
  default: throw Error("switch not exhaustive");
  }
}

/**
  @param {string} type
  @param {string} ok
  @return {string}
**/
function dots (type, ok) {
  if (type.length - ok.length > 1) return "...";
  return "";
}

/**
  @param {number} check
  @param {!Machine} m
  @param {string} type
  @param {string} ok
  @param {!Token} tk
  @return void
**/
function fail (check, m, type, ok, tk) {
  m.fail(
    "Expected '" + checkToStr(check) + type +
    "'. Actual '" + checkToStr(check) + dots(type, ok) + typeTk(tk) + ok + "'"
  );
}

/**
  @param {number} check
  @param {!Machine} m
  @param {string} type
  @param {string} ok
  @return void
**/
function wrong (check, m, type, ok) {
  m.fail(
    "Wrong type '" + checkToStr(check) + type +
    "' ('" + checkToStr(check) + dots(type, ok) + "~" + ok + "')"
  );
}

/**
  @param {!Machine} m
  @param {string} type
  @param {number} check
  @return {boolean}
**/
function check (m, type, check) {
  const stack = m.stack;
  let ix = stack.length;
  let p = type.length;

  for (;;) {
    if (p === 0) break;
    if (ix === 0)
      m.fail("Expected '@" + type + "', found '@[]" + type.substring(p) + "'");

    --ix;
    --p;
    const tk = stack[ix];
    let f = true;
    switch (type.charAt(p)) {
    case "i": if (tk.type === Token.INT) f = false; break;
    case "f": if (tk.type === Token.FLOAT) f = false; break;
    case "s": if (tk.type === Token.STRING) f = false; break;
    case "|":
      if (
        tk.type === Token.SYMBOL &&
        tk.symbolValue === Symbol.STACK_STOP
      ) {
        // check === CHECK fails when not debug.
        if (p === 0 && check !== CHECK) f = false;
        else wrong(check, m, type, type.substring(p));
      }
      break;
    case "y":
      if (
        tk.type === Token.SYMBOL &&
        tk.symbolValue !== Symbol.STACK_STOP
      ) f = false;
      break;
    case "l": if (tk.type === Token.LIST) f = false; break;
    case "m":
      if (
        tk.type === Token.NATIVE &&
        tk.nativeSymbol === Symbol.MAP_
      ) f = false;
      break;
    case "r":
      if (
        tk.type === Token.NATIVE &&
        tk.nativeSymbol === Symbol.REF_
      ) f = false;
      break;
    case "o":
      if (
        tk.type === Token.NATIVE &&
        tk.nativeSymbol === Symbol.OPTION_
      ) f = false;
      break;
    case "e":
      if (
        tk.type === Token.NATIVE &&
        tk.nativeSymbol === Symbol.EITHER_
      ) f = false;
      break;
    case ">": {
      const tmp = p;
      while (p > 0) {
        if (type.charAt(--p) === "<") break;
      }
      if (type.charAt(p) !== "<") wrong(check, m, type, type.substring(tmp));
      const sym = Symbol.mk("= " + type.substring(p + 1, tmp));
      if (
        tk.type === Token.NATIVE &&
        tk.nativeSymbol === sym
      ) f = false;
      else p = tmp;
      break;
    }
    case "*": f = false; break;
    default: wrong(check, m, type, type.substring(p));
    }

    if (f) {
      if (check === CHECK) return false;
      fail(check, m, type, type.substring(p + 1), tk);
    }
  }

  if (check === PUT)
    stack.splice(ix, 0, Token.mkSymbol(Symbol.STACK_STOP));
  else if (check === REMOVE)
    stack.splice(ix, 1);

  return true;
}

/** Types management. */
export default class Types {
  /**
    Check types of stack values and raise a fail if checking not succeeds.
    @param {!Machine} m
    @return {void}
  */
  static fail (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    check(m, t, FAIL);
  }

  /**
    Check types of stack values and push in stack '1' if checking succeeds.
    @param {!Machine} m
    @return {void}
  */
  static check (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    const checked = check(m, t, CHECK);
    m.push(Token.mkInt(checked ? 1 : 0));
  }

  /**
    Check types of stack values and raise a fail if checking not succeeds.
    @param {!Machine} m
    @return {void}
  */
  static openFail (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    check(m, t, PUT);
  }

  /**
    Check types of stack values and raise a fail if checking not succeeds.
    @param {!Machine} m
    @return {void}
  */
  static closeFail (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    check(m, "|" + t, REMOVE);
  }
}
