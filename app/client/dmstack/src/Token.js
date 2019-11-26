// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Symbol} from "./Symbol.js";
import List from "./util/List.js"; // eslint-disable-line

let i = 0;
const INT = i++;
const FLOAT = i++;
const STRING = i++;
const LIST = i++;
const SYMBOL = i++;
const NATIVE = i++;

/** Record of a Token position */
class TokenPos {
  /**
    @private
    @param {number} source
    @param {number} line
  **/
  constructor (source, line) {
    this._source = source;
    this._line = line;
  }

  /** @return {string} */
  get source () { return Symbol.toStr(this._source) }

  /** @return {number} */
  get line () { return this._line }
}

/** Imports management. */
export default class Token {

  /**
    @private
    @param {TokenPos} pos
    @param {number} type INT, FLOAT, STRING, LIST, SYMBOL or NATIVE
    @param {?} value
  **/
  constructor (pos, type, value) {
    this._pos = pos;
    this._type = type;
    this._value = value;
  }

  /** @return {TokenPos} */
  get pos () { return this._pos }

  /** @return {number} One of INT, FLOAT, STRING, LIST, SYMBOL or NATIVE */
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

  /** @return {number} */
  get nativeSymbol () { return this._value[0] }

  /** @return {*} */
  get nativeObject () { return this._value[1] }

  /**
    @param {*} value
    @return {void}
  **/
  set nativeObject (value) { this._value[1] = value }

  /** @return {!Token} Make a deep copy, except for NATIVE. */
  clone () {
    const type = this._type;
    let value = this._value;
    if (type === Token.LIST) {
      value = this.listValue.map(tk => tk.clone());
    } else if (type === Token.NATIVE) {
      if (this.nativeSymbol === Symbol.MAP_) {
        const mp = /** @type {!Object} */ (this.nativeObject);
        const o = {};
        for (const [key, value] of Object.entries(mp))
          o[key] = value.clone();
        return new Token(null, Token.NATIVE, [Symbol.MAP_, o]);
      }
      if (this.nativeSymbol === Symbol.REF_) {
        const value = /** @type {!Token} */ (this.nativeObject);
        return new Token(null, Token.NATIVE, [Symbol.REF_, value.clone()]);
      }
      if (this.nativeSymbol === Symbol.OPTION_) {
        const value = /** @type {Token} */ (this.nativeObject);
        return value === null
          ? new Token(null, Token.NATIVE, [Symbol.OPTION_, null])
          : new Token(null, Token.NATIVE, [Symbol.OPTION_, value.clone()])
        ;
      }
      if (this.nativeSymbol === Symbol.EITHER_) {
        const values = /** @type {!Array<Token>} */ (this.nativeObject);
        if (values[0] === null) {
          return new Token(
            null, Token.NATIVE, [Symbol.EITHER_, [null, values[1].clone()]]
          );
        }
        return new Token(
          null, Token.NATIVE, [Symbol.EITHER_, [values[0].clone(), null]]
        );
      }
    }
    return new Token(null, type, value);
  }

  /**
    @param {!Token} other Another token.
    @return {boolean} True if this === other
  **/
  eq (other) {
    if (other === null || this._type !== other._type) return false;
    if (this._type === Token.LIST) {
      const l1 = this.listValue;
      const l2 = other.listValue;
      if (l1.length !== l2.length) return false;
      for (let i = 0; i < l1.length; ++i)
        if (!l1[i].eq(l2[i])) return false;
      return true;
    }
    if (this._type === Token.NATIVE) {
      const sym = this.nativeSymbol;
      if (sym === Symbol.REF_)
        return this.nativeObject.eq(other.nativeObject);
      if (sym === Symbol.OPTION_) {
        const value = this.nativeObject;
        return value === null
          ? other.nativeObject === null
          : value.eq(other.nativeObject)
        ;
      }
      if (sym === Symbol.EITHER_) {
        const values = this.nativeObject;
        return values[0] === null
          ? values[1].eq(other.nativeObject[1])
          : values[0].eq(other.nativeObject[0])
        ;
      }
      return this._value[1] === other._value[1];
    }
    return this._value === other._value;
  }

  /** @return {string} */
  toString () {
    switch(this._type) {
    case Token.INT: return String(this._value | 0);
    case Token.FLOAT: return String(this._value);
    case Token.STRING: return this._value;
    case Token.SYMBOL: return "'" + Symbol.toStr(this._value) + "'";
    case Token.LIST: {
      const a = this.listValue.map(tk => tk.toString());
      return "(" + a.join(", ") + ")";
    }
    case Token.NATIVE: {
      if (this.nativeSymbol === Symbol.MAP_) {
        const mp = /** @type {!Object} */ (this.nativeObject);
        const a = [];
        for (const [key, value] of Object.entries(mp))
          a.push(key + ": " + value.toString());
        return "{" + a.join(", ") + "}";
      }
      if (this.nativeSymbol === Symbol.REF_) {
        return "<|" + this.nativeObject.toString() + ">";
      }
      if (this.nativeSymbol === Symbol.OPTION_) {
        const value = this.nativeObject;
        return value === null
          ? "<O|>"
          : "<O|" + this.nativeObject.toString() + ">"
        ;
      }
      if (this.nativeSymbol === Symbol.EITHER_) {
        const values = this.nativeObject;
        return values[0] === null
          ? "<R|" + this.nativeObject[1].toString() + ">"
          : "<L|" + this.nativeObject[0].toString() + ">"
        ;
      }
      return "<" + Symbol.toStr(this.nativeSymbol) + ", JsObject>";
    }
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {string} */
  toStringDraft () {
    switch(this._type) {
    case Token.STRING: return JSON.stringify(this._value);
    case Token.LIST: {
      let a = this.listValue.map(tk => tk.toStringDraft());
      if (a.length > 5) {
        a = a.slice(0, 5);
        a.push("...");
      }
      return "(" + a.join(", ") + ")";
    }
    case Token.NATIVE: {
      if (this.nativeSymbol === Symbol.MAP_) {
        const mp = /** @type {!Object} */ (this.nativeObject);
        const a = [];
        let c = 0;
        for (const [key, value] of Object.entries(mp)) {
          if (c >= 5) {
            a.push("...");
            break;
          }
          ++c;
          a.push(key + ": " + value.toString());
        }
        return "{" + a.join(", ") + "}";
      }
      return this.toString();
    }
    default: return this.toString();
    }
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
    case Token.NATIVE: return "JsObject";
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {number} Type of token. */
  static get INT () { return INT }

  /** @return {number} Type of token. */
  static get FLOAT () { return FLOAT }

  /** @return {number} Type of token. */
  static get STRING () { return STRING }

  /** @return {number} Type of token. */
  static get LIST () { return LIST }

  /** @return {number} Type of token. */
  static get SYMBOL () { return SYMBOL }

  /** @return {number} Type of token. */
  static get NATIVE () { return NATIVE }

  /**
    @param {number} value
    @return {!Token}
  **/
  static mkInt (value) {
    return new Token(null, Token.INT, value | 0);
  }

  /**
    @param {number} value
    @return {!Token}
  **/
  static mkFloat (value) {
    return new Token(null, Token.FLOAT, value);
  }

  /**
    @param {string} value
    @return {!Token}
  **/
  static mkString (value) {
    return new Token(null, Token.STRING, value);
  }

  /**
    @param {!Array<!Token>} value
    @return {!Token}
  **/
  static mkList (value) {
    return new Token(null, Token.LIST, value);
  }

  /**
    @param {number} value
    @return {!Token}
  **/
  static mkSymbol (value) {
    return new Token(null, Token.SYMBOL, value);
  }

  /**
    @param {number} symbol
    @param {*} value
    @return {!Token}
  **/
  static fromPointer (symbol, value) {
    return new Token(null, Token.NATIVE, [symbol, value]);
  }

  /**
    @param {number} value
    @param {number} source
    @param {number} line
    @return {!Token}
  **/
  static mkIntPos (value, source, line) {
    return new Token(new TokenPos(source, line), Token.INT, value | 0);
  }

  /**
    @param {number} value
    @param {number} source
    @param {number} line
    @return {!Token}
  **/
  static mkFloatPos (value, source, line) {
    return new Token(new TokenPos(source, line), Token.FLOAT, value);
  }

  /**
    @param {string} value
    @param {number} source
    @param {number} line
    @return {!Token}
  **/
  static mkStringPos (value, source, line) {
    return new Token(new TokenPos(source, line), Token.STRING, value);
  }

  /**
    @param {!Array<!Token>} value
    @param {number} source
    @param {number} line
    @return {!Token}
  **/
  static mkListPos (value, source, line) {
    return new Token(new TokenPos(source, line), Token.LIST, value);
  }

  /**
    @param {number} value
    @param {number} source
    @param {number} line
    @return {!Token}
  **/
  static mkSymbolPos (value, source, line) {
    return new Token(new TokenPos(source, line), Token.SYMBOL, value);
  }
}

