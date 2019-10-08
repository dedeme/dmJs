// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/**
  @param {!Machine} m
  @param {string} fn
  @param {number} min
  @return {void}
**/
function stkFail (m, fn, min) {
  m.fail(
    "'" + fn + "' require at less " + min +
    " elements in stack. Current number is " + m.stack.length + "."
  );
}


/** @type function (!Machine):void} */
const puts = m => {
  console.log(m.pop().toString()); // eslint-disable-line
};

/** @type function (!Machine):void} */
const toStr = m => {
  m.push(Token.mkString(0, m.pop().toString()));
};

/** @type function (!Machine):void} */
const clone = m => {
  m.push(m.pop().clone());
};

/** @type function (!Machine):void} */
const eq = m => {
  m.push(Token.mkInt(0, m.pop().eq(m.pop()) ? 1 : 0));
};

/** @type function (!Machine):void} */
const neq = m => {
  m.push(Token.mkInt(0, m.pop().eq(m.pop()) ? 0 : 1));
};

/** @type function (!Machine):void} */
const fail = m => {
  m.fail(Tk.popString(m));
};

/** @type function (!Machine):void} */
const swap = m => {
  const sz1 = m.stack.length - 1;
  if (m.stack.length > 0) {
    [m.stack[sz1], m.stack[sz1 - 1]] = [m.stack[sz1 - 1], m.stack[sz1]];
    return;
  }
  stkFail(m, "swap", 2);
};

/** @type function (!Machine):void} */
const pop = m => {
  if (m.stack.length > 0) {
    m.stack.pop();
    return;
  }
  stkFail(m, "pop", 1);
};

/** @type function (!Machine):void} */
const dup = m => {
  if (m.stack.length > 0) {
    m.stack.push(m.stack[m.stack.length - 1]);
    return;
  }
  stkFail(m, "dup", 1);
};

/** @type function (!Machine):void} */
const empty = m => {
  m.push(Token.mkInt(0, m.stack.length === 0 ? 1 : 0));
};

/** Global symbols. */
export default class ModGlobal {
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

    add("puts", puts);
    add("toStr", toStr);
    add("clone", clone);
    add("==", eq);
    add("!=", neq);
    add("fail", fail);
    add("swap", swap);
    add("pop", pop);
    add("dup", dup);
    add("empty?", empty);

    return r;
  }
}
