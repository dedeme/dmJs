// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line
import Fails from "../Fails.js"; // eslint-disable-line

/** @type function (!Machine):void} */
const locale = m => {
  m.push(Token.mkString(navigator.language));
};

/** @type function (!Machine):void} */
const go = m => {
  const prg = m.popExc(Token.LIST);
  function fn () {
    Machine.closureProcess("", m.pmachines, prg);
  }
  setTimeout(fn, 0);
};

/** @type function (!Machine):void} */
const delay = m => {
  const prg = m.popExc(Token.LIST);
  const time = Tk.popInt(m);
  function fn () {
    Machine.closureProcess("", m.pmachines, prg);
  }
  const timer = setTimeout(fn, time);
  m.push(Token.fromPointer(Symbol.TIMER_, timer));
};

/** @type function (!Machine):void} */
const interval = m => {
  const prg = m.popExc(Token.LIST);
  const time = Tk.popInt(m);
  function fn () {
    Machine.closureProcess("", m.pmachines, prg);
  }
  const timer = setInterval(fn, time);
  m.push(Token.fromPointer(Symbol.TIMER_, timer));
};

/** @type function (!Machine):void} */
const timerClear = m => {
  const timer = /** @type {number} */ (Tk.popNative(m, Symbol.TIMER_));
  clearTimeout(timer);
};

/** @type function (!Machine):void} */
const salert = m => {
  alert(Tk.popString(m));
};

/** @type function (!Machine):void} */
const sconfirm = m => {
  m.push(Token.mkInt(confirm(Tk.popString(m)) ? 1 : 0));
};

/** @type function (!Machine):void} */
const sprompt = m => {
  const ls = Tk.popList(m);
  if (ls.length !== 2 && ls.length !== 1) Fails.listSize(m, ls, 2);
  const r = ls.length === 1
    ? prompt(Tk.stringValue(m, ls[0]))
    : prompt(Tk.stringValue(m, ls[0]), Tk.stringValue(m, ls[1]))
  ;
  m.push(r === null ? Token.mkList([]) : Token.mkString(r));
};

/** @type function (!Machine):void} */
const log = m => {
  console.log(Tk.popString(m));
};

/** @type function (!Machine):void} */
const error = m => {
  console.error(Tk.popString(m));
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

    add("locale", locale); // <> - <STRING>

    add("go", go); // LIST - <>
    add("delay", delay); // <LIST - INT> - Timer
    add("interval", interval); // <LIST - INT> - Timer
    add("timerClear", timerClear); // Timer - <>

    add("alert", salert); // STRING - <>
    add("confirm", sconfirm); // STRING - INT
    add("prompt", sprompt); // LIST - STRING

    add("log", log); // STRING - <>
    add("error", error); // STRING - INT

    return r;
  }
}
