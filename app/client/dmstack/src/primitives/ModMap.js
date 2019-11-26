// Copyright 15-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";
import ModJs from "./ModJs.js";

/** @type function (!Machine):void} */
const snew = m => {
  m.push(Token.fromPointer(Symbol.MAP_, {}));
};

/** @type function (!Machine):void} */
const sfrom = m => {
  const prg = m.popExc(Token.LIST);
  const m2 = Machine.isolateProcess("", m.pmachines, prg);

  const a = m2.stack;
  const sz = a.length;
  if (sz % 2) Fails.listSize(m, a, sz + 1);

  // Map<Token>
  const r = {};
  for (let i = 0; i < sz;) {
    const k = Tk.stringValue(m, a[i++]);
    r[k] = a[i++];
  }

  m.push(Token.fromPointer(Symbol.MAP_, r));
};

/** @type function (!Machine):void} */
const size = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  m.push(Token.mkInt(Object.keys(mp).length));
};

function eqAux (m) {
  // Arr<Token>
  const prg = m.popExc(Token.LIST);
  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m) !== 0;
  }

  const m1 = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const m2 = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  if (Object.keys(m1).length !== Object.keys(m2).length) return 0;
  for (const [key, value] of Object.entries(m1)) {
    const tk = m2[key];
    if (tk === undefined || !fn(value, tk)) return 0;
  }
  return 1;
}

/** @type function (!Machine):void} */
const eq = m => {
  m.push(Token.mkInt(eqAux(m)));
};

/** @type function (!Machine):void} */
const neq = m => {
  m.push(Token.mkInt(eqAux(m) === 0 ? 1 : 0));
};

/** @type function (!Machine):void} */
const sget = m => {
  const k = Tk.popString(m);
  const mp = Tk.popNative(m, Symbol.MAP_);
  const tk = mp[k];
  if (tk !== undefined) m.push(tk);
  else m.fail("Key '" + k + "' not found");
};

/** @type function (!Machine):void} */
const oget = m => {
  const k = Tk.popString(m);
  const mp = Tk.popNative(m, Symbol.MAP_);
  const tk = mp[k];
  if (tk !== undefined) m.push(Token.fromPointer(Symbol.OPTION_, tk));
  else m.push(Token.fromPointer(Symbol.OPTION_, null));
};

/** @type function (!Machine):void} */
const has = m => {
  const k = Tk.popString(m);
  const mp = Tk.popNative(m, Symbol.MAP_);
  m.push(Token.mkInt(mp[k] === undefined ? 0 : 1));
};

function putBoth (m, isPlus) {
  const tk = m.pop();
  const k = Tk.popString(m);

  const mp = isPlus
    ? Tk.peekNative(m, Symbol.MAP_)
    : Tk.popNative(m, Symbol.MAP_)
  ;
  mp[k] = tk;
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
const remove = m => {
  const k = Tk.popString(m);
  const mp = Tk.popNative(m, Symbol.MAP_);
  delete mp[k];
};

/** @type function (!Machine):void} */
const keys = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const r = [];
  for (const k of Object.keys(mp)) r.push(Token.mkString(k));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const values = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  m.push(Token.mkList(Object.values(mp)));
};

/**
  @param {!Array<!Array<?>>} a0
  @return {!Array<!Token>}
**/
function pairsAux (a0) {
  const a = [];
  for (const [key, value] of a0)
    a.push(Token.mkList([Token.mkString(key), value]));
  return a;
}

/** @type function (!Machine):void} */
const pairs = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const pairs = Object.entries(mp);
  m.push(Token.mkList(pairsAux(pairs)));
};

/** @type function (!Machine):void} */
const sort = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const pairs = Object.entries(mp);
  pairs.sort();
  m.push(Token.mkList(pairsAux(pairs)));
};

/** @type function (!Machine):void} */
const sortLocale = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const pairs = Object.entries(mp);
  pairs.sort((a, b) => a[0].localeCompare(b[0]));
  m.push(Token.mkList(pairsAux(pairs)));
};

/** @type function (!Machine):void} */
const copy = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  m.push(Token.fromPointer(Symbol.MAP_, Object.assign({}, mp)));
};

/** @type function (!Machine):void} */
const to = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
  const a = [];
  for (const [key, value] of Object.entries(mp)) {
    a.push(Token.mkString(key));
    a.push(value);
  }
  m.push(Token.mkList(a));
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
    add("from", sfrom); // LIST - MAP
    add("size", size); // [MAP] - INT
    add("eq?", eq); // [MAP, MAP] - INT
    add("neq?", neq); // [MAP, MAP] - INT
    add("get", sget); // [MAP, STRING] - LIST // *
    add("oget", oget); // [MAP, STRING] - OPT
    add("has?", has); // [MAP, STRING] - INT
    add("put", put); // [MAP - STRING - *] - []
    add("put+", putPlus); // [MAP - STRING - *] - MAP
    add("up", up); // [MAP - STRING - LIST] - []
    add("up+", upPlus); // [MAP - STRING - LIST] - MAP
    add("remove", remove); // [MAP, STRING] - []
    add("keys", keys); // MAP - LIST
    add("values", values); // MAP - LIST
    add("pairs", pairs); // MAP - LIST (map - list<list<key, value>>
    add("sort", sort); // MAP - LIST (map - list<list<key, value>>
    add("sortLocale", sortLocale); // MAP - LIST (map - list<list<key, value>>
    add("copy", copy); // MAP - MAP
    add("to", to); // MAP - LIST

    add("fromJs", fromJs);
    add("toJs", toJs);

    return r;
  }
}
