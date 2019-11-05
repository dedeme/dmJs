// Copyright 05-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js";
import Machine from "./Machine.js"; // eslint-disable-line
import Fails from "./Fails.js";
import {Symbol} from "./Symbol.js";

/** Token management. */
export default class Tk {
  /**
    @param {!Machine} m
    @param {!Token} t
    @return {number}
  **/
  static intValue (m, t) {
    if (t.type !== Token.INT) Fails.typeIn(m, Token.INT, t);
    return t.intValue;
  }

  /**
    @param {!Machine} m
    @param {!Token} t
    @return {number}
  **/
  static floatValue (m, t) {
    if (t.type !== Token.FLOAT) Fails.typeIn(m, Token.FLOAT, t);
    return t.floatValue;
  }

  /**
    @param {!Machine} m
    @param {!Token} t
    @return {string}
  **/
  static stringValue (m, t) {
    if (t.type !== Token.STRING) Fails.typeIn(m, Token.STRING, t);
    return t.stringValue;
  }

  /**
    @param {!Machine} m
    @param {!Token} t
    @return {!Array<!Token>}
  **/
  static listValue (m, t) {
    if (t.type !== Token.LIST) Fails.typeIn(m, Token.LIST, t);
    return t.listValue;
  }

  /**
    @param {!Machine} m
    @param {!Token} t
    @return {number} A Symbol
  **/
  static symbolValue (m, t) {
    if (t.type !== Token.SYMBOL) Fails.typeIn(m, Token.SYMBOL, t);
    return t.symbolValue;
  }

  /**
    @param {!Machine} m
    @param {!Token} t
    @param {number} sym
    @return {*}
  **/
  static nativeValue (m, t, sym) {
    if (t.type !== Token.NATIVE) Fails.typeIn(m, Token.NATIVE, t);
    if (t.nativeSymbol !== sym)
      m.fail(
        "Expected object of type '" + Symbol.toStr(sym) +
        "', found one of type '" + Symbol.toStr(t.nativeSymbol) + "'"
      );
    return t.nativeObject;
  }

  /**
    @param {!Machine} m
    @return {number}
  **/
  static popInt (m) {
    return Tk.intValue(m, m.pop());
  }

  /**
    @param {!Machine} m
    @return {number}
  **/
  static popFloat (m) {
    return Tk.floatValue(m, m.pop());
  }

  /**
    @param {!Machine} m
    @return {string}
  **/
  static popString (m) {
    return Tk.stringValue(m, m.pop());
  }

  /**
    @param {!Machine} m
    @return {!Array<!Token>}
  **/
  static popList (m) {
    return Tk.listValue(m, m.pop());
  }

  /**
    @param {!Machine} m
    @return {number} symbol
  **/
  static popSymbol (m) {
    return Tk.symbolValue(m, m.pop());
  }

  /**
    @param {!Machine} m
    @param {number} symbol
    @return {*}
  **/
  static popNative (m, symbol) {
    return Tk.nativeValue(m, m.pop(), symbol);
  }

  /**
    @param {!Machine} m
    @return {number}
  **/
  static peekInt (m) {
    return Tk.intValue(m, m.peek());
  }

  /**
    @param {!Machine} m
    @return {number}
  **/
  static peekFloat (m) {
    return Tk.floatValue(m, m.peek());
  }

  /**
    @param {!Machine} m
    @return {string}
  **/
  static peekString (m) {
    return Tk.stringValue(m, m.peek());
  }

  /**
    @param {!Machine} m
    @return {!Array<!Token>}
  **/
  static peekList (m) {
    return Tk.listValue(m, m.peek());
  }

  /**
    @param {!Machine} m
    @return {number} symbol
  **/
  static peekSymbol (m) {
    return Tk.symbolValue(m, m.peek());
  }

  /**
    @param {!Machine} m
    @param {number} symbol
    @return {*}
  **/
  static peekNative (m, symbol) {
    return Tk.nativeValue(m, m.peek(), symbol);
  }

}
