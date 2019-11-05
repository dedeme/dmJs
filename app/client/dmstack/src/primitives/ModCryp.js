// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line
import Cryp from "../util/Cryp.js";

/** @type function (!Machine):void} */
const genk = m => {
  m.push(Token.mkString(Cryp.genK(Tk.popInt(m))));
};

/** @type function (!Machine):void} */
const key = m => {
  const len = Tk.popInt(m);
  m.push(Token.mkString(Cryp.key(Tk.popString(m), len)));
};

/** @type function (!Machine):void} */
const cryp = m => {
  const k = Tk.popString(m);
  m.push(Token.mkString(Cryp.cryp(k, Tk.popString(m))));
};

/** @type function (!Machine):void} */
const decryp = m => {
  const k = Tk.popString(m);
  m.push(Token.mkString(Cryp.decryp(k, Tk.popString(m))));
};

/** @type function (!Machine):void} */
const autocryp = m => {
  const len = Tk.popInt(m);
  m.push(Token.mkString(Cryp.autoCryp(Tk.popString(m), len)));
};

/** @type function (!Machine):void} */
const autodecryp = m => {
  m.push(Token.mkString(Cryp.autoDecryp(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const encode = m => {
  const k = Tk.popString(m);
  const len = Tk.popInt(m);
  m.push(Token.mkString(Cryp.encode(k, Tk.popString(m), len)));
};

/** @type function (!Machine):void} */
const decode = m => {
  const k = Tk.popString(m);
  m.push(Token.mkString(Cryp.decode(k, Tk.popString(m))));
};

/** Global symbols. */
export default class ModCryp {
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

    add("genk", genk); // INT - STRING
    add("key", key); // [STRING, INT] - STRING
    add("cryp", cryp); // [STRING, STRING] - STRING ([tx, key] - tx)
    add("decryp", decryp); // [STRING, STRING] - STRING ([tx, key] - tx)
    add("autoCryp", autocryp); // [STRING, INT] - STRING
    add("autoDecryp", autodecryp); // STRING - STRING
    add("encode", encode); // [STRING, INT, STRING] - STRING ([tx,len,key] - tx)
    add("decode", decode); // [STRING, STRING] - STRING ([tx, key] - tx)

    return r;
  }
}
