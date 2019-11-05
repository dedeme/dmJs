// Copyright 09-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";

/** Global functions. */
export default class ModGlobal2 {
  /**
    @param {!Machine} m
    @return {void}
  **/
  static size (m) {
    let tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkInt(tk.stringValue.length));
      return;
    }

    tk = m.popOpt(Token.LIST);
    if (tk !== null) {
      m.push(Token.mkInt(tk.listValue.length));
      return;
    }

    Fails.types(m, [Token.STRING, Token.LIST]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static sget (m) {
    const ix = Tk.popInt(m);
    const a = Tk.popList(m);
    Fails.checkRange(m, 0, a.length - 1, ix);
    m.push(a[ix]);
  }

  /** @private */
  static setBoth (m, isPlus) {
    const value = m.pop();
    const ix = Tk.popInt(m);
    const a = isPlus ? Tk.peekList(m) : Tk.popList(m);
    Fails.checkRange(m, 0, a.length - 1, ix);
    a[ix] = value;
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static sset (m) {
    ModGlobal2.setBoth(m, false);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static setPlus (m) {
    ModGlobal2.setBoth(m, true);
  }

  /** @private */
  static upBoth (m, isPlus) {
    const prg = m.popExc(Token.LIST);
    const ix = m.pop(m);
    const tk = m.peek(m);
    m.push(ix);
    ModGlobal2.sget(m);

    Machine.process("", m.pmachines, prg);

    const value = m.pop();
    m.push(tk);
    m.push(ix);
    m.push(value);
    ModGlobal2.setBoth(m, isPlus);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static up (m) {
    ModGlobal2.upBoth(m, false);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static upPlus (m) {
    ModGlobal2.upBoth(m, true);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static refGet (m) {
    const a = Tk.popList(m);
    if (a.length !== 1) Fails.listSize(m, a, 1);
    m.push(a[0]);
  }

  /** @private */
  static refSetBoth (m, isPlus) {
    const value = m.pop();
    const a = isPlus ? Tk.peekList(m) : Tk.popList(m);
    if (a.length !== 1) Fails.listSize(m, a, 1);
    a[0] = value;
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
