// Copyright 15-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/** @type function (!Machine):void} */
const isNull = m => {
  m.push(Token.mkInt(JSON.parse(Tk.popString(m)) === null ? 1 : 0));
};

/** @type function (!Machine):void} */
const rb = m => {
  const v = JSON.parse(Tk.popString(m));
  if (typeof v !== "boolean")
    m.fail("Expected JSON boolean");
  m.push(Token.mkInt(v === true ? 1 : 0));
};

/** @type function (!Machine):void} */
const ri = m => {
  const v = JSON.parse(Tk.popString(m));
  if (typeof v !== "number")
    m.fail("Expected JSON number");
  m.push(Token.mkInt(/** @type {number} */ (v)));
};

/** @type function (!Machine):void} */
const rf = m => {
  const v = JSON.parse(Tk.popString(m));
  if (typeof v !== "number")
    m.fail("Expected JSON number");
  m.push(Token.mkFloat(/** @type {number} */ (v)));
};

/** @type function (!Machine):void} */
const rs = m => {
  const v = JSON.parse(Tk.popString(m));
  if (typeof v !== "string")
    m.fail("Expected JSON string");
  m.push(Token.mkString(/** @type {string} */ (v)));
};

/** @type function (!Machine):void} */
const ra = m => {
  const v = JSON.parse(Tk.popString(m));
  if (!Array.isArray(v))
    m.fail("Expected JSON array");
  m.push(Token.mkList(v.map(s => Token.mkString(JSON.stringify(s)))));
};

/** @type function (!Machine):void} */
const ro = m => {
  const v = /** @type {!Object} */ (JSON.parse(Tk.popString(m)));
  if (typeof v !== "object")
    m.fail("Expected JSON object");
  if (Array.isArray(v))
    m.fail("Expected JSON object");

  const r = {};
  for (const [key, value] of Object.entries(v))
    r[key] = Token.mkString(JSON.stringify(value));
  m.push(Token.fromPointer(Symbol.MAP_, r));
};

/** @type function (!Machine):void} */
const wn = m => {
  m.push(Token.mkString("null"));
};

/** @type function (!Machine):void} */
const wb = m => {
  m.push(Token.mkString(JSON.stringify(Tk.popInt(m) !== 0)));
};

/** @type function (!Machine):void} */
const wi = m => {
  m.push(Token.mkString(JSON.stringify(Tk.popInt(m))));
};

/** @type function (!Machine):void} */
const wf = m => {
  m.push(Token.mkString(JSON.stringify(Tk.popFloat(m))));
};

/** @type function (!Machine):void} */
const ws = m => {
  m.push(Token.mkString(JSON.stringify(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const wa = m => {
  m.push(Token.mkString(JSON.stringify(
    Tk.popList(m).map(tk => JSON.parse(Tk.stringValue(m, tk)))
  )));
};

/** @type function (!Machine):void} */
const wo = m => {
  const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));

  const o = {};
  for (const [key, value] of Object.entries(mp))
    o[key] = JSON.parse(Tk.stringValue(m, value));
  m.push(Token.mkString(JSON.stringify(o)));
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

    add("null?", isNull); // STRING - INT
    add("rb", rb); // STRING - INT
    add("ri", ri); // STRING - INT
    add("rf", rf); // STRING - FLOAT
    add("rs", rs); // STRING - STRING
    add("ra", ra); // STRING - LIST
    add("ro", ro); // STRING - MAP

    add("wn", wn); // INT - STRING
    add("wb", wb); // INT - STRING
    add("wi", wi); // INT - STRING
    add("wf", wf); // FLOAT - STRING
    add("ws", ws); // STRING - STRING
    add("wa", wa); // LIST - STRING
    add("wo", wo); // MAP- STRING

    add("fromList", ModJs.fromList); // LIST - STRING
    add("toList", ModJs.toList); // STRING - LIST
    add("fromMap", ModJs.fromMap); // MAP - STRING
    add("toMap", ModJs.toMap); // STRING - MAP

    return r;
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static fromList (m) {
    const prg = m.popExc(Token.LIST);
    const r = [];
    for (const tk of Tk.popList(m)) {
      m.push(tk);
      Machine.process("", m.pmachines, prg);
      r.push(m.pop());
    }
    m.push(Token.mkList(r));

    wa(m);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static toList (m) {
    const prg = m.popExc(Token.LIST);
    ra(m);
    const r = [];
    for (const tk of Tk.popList(m)) {
      m.push(tk);
      Machine.process("", m.pmachines, prg);
      r.push(m.pop());
    }
    m.push(Token.mkList(r));
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static fromMap (m) {
    const prg = m.popExc(Token.LIST);
    const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
    const r = {};
    for (const [key, value] of Object.entries(mp)) {
      m.push(value);
      Machine.process("", m.pmachines, prg);
      r[key] = m.pop();
    }
    m.push(Token.fromPointer(Symbol.MAP_, r));
    wo(m);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static toMap (m) {
    const prg = m.popExc(Token.LIST);
    ro(m);
    const mp = /** @type {!Object} */ (Tk.popNative(m, Symbol.MAP_));
    const r = {};
    for (const [key, value] of Object.entries(mp)) {
      m.push(value);
      Machine.process("", m.pmachines, prg);
      r[key] = m.pop();
    }
    m.push(Token.fromPointer(Symbol.MAP_, r));
  }
}
