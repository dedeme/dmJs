// Copyright 10-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Flea");

goog.require("Stat");
goog.require("Gen");
goog.require("families_BuyAndHold");
goog.require("families_MovingAverage");
goog.require("families_WmovingAverage");
goog.require("families_Rsi");

Flea = class {
  /**
   * @param {number} id
   * @param {number} cycle
   * @param {number} family
   * @param {number} bet
   * @param {number} ibex
   * @param {!Stat} stats
   * @param {!Family} extra
   */
  constructor (id, cycle, family, bet, ibex, stats, extra) {
    /** @private */
    this._id = id;
    /** @private */
    this._cycle = cycle;
    /** @private */
    this._family = family;
    /** @private */
    this._bet = bet;
    /** @private */
    this._ibex = ibex;
    /** @private */
    this._stats = stats;
    /**
     * @private
     * @type {!Family}
     */
    this._extra = extra;
  }

  /** @return {number} */
  id () {
    return this._id;
  }

  /** @return {number} */
  cycle () {
    return this._cycle;
  }

  /** @return {number} */
  family () {
    return this._family;
  }

  /** @return {number} */
  bet () {
    return this._bet;
  }

  /** @return {number} */
  ibex () {
    return this._ibex;
  }

  /** @return {!Stat} */
  stats () {
    return this._stats;
  }

  /** @return {!Family} */
  extra () {
    return this._extra;
  }

  /**
   * @param {!Array<?>} serial
   * @return {Flea}
   */
  static restore (serial) {
    function gen (g) {
      return Gen.restore(g).actualOption();
    }
    function extra(family) {
      switch (family) {
        case Flea.buyAndHold(): return new families_BuyAndHold(
          ).mkFamily();
        case Flea.movingAverage(): return new families_MovingAverage(
            gen(serial[6][0]), gen(serial[6][1]), gen(serial[6][2])
          ).mkFamily();
        case Flea.wmovingAverage(): return new families_WmovingAverage(
            gen(serial[6][0]), gen(serial[6][1]), gen(serial[6][2])
          ).mkFamily();
        case Flea.rsi(): return new families_Rsi(
            gen(serial[6][0]), gen(serial[6][1]), gen(serial[6][2]),
            gen(serial[6][3])
          ).mkFamily();
        default: throw ("'" + family + "': Unkon family");
      }
    }

    if (serial === null) {
      return null;
    }

    const family = gen(serial[2])

    return new Flea (
      serial[0],
      serial[1],

      family,
      gen(serial[3]),
      gen(serial[4]),

      Stat.restore(serial[5]),

      extra(family)
    );
  }

  /** @return {number} */
  static buyAndHold () {
    return 0;
  }

  /** @return {number} */
  static movingAverage () {
    return 1;
  }

  /** @return {number} */
  static wmovingAverage () {
    return 2;
  }

  /** @return {number} */
  static rsi () {
    return 3;
  }

  /** @return {number} */
  static familyNumber () {
    return 4;
  }

  /**
   * @param {number} family
   * @return {string}
   */
  static familyNames(family) {
    switch(family) {
    case Flea.buyAndHold(): return "BuyAndHold";
    case Flea.movingAverage(): return "MovingAverage";
    case Flea.wmovingAverage(): return "WmovingAverage";
    case Flea.rsi(): return "Rsi";
    default: throw ("'" + family + "': Unkon family");
    }
  }

}

