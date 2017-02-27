//- dm/Dec.js
//- dm/It.js
/*
 * Copyright 12-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(() => {
  const Dec = dm.Dec;
  const It = dm.It;

  dm.rnd = {};
  const rnd = dm.rnd;

  class Box {
    /// Object for selecting among a group of elements in random way. When all
    /// elements have been selected, Box is reloaded with elements in different
    /// order.
    ///   es : Elements of Box.
    //# T :: Arr<T> - Box<T>
    constructor (es) {
      this._es = es;
      this._box = It.from(es).shuffle().to();
    }

    /// Returns next random element.
    //# - T
    next () {
      if (this._box.length === 0)
        this._box = It.from(this._es).shuffle().to();
      return this._box.pop();
    }

    /// Returns this in It form. It has not limit of elements
    //# - It<T>
    to () {
      const self = this;
      return new It(() => true, () => self.next());
    }
  }
  dm.Box = Box;

  /// Returns an integer between 0 (inclusive) and n (exclusive)
  ///   n : Must be > 0, otherwise is changed to 0
  //# num - num
  rnd.i = n => Math.floor(Math.random() * (n < 0 ? 0 : n));

  /// Returns a random dm.Dec between n1 (inclusive) and n2 (inclusive) with
  /// 'd' decimals. (n2 can be less than n1)
  ///   d   : Must be > 0, otherwise is changed to 0
  ///   n1  : A limit
  ///   n2  : Another limit
  //# num - num - num - Dec
  rnd.dec = (d, n1, n2) => Dec.rndDec(new Dec(n1, d), new Dec(n2, d));

  /// Returns a Box with repeated elements
  ///   es : Description of box elements. For example:
  ///        new Box [("a", 1),("b", 2)] creates elements "a","b","b".
  //# T :: Arr<Tp<T, num>> - Box<T>
  rnd.mkBox = es => {
    const r = [];
    It.from(es).each(function (e) {
      for (let i = 0; i < e.e2; ++i) r.push(e.e1);
    });
    return r;
  };

})();

