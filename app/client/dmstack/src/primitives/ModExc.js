// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Exception module. */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; //
import Exception from "../Exception.js";

/** @type function (!Machine):void} */
const type = m => {
  m.push(Token.mkString(Exception.type(
    /** @type {!Error} */ (Tk.popNative(m, Symbol.EXC_))
  )));
};

/** @type function (!Machine):void} */
const msg = m => {
  m.push(Token.mkString(Exception.msg(
    /** @type {!Error} */ (Tk.popNative(m, Symbol.EXC_))
  )));
};

/** @type function (!Machine):void} */
const stack = m => {
  m.push(Token.mkString(Exception.stack(
    /** @type {!Error} */ (Tk.popNative(m, Symbol.EXC_))
  )));
};

/** Exception module. */
export default class ModExc {
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

    add("type", type); // Exc - STRING
    add("msg", msg); // Exc - STRING
    add("stack", stack); // Exc - STRING

    return r;
  }
}
