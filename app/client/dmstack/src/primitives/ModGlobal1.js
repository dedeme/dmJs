// Copyright 09-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";
import Fails from "../Fails.js";

/** Global logic. */
export default class ModGlobal1 {
  /**
    @param {!Machine} m
    @return {void}
  **/
  static and (m) {
    const tk = m.popOpt(Token.LIST);
    if (tk !== null) {
      const i2 = Tk.popInt(m);
      if (i2 !== 0) {
        const m2 = Machine.isolateProcess("", m.pmachines, tk);
        if (m2.stack.length !== 1)
          m.fail(
            "Lazy '&&' stack. Expected size: 1, actual size: " +
            m2.stack.length + "."
          );
        m.push(m2.popExc(Token.INT));
      } else {
        m.push(Token.mkInt(0));
      }
    } else {
      const i1 = Tk.popInt(m);
      const i2 = Tk.popInt(m);
      m.push(Token.mkInt(i1 === 0 || i2 === 0 ? 0 : 1));
    }
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static or (m) {
    const tk = m.popOpt(Token.LIST);
    if (tk !== null) {
      const i2 = Tk.popInt(m);
      if (i2 === 0) {
        const m2 = Machine.isolateProcess("", m.pmachines, tk);
        if (m2.stack.length !== 1)
          m.fail(
            "Lazy '||' stack. Expected size: 1, actual size: " +
            m2.stack.length + "."
          );
        m.push(m2.popExc(Token.INT));
      } else {
        m.push(Token.mkInt(1));
      }
    } else {
      const i1 = Tk.popInt(m);
      const i2 = Tk.popInt(m);
      m.push(Token.mkInt(i1 === 0 && i2 === 0 ? 0 : 1));
    }
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static not (m) {
    const i = Tk.popInt(m);
    m.push(Token.mkInt(i === 0 ? 1 : 0));
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static greater (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue > tk.intValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue > tk.intValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue > tk.floatValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue > tk.floatValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }

    tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkInt(Tk.popString(m) > tk.stringValue ? 1 : 0));
      return;
    }

    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static greaterEq (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue >= tk.intValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue >= tk.intValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue >= tk.floatValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue >= tk.floatValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }

    tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkInt(Tk.popString(m) >= tk.stringValue ? 1 : 0));
      return;
    }

    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static less (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue < tk.intValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue < tk.intValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue < tk.floatValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue < tk.floatValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }

    tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkInt(Tk.popString(m) < tk.stringValue ? 1 : 0));
      return;
    }

    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING]);
  }

  /**
    @param {!Machine} m
    @return {void}
  **/
  static lessEq (m) {
    let tk = m.popOpt(Token.INT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue <= tk.intValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue <= tk.intValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }
    tk = m.popOpt(Token.FLOAT);
    if (tk !== null) {
      let tk2 = m.popOpt(Token.INT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.intValue <= tk.floatValue ? 1 : 0));
        return;
      }
      tk2 = m.popOpt(Token.FLOAT);
      if (tk2 !== null) {
        m.push(Token.mkInt(tk2.floatValue <= tk.floatValue ? 1 : 0));
        return;
      }
      Fails.types(m, [Token.INT, Token.FLOAT]);
    }

    tk = m.popOpt(Token.STRING);
    if (tk !== null) {
      m.push(Token.mkInt(Tk.popString(m) <= tk.stringValue ? 1 : 0));
      return;
    }

    Fails.types(m, [Token.INT, Token.FLOAT, Token.STRING]);
  }
}
