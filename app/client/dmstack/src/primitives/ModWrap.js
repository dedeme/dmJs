// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/** @type function (!Machine):void} */
const none = m => {
  m.push(Token.fromPointer(Symbol.OPTION_, null));
};

/** @type function (!Machine):void} */
const isNone = m => {
  const value = Tk.popNative(m, Symbol.OPTION_);
  m.push(Token.mkInt(value === null ? 1 : 0));
};

/** @type function (!Machine):void} */
const some = m => {
  m.push(Token.fromPointer(Symbol.OPTION_, m.pop()));
};

/** @type function (!Machine):void} */
const isSome = m => {
  const value = Tk.popNative(m, Symbol.OPTION_);
  m.push(Token.mkInt(value === null ? 0 : 1));
};

/** @type function (!Machine):void} */
const option = m => {
  const prgFail = m.popExc(Token.LIST);
  const prgOk = m.popExc(Token.LIST);
  const value = /** @type {Token} */ (Tk.popNative(m, Symbol.OPTION_));
  if (value === null) {
    Machine.process("", m.pmachines, prgFail);
  } else {
    m.push(value);
    Machine.process("", m.pmachines, prgOk);
  }
};

/** @type function (!Machine):void} */
const ref = m => {
  m.push(Token.fromPointer(Symbol.REF_, m.pop()));
};

/** @type function (!Machine):void} */
const left = m => {
  m.push(Token.fromPointer(Symbol.EITHER_, [m.pop(), null]));
};

/** @type function (!Machine):void} */
const isLeft = m => {
  const values = /** @type {!Array<Token>} */ (Tk.popNative(m, Symbol.EITHER_));
  m.push(Token.mkInt(values[1] === null ? 1 : 0));
};

/** @type function (!Machine):void} */
const right = m => {
  m.push(Token.fromPointer(Symbol.EITHER_, [null, m.pop()]));
};

/** @type function (!Machine):void} */
const isRight = m => {
  const values = /** @type {!Array<Token>} */ (Tk.popNative(m, Symbol.EITHER_));
  m.push(Token.mkInt(values[0] === null ? 1 : 0));
};

/**
  @type function (!Machine):void}
  @suppress {checkTypes}
**/
const either = m => {
  const prgFail = m.popExc(Token.LIST);
  const prgOk = m.popExc(Token.LIST);
  const values = /** @type {!Array<Token>} */ (Tk.popNative(m, Symbol.EITHER_));
  if (values[0] === null) {
    m.push(values[1]);
    Machine.process("", m.pmachines, prgOk);
  } else {
    m.push(values[0]);
    Machine.process("", m.pmachines, prgFail);
  }
};

/** @type function (!Machine):void} */
const tp = m => {
  const tk2 = m.pop();
  m.push(Token.mkList([m.pop(), tk2]));
};

/** @type function (!Machine):void} */
const tp3 = m => {
  const tk3 = m.pop();
  const tk2 = m.pop();
  m.push(Token.mkList([m.pop(), tk2, tk3]));
};

/** Global symbols. */
export default class ModWrap {
  /** @return {!Array<!PmoduleEntry>} */
  static mk () {
    const r = Pmodule.mk();

    /**
      @param {string} name
      @param {function (!Machine):void} fn
      @return void
    **/
    function add (name, fn) {
      Pmodule.add(r, Symbol.mk(name), fn);
    }

    add("none", none); // [] - OPT ([] -> empty list)
    add("none?", isNone); // OPT - INT
    add("some", some); // * - OPT (* -> (*))
    add("some?", isSome); // OPT - INT
    add("option", option); // [(->B?), (OPT->B?), (->OPT)] - B?
    add("ref", ref); // * - REF (* -> (*))
    add("left", left); // STRING -> EITHER (s -> (s, 0))
    add("left?", isLeft); // EITHER - INT
    add("right", right); // * -> EITHER (* -> (*)) -some is ok-
    add("right?", isRight); // EITHER - INT
    add("either", either); // [(LEFT->B?), (RIGHT->B?), (->EITHER)] - B?
    add("tp", tp); // [A, B] -> [(A, B)]
    add("tp3", tp3); // [A, B, C] -> [(A, B, C)]

    return r;
  }
}
