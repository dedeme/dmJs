// Copyright 28-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/** @type function (!Machine):void} */
const clear = m => { // eslint-disable-line
  window.localStorage.clear();
};

/** @type function (!Machine):void} */
const del = m => {
  window.localStorage.removeItem(Tk.popString(m));
};

/** @type function (!Machine):void} */
const expires = m => {
  const time = Tk.popInt(m);
  const keys = Tk.popList(m);
  const tKey = Tk.popString(m);

  const dt = new Date(Date.now()).getTime();
  const ks = window.localStorage.getItem(tKey);
  if (ks === "null" || dt > Number(ks))
    keys.forEach(k => window.localStorage.removeItem(Tk.stringValue(m, k)));
  window.localStorage.setItem(tKey, String(dt + time * 3600000));
};

/** @type function (!Machine):void} */
const take = m => {
  const r = window.localStorage.getItem(Tk.popString(m));
  m.push(Token.fromPointer(
    Symbol.OPTION_, r === null ? null : Token.mkString(r)
  ));
};

/** @type function (!Machine):void} */
const key = m => {
  const r = window.localStorage.key(Tk.popInt(m));
  m.push(Token.mkList(r === null ? [] : [Token.mkString(r)]));
};

/** @type function (!Machine):void} */
const keys = m => {
  const r = [];
  for (let i = 0; i < window.localStorage.length; ++i)
    r.push(Token.mkString(
      /** @type {string} */ (window.localStorage.key(i))
    ));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const put = m => {
  const value = Tk.popString(m);
  const key = Tk.popString(m);
  window.localStorage.setItem(key, value);
};

/** @type function (!Machine):void} */
const size = m => {
  m.push(Token.mkInt(window.localStorage.length));
};

/** @type function (!Machine):void} */
const values = m => {
  const r = [];
  for (let i = 0; i < window.localStorage.length; ++i)
    r.push(Token.mkString(
      /** @type {string} */ (window.localStorage.getItem(
        /** @type {string} */ (window.localStorage.key(i))
      ))
    ));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const sessionClear = m => { // eslint-disable-line
  window.sessionStorage.clear();
};

/** @type function (!Machine):void} */
const sessionDel = m => {
  window.sessionStorage.removeItem(Tk.popString(m));
};

/** @type function (!Machine):void} */
const sessionTake = m => {
  const r = window.sessionStorage.getItem(Tk.popString(m));
  m.push(Token.fromPointer(
    Symbol.OPTION_, r === null ? null : Token.mkString(r)
  ));
};

/** @type function (!Machine):void} */
const sessionKey = m => {
  const r = window.sessionStorage.key(Tk.popInt(m));
  m.push(Token.mkList(r === null ? [] : [Token.mkString(r)]));
};

/** @type function (!Machine):void} */
const sessionKeys = m => {
  const r = [];
  for (let i = 0; i < window.sessionStorage.length; ++i)
    r.push(Token.mkString(
      /** @type {string} */ (window.sessionStorage.key(i))
    ));
  m.push(Token.mkList(r));
};

/** @type function (!Machine):void} */
const sessionPut = m => {
  const value = Tk.popString(m);
  const key = Tk.popString(m);
  window.sessionStorage.setItem(key, value);
};

/** @type function (!Machine):void} */
const sessionSize = m => {
  m.push(Token.mkInt(window.sessionStorage.length));
};

/** @type function (!Machine):void} */
const sessionValues = m => {
  const r = [];
  for (let i = 0; i < window.sessionStorage.length; ++i)
    r.push(Token.mkString(
      /** @type {string} */ (window.sessionStorage.getItem(
        /** @type {string} */ (window.sessionStorage.key(i))
      ))
    ));
  m.push(Token.mkList(r));
};

/** Global symbols. */
export default class ModStore {
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

    add("clear", clear);
    add("del", del);
    add("expires", expires);
    add("take", take);
    add("key", key);
    add("keys", keys);
    add("put", put);
    add("size", size);
    add("values", values);

    add("sessionClear", sessionClear);
    add("sessionDel", sessionDel);
    add("sessionTake", sessionTake);
    add("sessionKey", sessionKey);
    add("sessionKeys", sessionKeys);
    add("sessionPut", sessionPut);
    add("sessionSize", sessionSize);
    add("sessionValues", sessionValues);

    return r;
  }
}
