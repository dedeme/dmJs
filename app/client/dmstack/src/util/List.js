// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
  Linked list.
  @template T
  @implements {Iterable<T>}
**/
export default class List {
  constructor () {
    this._head = null;
    this._tail = null;
  }

  /**
    @template T
    @return {T}
  **/
  get head () {
    if (this._tail === null) throw "List is empty";
    return this._head;
  }

  /**
    @template T
    @return {!List<T>}
  **/
  get tail () {
    if (this._tail === null) throw "List is empty";
    return this._tail;
  }

  /** @return {boolean} */
  isEmpty () {
    return this._tail === null;
  }

  /**
    @param {T} value
    @return {!List<T>}
  **/
  cons (value) {
    const r = new List();
    r._head = value;
    r._tail = this;
    return r;
  }

  /** @return {number} */
  count () {
    let n = 0;
    let l = this; // eslint-disable-line
    while (l._tail !== null) {
      ++n;
      l = l._tail;
    }
    return n;
  }

}

