// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";

/** @type function (!Machine):void} */
const none = m => {
  m.push(Token.mkList([]));
};

/** @type function (!Machine):void} */
const isNone = m => {
  m.push(Token.mkInt(Tk.popList(m).length === 0 ? 1 : 0));
};

/** @type function (!Machine):void} */
const some = m => {
  m.push(Token.mkList([m.pop()]));
};

/** @type function (!Machine):void} */
const isSome = m => {
  const a = Tk.popList(m);
  if (a.length > 1) Fails.listSize(m, a, 1);
  m.push(Token.mkInt(a.length === 1 ? 1 : 0));
};

/** @type function (!Machine):void} */
const option = m => {
  const prgFail = m.popExc(Token.LIST);
  const prgOk = m.popExc(Token.LIST);
  const o = Tk.popList(m);
  switch(o.length) {
  case 0:
    Machine.process("", m.pmachines, prgFail);
    break;
  case 1:
    m.push(o[0]);
    Machine.process("", m.pmachines, prgOk);
    break;
  default:
    Fails.listSize(m, o, 1);
  }
};

/** @type function (!Machine):void} */
const left = m => {
  m.push(Token.mkList([m.popExc(Token.STRING), Token.mkInt(0)]));
};

/** @type function (!Machine):void} */
const isLeft = m => {
  const a = Tk.popList(m);
  if (a.length !== 1 && a.length !== 2) Fails.listSize(m, a, 2);
  m.push(Token.mkInt(a.length === 2 ? 1 : 0));
};

/** @type function (!Machine):void} */
const isRight = m => {
  const a = Tk.popList(m);
  if (a.length !== 1 && a.length !== 2) Fails.listSize(m, a, 2);
  m.push(Token.mkInt(a.length === 1 ? 1 : 0));
};

/** @type function (!Machine):void} */
const either = m => {
  const prgFail = m.popExc(Token.LIST);
  const prgOk = m.popExc(Token.LIST);
  const o = Tk.popList(m);
  switch(o.length) {
  case 1:
    m.push(o[0]);
    Machine.process("", m.pmachines, prgOk);
    break;
  case 2:
    m.push(o[0]);
    Machine.process("", m.pmachines, prgFail);
    break;
  default:
    Fails.listSize(m, o, 2);
  }
};

/** @type function (!Machine):void} */
const tp = m => {
  const tk2 = m.pop();
  m.push(Token.mkList([m.pop(), tk2]));
};

/** @type function (!Machine):void} */
const tp3 = m => {
  const tk3 = m.pop();
  const tk2 = m.pop();
  m.push(Token.mkList([m.pop(), tk2, tk3]));
};

/** Global symbols. */
export default class ModWrap {
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

    add("none", none); // [] - OPT ([] -> empty list)
    add("none?", isNone); // OPT - INT
    add("some", some); // * - OPT (* -> (*))
    add("some?", isSome); // OPT - INT
    add("option", option); // [(->B?), (OPT->B?), (->OPT)] - B?
    add("ref", some); // * - REF (* -> (*))
    add("left", left); // STRING -> EITHER (s -> (s, 0))
    add("left?", isLeft); // EITHER - INT
    add("right", some); // * -> EITHER (* -> (*)) -some is ok-
    add("right?", isRight); // EITHER - INT
    add("either", either); // [(LEFT->B?), (RIGHT->B?), (->EITHER)] - B?
    add("tp", tp); // [A, B] -> [(A, B)]
    add("tp3", tp3); // [A, B, C] -> [(A, B, C)]

    return r;
  }
}
