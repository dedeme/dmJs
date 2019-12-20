// Copyright 30-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Global constants

/** Global constants. */
export default class Global {
  /** @return {string} */
  static get VERSION () { return "201909" }

  /** @return {string} */
  static get ERROR_DMSTACK () { return "dmstackJs" }

  /** @return {number} */
  static get MAX_ERR_STACK () { return 5 }

  /** @return {number} */
  static get MAX_ERR_TRACE () { return 15 }
}
