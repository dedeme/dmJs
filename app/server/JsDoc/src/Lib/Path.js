// Copyright 17-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Path");

Path = class {
  /**
   * @param {string} id
   * @param {string} path
   * @param {boolean} show
   */
  constructor (id, path, show) {
    /**
     * @private
     * @type {string}
     */
    this._id = id;
    /**
     * @private
     * @type {string}
     */
    this._path = path;
    /**
     * @private
     * @type {boolean}
     */
    this._show = show;
    /**
     * @private
     * @type {boolean}
     */
    this._valid = true;
  }

  /** @return {string} */
  id () {
    return this._id;
  }

  /** @param {string} value */
  setId (value) {
    this._id = value;
  }

  /** @return {string} */
  path () {
    return this._path;
  }

  /** @param {string} value */
  setPath (value) {
    this._path = value;
  }

  /** @return {boolean} */
  show () {
    return this._show;
  }

  /** @param {boolean} value */
  setShow (value) {
    this._show = value;
  }

  /** @return {boolean} */
  valid () {
    return this._valid;
  }

  /** @param {boolean} value */
  setValid (value) {
    this._valid = value;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [this._id, this._path, this._show];
  }

  /**
   * @param {!Array<?>} s
   */
  static restore (s) {
    return new Path(s[0], s[1], s[2]);
  }
}

