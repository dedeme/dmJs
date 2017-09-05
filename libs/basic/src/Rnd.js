// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Random utilities */
goog.provide("github.dedeme.Box");
goog.provide("github.dedeme.Rnd");
goog.require("github.dedeme.It");
goog.require("github.dedeme.Dec");

/**
 * Object for selecting among a group of elements in random way. When all
 * elements have been selected, Box is reloaded with elements in different
 * order.
 * @template T
 */
github.dedeme.Box = class {

  /** @param {!Array<T>} es Elements of Box */
  constructor (es) {
    /** @private */
    this._es = es;
    /** @private */
    this._box = github.dedeme.It.from(es).shuffle().to();
  }

  /**
   * Returns next random element.
   * @return {T}
   */
  next () {
    if (this._box.length === 0)
      this._box = github.dedeme.It.from(this._es).shuffle().to();
    return this._box.pop();
  }

  /**
   * Returns [this] in It form. It has not limit of elements.
   * @return {!github.dedeme.It<T>}
   */
  to () {
    const self = this;
    return new github.dedeme.It(() => true, () => self.next());
  }
}

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

  /**
   * Returns a Box with repeated elements
   * @template T
   * @param {!Array<!Tp<T, number>>} es Description of box elements.
   *        For example:
   *        new Box [("a", 1),("b", 2)] creates elements "a","b","b".
   * @return {!github.dedeme.Box<T>}
   */
  static mkBox (es) {
    const r = [];
    It.from(es).each(function (e) {
      for (let i = 0; i < e.e2; ++i) r.push(e.e1);
    });
    return new github.dedeme.Box(r);
  };
}
