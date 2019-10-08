// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

let debug = false;

/** Application arguments. */
export default class Args {
  /**
    @param {boolean} debugValue
  **/
  static init (debugValue) {
    debug = debugValue;
  }

  /** @return {boolean} */
  static get debug () {
    return debug;
  }
}
