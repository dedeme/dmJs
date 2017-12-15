// Copyright 10-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Flea");

goog.require("Stat");
goog.require("Gen");
goog.require("families_MovingAverage");
goog.require("families_WmovingAverage");

Flea = class {
  /**
   * @param {number} id
   * @param {number} cycle
   * @param {number} family
   * @param {number} bet
   * @param {number} ibex
   * @param {number} mutability
   * @param {!Stat} stats
   * @param {?} extraData
   */
  constructor (id, cycle, family, bet, ibex, mutability, stats, extraData) {
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
    this._mutability = mutability;
    /** @private */
    this._stats = stats;
    /**
     * @private
     * @type {?}
     */
    this._extraData = extraData;

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

  /** @return {number} */
  mutability () {
    return this._mutability;
  }

  /** @return {!Stat} */
  stats () {
    return this._stats;
  }

  /** @return {?} */
  extraData () {
    return this._extraData;
  }

  /**
   * @param {!Array<?>} serial
   * @return {!Flea}
   */
  static restore (serial) {
    function gen (g) {
      return Gen.restore(g).actualOption();
    }
    function extra (family) {
      switch (family) {
        case FleasData.movingAverage(): return new families_MovingAverage(
            gen(serial[7]), gen(serial[8]), gen(serial[9])
          );
        case FleasData.wmovingAverage(): return new families_WmovingAverage(
            gen(serial[7]), gen(serial[8]), gen(serial[9])
          );
        default: return null;
      }
    }

    const family = gen(serial[2])

    return new Flea (
      serial[0],
      serial[1],

      family,
      gen(serial[3]),
      gen(serial[4]),
      gen(serial[5]),

      Stat.restore(serial[6]),

      extra(family)
    );
  }
}

