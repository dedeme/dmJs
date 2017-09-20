// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// (Extends Tp) Tuple of three elements
goog.provide("github.dedeme.Tp3")

goog.require("github.dedeme.Tp")

/**
 * @extends {github.dedeme.Tp}
 * @template A, B, C
 */
github.dedeme.Tp3 = class extends github.dedeme.Tp {
  /**
   * @param {A} e1
   * @param {B} e2
   * @param {C} e3
   */
  constructor (e1, e2, e3) {
    super(e1, e2);
    /** @private */
    this._e3 = e3;
  }

  /** @return {C} */
  e3 () {
    return this._e3;
  }

  /** @param {C} value */
  setE3 (value) {
    this._e3 = value
  }
}
