// Copyright 18-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";
import It from "../util/It.js";
import ModList from "./ModList.js";

/**
  @param {!Machine} m
  @return {!It}
**/
function getIt (m) {
  return /** @type {!It<Token>} */(Tk.popNative(m, Symbol.ITERATOR_));
}

/**
  @param {!Machine} m
  @param {!It} it
  @return void
**/
function setIt (m, it) {
  m.push(Token.fromPointer(Symbol.ITERATOR_, it));
}

/** @type function (!Machine):void} */
const snew = m => {
  const prg = m.popExc(Token.LIST);
  const o = m.pop();
  const it = {};
  it[Symbol.iterator] = () => { return {
    "next": function () {
      m.push(o);
      Machine.process("", m.pmachines, prg);
      const a = Tk.popList(m);
      if (a.length > 1) Fails.listSize(m, a, 1);
      return a.length === 0
        ? {"done": true}
        : {"value": a[0], "done": false}
      ;
    }
  }; };

  setIt(m, new It(() => {
    m.push(o);
    Machine.process("", m.pmachines, prg);
    const a = Tk.popList(m);
    if (a.length > 1) Fails.listSize(m, a, 1);
    return a.length === 0 ? null : a[0];
  }));
};

/** @type function (!Machine):void} */
const empty = m => {
  setIt(m, It.empty());
};

/** @type function (!Machine):void} */
const unary = m => {
  setIt(m, It.from([m.pop()]));
};

/** @type function (!Machine):void} */
const range = m => {
  const end = Tk.popInt(m);
  const begin = Tk.popInt(m);
  setIt(m, It.range(begin, end));
};

/** @type function (!Machine):void} */
const range0 = m => {
  const n = Tk.popInt(m);
  setIt(m, It.range(0, n));
};

/** @type function (!Machine):void} */
const sfrom = m => {
  const a = Tk.popList(m);
  setIt(m, It.from(a));
};

/** @type function (!Machine):void} */
const has = m => {
  const it = getIt(m);
  m.push(Token.mkInt(it.has ? 1 : 0));
};

/** @type function (!Machine):void} */
const peek = m => {
  const it = getIt(m);
  if (it.has) m.push(/** @type {!Token} */ (it.peek));
  else m.fail("Iterator is empty");
};

/** @type function (!Machine):void} */
const next = m => {
  const it = getIt(m);
  if (it.has) m.push(/** @type {!Token} */ (it.next()));
  else m.fail("Iterator is empty");
};

/** @type function (!Machine):void} */
const plus = m => {
  const it2 = getIt(m);
  const it = getIt(m);
  setIt(m, it.cat(it2));
};

/** @type function (!Machine):void} */
const push = m => {
  const tk = m.pop();
  const it = getIt(m);
  setIt(m, it.push(tk));
};

/** @type function (!Machine):void} */
const push0 = m => {
  const tk = m.pop();
  const it = getIt(m);
  setIt(m, it.push0(tk));
};

/** @type function (!Machine):void} */
const drop = m => {
  const n = Tk.popInt(m);
  const it = getIt(m);
  setIt(m, it.drop(n));
};

/** @type function (!Machine):void} */
const dropf = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);
  setIt(m, it.dropf(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const filter = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);
  setIt(m, it.filter(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const map = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);
  setIt(m, it.map(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return m.pop();
  }));
};

/** @type function (!Machine):void} */
const take = m => {
  const n = Tk.popInt(m);
  const it = getIt(m);
  setIt(m, it.take(n));
};

/** @type function (!Machine):void} */
const takef = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);
  setIt(m, it.takef(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const zip = m => {
  const it2 = getIt(m);
  const it1 = getIt(m);
  setIt(m, it1.zip(it2));
};

/** @type function (!Machine):void} */
const zip3 = m => {
  const it3 = getIt(m);
  const it2 = getIt(m);
  const it1 = getIt(m);
  setIt(m, it1.zip3(it2, it3));
};

/** @type function (!Machine):void} */
const all = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.all(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const any = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.any(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const count = m => {
  const it = getIt(m);
  m.push(it.count());
};

/** @type function (!Machine):void} */
const duplicates = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.duplicates((tk1, tk2) => {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const each = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  it.each(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
  });
};

/** @type function (!Machine):void} */
const eachIx = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  it.eachIx((tk, i) => {
    m.push(tk);
    m.push(Token.mkInt(i));
    Machine.process("", m.pmachines, prg);
  });
};

/** @type function (!Machine):void} */
const eq = m => {
  const prg = m.popExc(Token.LIST);
  const it1 = getIt(m);
  const it2 = getIt(m);

  m.push(it1.eq(it2, (tk1, tk2) => {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const neq = m => {
  const prg = m.popExc(Token.LIST);
  const it1 = getIt(m);
  const it2 = getIt(m);

  m.push(it1.neq(it2, (tk1, tk2) => {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const equals = m => {
  const it1 = getIt(m);
  const it2 = getIt(m);
  const prg = Token.mkList([Token.mkSymbol(Symbol.mk("=="))]);

  m.push(it1.eq(it2, (tk1, tk2) => {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const notEquals = m => {
  const it1 = getIt(m);
  const it2 = getIt(m);
  const prg = Token.mkList([Token.mkSymbol(Symbol.mk("=="))]);

  m.push(it1.neq(it2, (tk1, tk2) => {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const find = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.find(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const indexf = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.index(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const index = m => {
  const tk = m.pop();
  const it = getIt(m);
  const prg = Token.mkList([tk, Token.mkSymbol(Symbol.mk("=="))]);

  m.push(it.index(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const lastIndexf = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);

  m.push(it.lastIndex(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const lastIndex = m => {
  const tk = m.pop();
  const it = getIt(m);
  const prg = Token.mkList([tk, Token.mkSymbol(Symbol.mk("=="))]);

  m.push(it.lastIndex(tk => {
    m.push(tk);
    Machine.process("", m.pmachines, prg);
    return Boolean(Tk.popInt(m));
  }));
};

/** @type function (!Machine):void} */
const reduce = m => {
  const prg = m.popExc(Token.LIST);
  const tk = m.pop();
  const it = getIt(m);

  m.push(it.reduce(tk, (seed, t) => {
    m.push(seed);
    m.push(t);
    Machine.process("", m.pmachines, prg);
    return m.pop();
  }));
};

/** @type function (!Machine):void} */
const to = m => {
  const it = getIt(m);
  m.push(Token.mkList(it.to()));
};

/** @type function (!Machine):void} */
const reverse = m => {
  const it = getIt(m);
  const a = it.to();
  a.reverse();
  setIt(m, It.from(a));
};

/** @type function (!Machine):void} */
const shuffle = m => {
  const it = getIt(m);
  const a = it.to();
  ModList.shuffle(a);
  setIt(m, It.from(a));
};

/** @type function (!Machine):void} */
const sort = m => {
  const prg = m.popExc(Token.LIST);
  const it = getIt(m);
  const a = it.to();

  function fn (tk1, tk2) {
    m.push(tk1);
    m.push(tk2);
    Machine.process("", m.pmachines, prg);
    return Tk.popInt(m);
  }
  a.sort((tk1, tk2) => fn(tk1, tk2) === 0 ? -1 : 1);
  setIt(m, It.from(a));
};

/** @type function (!Machine):void} */
const box = m => {
  const a = Tk.popList(m);
  if (a.length === 0) Fails.listSize(m, a, 1);

  ModList.shuffle(a);
  let it2 = It.from(a);
  setIt(m, new It(() => {
    if (it2.has) return it2.next();
    ModList.shuffle(a);
    it2 = It.from(a);
    return it2.next();
  }));
};

/** Global symbols. */
export default class ModIt {
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

    add("new", snew);
    add("empty", empty);
    add("unary", unary);
    add("from", sfrom);
    add("range", range);
    add("range0", range0);
    add("has?", has);
    add("peek", peek);
    add("next", next);

    add("+", plus);
    add("drop", drop);
    add("dropf", dropf);
    add("filter", filter);
    add("map", map);
    add("push", push);
    add("push0", push0);
    add("take", take);
    add("takef", takef);
    add("zip", zip);
    add("zip3", zip3);

    add("all?", all);
    add("any?", any);
    add("count", count);
    add("duplicates", duplicates);
    add("each", each);
    add("eachIx", eachIx);
    add("eq?", eq);
    add("neq?", neq);
    add("==", equals);
    add("!=", notEquals);
    add("find", find);
    add("index", index);
    add("indexf", indexf);
    add("lastIndex", lastIndex);
    add("lastIndexf", lastIndexf);
    add("reduce", reduce);
    add("to", to);

    add("shuffle", shuffle);
    add("reverse", reverse);
    add("sort", sort);

    add("box", box);

    return r;
  }
}
