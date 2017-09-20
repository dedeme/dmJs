// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Random utilities */
goog.provide("github.dedeme.Rnd");
goog.require("github.dedeme.It");
goog.require("github.dedeme.Dec");


/** Random generators */
github.dedeme.Rnd = class {
  /**
   * Returns an integer between 0 (inclusive) and [n] (exclusive)
   * @param {number} n Must be > 0, otherwise is changed to 0
   * @return {number}
   */
  static i (n) {
    return Math.floor(Math.random() * (n < 0 ? 0 : n));
  }

  /**
   * Returns a random Dec between [n1] (inclusive) and [n2] (inclusive) with
   * [scale] decimals. ([n2] can be less than [n1])
   * @param {number} n1 A limit
   * @param {number} n2 Another limit
   * @param {number=} scale Must be > 0, otherwise is changed to 0. Its default
   *                  value is 0.
   * @return {!github.dedeme.Dec}
   */
  static dec (n1, n2, scale) {
    scale = scale || 0;
    return github.dedeme.Dec.rnd(
      new github.dedeme.Dec(n1, scale),
      new github.dedeme.Dec(n2, scale)
    );
  }
}
