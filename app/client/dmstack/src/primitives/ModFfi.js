// Copyright 13-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line
import Fails from "../Fails.js"; // eslint-disable-line
import List from "../util/List.js"; // eslint-disable-line

function tkValue (tk) {
  switch (tk.type) {
  case Token.INT: return tk.intValue;
  case Token.FLOAT: return tk.floatValue;
  case Token.STRING: return tk.stringValue;
  case Token.LIST: return tk.listValue.map(t => tkValue(t));
  case Token.SYMBOL: return Symbol.toStr(tk.symbolValue);
  case Token.NATIVE: return tk.nativeObject;
  }
  throw new Error("Switch not exhaustive.");
}

function value (m, ls) {
  let tk = null;
  const jsVars = [];
  const jsValues = [];
  for (;;) {
    if (ls.length === 0) break;
    tk = ls.shift();
    if (tk.type === Token.STRING) break;
    if (tk.type !== Token.SYMBOL) Fails.typeIn(m, Token.SYMBOL, tk);
    jsVars.push(Symbol.toStr(tk.symbolValue));
    jsValues.push(tkValue(m.pop()));
  }
  if (tk === null) Fails.listSize(m, ls.toArray(), 1);
  if (tk.type !== Token.STRING) m.fail("FFI string is missing.");
  jsVars.reverse();
  const js = "(" + jsVars.join(", ") + ") => {\n" +
    tk.stringValue + "\n}\n";
  try {
    const fn = eval(js);
    /** @suppress {checkTypes} */
    const r = fn(...jsValues);
    return r;
  } catch (e) {
    m.fail(e.message);
    return null;
  }
}

/** @type function (!Machine):void} */
const v = m => {
  const ls = Array.from(Tk.popList(m));
  value(m, ls);
  if (ls.length > 0) m.fail("Extra data at end of ffi procedure");
};

/** @type function (!Machine):void} */
const i = m => {
  const ls = Array.from(Tk.popList(m));
  const /** number */ r = value(m, ls);
  if (ls.length > 0) m.fail("Extra data at end of ffi procedure");
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const f = m => {
  const ls = Array.from(Tk.popList(m));
  const /** number */ r = value(m, ls);
  if (ls.length > 0) m.fail("Extra data at end of ffi procedure");
  m.push(Token.mkFloat(r));
};

/** @type function (!Machine):void} */
const s = m => {
  const ls = Array.from(Tk.popList(m));
  const /** string */ r = value(m, ls);
  if (ls.length > 0) m.fail("Extra data at end of ffi procedure");
  m.push(Token.mkString(r));
};

/** @type function (!Machine):void} */
const o = m => {
  const ls = Array.from(Tk.popList(m));
  const r = value(m, ls);
  if (ls.length === 0) m.fail("Expected object type at end of ffi procedure");
  if (ls.length > 1) m.fail("Extra data at end of ffi procedure");
  const tk = ls[0];
  if (tk.type !== Token.SYMBOL) Fails.typeIn(m, Token.SYMBOL, tk);
  m.push(Token.fromPointer(Symbol.mk("= " + Symbol.toStr(tk.symbolValue)), r));
};

/** @type function (!Machine):void} */
const fn = m => {
  const prg = m.popExc(Token.LIST);
  const fn = () => {
    Machine.closureProcess("", m.pmachines, prg);
  };
  m.push(Token.fromPointer(Symbol.CLOSURE_, fn));
};

/** Global symbols. */
export default class ModFfi {
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

    add("v", v);
    add("i", i);
    add("f", f);
    add("s", s);
    add("o", o);
    add("fn", fn);

    return r;
  }
}
