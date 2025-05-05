// Copyright 25-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Ui management */

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import {Heap} from "../Heap.js"; // eslint-disable-line
import Imports from "../Imports.js"; // eslint-disable-line
import Tk from "../Tk.js"; // eslint-disable-line
import Fails from "../Fails.js"; // eslint-disable-line

/**
  @param {!Token} tk
  @param {function ():void} fn
**/
function fail (tk, fn) {
  console.log("Ui error:");
  const pos = tk.pos;
  if (pos !== null)
    console.log(pos.source + ":" + pos.line + ":" + tk.toStringDraft());
  else
    console.log("Runtime:0:" + tk.toStringDraft());
  fn();
}

/** Create a Js Element from a string */
function element (s) {
  return s.charAt(0) === "#"
    ? document.getElementById(s.substring(1))
    : s.charAt(0) === "@"
      ? document.querySelector(s.substring(1))
      : document.createElement(s)
  ;
}

/** Create a token from a Js Element */
function elementTk (element) {
  return Token.fromPointer(Symbol.ELEMENT_, element);
}

/** Checks if a token is an ELEMENT_ */
function isElement (tk) {
  return tk.type === Token.NATIVE && tk.nativeSymbol === Symbol.ELEMENT_;
}

/** Process a token in a isolateProcess an returns its result */
function isolateProcess (m, tk) {
  const prg = tk.type === Token.LIST ? tk : Token.mkList([tk]);
  const m2 = Machine.isolateProcess("", m.pmachines, prg);
  if (m2.stack.length !== 1) fail(tk, () => Fails.listSize(m, m2.stack, 1));
  return m2.stack[0];
}

/** Checks and pop an ELEMENT_ object or null */
function popOptElement (m) {
  const stk = m.stack;
  const len = stk.length;
  if (len === 0) m.fail("Stack is empty");
  return isElement(stk[len - 1]) ? stk.pop() : null;
}

/**
  Read a callback without arguments.
  @param {!Machine} m
  @param {!Token} tk
  @param {!Array<!Token>} atts Symbol - List (program without argument)
  @return {!Array<?>} Array with two elements:
    - {string} ev - Event type: "click", "change", etc.
    - {function ():void} fn - Callback
**/
function event (m, tk, atts) {
  if (atts.length === 0) fail(tk, () => m.fail("Value of 'on' is missing."));
  const tks = Array.from(Tk.listValue(m, atts.shift()));
  if (tks.length !== 2) fail(tk, () => Fails.listSize(m, tks, 2));
  const ev = Symbol.toStr(Tk.symbolValue(m, tks.shift()));
  const prg = tks.shift();
  if (prg.type !== Token.LIST) fail(tk, () => Fails.typeIn(m, Token.LIST, prg));
  function fn () {
    Machine.closureProcess("", m.pmachines, prg);
  }
  return [ev, fn];
}

/**
  Read a callback with an event as argument.
  @param {!Machine} m
  @param {!Token} tk
  @param {!Array<!Token>} atts Symbol - List (program with EVENT_ argument)
  @return {!Array<?>} Array with two elements:
    - {string} ev - Event type: "click", "change", etc.
    - {function (Event):void} fn - Callback
**/

function eventEv (m, tk, atts) {
  if (atts.length === 0) fail(tk, () => m.fail("Value of 'on' is missing."));
  const tks = Array.from(Tk.listValue(m, atts.shift()));
  if (tks.length !== 2) fail(tk, () => Fails.listSize(m, tks, 2));
  const ev = Symbol.toStr(Tk.symbolValue(m, tks.shift()));
  const prg = tks.shift();
  if (prg.type !== Token.LIST) fail(tk, () => Fails.typeIn(m, Token.LIST, prg));
  function fn (ev) {
    const ls = Array.from(prg.listValue);
    ls.unshift(Token.fromPointer(Symbol.EVENT_, ev));
    const p = prg.pos === null
      ? Token.mkList(ls)
      : Token.mkListPos(ls, prg.pos.source, prg.pos.line)
    ;
    Machine.closureProcess("", m.pmachines, p);
  }
  return [ev, fn];
}

/**
  Sets attributes of an Js Element.
  Read a callback with an event as argument.
  @param {!Machine} m
  @param {*} e Js Element.
  @param {!Array<!Token>} atts Token list.
  @return {void}
**/
function attrs (m, tk, e, atts) {
  function read (att, type) {
    if (atts.length === 0)
      fail(tk, () => m.fail("Value of '" + att + "' is missing."));
    const tk2 = isolateProcess(m, atts.shift());
    if (tk2.type !== type)
      fail(tk2, () => m.fail(
        "Expected value of type '" + Token.typeToString(type) +
        "', found '" + tk2.toStringDraft() + "'"
      ));
    return tk2;
  }

  function read2 (att) {
    if (atts.length === 0)
      fail(tk, () => m.fail("Key of '" + att + "' is missing."));
    const key = Symbol.toStr(Tk.symbolValue(m, atts.shift()));
    const value = read(key, Token.STRING).stringValue;
    return [key, value];
  }

  while (atts.length !== 0) {
    const attTk = atts.shift();
    if (attTk.type !== Token.SYMBOL)
      fail(
        tk, () => m.fail("Expected symbol, found '" + attTk.toString() + "'")
      );
    const att = Symbol.toStr(attTk.symbolValue);
    switch (att) {
    case "removeAll":
      e.innerHTML = "";
      break;
    case "focus":
      e.focus();
      break;
    case "style": {
      const tk = read("style", Token.STRING);
      e.setAttribute("style", tk.stringValue);
      break;
    }
    case "text": {
      const tk = read("text", Token.STRING);
      e.textContent = tk.stringValue;
      break;
    }
    case "html": {
      const tk = read("html", Token.STRING);
      e.innerHTML = tk.stringValue;
      break;
    }
    case "class": {
      const tk = read("class", Token.STRING);
      e.className = tk.stringValue;
      break;
    }
    case "value": {
      const tk = read("value", Token.STRING);
      e.value = tk.stringValue;
      break;
    }
    case "checked": {
      const tk = read("checked", Token.INT);
      e.checked = tk.intValue !== 0;
      break;
    }
    case "disabled": {
      const tk = read("disabled", Token.INT);
      e.disabled = tk.intValue !== 0;
      break;
    }
    case "att": {
      const tks = read2("att");
      e.setAttribute(tks[0], tks[1]);
      break;
    }
    case "styleOf": {
      const kv = read2("setStyle");
      e.style[kv[0]] = kv[1];
      break;
    }
    case "on": {
      const evFn = event(m, tk, atts);
      e.addEventListener(evFn[0], evFn[1], false);
      break;
    }
    case "onEv": {
      const evFn = eventEv(m, tk, atts);
      e.addEventListener(evFn[0], evFn[1], false);
      break;
    }
    default: fail(tk, () => m.fail("Unkown attribute '" + att + "'"));
    }
  }
}

/**
  Adds children to a Js Element
  @param {!Machine} m
  @param {*} parent Js Element.
  @param {!Array<!Token>} adds Token list.
  @return {void}
**/
function addEls (m, parent, adds) {
  const m2 = Machine.isolateProcess("", m.pmachines, Token.mkList(adds));
  for (const e of m2.stack) {
    if (!isElement(e))
      fail(e, () => m.fail(
        "Expected token type 'Element', found " + e.toStringDraft()
      ));
    parent.appendChild(Tk.nativeValue(m, e, Symbol.ELEMENT_));
  }
}

/**
  Sets a property of a Js Element.
  @param {!Machine} m
  @param {*} e Js Element.
  @param {!Token} tk Property (Symbol token).
  @return {void}
**/
function prop1 (m, e, tk) {
  const att = Symbol.toStr(Tk.symbolValue(m, tk));
  switch (att) {
  case "removeAll":
    e.innerHTML = "";
    break;
  case "focus":
    e.focus();
    break;
  case "style":
    m.push(Token.mkString(e.getAttribute("style")));
    break;
  case "text":
    m.push(Token.mkString(e.textContent));
    break;
  case "html":
    m.push(Token.mkString(e.innerHTML));
    break;
  case "class":
    m.push(Token.mkString(e.className));
    break;
  case "value":
    m.push(Token.mkString(e.value));
    break;
  case "checked":
    m.push(Token.mkInt(e.checked ? 1 : 0));
    break;
  case "disabled":
    m.push(Token.mkInt(e.disabled ? 1 : 0));
    break;
  default: fail(tk, () => m.fail("Unkown attribute '" + att + "'"));
  }
}

/**
  Sets a property of a Js Element.
  @param {!Machine} m
  @param {*} e Js Element.
  @param {!Token} tk1 Property id (Symbol token).
  @param {!Token} tk2 Property value.
  @return {void}
**/
function prop2 (m, e, tk1, tk2) {
  const att = Symbol.toStr(Tk.symbolValue(m, tk1));
  switch (att) {
  case "att":
    m.push(Token.mkString(
      e.getAttribute(Symbol.toStr(Tk.symbolValue(m, tk2)))
    ));
    break;
  case "styleOf":
    m.push(Token.mkString(
      e.style[Symbol.toStr(Tk.symbolValue(m, tk2))]
    ));
    break;
  case "on": {
    const evFn = event(m, tk1, [tk2]);
    e.addEventListener(evFn[0], evFn[1], false);
    break;
  }
  case "onEv": {
    const evFn = eventEv(m, tk1, [tk2]);
    e.addEventListener(evFn[0], evFn[1], false);
    break;
  }
  default: fail(tk1, () => m.fail("Unkown attribute '" + att + "'"));
  }
}

/** @type function (!Machine):void} */
const dolarPlus = m => {
  const adds = Array.from(Tk.popList(m));
  const atts = Array.from(Tk.popList(m));
  let tk = m.popOpt(Token.STRING);
  if (tk !== null) {
    const e = element(tk.stringValue);
    attrs(m, tk, e, atts);
    addEls(m, e, adds);
    m.push(elementTk(e));
    return;
  }
  tk = popOptElement(m);
  if (tk !== null) {
    const e = tk.nativeObject;
    attrs(m, tk, e, atts);
    addEls(m, e, adds);
    m.push(tk);
    return;
  }

  fail(m.peek(), () => m.fail(
    "Expected 'String' or 'Element', found '" +
    Token.typeToString(m.peek().type) + "'"
  ));
};

/** @type function (!Machine):void} */
const dolar = m => {
  dolarPlus(m);
  m.pop();
};

/** @type function (!Machine):void} */
const mk = m => {
  m.push(elementTk(element(Tk.popString(m))));
};

/** @type function (!Machine):void} */
const prop = m => {
  const tk = m.popExc(Token.LIST);
  const ls = tk.listValue;
  const e = Tk.nativeValue(m, m.pop(), Symbol.ELEMENT_);

  if (ls.length === 1) {
    prop1(m, e, ls[0]);
    return;
  }

  if (ls.length === 2) {
    prop2(m, e, ls[0], ls[1]);
    return;
  }

  fail(tk, () => m.fail(
    "List " + Token.mkList(ls).toString() +
    "\nExpected size: 1 or 2. Actual size: " + ls.length
  ));
};

/** @type function (!Machine):void} */
const addf = m => {
  const adds = Array.from(Tk.popList(m));
  const e = Tk.nativeValue(m, m.pop(), Symbol.ELEMENT_);
  addEls(m, e, adds);
};

/** Ui management. */
export default class ModUi {
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

    add("$", dolar);
    add("$+", dolarPlus);
    add("mk", mk); // [STRING] - [ELEMENT]
    add("prop", prop);
    add("add", addf);

    return r;
  }
}
