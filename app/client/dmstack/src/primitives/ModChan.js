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
const snew = m => {
  m.push(Token.mkList([]));
};

/** @type function (!Machine):void} */
const send = m => {
  const chan = Tk.popList(m);
  if (chan.length === 0) Fails.listSize(m, chan, 1);
  const prg = chan.length > 1 ? chan.shift() : chan[0];
  if (prg.type !== Token.LIST) Fails.typeIn(m, Token.LIST, prg);
  const prgA = prg.listValue;
  const a = prgA.slice(0, prgA.length);
  a.unshift(m.pop());
  Machine.isolateProcess("", m.pmachines, Token.mkList(a));
};

/** @type function (!Machine):void} */
const recv = m => {
  const chan = Tk.popList(m);
  if (chan.length > 1) Fails.listSize(m, chan, 1);
  const prg = m.popExc(Token.LIST);
  chan.push(prg);
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

    add("new", snew); // <> - OPT<LIST>
    add("send", send); // <*, OPT<LIST>> - <>
    add("recv", recv); // <LIST, OPT<LIST>> - <>

    return r;
  }
}
