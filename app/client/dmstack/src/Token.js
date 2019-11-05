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

  /** @return {!Token} Make a deep copy, except for NATIVE. */
  clone () {
    const type = this._type;
    let value = this._value;
    if (type === Token.LIST)
      value = this.listValue.map(tk => tk.clone());
    return new Token(null, type, value);
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
    if (this._type === Token.NATIVE)
      return this._value[1] === other._value[1];
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
    case Token.NATIVE: return "JsObject";
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {string} */
  toString () {
    switch(this._type) {
    case Token.INT: return String(this._value | 0);
    case Token.FLOAT: return String(this._value);
    case Token.STRING: return this._value;
    case Token.LIST: {
      const a = this.listValue.map(tk => tk.toString());
      return "(" + a.join(", ") + ")";
    }
    case Token.SYMBOL: return "'" + Symbol.toStr(this._value) + "'";
    case Token.NATIVE: return "JS Object";
    }
    throw new Error("Switch not exhaustive.");
  }

  /** @return {string} */
  toStringDraft () {
    switch(this._type) {
    case Token.LIST: {
      let a = this.listValue.map(tk => tk.toStringDraft());
      if (a.length > 5) {
        a = a.slice(0, 5);
        a.push("...");
      }
      return "(" + a.join(", ") + ")";
    }
    default: return this.toString();
    }
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

  /**
    Check a type against an stack.
    @param {!List<!Token>} tokens Stack
    @param {string} type Type to check.
    @return {string} Actual type
  **/
  static checkType (tokens, type) {
    if (tokens.isEmpty()) return "";
    const tk = tokens.head;
    const tail = tokens.tail;

    function paste (code, len) {
      return code + Token.checkType(tail, type.substring(len));
    }

    function tpaste () {
      switch (tk._type) {
      case Token.INT: return paste("i", 1);
      case Token.FLOAT: return paste("f", 1);
      case Token.STRING: return paste("s", 1);
      case Token.SYMBOL: return paste("y", 1);
      case Token.LIST: return paste("l", 1);
      case Token.NATIVE: return paste("n", 1);
      }
      throw ("switch not exhaustive");
    }

    function object () {
      const a = tk._type === Token.LIST ? tk._value : null;
      function badformat () {
        for (let i = 0; i < a.length; i += 2)
          if (a[i].type !== Token.STRING) return true;
        return false;
      }
      if (a === null || a.length % 2 === 1 || badformat()) return tpaste();
      return paste("o", 1);
    }

    function map () {
      const a = tk._type === Token.LIST ? tk._value : null;
      function badformat () {
        for (const t of a) {
          const a2 = t._type === Token.LIST ? t._value : null;
          if (
            a2 === null || a2.length !== 2 ||
            a2[0].type !== Token.STRING
          ) return true;
        }
        return false;
      }
      if (a === null || badformat()) return tpaste();
      return paste("m", 1);
    }

    function pointer () {
      const ix = type.indexOf(">", 1);
      if (ix === -1) return paste("<?", 1);
      if (ix === 1) return paste("<>?", 2);
      const len = ix + 1;

      if (tk._type !== Token.NATIVE) {
        const r = tpaste();
        return r.charAt(0) + type.substring(len);
      }
      const symid = "<" + Symbol.toStr(tk.nativeSymbol).substring(2) + ">";
      return symid + Token.checkType(tail, type.substring(len));
    }

    function list () {
      function close () {
        let ix = 2;
        let c = 1;
        while (ix < type.length) {
          const ch = type.charAt(ix++);
          if (ch === ">") {
            --c;
            if (c === 0) return ix - 1;
          } else if (ch === "<") {
            ++c;
          }
        }
        return -1;
      }

      if (type.charAt(1) !== "<") return paste("L?", 1);
      const ix = close();
      if (ix === -1) return paste("L<?", 2);
      const len = ix + 1;
      const a = tk._type === Token.LIST ? tk._value : null;

      function badformat () {
        const intype = type.substring(2, ix);
        if (intype !== "") {
          let lst = List.fromArray(a);
          if (intype !== Token.checkType(lst, intype)) return true;
          lst = lst.reverse().tail.reverse();
          return intype === Token.checkType(lst, intype);
        }
        return a.length !== 0;
      }
      if (a === null || badformat()) {
        const r = tpaste();
        return r.charAt(0) + type.substring(len);
      }
      return type.substring(0, len) +
        Token.checkType(tail, type.substring(len));
    }

    // ---------------------------------------------

    switch (type.charAt(0)) {
    case "": return "";
    case "i":
    case "f":
    case "s":
    case "y":
    case "l": return tpaste();
    case "o": return object();
    case "m": return map();
    case "<": return pointer();
    case "L": return list();
    default: return paste(type.charAt(0) + "?", 1);
    }
  }

}

