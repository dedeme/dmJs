// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Error message handler. */
export default class Either {
  /**
    @template T
    @private
    @param {string} left
    @param {T} right
  **/
  constructor (left, right) {
    this._left = left;
    this._right = right;
  }

  /** @return {string} */
  get left () { return this._left }

  /**
    @template T
    @return {T}
  **/
  get right () { return this._right }

  /**
    @param {string}  error
    @return {!Either}
  **/
  static mkLeft (error) {
    return new Either(error, null);
  }

  /**
    @template T
    @param {T} value
    @return {!Either}
  **/
  static mkRight (value) {
    return new Either("", value);
  }
}
