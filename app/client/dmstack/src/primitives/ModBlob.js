// Copyright 08-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";
import B64 from "../util/B64.js";


/** @type function (!Machine):void} */
const snew = m => {
  m.push(Token.fromPointer(Symbol.BLOB_, new Uint8Array(Tk.popInt(m))));
};

/** @type function (!Machine):void} */
const make = m => {
  const size = Tk.popInt(m);
  const value = Tk.popInt(m);
  const bs = new Uint8Array(size);
  bs.fill(value, 0, size);
  m.push(Token.fromPointer(Symbol.BLOB_, bs));
};

/** @type function (!Machine):void} */
const fill = m => {
  const value = Tk.popInt(m);
  const bs = Tk.popNative(m, Symbol.BLOB_);
  bs.fill(value, 0, bs.length);
};

/** @type function (!Machine):void} */
const sfrom = m => {
  m.push(Token.fromPointer(
    Symbol.BLOB_,
    Uint8Array.from(Tk.popList(m).map(tk => Tk.intValue(m, tk)))
  ));
};

/** @type function (!Machine):void} */
const sget = m => {
  const ix = Tk.popInt(m);
  const bs = Tk.popNative(m, Symbol.BLOB_);
  Fails.checkRange(m, 0, bs.length - 1, ix);
  m.push(Token.mkInt(bs[ix]));
};

const setBoth = (m, isPlus) => {
  const value = Tk.popInt(m);
  const ix = Tk.popInt(m);
  const bs = isPlus
    ? Tk.peekNative(m, Symbol.BLOB_)
    : Tk.popNative(m, Symbol.BLOB_)
  ;
  Fails.checkRange(m, 0, bs.length - 1, ix);

  bs[ix] = value;
};

/** @type function (!Machine):void} */
const sset = m => {
  setBoth(m, false);
};

/** @type function (!Machine):void} */
const setPlus = m => {
  setBoth(m, true);
};

const upBoth = (m, isPlus) => {
  const prg = m.popExc(Token.LIST);
  const ixTk = m.pop();
  const bsTk = m.peek();
  m.push(ixTk);
  sget(m);

  Machine.process("", m.pmachines, prg);

  const valueTk = m.pop();
  m.push(bsTk);
  m.push(ixTk);
  m.push(valueTk);
  setBoth(m, isPlus);
};

/** @type function (!Machine):void} */
const up = m => {
  upBoth(m, false);
};

/** @type function (!Machine):void} */
const upPlus = m => {
  upBoth(m, true);
};

/** @type function (!Machine):void} */
const size = m => {
  const bs = Tk.popNative(m, Symbol.BLOB_);
  m.push(Token.mkInt(bs.length));
};

const bseq = (bs1, bs2) => {
  const sz = bs1.length;
  if (bs2.length !== sz) return 0;
  for (let i = 0; i < sz; ++i) if (bs1[i] !== bs2[i]) return 0;
  return 1;
};

/** @type function (!Machine):void} */
const equals = m => {
  const bs2 = Tk.popNative(m, Symbol.BLOB_);
  const bs1 = Tk.popNative(m, Symbol.BLOB_);
  m.push(Token.mkInt(bseq(bs1, bs2)));
};

/** @type function (!Machine):void} */
const notEquals = m => {
  const bs2 = Tk.popNative(m, Symbol.BLOB_);
  const bs1 = Tk.popNative(m, Symbol.BLOB_);
  m.push(Token.mkInt(bseq(bs1, bs2) === 0 ? 1 : 0));
};

/** @type function (!Machine):void} */
const to = m => {
  const bs = Tk.popNative(m, Symbol.BLOB_);
  const a = [];
  bs.forEach(n => a.push(Token.mkInt(n)));
  m.push(Token.mkList(a));
};

const subaux = (m, begin, end, is_right) => {
  function bounds (size) {
    if (is_right) end = size;
    if (begin < 0) begin = size + begin;
    if (begin < 0 || begin > size) Fails.range(m, 0, size, begin);
    if (end < 0) end = size + end;
    if (end < 0 || end > size) Fails.range(m, 0, size, end);
  }

  const bs = Tk.popNative(m, Symbol.BLOB_);
  bounds(bs.length);
  m.push(Token.fromPointer(Symbol.BLOB_, bs.slice(begin, end)));
};

/** @type function (!Machine):void} */
const sub = m => {
  const end = Tk.popInt(m);
  const begin = Tk.popInt(m);
  subaux(m, begin, end, false);
};

/** @type function (!Machine):void} */
const left = m => {
  const cut = Tk.popInt(m);
  subaux(m, 0, cut, false);
};

/** @type function (!Machine):void} */
const right = m => {
  const cut = Tk.popInt(m);
  subaux(m, cut, 0, true);
};

/** @type function (!Machine):void} */
const copy = m => {
  const bs = Tk.popNative(m, Symbol.BLOB_);
  m.push(Token.fromPointer(Symbol.BLOB_, bs.slice(0, bs.length)));
};

/** @type function (!Machine):void} */
const plus = m => {
  const bs2 = Tk.popNative(m, Symbol.BLOB_);
  const bs1 = Tk.popNative(m, Symbol.BLOB_);
  const bsc = new Uint8Array(bs1.length + bs2.length);
  let c = 0;
  for (let i = 0; i < bs1.length; ++i) bsc[c++] = bs1[i];
  for (let i = 0; i < bs2.length; ++i) bsc[c++] = bs2[i];
  m.push(Token.fromPointer(Symbol.BLOB_, bsc));
};

/** @type function (!Machine):void} */
const fromJs = m => {
  const bs = B64.decodeBytes(
    /** @type {string} */ (JSON.parse(Tk.popString(m)))
  );
  m.push(Token.fromPointer(Symbol.BLOB_, bs));
};

/** @type function (!Machine):void} */
const toJs = m => {
  const bs = /** @type {!Uint8Array} */(Tk.popNative(m, Symbol.BLOB_));
  m.push(Token.mkString(JSON.stringify(B64.encodeBytes(bs))));
};

/** Global symbols. */
export default class ModBlob {
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

    add("new", snew); // INT - BLOB
    add("make", make); // <INT, INT> - <BLOB>  (value, size) - (blob)
    add("fill", fill); // <BLOB, INT> - <BLOB>
    add("from", sfrom); // LIST - BLOB
    add("get", sget); // [BLOB, INT] - INT
    add("set", sset); // [BLOB, INT, INT] - []
    add("set+", setPlus); // [BLOB, INT, INT] - [BLOB]
    add("up", up); // [BLOB, INT, LIST] - []
    add("up+", upPlus); // [BLOB, INT, LIST] - [BLOB]

    add("size", size); // BLOB - INT
    add("==", equals); // [BLOB, BLOB] - INT
    add("!=", notEquals); // [BLOB, BLOB] - INT

    add("to", to); // BLOB - LIST
    add("sub", sub); // [BLOB, INT, INT] - [BLOB]
    add("left", left); // [BLOB, INT] - [BLOB]
    add("right", right); // [BLOB, INT] - [BLOB]*/
    add("copy", copy); // [BLOB] - [BLOB]
    add("+", plus); // [BLOB, BLOB] - [BLOB]

    add("fromJs", fromJs); // STRING - BLOB
    add("toJs", toJs); // BLOB - STRING

    return r;
  }
}
