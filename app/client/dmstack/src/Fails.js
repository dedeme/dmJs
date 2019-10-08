// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js";
import Machine from "./Machine.js"; // eslint-disable-line

/** Erros management. */
export default class Fails {

  /**
    @param {!Machine} m
    @param {!Error} e
    @return void
  **/
  static fromException (m, e) {
    console.log(e.stack); // eslint-disable-line
    m.fail(e);
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
    @param {!Machine} m
    @param {number} type
    @param {!Token} tk
    @return void
  **/
  static typeIn (m, type, tk) {
    m.fail(
      "Stack pop: Expected token of type '" +
      Token.typeToString(type) +
      Token.typeToString(tk.type)
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
      "List " + Token.mkList(0, list).toString() +
      "\nExpected size: " + expected + ", actual size: " + list.length
    );
  }
}

