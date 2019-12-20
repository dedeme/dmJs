// Copyright 08-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";

/** Global math. */
export default class ModGlobal0 {
  /**
    @param {!Machine} m
    @return {void}
  **/
  static add (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue + tk.intValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue + tk.intValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.intValue + tk.floatValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue + tk.floatValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }

    tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkString(Tk.popString(m) + tk.stringValue));
      return;
    }

    tk = m.popOpt(Token.LIST);
    if (tk !== null) {
      m.push(Token.mkList(Tk.popList(m).concat(tk.listValue)));
      return;
    }

    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING, Token.LIST]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static add2 (m) {
    const m2 = Machine.isolateProcess("", m._pmachines, m.popExc(Token.LIST));
    const a = m2.stack;
    if (a.length === 0) Fails.listSize(m, a, 1);

    m.push(a[0]);
    for (let i = 1; i < a.length; ++i) {
      m.push(a[i]);
      ModGlobal0.add(m);
    }
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static sub (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue - tk.intValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue - tk.intValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.intValue - tk.floatValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue - tk.floatValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    Fails.types(m, [Token.INT, Token.FLOAT]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static mul (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue * tk.intValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue * tk.intValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.intValue * tk.floatValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue * tk.floatValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    Fails.types(m, [Token.INT, Token.FLOAT]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static div (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue / tk.intValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue / tk.intValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.intValue / tk.floatValue));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkFloat(tk2.floatValue / tk.floatValue));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING, Token.LIST]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static mod (m) {
    const i = Tk.popInt(m);
    const i2 = Tk.popInt(m);
    m.push(Token.mkInt(i2 % i));
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static incr (m) {
    const tk = m.popOpt(Token.INT);
    if (tk !== null) m.push(Token.mkInt(tk.intValue + 1));
    else ModGlobal0.add2(m);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static decr (m) {
    m.push(Token.mkInt(Tk.popInt(m) - 1));
  }
}
