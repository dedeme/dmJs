// Copyright 31-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Global from "./Global.js";
import Machine from "./Machine.js"; // eslint-disable-line

/** Exception. */
export default class Exception {
  /**
    @param {!Machine} m
    @param {string} type
    @return {string} msg
  **/
  static raise (m, type, msg) {
    throw (Error(Global.ERROR_DMSTACK + "|" + JSON.stringify([
      type, msg, m.stackTrace
    ])));
  }

  /**
    @param {!Error} e
    @return {boolean}
  */
  static isDmStack (e) {
    const ps = e.message.split("|");
    return ps.length > 0 && ps[0] === Global.ERROR_DMSTACK;
  }

  /**
    @param {!Error} e
    @return {string}
  */
  static type (e) {
    if (Exception.isDmStack(e)) {
      const ps = JSON.parse(e.message.split("|")[1]);
      return ps[0];
    }
    return "JsError";
  }

  /**
    @param {!Error} e
    @return {string}
  */
  static msg (e) {
    if (Exception.isDmStack(e)) {
      const ps = JSON.parse(e.message.split("|")[1]);
      return ps[1];
    }
    return e.message;
  }

  /**
    @param {!Error} e
    @return {string}
  */
  static stack (e) {
    if (Exception.isDmStack(e)) {
      const ps = JSON.parse(e.message.split("|")[1]);
      return ps[2];
    }
    return e.stack;
  }

}
