// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js";
import Machine from "./Machine.js"; // eslint-disable-line
import Exception from "./Exception.js";
import {Symbol} from "./Symbol.js";

/** @type {Machine } */
let currentMachine = null;

/** Erros management. */
export default class Fails {

  /**
    @param {!Machine} m
    @return void
  **/
  static registerMachine (m) {
    currentMachine = m;
  }

  /**
    @param {!Error} e
    @return void
  **/
  static fromException (e) {
    if (Exception.isDmStack(e)) {
      console.log(Exception.msg(e)); // eslint-disable-line
      console.log(Exception.stack(e)); // eslint-disable-line
      throw "Runtime error";
    } else {
      const m = currentMachine;
      if (m) {
        m.fail(e.message);
      } else {
        console.log(e.stack); // eslint-disable-line
        throw e.message;
      }
    }
  }

  /**
    @param {!Machine} m
    @param {number} type
    @return void
  **/
  static type (m, type) {
    Fails.typeIn(m, type, m.peek());
  }

  /**
    Fails of a Native type.
    @param {!Machine} m
    @param {number} id
    @return void
  **/
  static ntype (m, id) {
    Fails.ntypeIn(m, id, m.peek());
  }

  /**
    @param {!Machine} m
    @param {number} type
    @param {!Token} tk
    @return void
  **/
  static typeIn (m, type, tk) {
    m.fail(
      "Stack pop: Expected token of type '" +
      Token.typeToString(type) +
      "'. Found type '" +
      Token.typeToString(tk.type) +
      "'"
    );
  }

  /**
    Fail of a Native type.
    @param {!Machine} m
    @param {number} id
    @param {!Token} tk
    @return void
  **/
  static ntypeIn (m, id, tk) {
    m.fail(
      "Stack pop: Expected token of type '" +
      Symbol.toStr(id) +
      "'. Found type '" +
      (tk.type === Token.NATIVE
        ? Symbol.toStr(tk.nativeSymbol)
        : Token.typeToString(tk.type)) +
      "'"
    );
  }

  /**
    @param {!Machine} m
    @param {!Array<number>} types
    @return void
  **/
  static types (m, types) {
    Fails.typesIn(m, types, m.peek());
  }

  /**
    @param {!Machine} m
    @param {!Array<number>} types
    @param {!Token} tk
    @return void
  **/
  static typesIn (m, types, tk) {
    m.fail(
      "Stack pop: Expected token of type [" +
      types.map(t => Token.typeToString(t)).join(", ") +
      "]. Found type '" +
      Token.typeToString(tk.type) +
      "'"
    );
  }

  /**
    @param {!Machine} m
    @param {!Array<!Token>} list
    @param {number} expected
    @return void
  **/
  static listSize (m, list, expected) {
    m.fail(
      "List " + Token.mkList(list).toString() +
      "\nExpected size: " + expected + ", actual size: " + list.length
    );
  }

  /**
    @param {!Machine} m
    @param {number} min (inclusive)
    @param {number} max (inclusive)
    @param {number} value
  **/
  static range (m, min, max, value) {
    m.fail(
      "Index " + value + " out of range " +
      "[" + min + " - " + max + "], both inclusive."
    );
  }

  /**
    @param {!Machine} m
    @param {number} min (inclusive)
    @param {number} max (inclusive)
    @param {number} value
  **/
  static checkRange (m, min, max, value) {
    if (value < min || value > max) Fails.range(m, min, max, value);
  }

}

