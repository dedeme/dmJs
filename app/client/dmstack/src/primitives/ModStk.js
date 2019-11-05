// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line

/** @type function (!Machine):void} */
const clear = m => {
  m.stack.length = 0;
};

/** @type function (!Machine):void} */
const show = m => {
  const st = m.stack;
  console.log("Stack:");
  if (st.length === 0) {
    console.log("  [EMPTY]");
    return;
  }
  const a = st.map(tk => tk.toString());
  a.reverse();
  console.log("  [ " + a.join(" ") + " ]");
};

/** Global symbols. */
export default class ModStk {
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

    add("clear", clear);
    add("show", show);

    return r;
  }
}
