// Copyright 05-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/**
  @param {!Machine} m
  @param {function(number):number} f
  @return {void}
**/
function fn1 (m, f) {
  const n = Tk.popFloat(m);
  m.push(Token.mkFloat(f(n)));
}

/**
  @param {!Machine} m
  @param {function(number, number):number} f
  @return {void}
**/
function fn2 (m, f) {
  const n2 = Tk.popFloat(m);
  const n1 = Tk.popFloat(m);
  m.push(Token.mkFloat(f(n1, n2)));
}

/** @type function (!Machine):void} */
const pi = m => {
  m.push(Token.mkFloat(Math.PI));
};

/** @type function (!Machine):void} */
const sin = m => {
  fn1(m, Math.sin);
};

/** @type function (!Machine):void} */
const cos = m => {
  fn1(m, Math.cos);
};

/** @type function (!Machine):void} */
const tan = m => {
  fn1(m, Math.tan);
};

/** @type function (!Machine):void} */
const asin = m => {
  fn1(m, Math.asin);
};

/** @type function (!Machine):void} */
const acos = m => {
  fn1(m, Math.acos);
};

/** @type function (!Machine):void} */
const atan = m => {
  fn1(m, Math.atan);
};

/** @type function (!Machine):void} */
const atan2 = m => {
  fn2(m, Math.atan2);
};

/** @type function (!Machine):void} */
const e = m => {
  m.push(Token.mkFloat(Math.E));
};

/** @type function (!Machine):void} */
const exp = m => {
  fn1(m, Math.exp);
};

/** @type function (!Machine):void} */
const exp2 = m => {
  fn1(m, (n) => Math.pow(2, n));
};

/** @type function (!Machine):void} */
const exp10 = m => {
  fn1(m, (n) => Math.pow(10, n));
};

/** @type function (!Machine):void} */
const log = m => {
  fn1(m, Math.log);
};

/** @type function (!Machine):void} */
const log2 = m => {
  fn1(m, Math.log2);
};

/** @type function (!Machine):void} */
const log10 = m => {
  fn1(m, Math.log10);
};

/** @type function (!Machine):void} */
const pow = m => {
  fn2(m, Math.pow);
};

/** @type function (!Machine):void} */
const sqrt = m => {
  fn1(m, Math.sqrt);
};

/** @type function (!Machine):void} */
const cbrt = m => {
  fn1(m, Math.cbrt);
};


/** Global symbols. */
export default class ModFloat {
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

    add("pi", pi);
    add("sin", sin);
    add("cos", cos);
    add("tan", tan);
    add("asin", asin);
    add("acos", acos);
    add("atan", atan);
    add("atan2", atan2);

    add("e", e);
    add("exp", exp);
    add("exp2", exp2);
    add("exp10", exp10);
    add("log", log);
    add("log2", log2);
    add("log10", log10);

    add("pow", pow);
    add("sqrt", sqrt);
    add("cbrt", cbrt);

    return r;
  }
}
