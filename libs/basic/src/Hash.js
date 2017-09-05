// Copyright 02-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("github.dedeme.Hash");

/** @template T */
github.dedeme.Hash = class {
  constructor () {
    /** @private */
    this._object = {}
  }

  /**
   * Returns the subjacent object
   * @template T
   * @return {!Object<string, T>}
   */
  get object () {
    return this._object;
  }

  /** @return {number} */
  get length () {
    return Object.keys(this._object).length;
  }

  /**
   * Get value with key 'k'.<p>
   * If 'k' does no exists 'take' returns 'undefined'. 'take' can return
   * 'null' values.
   * @param {string} k
   * @return {T}
   */
  take (k) {
    return this._object[k];
  }

  /**
   * Sets value to key 'k'. If 'k' already exists is overwritten.
   * @param {string} k
   * @param {T} v
   */
  put (k, v) {
    this._object[k] = v
  }

  /**
   * Removes a key
   * @param {string} k
   */
  del (k) {
    delete this._object[k];
  }

  /** @return {!Array<string>} */
  keys () {
    return Object.keys(this._object)
  }

  /** @return {string} */
  toJson () {
    return JSON.stringify(this._object);
  }

  /**
   * Contructs a Hash from an Object
   * @template T
   * @param {!Object<string, T>} o
   * @return {!github.dedeme.Hash<T>}
   */
  static from (o) {
    let r = new Hash();
    r._object = o;
    return r;
  }

  /**
   * @param {string} s
   * @return {!github.dedeme.Hash<*>}
   */
  static fromJson (s) {
    let o = /** @type {!Object<string, *>} */ (JSON.parse(s));
    return github.dedeme.Hash.from(o);
  }
}
