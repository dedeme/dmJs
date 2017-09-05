// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Tuples

goog.provide("github.dedeme.Tp")
goog.provide("github.dedeme.Tp3")

/// Tuple of two elements
github.dedeme.Tp = class {
  /**
   * @param {?} e1
   * @param {?} e2
   */
  constructor (e1, e2) {
    this.e1 = e1;
    this.e2 = e2;
  }
}

/// Tuple of three elements
github.dedeme.Tp3 = class extends github.dedeme.Tp {
  /**
   * @param {?} e1
   * @param {?} e2
   * @param {?} e3
   */
  constructor (e1, e2, e3) {
    super(e1, e2);
    this.e3 = e3;
  }
}
