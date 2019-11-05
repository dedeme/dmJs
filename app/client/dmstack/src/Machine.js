// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import Global from "./Global.js";
import {Heap, HeapEntry} from "./Heap.js"; // eslint-disable-line
import Imports from "./Imports.js";
import Fails from "./Fails.js";
import List from "./util/List.js"; // eslint-disable-line
import Token from "./Token.js";
import {Symbol} from "./Symbol.js";
import Reader from "./Reader.js";
import Primitives from "./Primitives.js";
import Types from "./Types.js";
import Path from "./util/Path.js";

/** Virtual machine. */
export default class Machine {
  /**
    @param {string} source
    @param {!List<!Machine>} pmachines
    @param {!Token} prg
  **/
  constructor (source, pmachines, prg) {
    this._source = source;
    this._pmachines = pmachines.cons(this);
    /** @type {!Array<!Token>} */
    this._stack = [];
    /** @type {!Array<!HeapEntry>} */
    this._heap = Heap.mk();
    this._prg = prg;
    this._ix = 0;
  }

  /** @return {string} */
  get source () {
    if (this._source !== "") return this._source;
    let pms = this._pmachines;
    while (pms.head._source === "") pms = pms.tail;
    return pms.head._source;
  }

  /** @return {!List<!Machine>} */
  get pmachines () { return this._pmachines }

  /** @return {!Array<!Token>} */
  get stack () { return this._stack }

  /** @return {!Array<!HeapEntry>} */
  get heap () { return this._heap }

  /** @return {string} */
  get stackTrace () {
    let r = "  Stack:\n";
    const a = Array.from(this._stack);
    if (a.length === 0) {
      r += "    [EMPTY]\n";
    } else {
      r += "    ";
      let c = 0;
      while (a.length !== 0 && c < Global.MAX_ERR_STACK) {
        r += a.pop().toStringDraft() + " ";
        ++c;
      }
      r += "\n";
    }

    let c = 0;
    let ms = this._pmachines;
    while (!ms.isEmpty()) {
      if (c >= Global.MAX_ERR_TRACE) break;
      ++c;

      const m = ms.head;
      const tk = m._prg.listValue[m._ix];
      const pos = tk.pos;
      if (pos !== null) {
        r += pos.source + ":" + pos.line + ":" + tk.toStringDraft() + "\n";
      } else {
        r += "Runtime:0:" + tk.toStringDraft() + "\n";
      }

      ms = ms.tail;
    }

    return r;
  }


  // Private -------------------------------------------------------------------

  /** @private */
  _eval () {
    const prg = this.popExc(Token.STRING).stringValue;
    const r = new Reader("[EVAL]", prg);
    Machine.process("", this._pmachines, r.process());
  }

  /** @private */
  _run () {
    Machine.process("", this._pmachines, this.popExc(Token.LIST));
  }

  /**
    @private
    @param {string} module
  **/
  _runMod (module) {
    const runner = Token.mkList([
      this.popExc(Token.LIST), Token.mkSymbol(Symbol.mk("run"))
    ]);
    Machine.process(module + ".dms", this._pmachines, runner);
  }

  /** @private */
  _mrun () {
    const a = this.popExc(Token.LIST).listValue;
    const module = a[0].symbolValue;
    const fn = a[1].symbolValue;
    const f = Primitives.take(module, fn);
    if (fn === null)
      this.fail("Symbol " + Symbol.toStr(module) + " not found");
    f(this);
  }

  /** @private */
  _data () {
    const prg = this.popExc(Token.LIST);
    const m = Machine.isolateProcess("", this._pmachines, prg);
    this.push(Token.mkList(m._stack));
  }

  /** @private */
  _elif () {
    const prgNot = this.popExc(Token.LIST);
    const prgYes = this.popExc(Token.LIST);
    if (this.popExc(Token.INT).intValue)
      Machine.process("", this._pmachines, prgYes);
    else
      Machine.process("", this._pmachines, prgNot);
  }

  /** @private */
  _if () {
    const prg = this.popOpt(Token.LIST);
    if (prg !== null) {
      const tk = this.popOpt(Token.INT);
      if (tk !== null) {
        if (tk.intValue !== 0) Machine.process("", this._pmachines, prg);
        return;
      }
    } else {
      const tk = this.peekOpt(Token.SYMBOL);
      if (tk === null || tk.symbolValue !== Symbol.ELSE)
        this.fail("Expected List or 'else'");
    }

    const a = [];
    let tk = this.peekOpt(Token.SYMBOL);
    while (tk !== null && tk.symbolValue === Symbol.ELSE) {
      this.pop();
      a.push(this.popExc(Token.LIST));
      a.push(this.popExc(Token.LIST));
      tk = this._stack.length > 0 ? this.peekOpt(Token.SYMBOL) : null;
    }

    if (a.length > 0) {
      let rprg = true;
      while (a.length > 0) {
        Machine.process("", this._pmachines, a.pop());
        if (this.popExc(Token.INT).intValue !== 0) {
          Machine.process("", this._pmachines, a.pop());
          rprg = false;
          break;
        }
        a.pop();
      }
      if (rprg && prg !== null) Machine.process("", this._pmachines, prg);
    } else if (prg === null) {
      this.fail("Expected List");
    }
  }

  /** @private */
  _loop () {
    const prg = this.popExc(Token.LIST);

    for (;;) {
      Machine.process("", this._pmachines, prg);
      if (this._stack.length > 0) {
        const tk = this.peekOpt(Token.SYMBOL);
        if ((tk !== null) && tk.symbolValue === Symbol.BREAK) {
          this.pop();
          break;
        }
      }
    }
  }

  /** @private */
  _while () {
    const prg = this.popExc(Token.LIST);
    const cond = this.popExc(Token.LIST);

    for (;;) {
      Machine.process("", this._pmachines, cond);
      if (this.popExc(Token.INT).intValue !== 0) {
        Machine.process("", this._pmachines, prg);
        if (this._stack.length > 0) {
          const tk = this.peekOpt(Token.SYMBOL);
          if (tk !== null && tk.symbolValue === Symbol.BREAK) {
            this.pop();
            break;
          }
        }
      } else {
        break;
      }
    }
  }

  /** @private */
  _for () {
    const prg = this.popExc(Token.LIST);
    let cond = this.popOpt(Token.INT);
    if (cond !== null) {
      for (let i = 0; i < cond.intValue; ++i) {
        this.push(Token.mkInt(i));
        Machine.process("", this._pmachines, prg);
        if (this._stack.length > 0) {
          const tk = this.peekOpt(Token.SYMBOL);
          if (tk !== null && tk.symbolValue === Symbol.BREAK) {
            this.pop();
            break;
          }
        }
      }
      return;
    }

    cond = this.popOpt(Token.LIST);

    if (cond === null) {
      Fails.types(this, [Token.INT, Token.LIST]);
      throw "Unreachable";
    }

    const m2 = Machine.isolateProcess("", this._pmachines, cond);

    const a = m2._stack;
    const size = a.length;
    if (size < 1) this.fail("Expected al least one one value in 'for'");
    if (size > 4) this.fail("Expected as much three values in 'for'");

    const tk = a[0];
    if (tk.type !== Token.INT)
      this.fail("Expected an Int as first value in 'for'");

    let begin = tk.intValue;
    let end = begin;
    if (size > 1) {
      const tk = a[1];
      if (tk.type !== Token.INT)
        this.fail("Expected an Int as second value in 'for'");
      end = tk.intValue;
    } else {
      begin = 0;
    }
    let step = 1;
    if (size === 3) {
      const tk = a[2];
      if (tk.type !== Token.INT)
        this.fail("Expected an Int as third value in 'for'");
      step = tk.intValue;
      if (step === 0) this.fail("No valid '0' value as step in 'for'");
    }

    for (;;) {
      if (step > 0 && begin >= end) break;
      else if (step < 0 && begin <= end) break;
      this.push(Token.mkInt(begin));
      Machine.process("", this._pmachines, prg);
      if (this._stack.length > 0) {
        const tk = this.peekOpt(Token.SYMBOL);
        if (tk !== null && tk.symbolValue === Symbol.BREAK) {
          this.pop();
          break;
        }
      }
      begin += step;
    }
  }

  /** @private */
  _recursive () {
    const prg = this.popExc(Token.LIST);

    for (;;) {
      Machine.process("", this._pmachines, prg);
      if (this._stack.length > 0) {
        const tk = this.peekOpt(Token.SYMBOL);
        if (tk !== null && tk.symbolValue === Symbol.CONTINUE) {
          this.pop();
          continue;
        }
      }
      break;
    }
  }

  /** @private */
  _import () {
    const errorSymKv = Imports.readSymbol(this.pop());
    if (errorSymKv.left !== "") this.fail(errorSymKv.left);
    const source = errorSymKv.right.value;

    const sid = Symbol.toStr(source);
    const f = Path.canonical(
      Path.cat([Path.parent(this.source), sid + ".dms"])
    );
    const fid = f.substring(0, f.length - 4);
    const ssource = Symbol.mk(fid);

    const prg = Imports.takeCache(ssource);
    if (prg === null) throw "In Machine.import: 'prg' is null.";
    const m = Machine.isolateProcess(f, this._pmachines, prg);
    Imports.add(ssource, m._heap);
  }

  // Public --------------------------------------------------------------------

  /**
    @param {string} source
    @param {!List<!Machine>} pmachines
    @param {!Token} prg
    @return {!Machine}
  **/
  static process (source, pmachines, prg) {
    const m = new Machine(source, pmachines, prg);
    if (!pmachines.isEmpty()) m._stack = pmachines.head._stack;

    m.cprocess();
    return m;
  }

  /**
    @param {string} source
    @param {!List<!Machine>} pmachines
    @param {!Token} prg
    @return {!Machine}
  **/
  static isolateProcess (source, pmachines, prg) {
    const m = new Machine(source, pmachines, prg);
    if (source !== "")
      Imports.add(Symbol.mk(source.substring(0, source.length - 4)), m._heap);

    m.cprocess();
    return m;
  }

  /**
    @private
    @return {void}
  **/
  _assert () {
    if (this.popExc(Token.INT).intValue === 1) return;
    console.log("Assert error:" + (this._pmachines.count() + 1) + ":");
    console.log(this.stackTrace);
    throw "Assert error";
  }

  /**
    @private
    @return {void}
  **/
  _expect () {
    const expect = this.pop();
    const actual = this.pop();
    if (expect.eq(actual)) return;
    console.log(
      "Expect error:" + (this._pmachines.count() + 1) + ":" +
      "\n  Expected: " + expect.toStringDraft() +
      "\n  Actual  : " + actual.toStringDraft()
    );
    console.log(this.stackTrace);
    throw "Expect error";
  }

  /**
    @param {string | Error} msg
    @return {void}
  **/
  fail (msg) {
    console.log("Runtime error:" + (this._pmachines.count() + 1) + ": " + msg);
    console.log(this.stackTrace);
    throw "Runtime error";
  }

  /**
    @param {!Token} tk
    @return {void}
  **/
  push (tk) {
    this._stack.push(tk);
  }

  /** @return {!Token} */
  peek () {
    const stk = this._stack;
    const ix = stk.length - 1;
    if (ix === -1)
      this.fail("Stack is empty");
    return stk[ix];
  }

  /**
    @param {number} type Token type
    @return {!Token}
  */
  peekExc (type) {
    const stk = this._stack;
    const ix = stk.length - 1;
    if (ix === -1)
      this.fail("Stack is empty");
    const tk = stk[ix];
    if (tk.type !== type)
      Fails.type(this, type);
    return tk;
  }

  /**
    @param {number} type Token type
    @return {Token}
  */
  peekOpt (type) {
    const stk = this._stack;
    const ix = stk.length - 1;
    if (ix === -1)
      this.fail("Stack is empty");
    const tk = stk[ix];
    return tk.type === type ? tk : null;
  }

  /** @return {!Token} */
  pop () {
    const tk = this._stack.pop();
    if (tk === undefined)
      this.fail("Stack is empty");
    return tk;
  }

  /**
    @param {number} type Token type
    @return {!Token}
  */
  popExc (type) {
    const tk = this._stack.pop();
    if (tk === undefined)
      this.fail("Stack is empty");
    if (tk.type !== type)
      Fails.type(this, type);
    return tk;
  }

  /**
    @param {number} type Token type
    @return {Token}
  */
  popOpt (type) {
    const stk = this._stack;
    const len = stk.length;
    if (len === 0) this.fail("Stack is empty");
    const tk = stk[len - 1];
    return tk.type === type ? stk.pop() : null;
  }

  cprocess () {
    let module = -1; // Symbol
    let moduleh = null; // Array<HeapEntry>
    let sym = -1; // Symbol

    const prg = this._prg.listValue;
    for (let ix = 0; ix < prg.length; ++ix) {
      this._ix = ix;
      const tk = prg[ix];
      if (sym !== -1) {
        let t = null;
        if (moduleh !== null) {
          t = Heap.take(moduleh, sym);
          if (t !== null) {
            if (t.type === Token.SYMBOL) {
              const symbol = t.symbolValue;
              if (symbol === Symbol.EQUALS || symbol === Symbol.FUNCTION)
                this.fail("Imported symbols can not be set");
              if (symbol === Symbol.AMPERSAND) {
                this._stack.push(t);
                module = -1;
                moduleh = null;
                sym = -1;
                continue;
              }
            }
          } else {
            --this._ix;
            this.fail(
              "Symbol " + Symbol.toStr(module) + "," +
              Symbol.toStr(sym) + " not found"
            );
          }
        } else {
          t = Heap.take(this._heap, sym);
          if (t === null) t = Heap.take(Imports.base, sym);
          if (t !== null) {
            if (tk.type === Token.SYMBOL) {
              const symbol = tk.symbolValue;
              if (symbol === Symbol.EQUALS) {
                const tk = this.pop();
                if (tk.type === Token.LIST) {
                  const ch = Symbol.toStr(sym).charAt(0);
                  if (ch < "A" || ch > "Z")
                    this.fail(
                      "List or object name must start with uppercase [A-Z]"
                    );
                }
                Heap.add(this._heap, sym, tk);
                sym = -1;
                continue;
              }
              if (symbol === Symbol.FUNCTION) {
                const tk = this.pop();
                if (tk.type !== Token.LIST)
                  this.fail("Symbol => not used with function");
                const ch = Symbol.toStr(sym).charAt(0);
                if (ch >= "A" && ch <= "Z")
                  this.fail(
                    "Function must name not start with uppercase [A-Z]"
                  );
                Heap.add(this._heap, sym, tk);
                sym = -1;
                continue;
              }
              if (symbol === Symbol.AMPERSAND) {
                this._stack.push(t);
                sym = -1;
                continue;
              }
            }
          } else {
            if (tk.type === Token.SYMBOL) {
              const symbol = tk.symbolValue;
              if (symbol === Symbol.EQUALS) {
                const tk = this.pop();
                if (tk.type === Token.LIST) {
                  const ch = Symbol.toStr(sym).charAt(0);
                  if (ch < "A" || ch > "Z")
                    this.fail(
                      "List or object name must start with uppercase [A-Z]"
                    );
                }
                Heap.add(this._heap, sym, tk);
                sym = -1;
                continue;
              }
              if (symbol === Symbol.FUNCTION) {
                const tk = this.pop();
                if (tk.type !== Token.LIST)
                  this.fail("Symbol => not used with function");
                const ch = Symbol.toStr(sym).charAt(0);
                if (ch >= "A" && ch <= "Z")
                  this.fail(
                    "Function must name not start with uppercase [A-Z]"
                  );
                Heap.add(this._heap, sym, tk);
                sym = -1;
                continue;
              }
            }

            let pms = this._pmachines;
            for (;;) {
              if (pms.isEmpty()) break;
              const mch = pms.head;
              t = Heap.take(mch._heap, sym);
              if (t !== null) break;
              pms = pms.tail;
            }
            if (t !== null) {
              if (tk.type === Token.SYMBOL)
                if (tk.symbolValue === Symbol.AMPERSAND) {
                  this._stack.push(t);
                  module = -1;
                  moduleh = null;
                  sym = -1;
                  continue;
                }
            } else {
              let pms = this._pmachines;
              while (pms.head._source === "") pms = pms.tail;
              let msg = "";
              if (Heap.take(pms.head._heap, sym) !== null)
                msg = "\n(Top symbols can no be referenced out of top scope. " +
                      "Use 'this'.)";
              --this._ix;
              this.fail("Symbol '" + Symbol.toStr(sym) + "' not found" + msg);
            }
          }
        }

        this._stack.push(/** @type {!Token} */(t));
        const sname = Symbol.toStr(sym).charAt(0);
        if (
          t.type === Token.LIST &&
          (sname > "Z" || sname < "A")
        ) {
          --this._ix;
          if (module !== -1 && Symbol.toStr(module).charAt(0) === ".")
            this._runMod(Symbol.toStr(module));
          else
            this._run();
          ++this._ix;
        }
        module = -1;
        moduleh = null;
        sym = -1;
      }

      if (moduleh !== null) {
        if (tk.type !== Token.SYMBOL)
          this.fail(
            "Expected a symbol of module '" + Symbol.toStr(module) + "'"
          );
        sym = tk.symbolValue;
        continue;
      }

      if (tk.type === Token.SYMBOL) {
        const symbol = tk.symbolValue;

        if (symbol === Symbol.NOP) continue;
        else if (symbol === Symbol.EVAL) this._eval();
        else if (symbol === Symbol.RUN) this._run();
        else if (symbol === Symbol.MRUN) this._mrun();
        else if (symbol === Symbol.DATA) this._data();
        else if (symbol === Symbol.ELIF) this._elif();
        else if (symbol === Symbol.ELSE) this.push(tk);
        else if (symbol === Symbol.IF) this._if();
        else if (symbol === Symbol.BREAK || symbol === Symbol.CONTINUE) {
          this._stack.push(tk);
          return;
        }
        else if (symbol === Symbol.LOOP) this._loop();
        else if (symbol === Symbol.WHILE) this._while();
        else if (symbol === Symbol.FOR) this._for();
        else if (symbol === Symbol.RECURSIVE) this._recursive();
        else if (symbol === Symbol.IMPORT) this._import();
        else if (symbol === Symbol.ASSERT) this._assert();
        else if (symbol === Symbol.EXPECT) this._expect();
        else if (symbol === Symbol.STACK) Types.fail(this);
        else if (symbol === Symbol.STACK_CHECK) Types.check(this);
        else {
          const h = Imports.take(symbol);
          if (h === null) {
            sym = symbol;
          } else {
            module = symbol;
            moduleh = h;
          }
        }
      } else {
        this._stack.push(tk);
      }
    }

    if (sym !== -1) {
      let t = null;
      if (moduleh !== null) {
        t = Heap.take(moduleh, sym);
        if (t === null) {
          this.fail(
            "Symbol " + Symbol.toStr(module) + "," +
            Symbol.toStr(sym) + " not found"
          );
        }
      } else {
        t = Heap.take(this._heap, sym);
        if (t === null) t = Heap.take(Imports.base, sym);
        if (t === null) {
          let pms = this._pmachines;
          for (;;) {
            if (pms.isEmpty()) break;
            const mch = pms.head;
            t = Heap.take(mch._heap, sym);
            if (t !== null) break;
            pms = pms.tail;
          }
        }
        if (t === null) {
          this.fail("Symbol '" + Symbol.toStr(sym) + "' not found");
        }
      }

      this._stack.push(/** @type {!Token} */(t));
      const sname = Symbol.toStr(sym).charAt(0);
      if (
        t.type === Token.LIST &&
        (sname > "Z" || sname < "A")
      ) {
        if (module !== -1 && Symbol.toStr(module).charAt(0) === ".")
          this._runMod(Symbol.toStr(module));
        else
          this._run();
      }
      module = -1;
      moduleh = null;
      sym = -1;
    } else if (module !== -1) {
      this.fail("Expected a symbol of module '" + Symbol.toStr(module) + "'");
    }
  }

}
