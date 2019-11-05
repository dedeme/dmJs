// Copyright 15-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import ModJs from "./ModJs.js";

/** @type function (!Machine):void} */
const snew = m => {
  m.push(Token.mkList([]));
};

/** @type function (!Machine):void} */
const sget = m => {
  const key = Tk.popString(m);
  for (const kvTk of Tk.popList(m)) {
    const kv = Tk.listValue(m, kvTk);
    if (Tk.stringValue(m, kv[0]) === key) {
      m.push(Token.mkList([kv[1]]));
      return;
    }
  }
  m.push(Token.mkList([]));
};

/** @type function (!Machine):void} */
const has = m => {
  const key = Tk.popString(m);
  for (const kvTk of Tk.popList(m)) {
    const kv = Tk.listValue(m, kvTk);
    if (Tk.stringValue(m, kv[0]) === key) {
      m.push(Token.mkInt(1));
      return;
    }
  }
  m.push(Token.mkInt(0));
};

function putBoth (m, isPlus) {
  const tk = m.pop();
  const keyTk = m.pop();

  const key = Tk.stringValue(m, keyTk);
  const a = isPlus
    ? Tk.peekList(m)
    : Tk.popList(m)
  ;
  for (const kvTk of a) {
    const kv = Tk.listValue(m, kvTk);
    if (Tk.stringValue(m, kv[0]) === key) {
      kv[1] = tk;
      return;
    }
  }
  a.push(Token.mkList([keyTk, tk]));
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

  const a = Tk.popList(m);
  if (a.length === 0)
    m.fail("Key '" + tk2.stringValue + "' not found");
  m.push(a[0]);
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
const remove = m => {
  const key = Tk.popString(m);
  const a = Tk.popList(m);
  let ix = -1;
  for (let i = 0; i < a.length; ++i) {
    const kv = Tk.listValue(m, a[i]);
    if (Tk.stringValue(m, kv[0]) === key) {
      ix = i;
      break;
    }
  }
  if (ix !== -1) a.splice(ix, 1);
};

/** @type function (!Machine):void} */
const keys = m => {
  const a = Tk.popList(m);
  const r = [];
  for (const kvTk of a) r.push(Tk.listValue(m, kvTk)[0]);
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const values = m => {
  const a = Tk.popList(m);
  const r = [];
  for (const kvTk of a) r.push(Tk.listValue(m, kvTk)[1]);
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const sort = m => {
  const a = Tk.popList(m);
  a.sort((kvTk1, kvTk2) =>
    Tk.stringValue(m, Tk.listValue(m, kvTk1)[0]) >
      Tk.stringValue(m, Tk.listValue(m, kvTk2)[0]) ? 1 : -1
  );
};

/** @type function (!Machine):void} */
const sortLocale = m => {
  const a = Tk.popList(m);
  a.sort((kvTk1, kvTk2) =>
    Tk.stringValue(m, Tk.listValue(m, kvTk1)[0]).localeCompare(
      Tk.stringValue(m, Tk.listValue(m, kvTk2)[0])
    )
  );
};

/** @type function (!Machine):void} */
const fromJs = m => {
  ModJs.toMap(m);
};

/** @type function (!Machine):void} */
const toJs = m => {
  ModJs.fromMap(m);
};

/** Global symbols. */
export default class ModMap {
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

    add("new", snew); // [] - MAP
    add("get", sget); // [MAP, STRING] - LIST // ([map, key] - OPT)
    add("has?", has); // [MAP, STRING] - INT
    add("put", put); // [MAP - STRING - *] - []
    add("put+", putPlus); // [MAP - STRING - *] - MAP
    add("up", up); // [MAP - STRING - LIST] - []
    add("up+", upPlus); // [MAP - STRING - LIST] - MAP
    add("remove", remove); // [MAP, STRING] - []
    add("keys", keys); // MAP - LIST
    add("values", values); // MAP - LIST
    add("sort", sort); // MAP - []
    add("sortLocale", sortLocale); // MAP - []

    add("fromJs", fromJs);
    add("toJs", toJs);

    return r;
  }
}
