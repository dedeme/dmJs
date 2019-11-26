// Copyright 09-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/** Global functions. */
export default class ModGlobal2 {
  /**
    @param {!Machine} m
    @return {void}
  **/
  static refGet (m) {
    m.push(/** @type{!Token} */ (Tk.popNative(m, Symbol.REF_)));
  }

  /** @private */
  static refSetBoth (m, isPlus) {
    const value = m.pop();
    const tk = isPlus ? m.peek() : m.pop();
    Tk.nativeValue(m, tk, Symbol.REF_);
    tk.nativeObject = value;
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static refSet (m) {
    ModGlobal2.refSetBoth(m, false);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static refSetPlus (m) {
    ModGlobal2.refSetBoth(m, true);
  }

  /** @private */
  static refUpBoth (m, isPlus) {
    const prg = m.popExc(Token.LIST);
    const tk = m.peek();
    ModGlobal2.refGet(m);

    Machine.process("", m.pmachines, prg);

    const value = m.pop();
    m.push(tk);
    m.push(value);
    ModGlobal2.refSetBoth(m, isPlus);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static refUp (m) {
    ModGlobal2.refUpBoth(m, false);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static refUpPlus (m) {
    ModGlobal2.refUpBoth(m, true);
  }

}
