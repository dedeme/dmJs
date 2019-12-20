// Copyright 19-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";

/** @type function (!Machine):void} */
const cmp = m => {
  const s2 = Tk.popString(m);
  const s1 = Tk.popString(m);
  m.push(Token.mkInt(s1.localeCompare(s2)));
};

/** @type function (!Machine):void} */
const ends = m => {
  const sub = Tk.popString(m);
  m.push(Token.mkInt(Tk.popString(m).endsWith(sub) ? 1 : 0));
};

/** @type function (!Machine):void} */
const fromUtf8 = m => {
  m.push(Token.mkString(decodeURIComponent(escape(Tk.popString(m)))));
};

/** @type function (!Machine):void} */
const greater = m => {
  const s2 = Tk.popString(m);
  const s1 = Tk.popString(m);
  m.push(Token.mkInt(s1.localeCompare(s2) > 0 ? 1 : 0));
};

/** @type function (!Machine):void} */
const index = m => {
  const sub = Tk.popString(m);
  m.push(Token.mkInt(Tk.popString(m).indexOf(sub)));
};

/** @type function (!Machine):void} */
const indexFrom = m => {
  const ix = Tk.popInt(m);
  const sub = Tk.popString(m);
  m.push(Token.mkInt(Tk.popString(m).indexOf(sub, ix)));
};

/** @type function (!Machine):void} */
const lastIndex = m => {
  const sub = Tk.popString(m);
  m.push(Token.mkInt(Tk.popString(m).lastIndexOf(sub)));
};

/** @type function (!Machine):void} */
const join = m => {
  const sep = Tk.popString(m);
  const a = Tk.popList(m);
  let r = "";
  let first = true;
  for (const tk of a) {
    if (first) first = false;
    else r += sep;
    r += Tk.stringValue(m, tk);
  }
  m.push(Token.mkString(r));
};

/** @type function (!Machine):void} */
const replace = m => {
  const news = Tk.popString(m);
  const olds = Tk.popString(m);
  const s = Tk.popString(m);
  m.push(Token.mkString(s.split(olds).join(news)));
};

/** @type function (!Machine):void} */
const split = m => {
  const sep = Tk.popString(m);
  const s = Tk.popString(m);
  const r = [];
  for (const sub of s.split(sep))
    r.push(Token.mkString(sub));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const splitTrim = m => {
  const sep = Tk.popString(m);
  const s = Tk.popString(m);
  const r = [];
  for (const sub of s.split(sep))
    r.push(Token.mkString(sub.trim()));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const starts = m => {
  const sub = Tk.popString(m);
  m.push(Token.mkInt(Tk.popString(m).startsWith(sub) ? 1 : 0));
};

/** @type function (!Machine):void} */
const reverse = m => {
  m.push(Token.mkString(Tk.popString(m).split("").reverse().join("")));
};

/** @type function (!Machine):void} */
const trim = m => {
  m.push(Token.mkString(Tk.popString(m).trim()));
};

/** @type function (!Machine):void} */
const ltrim = m => {
  m.push(Token.mkString(Tk.popString(m).replace(/^[\s\uFEFF\xA0]+/, "")));
};

/** @type function (!Machine):void} */
const rtrim = m => {
  m.push(Token.mkString(Tk.popString(m).replace(/[\s\uFEFF\xA0]+$/, "")));
};

/** @type function (!Machine):void} */
const toUtf8 = m => {
  m.push(Token.mkString(unescape(encodeURIComponent(Tk.popString(m)))));
};

/** @type function (!Machine):void} */
const toLower = m => {
  m.push(Token.mkString(Tk.popString(m).toLowerCase()));
};

/** @type function (!Machine):void} */
const toUpper = m => {
  m.push(Token.mkString(Tk.popString(m).toUpperCase()));
};

/** @type function (!Machine):void} */
const sget = m => {
  const ix = Tk.popInt(m);
  const s = Tk.popString(m);
  Fails.checkRange(m, 0, s.length, ix);
  m.push(Token.mkString(s.charAt(ix)));
};

/** @type function (!Machine):void} */
const len = m => {
  const s = Tk.popString(m);
  m.push(Token.mkInt(s.length));
};

function subaux (m, begin, end, isRight) {
  function bounds (size) {
    if (isRight) end = size;
    if (begin < 0) begin = size + begin;
    if (begin < 0 || begin > size) Fails.range(m, 0, size, begin);
    if (end < 0) end = size + end;
    if (end < 0 || end > size) Fails.range(m, 0, size, end);
    if (end < begin) end = begin;
  }

  const s = Tk.popString(m);
  bounds(s.length);
  m.push(Token.mkString(s.substring(begin, end)));
}

/** @type function (!Machine):void} */
const sub = m => {
  const end = Tk.popInt(m);
  const begin = Tk.popInt(m);
  subaux(m, begin, end, false);
};

/** @type function (!Machine):void} */
const left = m => {
  const end = Tk.popInt(m);
  subaux(m, 0, end, false);
};

/** @type function (!Machine):void} */
const right = m => {
  const begin = Tk.popInt(m);
  subaux(m, begin, 0, true);
};

/** @type function (!Machine):void} */
const code = m => {
  const s = Tk.popString(m);
  if (s.length === 0) m.fail("String is empty");
  m.push(Token.mkInt(s.charCodeAt(0)));
};

/** @type function (!Machine):void} */
const fromCode = m => {
  m.push(Token.mkString(String.fromCharCode(Tk.popInt(m))));
};

/** @type function (!Machine):void} */
const isDigits = m => {
  const s = Tk.popString(m);
  let r = 1;
  for (let i = 0; i < s.length; ++i) {
    const ch = s.charAt(i);
    if (ch < "0" || ch > "9") {
      r = 0;
      break;
    }
  }
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const isNumber = m => {
  const s = Tk.popString(m);
  m.push(Token.mkInt(isNaN(s) ? 0 : 1));
};

/** @type function (!Machine):void} */
const riso = m => {
  const s = Tk.popString(m);
  m.push(Token.mkString(s.replace(/\./g, "").replace(/,/g, ".")));
};

/** @type function (!Machine):void} */
const rus = m => {
  const s = Tk.popString(m);
  m.push(Token.mkString(s.replace(/,/g, "")));
};

/** Global symbols. */
export default class ModStr {
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

    add("cmp", cmp); // in locale
    add("ends?", ends);
    add("fromUtf8", fromUtf8);
    add("greater?", greater); // in locale
    add("index", index);
    add("indexFrom", indexFrom);
    add("lastIndex", lastIndex);
    add("join", join);
    add("replace", replace);
    add("split", split);
    add("splitTrim", splitTrim);
    add("starts?", starts);
    add("reverse", reverse);
    add("trim", trim);
    add("ltrim", ltrim);
    add("rtrim", rtrim);
    add("toLower", toLower);
    add("toUtf8", toUtf8);
    add("toUpper", toUpper);

    add("get", sget);
    add("len", len);
    add("sub", sub);
    add("left", left);
    add("right", right);
    add("code", code);
    add("fromCode", fromCode);

    add("digits?", isDigits);
    add("number?", isNumber);
    add("regularizeIso", riso);
    add("regularizeUs", rus);

    return r;
  }
}
