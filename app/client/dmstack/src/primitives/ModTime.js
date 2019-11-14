// Copyright 23-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

function fmt (dt, tpl) {
  function cut (s, n) { return s.substring(s.length - n) }
  function fn2 (n) { return cut("0" + n, 2) }
  function fn4 (n) { return cut("0" + n, 4) }
  function replace (s, sold, snew) { return s.split(sold).join(snew) }

  let r = replace(tpl, "%Y", fn4(dt.getFullYear()));
  r = replace(r, "%y", fn2(dt.getFullYear() - 2000));
  r = replace(r, "%m", fn2(dt.getMonth() + 1));
  r = replace(r, "%d", fn2(dt.getDate()));
  r = replace(r, "%H", fn2(dt.getHours()));
  r = replace(r, "%M", fn2(dt.getMinutes()));
  r = replace(r, "%S", fn2(dt.getSeconds()));
  r = replace(r, "%%", "%");
  return r;
}

function rdg (s, ix, n) {
  let end = n + ix;
  if (end > s.length) end = s.length;
  let bf = "";
  while (
    ix < end &&
    s.charAt(ix) >= "0" &&
    s.charAt(ix) <= "9"
  ) bf += s.charAt(ix++);

  if (bf === "") return [null, null];
  return [Number(bf), ix];
}

function dfrom (dt, tpl) {
  const dtLen = dt.length;
  const tplLen = tpl.length;
  let dtIx = 0;
  let tplIx = 0;
  const r = new Date();
  r.setHours(12);
  r.setMinutes(0);
  r.setSeconds(0);
  r.setMilliseconds(0);

  while (dtIx < dtLen && tplIx < tplLen) {
    const tplc = tpl.charAt(tplIx++);
    if (tplc === "%") {
      const tplc = tpl.charAt(tplIx++);
      if (tplc === "%") {
        if (dt.charAt(dtIx++) !== "%") return null;
      } else {
        let v = 0;
        switch (tplc) {
        case "Y":
          [v, dtIx] = rdg(dt, dtIx, 4);
          if (v === null) return null;
          r.setFullYear(v);
          break;
        case "y":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setFullYear(2000 + v);
          break;
        case "m":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setMonth(v - 1);
          break;
        case "d":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setDate(v);
          break;
        case "H":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setHours(v);
          break;
        case "M":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setMinutes(v);
          break;
        case "S":
          [v, dtIx] = rdg(dt, dtIx, 2);
          if (v === null) return null;
          r.setSeconds(v);
          break;
        default: return null;
        }
      }
    } else if (tplc !== dt.charAt(dtIx++)) {
      return null;
    }
  }

  return r.getTime();
}

/** @type function (!Machine):void} */
const snew = m => {
  const sec = Tk.popInt(m);
  const min = Tk.popInt(m);
  const hour = Tk.popInt(m);
  const day = Tk.popInt(m);
  const month = Tk.popInt(m);
  const year = Tk.popInt(m);
  m.push(Token.mkFloat(new Date(
    year, month - 1, day, hour, min, sec, 0
  ).getTime()));
};

/** @type function (!Machine):void} */
const newDate = m => {
  const day = Tk.popInt(m);
  const month = Tk.popInt(m);
  const year = Tk.popInt(m);
  m.push(Token.mkFloat(new Date(
    year, month - 1, day, 12, 0, 0, 0
  ).getTime()));
};

/** @type function (!Machine):void} */
const now = m => {
  m.push(Token.mkFloat(new Date().getTime()));
};

/** @type function (!Machine):void} */
const broke = m => {
  const dt = new Date(Tk.popFloat(m));
  m.push(Token.fromPointer(Symbol.MAP_, {
    "year": Token.mkInt(dt.getFullYear()),
    "month": Token.mkInt(dt.getMonth() + 1),
    "day": Token.mkInt(dt.getDate()),
    "hour": Token.mkInt(dt.getHours()),
    "minute": Token.mkInt(dt.getMinutes()),
    "second": Token.mkInt(dt.getSeconds())
  }));
};

/** @type function (!Machine):void} */
const fromStr = m => {
  const fm = Tk.popString(m);
  const dt = Tk.popString(m);
  const r = dfrom(dt, fm);
  m.push(Token.mkList(r === null ? [] : [Token.mkFloat(r)]));
};

/** @type function (!Machine):void} */
const fromDate = m => {
  const dt = Tk.popString(m);
  const r = dfrom(dt, "%Y%m%d");
  m.push(Token.mkList(r === null ? [] : [Token.mkFloat(r)]));
};

/** @type function (!Machine):void} */
const toDate = m => {
  const dt = new Date(Tk.popFloat(m));
  m.push(Token.mkString(fmt(dt, "%Y%m%d")));
};

/** @type function (!Machine):void} */
const toTime = m => {
  const dt = new Date(Tk.popFloat(m));
  m.push(Token.mkString(fmt(dt, "%H:%M:%S")));
};

/** @type function (!Machine):void} */
const toDateTime = m => {
  const dt = new Date(Tk.popFloat(m));
  m.push(Token.mkString(fmt(dt, "%Y%m%d%H%M%S")));
};

/** @type function (!Machine):void} */
const format = m => {
  const fm = Tk.popString(m);
  const dt = new Date(Tk.popFloat(m));
  m.push(Token.mkString(fmt(dt, fm)));
};

/** @type function (!Machine):void} */
const addd = m => {
  const days = Tk.popInt(m);
  const dt = new Date(Tk.popFloat(m));
  dt.setDate(dt.getDate() + days);

  m.push(Token.mkFloat(dt.getTime()));
};

/** @type function (!Machine):void} */
const df = m => {
  const dt2 = Tk.popFloat(m);
  const dt1 = Tk.popFloat(m);
  let r = (dt1 - dt2) / 1000;
  r = r >= 0 ? r + 0.5 : r - 0.5;
  m.push(Token.mkInt(r));
};

/** @type function (!Machine):void} */
const sadd = m => {
  const secs = Tk.popInt(m);
  const dt = Tk.popFloat(m);
  m.push(Token.mkFloat(dt + secs * 1000));
};

/** @type function (!Machine):void} */
const dfd = m => {
  const dt2 = Tk.popFloat(m);
  const dt1 = Tk.popFloat(m);
  let r = (dt1 - dt2) / 86400000;
  r = r >= 0 ? r + 0.5 : r - 0.5;
  m.push(Token.mkInt(r));
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

    // [INT, INT, INT, INT, INT, INT] - INT
    // [year, month, day, hour, min, sec] - date
    // Note: hour is without daylight saving
    add("new", snew);
    // [INT, INT, INT] - INT
    // [year, month, day] - date
    add("newDate", newDate);
    // [STRING, STRING] - OPT<INT>
    // [date, template] - option of date
    add("fromStr", fromStr);
    add("fromDate", fromDate); // STRING - INT
    add("toDate", toDate); // INT - STRING
    add("toTime", toTime); // INT - STRING
    add("toDateTime", toDateTime); // INT - STRING
    // [INT - STRING] - STRING
    // [date, template] - date */
    add("format", format);

    add("now", now); // [] - INT
    add("broke", broke); // INT - MAP
    add("add", sadd); // [INT - INT] - INT  - In seconds (date + secs.)
    add("df", df); // [INT - INT] - INT  - In seconds (date - date) = secs.
    add("addDays", addd); // [INT - INT] - INT (date + days)
    add("dfDays", dfd); // [INT - INT] - INT (date - date) = days

    return r;
  }
}
