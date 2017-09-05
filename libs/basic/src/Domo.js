// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Class for envelopping DOM objects */
goog.provide("github.dedeme.Domo");
goog.require("github.dedeme.It");

github.dedeme.Domo = class {
  /** @param {*} e */
  constructor (e) {
    this._e = e;
  }

  /** @return {*} */
  get e () {
    return this._e;
  }

  /**
   * @param {string=} tx
   * @return {!github.dedeme.Domo | string}
   */
  html (tx) {
    if (tx === undefined) return this._e.innerHTML;
    this._e.innerHTML = tx;
    return this;
  }

  /**
   * @param {string=} tx
   * @return {!github.dedeme.Domo | string}
   */
  text (tx) {
    if (tx === undefined) return this._e.textContent;
    this._e.textContent = tx;
    return this;
  }

  /**
   * @param {string=} tx
   * @return {!github.dedeme.Domo | string}
   */
  klass (tx) {
    if (tx === undefined) return this._e.className;
    this._e.className = tx;
    return this;
  }

  /**
   * @param {string=} s
   * @return {!github.dedeme.Domo | string}
   */
  style (s) {
    if (s === undefined) return this._e.getAttribute("style");
    this._e.setAttribute("style", s);
    return this;
  }
  ///

  //# str - * - Domo || str -  - *
  /**
   * @param {string} key
   * @param {? | undefined} value
   * @return {!github.dedeme.Domo | ?}
   */
  att (key, value) {
    if (value === undefined) return this._e.getAttribute(key);
    this._e.setAttribute(key, value);
    return this;
  }

  /**
   * @param {boolean=} value
   * @return {!github.dedeme.Domo | boolean}
   */
  disabled (value) {
    if (value === undefined) return this._e.disabled;
    this._e.disabled = value;
    return this;
  }

  /**
   * @param {boolean=} value
   * @return {!github.dedeme.Domo | boolean}
   */
  checked (value) {
    if (value === undefined) return this._e.checked;
    this._e.checked = value;
    return this;
  }

  /**
   * @param {?=} v
   * @return {!github.dedeme.Domo | ?}
   */
  value (v) {
    if (v === undefined) return this._e.value;
    this._e.value = v;
    return this;
  }

  /**
   * Appends a child element.
   * @param {!github.dedeme.Domo} el
   * @return {!github.dedeme.Domo}
   */
  add (el) {
    this._e.appendChild(el._e);
    return this;
  }

  /**
   * Adds an iterator over elements.
   * @param {github.dedeme.It<!github.dedeme.Domo>} els
   * @return {!github.dedeme.Domo}
   */
  addIt (els) {
    els.each(el => {
      this._e.appendChild(el.e);
    });
    return this;
  }

  /**
   * Removes a child element.
   * @param {!github.dedeme.Domo} el
   * @return {!github.dedeme.Domo}
   */
  remove (el) {
    this._e.removeChild(el.e);
    return this;
  }

  /**
   * Removes every child element.
   * @return {!github.dedeme.Domo}
   */
  removeAll () {
    this._e.innerHTML = "";
    return this;
  }

  /**
   * Iterator over child elements.
   * @return {github.dedeme.It<!github.dedeme.Domo>}
   */
  nodes () {
    let nextNode = this._e.firstChild;
    return new github.dedeme.It(
      () => nextNode !== null,
      () => {
        const r = nextNode;
        nextNode = nextNode.nextSibling;
        return new github.dedeme.Domo(r);
      }
    );
  }

  /**
   * @param {string} event It can be one of: "blur", "change", "click",
   *        "dblclick", "focus", "keydown", "keypress", "keyup", "load",
   *        "mousedown", "mousemove", "mouseout", "mouseover", "mouseup",
   *        "mouseweel", "select", "selectstart" or "submit".
   * @param {function (*)} action
   * @return {!github.dedeme.Domo}
   */
  on (event, action) {
    this._e.addEventListener(event, action, false);
    return this;
  }
}

