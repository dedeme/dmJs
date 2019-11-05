// Copyright 15-Oct-2019 ºDeme
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
const has = m => {
  const key = Tk.popString(m);
  const a = Tk.popList(m);
  const sz = a.length;
  if (sz & 1) Fails.listSize(m, a, sz + 1);
  for (let i = 0; i < sz; i += 2) {
    if (Tk.stringValue(m, a[i]) === key) {
      m.push(Token.mkInt(1));
      return;
    }
  }
  m.push(Token.mkInt(0));
};

/** @type function (!Machine):void} */
const sget = m => {
  const key = Tk.popString(m);
  const a = Tk.popList(m);
  const sz = a.length;
  if (sz & 1) Fails.listSize(m, a, sz + 1);
  for (let i = 0; i < sz; i += 2) {
    if (Tk.stringValue(m, a[i]) === key) {
      m.push(a[i + 1]);
      return;
    }
  }
  m.fail("Key '" + key + "' not found");
};

function putBoth (m, isPlus) {
  const tk = m.pop();
  const keyTk = m.pop();

  const key = Tk.stringValue(m, keyTk);
  const a = isPlus
    ? Tk.peekList(m)
    : Tk.popList(m)
  ;
  const sz = a.length;
  if (sz & 1) Fails.listSize(m, a, sz + 1);
  for (let i = 0; i < sz; i += 2) {
    if (Tk.stringValue(m, a[i]) === key) {
      a[i + 1] = tk;
      return;
    }
  }
  a.push(keyTk);
  a.push(tk);
}

/** @type function (!Machine):void} */
const put = m => {
  putBoth(m, false);
};

/** @type function (!Machine):void} */
const putPlus = m => {
  putBoth(m, true);
};

function upBoth (m, isPlus) {
  const prg = m.popExc(Token.LIST);
  const tk2 = m.pop();
  const tk1 = m.peek();
  m.push(tk2);
  sget(m);

  Machine.process("", m.pmachines, prg);

  const tk3 = m.pop(m);
  m.push(tk1);
  m.push(tk2);
  m.push(tk3);
  putBoth(m, isPlus);
}

/** @type function (!Machine):void} */
const up = m => {
  upBoth(m, false);
};

/** @type function (!Machine):void} */
const upPlus = m => {
  upBoth(m, true);
};

/** @type function (!Machine):void} */
const fromMap = m => {
  const r = [];
  for (const tk of Tk.popList(m)) {
    const a = Tk.listValue(m, tk);
    if (a.length !== 2) Fails.listSize(m, a, 2);
    const tk1 = a[0];
    if (tk1.type !== Token.STRING) Fails.typeIn(m, Token.STRING, tk1);
    r.push(tk1);
    r.push(a[1]);
  }
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const toMap = m => {
  const r = [];
  let tk1 = null;
  const a = Tk.popList(m);
  for (const tk of a) {
    if (tk1 === null) {
      if (tk.type !== Token.STRING) Fails.typeIn(m, Token.STRING, tk);
      tk1 = tk;
    } else {
      r.push(Token.mkList([tk1, tk]));
      tk1 = null;
    }
  }
  if (tk1 !== null) {
    Fails.listSize(m, a, a.length + 1);
  }
  m.push(Token.mkList(r));
};

/** Global symbols. */
export default class ModJs {
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

    add("new", snew); // [] - OBJ
    add("has?", has); // [OBJ, STRING] - INT
    add("get", sget); // [OBJ, STRING] - *
    add("put", put); // [OBJ - STRING - *] - []
    add("put+", putPlus); // [OBJ - STRING - *] - OBJ
    add("up", up); // [OBJ - STRING - LIST] - []
    add("up+", upPlus); // [OBJ - STRING - LIST] - OBJ
    add("fromMap", fromMap); // MAP - OBJ
    add("toMap", toMap); // OBJ - MAP

    return r;
  }
}
