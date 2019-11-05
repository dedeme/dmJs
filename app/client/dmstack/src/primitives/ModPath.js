// Copyright 21-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line
import Path from "../util/Path.js"; // eslint-disable-line

/** @type function (!Machine):void} */
const canonical = m => {
  m.push(Token.mkString(Path.canonical(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const plus = m => {
  const s = Tk.popString(m);
  m.push(Token.mkString(Path.cat([Tk.popString(m), s])));
};

/** @type function (!Machine):void} */
const cat = m => {
  const a = Tk.popList(m);
  m.push(Token.mkString(Path.cat(a.map(tk => Tk.stringValue(m, tk)))));
};

/** @type function (!Machine):void} */
const extension = m => {
  m.push(Token.mkString(Path.extension(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const name = m => {
  m.push(Token.mkString(Path.name(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const onlyName = m => {
  m.push(Token.mkString(Path.onlyName(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const parent = m => {
  m.push(Token.mkString(Path.parent(Tk.popString(m))));
};

/** Global symbols. */
export default class ModPath {
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

    add("canonical", canonical); // STRING - OPT<STRING>
    add("+", plus); // STRING - STRING
    add("cat", cat); // STRING - STRING
    add("extension", extension); // STRING - STRING
    add("name", name); // STRING - STRING
    add("onlyName", onlyName); // STRING - STRING
    add("parent", parent); // STRING - STRING

    return r;
  }
}
