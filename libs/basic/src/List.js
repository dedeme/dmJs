// Copyright 02-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Inmutable container

goog.provide("github.dedeme.List");

/** @template T */
github.dedeme.List = class {
  constructor () {
    this._head = undefined;
    this._tail = null;
  }

  /**
   * Returns the first element or 'undefined' if 'this' is empty. It can
   * retuns a 'null' value.
   * @template T
   * @return {T | null | undefined}
   */
  get head () {
    return this._head;
  }

  /**
   * Returns all elements of this but the first one or 'null' if 'this' is
   * empty.
   * @template T
   * @return {?github.dedeme.List<T>}
   */
  get tail () {
    return this._tail;
  }

  /**
   * Returns a new List with 'e' adds at the head of 'this'
   * @param {T} e
   * @return {!github.dedeme.List<T>}
   */
  cons (e) {
    let r = new github.dedeme.List;
    r._head = e;
    r._tail = this;
    return r;
  }

  /** @return {!github.dedeme.List<T>} */
  reverse () {
    let r = new github.dedeme.List;
    let l = this;
    while (l.tail !== null) {
      r = r.cons(l.head);
      l = l.tail;
    }
    return r;
  }
}
