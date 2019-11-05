// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import B64 from "../util/B64.js";

/** @type function (!Machine):void} */
const decode = m => {
  m.push(Token.mkString(B64.decode(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const decodeBytes = m => {
  m.push(Token.fromPointer(Symbol.BLOB_, B64.decodeBytes(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const encode = m => {
  m.push(Token.mkString(B64.encode(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const encodeBytes = m => {
  m.push(Token.mkString(B64.encodeBytes(
    /** @type {!Uint8Array} */ (Tk.popNative(m, Symbol.BLOB_))
  )));
};


/** Global symbols. */
export default class ModB64 {
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

    add("decode", decode); // STRING - STRING
    add("decodeBytes", decodeBytes); // STRING - BLOB
    add("encode", encode); // STRING - STRING
    add("encodeBytes", encodeBytes); // BLOB - STRING

    return r;
  }
}
