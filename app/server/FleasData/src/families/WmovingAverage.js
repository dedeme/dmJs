// Copyright 10-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("families_WmovingAverage");

families_WmovingAverage = class {
  /**
   * @param {number} len
   * @param {number} buyStrip
   * @param {number} sellStrip
   */
  constructor (len, buyStrip, sellStrip) {
    /** @private */
    this._len = len;
    /** @private */
    this._buyStrip = buyStrip;
    /** @private */
    this._sellStrip = sellStrip;
  }

  /** @return {number} */
  id () {
    return FleasData.wmovingAverage();
  }

  /** @return {number} */
  len () {
    return this._len;
  }

  /** @return {number} */
  buyStrip () {
    return this._buyStrip;
  }

  /** @return {number} */
  sellStrip () {
    return this._sellStrip;
  }

}
