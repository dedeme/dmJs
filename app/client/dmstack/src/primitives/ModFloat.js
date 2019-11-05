// Copyright 05-Oct-2019 ºDeme
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
  const n2 = Tk.popFloat(m);
  const n1 = Tk.popFloat(m);
  m.push(Token.mkFloat(f(n1, n2)));
}

/**
 * Decimal adjust of a number.
 *
 * @param {string}  type  Function type.
 * @param {number}  value Number.
 * @param {number}  exp   Scale.
 * @returns {number} Adjusted value.
 */
function decimalAdjust (type, value, exp) {
  if (typeof exp === "undefined" || exp === 0) {
    return Math[type](value);
  }
  // Si el valor no es un número o el exp no es un entero...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  let vals = value.toString().split("e");
  value = Math[type](
    Number(vals[0] + "e" + (vals[1] ? (Number(vals[1]) + exp) : exp))
  );
  // Shift back
  vals = value.toString().split("e");
  return Number(vals[0] + "e" + (vals[1] ? (Number(vals[1]) - exp) : -exp));
}

/** @type function (!Machine):void} */
const fromStr = m => {
  m.push(Token.mkFloat(Number(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const abs = m => {
  m.push(Token.mkFloat(Math.abs(Tk.popFloat(m))));
};

/** @type function (!Machine):void} */
const rnd = m => {
  m.push(Token.mkFloat(Math.random()));
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
const round = m => {
  m.push(Token.mkFloat(decimalAdjust("round", Tk.popFloat(m), 0)));
};

/** @type function (!Machine):void} */
const roundn = m => {
  let scale = Tk.popInt(m);
  if (scale < 0) scale = 0;
  m.push(Token.mkFloat(decimalAdjust("round", Tk.popFloat(m), scale)));
};

/** @type function (!Machine):void} */
const eq = m => {
  const gap = Tk.popFloat(m);
  const n2 = Tk.popFloat(m);
  const n1 = Tk.popFloat(m);
  m.push(Token.mkInt(n2 < n1 + gap && n2 > n1 - gap ? 1 : 0));
};

/** @type function (!Machine):void} */
const toInt = m => {
  m.push(Token.mkInt(Tk.popFloat(m)));
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

    add("fromStr", fromStr); // STRING - FLOAT
    add("abs", abs); // FLOAT - FLOAT
    add("rnd", rnd); //  [] - FLOAT

    add("max", max); // [FLOAT, FLOAT] - FLOAT
    add("min", min); // [FLOAT, FLOAT] - FLOAT

    add("round", round); // FLOAT - FLOAT
    add("roundn", roundn); // [FLOAT, INT] - FLOAT
    add("==", eq);

    add("toInt", toInt); // [FLOAT] - INT

    return r;
  }
}
