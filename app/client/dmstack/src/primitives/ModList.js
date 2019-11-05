// Copyright 05-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";
import ModJs from "./ModJs.js";

/**
  @param {!Machine} m
  @param {!Array<!Token>} a
  @return {void}
**/
function pushList (m, a) {
  m.push(Token.mkList(a));
}

/** @type function (!Machine):void} */
const snew = m => {
  pushList(m, []);
};

/** @type function (!Machine):void} */
const unary = m => {
  pushList(m, [m.pop()]);
};

/** @type function (!Machine):void} */
const make = m => {
  const n = Tk.popInt(m);
  const value = m.pop();
  pushList(m, new Array(n).fill(value));
};

/** @type function (!Machine):void} */
const fill = m => {
  const value = m.pop();
  const a = Tk.popList(m);
  a.fill(value);
};

/** @type function (!Machine):void} */
const push = m => {
  const tk = m.pop();
  Tk.popList(m).push(tk);
};

/** @type function (!Machine):void} */
const pushPlus = m => {
  const tk = m.pop();
  Tk.peekList(m).push(tk);
};

/** @type function (!Machine):void} */
const pop = m => {
  const a = Tk.popList(m);
  if (a.length === 0) m.fail("List is empty");
  m.push(a.pop());
};

/** @type function (!Machine):void} */
const peek = m => {
  const a = Tk.popList(m);
  if (a.length === 0) m.fail("List is empty");
  m.push(a[a.length - 1]);
};

/** @type function (!Machine):void} */
const push0 = m => {
  const tk = m.pop();
  Tk.popList(m).unshift(tk);
};

/** @type function (!Machine):void} */
const push0Plus = m => {
  const tk = m.pop();
  Tk.peekList(m).unshift(tk);
};

/** @type function (!Machine):void} */
const pop0 = m => {
  const a = Tk.popList(m);
  if (a.length === 0) m.fail("List is empty");
  m.push(a.shift());
};

/** @type function (!Machine):void} */
const peek0 = m => {
  const a = Tk.popList(m);
  if (a.length === 0) m.fail("List is empty");
  m.push(a[0]);
};

/** @type function (!Machine):void} */
const insert = m => {
  const tk = m.pop();
  const ix = Tk.popInt(m);
  const a = Tk.popList(m);
  Fails.checkRange(m, 0, a.length, ix);
  a.splice(ix, 0, tk);
};

/** @type function (!Machine):void} */
const insertList = m => {
  const aIns = Tk.popList(m);
  const ix = Tk.popInt(m);
  const a = Tk.popList(m);
  Fails.checkRange(m, 0, a.length, ix);
  a.splice(ix, 0, ...aIns);
};

/** @type function (!Machine):void} */
const remove = m => {
  const ix = Tk.popInt(m);
  const a = Tk.popList(m);
  Fails.checkRange(m, 0, a.length - 1, ix);
  a.splice(ix, 1);
};

/** @type function (!Machine):void} */
const removeRange = m => {
  const end = Tk.popInt(m);
  const begin = Tk.popInt(m);
  const a = Tk.popList(m);
  Fails.checkRange(m, 0, a.length, begin);
  Fails.checkRange(m, begin, a.length, end);
  a.splice(begin, end - begin);
};

/** @type function (!Machine):void} */
const clear = m => {
  const a = Tk.popList(m);
  a.splice(0, a.length);
};

/** @type function (!Machine):void} */
const reverse = m => {
  const a = Tk.popList(m);
  a.reverse();
};

/** @type function (!Machine):void} */
const shuffle = m => {
  const a = Tk.popList(m);
  ModList.shuffle(a); // eslint-disable-line
};

/** @type function (!Machine):void} */
const sort = m => {
  const prg = m.popExc(Token.LIST);
  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  const a = Tk.popList(m);
  a.sort((tk1, tk2) => fn(tk1, tk2) === 0 ? -1 : 1);
};

/** @type function (!Machine):void} */
const duplicates = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  const d = [];
  const r = [];
  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  for (const tk of a) {
    if (r.some(e => fn(e, tk))) {
      if (!d.some(e => fn(e, tk))) d.push(tk);
    } else {
      r.push(tk);
    }
  }
  const rs = [];
  rs.push(Token.mkList(d));
  rs.push(Token.mkList(r));
  pushList(m, rs);
};

/** @type function (!Machine):void} */
const all = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  m.push(Token.mkInt(a.every(fn) ? 1 : 0));
};

/** @type function (!Machine):void} */
const any = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  m.push(Token.mkInt(a.some(fn) ? 1 : 0));
};

/** @type function (!Machine):void} */
const each = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
  }
  a.forEach(fn);
};

/** @type function (!Machine):void} */
const eachIx = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk, ix) {
    m.push(tk);
    m.push(Token.mkInt(ix));
    Machine.process("", m.pmachines, prg);
  }
  a.forEach(fn);
};

/** @type function (!Machine):void} */
const eq = m => {
  const prg = m.popExc(Token.LIST);
  const a2 = Tk.popList(m);
  const a1 = Tk.popList(m);
  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  let r = 1;
  if (a1.length !== a2.length) {
    r = 0;
  } else {
    for (let i = 0; i < a1.length; ++i) {
      if (!fn(a1[i], a2[i])) {
        r = 0;
        break;
      }
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const neq = m => {
  const prg = m.popExc(Token.LIST);
  const a2 = Tk.popList(m);
  const a1 = Tk.popList(m);
  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  let r = 0;
  if (a1.length !== a2.length) {
    r = 1;
  } else {
    for (let i = 0; i < a1.length; ++i) {
      if (!fn(a1[i], a2[i])) {
        r = 1;
        break;
      }
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const index = m => {
  const tk = m.pop();
  const a = Tk.popList(m);
  let r = -1;
  for (let i = 0; i < a.length; ++i) {
    if (tk.eq(a[i])) {
      r = i;
      break;
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const indexf = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  let r = -1;
  for (let i = 0; i < a.length; ++i) {
    if (fn(a[i])) {
      r = i;
      break;
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const find = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  let r = [];
  for (let i = 0; i < a.length; ++i) {
    if (fn(a[i])) {
      r = [a[i]];
      break;
    }
  }
  pushList(m, r);
};

/** @type function (!Machine):void} */
const lastIndex = m => {
  const tk = m.pop();
  const a = Tk.popList(m);
  let r = -1;
  for (let i = a.length - 1; i >= 0; --i) {
    if (tk.eq(a[i])) {
      r = i;
      break;
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const lastIndexf = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (tk) {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  let r = -1;
  for (let i = a.length - 1; i >= 0; --i) {
    if (fn(a[i])) {
      r = i;
      break;
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const reduce = m => {
  const prg = m.popExc(Token.LIST);
  const seed = m.pop();
  const a = Tk.popList(m);
  function fn (seed, e) {
    m.push(seed);
    m.push(e);
    Machine.process("", m.pmachines, prg);
    return m.pop();
  }
  m.push(a.reduce(fn, seed));
};

/** @type function (!Machine):void} */
const flat = m => {
  const a = Tk.popList(m);
  const r = [];
  function add (ls) {
    for (const tk of ls)
      if (tk.type === Token.LIST) add(tk.listValue);
      else r.push(tk);
  }
  add(a);
  pushList(m, r);
};

/** @type function (!Machine):void} */
const drop = m => {
  let n = Tk.popInt(m);
  const a = Tk.popList(m);
  if (n < 0) n = 0;
  pushList(m, a.slice(n));
};

/** @type function (!Machine):void} */
const dropf = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (e) {
    m.push(e);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m) === 0;
  }
  let ix = a.findIndex(fn);
  if (ix === -1) ix = a.length;
  pushList(m, a.slice(ix));
};

/** @type function (!Machine):void} */
const filter = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (e) {
    m.push(e);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  pushList(m, a.filter(fn));
};

/** @type function (!Machine):void} */
const map = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (e) {
    m.push(e);
    Machine.process("", m.pmachines, prg);
    return m.pop();
  }
  pushList(m, a.map(fn));
};

/** @type function (!Machine):void} */
const take = m => {
  let n = Tk.popInt(m);
  const a = Tk.popList(m);
  if (n < 0) n = 0;
  pushList(m, a.slice(0, n));
};

/** @type function (!Machine):void} */
const takef = m => {
  const prg = m.popExc(Token.LIST);
  const a = Tk.popList(m);
  function fn (e) {
    m.push(e);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m) === 0;
  }
  let ix = a.findIndex(fn);
  if (ix === -1) ix = a.length;
  pushList(m, a.slice(0, ix));
};

/** @type function (!Machine):void} */
const zip = m => {
  const a2 = Tk.popList(m);
  const a1 = Tk.popList(m);
  let len = a1.length;
  if (len > a2.length) len = a2.length;
  const a = Array(len);
  for (let i = 0; i < len; ++i)
    a[i] = Token.mkList([a1[i], a2[i]]);
  pushList(m, a);
};

/** @type function (!Machine):void} */
const zip3 = m => {
  const a3 = Tk.popList(m);
  const a2 = Tk.popList(m);
  const a1 = Tk.popList(m);
  let len = a1.length;
  if (len > a2.length) len = a2.length;
  if (len > a3.length) len = a3.length;
  const a = Array(len);
  for (let i = 0; i < len; ++i)
    a[i] = Token.mkList([a1[i], a2[i], a3[i]]);
  pushList(m, a);
};

/** @type function (!Machine):void} */
const unzip = m => {
  const a = Tk.popList(m);
  const len = a.length;
  const a1 = Array(len);
  const a2 = Array(len);
  for (let i = 0; i < len; ++i) {
    const e = Tk.listValue(m, a[i]);
    if (e.length !== 2) Fails.listSize(m, e, 2);
    a1[i] = e[0];
    a2[i] = e[1];
  }

  pushList(m, [Token.mkList(a1), Token.mkList(a2)]);
};

/** @type function (!Machine):void} */
const unzip3 = m => {
  const a = Tk.popList(m);
  const len = a.length;
  const a1 = Array(len);
  const a2 = Array(len);
  const a3 = Array(len);
  for (let i = 0; i < len; ++i) {
    const e = Tk.listValue(m, a[i]);
    if (e.length !== 3) Fails.listSize(m, e, 3);
    a1[i] = e[0];
    a2[i] = e[1];
    a3[i] = e[2];
  }

  pushList(m, [Token.mkList(a1), Token.mkList(a2), Token.mkList(a3)]);
};

/** @type function (!Machine):void} */
const sub = m => {
  const end = Tk.popInt(m);
  const begin = Tk.popInt(m);
  const a = Tk.popList(m);
  pushList(m, a.slice(begin, end));
};

/** @type function (!Machine):void} */
const left = m => {
  const ix = Tk.popInt(m);
  const a = Tk.popList(m);
  pushList(m, a.slice(0, ix));
};

/** @type function (!Machine):void} */
const right = m => {
  const ix = Tk.popInt(m);
  const a = Tk.popList(m);
  pushList(m, a.slice(ix));
};

/** @type function (!Machine):void} */
const fromJs = m => {
  ModJs.toList(m);
};

/** @type function (!Machine):void} */
const toJs = m => {
  ModJs.fromList(m);
};

/** Global symbols. */
export default class ModList {
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

    add("new", snew); // [] - LIST
    add("unary", unary); // [] - LIST
    add("make", make); // <INT, *> - <LIST>

    add("fill", fill); // <LIST, *> - <>
    add("push", push); // [LIST, *] - LIST
    add("push+", pushPlus); // [LIST, *] - []
    add("pop", pop); // LIST - *
    add("peek", peek); // LIST - *
    add("push0", push0); // [LIST, *] - []
    add("push0+", push0Plus); // [LIST, *] - LIST
    add("pop0", pop0); // LIST - *
    add("peek0", peek0); // LIST - *
    add("insert", insert);
    add("insertList", insertList);
    add("remove", remove);
    add("removeRange", removeRange);
    add("clear", clear);
    add("reverse", reverse);
    add("shuffle", shuffle);
    add("sort", sort);

    add("duplicates", duplicates);
    add("all?", all);
    add("any?", any);
    add("each", each);
    add("eachIx", eachIx);
    add("eq?", eq);
    add("neq?", neq);
    add("index", index);
    add("indexf", indexf);
    add("find", find);
    add("lastIndex", lastIndex);
    add("lastIndexf", lastIndexf);
    add("reduce", reduce);

    add("flat", flat);
    add("drop", drop);
    add("dropf", dropf);
    add("filter", filter);
    add("map", map);
    add("take", take);
    add("takef", takef);
    add("zip", zip);
    add("zip3", zip3);
    add("unzip", unzip);
    add("unzip3", unzip3);

    add("sub", sub);
    add("left", left);
    add("right", right);

    add("fromJs", fromJs);
    add("toJs", toJs);

    return r;
  }

  /**
    @param {!Array<!Token>} a
    @return {void}
  **/
  static shuffle (a) {
    let ix = a.length;
    while (ix !== 0) {
      const rix = Math.floor(Math.random() * ix);
      ix -= 1;
      const tmp = a[ix];
      a[ix] = a[rix];
      a[rix] = tmp;
    }
  }

}
