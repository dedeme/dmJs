// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line

/** @type function (!Machine):void} */
const now = m => {
  m.push(Token.fromPointer(Symbol.DATE_, new Date()));
};

/** @type function (!Machine):void} */
const sadd = m => {
  const millis = Tk.popInt(m);
  const d = Tk.popNative(m, Symbol.DATE_);
  m.push(Token.fromPointer(Symbol.DATE_, new Date(d.getTime() + millis)));
};

/** @type function (!Machine):void} */
const df = m => {
  const d2 = Tk.popNative(m, Symbol.DATE_);
  const d1 = Tk.popNative(m, Symbol.DATE_);
  m.push(Token.mkInt(d1.getTime() - d2.getTime()));
};

/** Global symbols. */
export default class ModSys {
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

    add("now", now); // [] - Date
    add("add", sadd); // [Date - INT] - Date
    add("df", df); // [Date - Date] - INT   lists are list (LONG, LONG) Millisec.

    return r;
  }
}
