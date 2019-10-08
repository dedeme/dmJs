// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Symbol} from "./Symbol.js";
import List from "./util/List.js"; // eslint-disable-line

/** Imports management. */
export default class Token {

  /**
    @private
    @param {number} line
    @param {number} type INT, FLOAT, STRING, LIST, SYMBOL or POINTER
    @param {?} value
  **/
  constructor (line, type, value) {
    this._line = line;
    this._type = type;
    this._value = value;
  }

  /** @return {number} */
  get line () { return this._line }

  /** @return {number} One of INT, FLOAT, STRING, LIST, SYMBOL or POINTER */
  get type () { return this._type }

  /** @return {number} */
  get intValue () { return this._value }

  /** @return {number} */
  get floatValue () { return this._value }

  /** @return {string} */
  get stringValue () { return this._value }

  /** @return {!Array<!Token>} */
  get listValue () { return this._value }

  /** @return {number} */
  get symbolValue () { return this._value }

  /** @return {*} */
  get pointerValue () { return this._value }

  /** @return {!Token} Make a deep copy, except for POINTER. */
  clone () {
    const type = this._type;
    let value = this._value;
    if (type === Token.LIST)
      value = this.listValue.map(tk => tk.clone());
    return new Token(0, type, value);
  }

  /**
    @param {!Token} other Another token.
    @return {boolean} True if this === other
  **/
  eq (other) {
    if (this._type !== other._type) return false;
    if (this._type === Token.LIST) {
      const l1 = this.listValue;
      const l2 = other.listValue;
      if (l1.length !== l2.length) return false;
      for (let i = 0; i < l1.length; ++i)
        if (!l1[i].eq(l2[i])) return false;
      return true;
    }
    return this._value === other._value;
  }

  /**
    @param {number} type
    @return {string}
  **/
  static typeToString (type) {
    switch(type) {
    case Token.INT: return "Int";
    case Token.FLOAT: return "Float";
    case Token.STRING: return "String";
    case Token.LIST: return "List";
    case Token.SYMBOL: return "Symbol";
    case Token.POINTER: return "Pointer";
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {string} */
  toString () {
    switch(this._type) {
    case Token.INT: return String(this._value | 0);
    case Token.FLOAT: return String(this._value);
    case Token.STRING: return JSON.stringify(this._value);
    case Token.LIST: {
      let a = this.listValue.map(tk => tk.toString());
      if (a.length > 5) {
        a = a.slice(0, 5);
        a.push("...");
      }
      return "(" + a.join(", ") + ")";
    }
    case Token.SYMBOL: return Symbol.toStr(this._value);
    case Token.POINTER: return "JS Object";
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {number} Type of token. */
  static get INT () { return 0 }

  /** @return {number} Type of token. */
  static get FLOAT () { return Token.INT + 1 }

  /** @return {number} Type of token. */
  static get STRING () { return Token.FLOAT + 1 }

  /** @return {number} Type of token. */
  static get LIST () { return Token.STRING + 1 }

  /** @return {number} Type of token. */
  static get SYMBOL () { return Token.LIST + 1 }

  /** @return {number} Type of token. */
  static get POINTER () { return Token.SYMBOL + 1 }

  /**
    @param {number} line
    @param {number} value
    @return {!Token}
  **/
  static mkInt (line, value) {
    return new Token(line, Token.INT, value | 0);
  }

  /**
    @param {number} line
    @param {number} value
    @return {!Token}
  **/
  static mkFloat (line, value) {
    return new Token(line, Token.FLOAT, value);
  }

  /**
    @param {number} line
    @param {string} value
    @return {!Token}
  **/
  static mkString (line, value) {
    return new Token(line, Token.STRING, value);
  }

  /**
    @param {number} line
    @param {!Array<!Token>} value
    @return {!Token}
  **/
  static mkList (line, value) {
    return new Token(line, Token.LIST, value);
  }

  /**
    @param {number} line
    @param {number} value
    @return {!Token}
  **/
  static mkSymbol (line, value) {
    return new Token(line, Token.SYMBOL, value);
  }

  /**
    @param {number} symbol
    @param {*} value
    @return {!Token}
  **/
  static fromPointer (symbol, value) {
    return Token.mkList(0, [
      new Token(0, Token.SYMBOL, symbol),
      new Token(0, Token.POINTER, value)
    ]);
  }

  /**
    Check a type against an stack.
    @param {!List<!Token>} tokens Stack
    @param {string} type Type to check.
    @return {string} Actual type
  **/
  static checkType (tokens, type) {
    throw ("witout implementation " + tokens + type);
  }

}

