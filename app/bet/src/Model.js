// Copyright 13-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Store from "./dmjs/Store.js";
import Dec from "./dmjs/Dec.js";

/**
 * @param {!Array<!Array<number>>} matrix Equations system
 * @return {!Array<number>} Solutions
 */
function solve (matrix) {
  const len = matrix.length;
  if (len === 1) {
    return [-matrix[0][1] / matrix[0][0]];
  }
  const ec0 = matrix[0];
  const ec00 = ec0[0];
  const subMatrix = [];
  for (let i = 1; i < len; ++i) {
    const ec = matrix[i];
    const m = ec[0] / ec00;
    const subEc = [];
    for (let j = 1; j < len + 1; ++j) {
      subEc.push(ec0[j] * m - ec[j]);
    }
    subMatrix.push(subEc);
  }
  const r = solve(subMatrix);
  let sum = 0;
  let i = 1;
  for (;i < len; ++i) {
    sum += ec0[i] * r[i - 1];
  }
  sum += ec0[i];
  r.unshift(-sum / ec00);
  return r;
}

export default class Model {
  constructor () {
    /**
     * @private
     * @type {string}
     */
    this._version = "201801";
    /**
     * @private
     * @type {string}
     */
    this._appName = "DmBet";

  }

  /** @return {string} Version*/
  version () {
    return this._version;
  }

  /** @return {string} Name*/
  appName () {
    return this._appName;
  }

  /** @return {string} Lang */
  lang () {
    return Store.take("bet_lang") ? "en" : "es";
  }

  /**
   * @param {string} value Value
   * @return {void}
   */
  setLang (value) {
    if (value === "en") {
      Store.put("bet_lang", "en");
    } else {
      Store.del("bet_lang");
    }
  }

  /** @return {number} Bet options*/
  options () {
    const r = Store.take("bet_options");
    return r ? Number(r) : 3;
  }

  /**
   * @param {number} value Bet options
   * @return {void}
   */
  setOptions (value) {
    if (value !== 3) {
      Store.put("bet_options", String(value));
    } else {
      Store.del("bet_options");
    }
  }

  /**
   * Returns % of profits
   * @param {!Array<number>} values Bet values
   * @return {!Dec} Result
   */
  calculate (values) {
    /** Test
    const matrix = [
      [3, 1, 5, 7, 7, 22, 2],
      [1, 2, 3, 4, 6, 43, 12],
      [7, 8, -1, 45, 3, -5, 5],
      [-1, 2, 12, 34, 11, 3, -1],
      [1, 11, -11, 6, 7, -6, 2],
      [5, 2, 8, 4, 5, 23, -6]
    ];
    const rtest = solve(matrix);
    console.log(rtest);
    const lg = rtest.length;
    It.range(lg).each(i => {
      console.log(new Dec(
        It.range(lg).reduce(0, (s, j) => s + rtest[j] * matrix[i][j]), 2
      ).toString())
    });
    */
    const matrix = [];
    for (let i = 0; i < values.length; ++i) {
      const a = [];
      for (let j = 0; j < values.length; ++j) {
        a.push(j === i ? (values[i] - 1) : -1);
      }
      a.push(1);
      matrix.push(a);
    }

    const solMatrix = solve(matrix);
    let sum = 0;
    for (let i = 0; i < solMatrix.length; ++i) {
      sum += solMatrix[i];
    }
    //console.log(solMatrix);
    //console.log(sum);
    return new Dec(100 / sum, 2);
  }

}
