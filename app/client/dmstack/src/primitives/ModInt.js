// Copyright 08-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/**
  @param {!Machine} m
  @param {function(number, number):number} f
  @return {void}
**/
function fn2 (m, f) {
  const n2 = Tk.popInt(m);
  const n1 = Tk.popInt(m);
  m.push(Token.mkInt(f(n1, n2)));
}

/** @type function (!Machine):void} */
const fromStr = m => {
  m.push(Token.mkInt(Number(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const abs = m => {
  m.push(Token.mkInt(Math.abs(Tk.popInt(m))));
};

/** @type function (!Machine):void} */
const rnd = m => {
  m.push(Token.mkInt(Math.random() * Tk.popInt(m)));
};

/** @type function (!Machine):void} */
const div = m => {
  const den = Tk.popInt(m);
  const num = Tk.popInt(m);
  const quot = num / den | 0;
  const rem = num - quot * den;
  m.push(Token.mkInt(quot));
  m.push(Token.mkInt(rem));
};

/** @type function (!Machine):void} */
const and = m => {
  fn2(m, (a, b) => a & b);
};

/** @type function (!Machine):void} */
const or = m => {
  fn2(m, (a, b) => a | b);
};

/** @type function (!Machine):void} */
const xor = m => {
  fn2(m, (a, b) => a ^ b);
};

/** @type function (!Machine):void} */
const not = m => {
  m.push(Token.mkInt(~Tk.popInt(m)));
};

/** @type function (!Machine):void} */
const left = m => {
  fn2(m, (a, b) => a << b);
};

/** @type function (!Machine):void} */
const right = m => {
  fn2(m, (a, b) => a >> b);
};

/** @type function (!Machine):void} */
const max = m => {
  fn2(m, Math.max);
};

/** @type function (!Machine):void} */
const min = m => {
  fn2(m, Math.min);
};

/** @type function (!Machine):void} */
const maxInt = m => {
  m.push(Token.mkInt(Number.MAX_SAFE_INTEGER));
};

/** @type function (!Machine):void} */
const minInt = m => {
  m.push(Token.mkInt(Number.MIN_SAFE_INTEGER));
};

/** @type function (!Machine):void} */
const toFloat = m => {
  m.push(Token.mkFloat(Tk.popInt(m)));
};

/** Global symbols. */
export default class ModInt {
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

    add("fromStr", fromStr); // STRING - INT
    add("abs", abs); // INT - INT
    add("rnd", rnd); // [] - INT
    add("div", div); // [INT, INT] - [INT, INT] (num, den) - [quot, rem]

    add("&", and);
    add("|", or);
    add("^", xor);
    add("~", not);
    add("<<", left);
    add(">>", right);

    add("max", max); // [INT, INT] - INT
    add("min", min); // [INT, INT] - INT

    add("maxInt", maxInt); // () - INT
    add("minInt", minInt); // () - INT
    add("toFloat", toFloat); // INT - FLOAT

    return r;
  }
}
