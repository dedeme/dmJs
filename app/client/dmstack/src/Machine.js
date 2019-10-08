// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Heap} from "./Heap.js";
import Imports from "./Imports.js";
import Fails from "./Fails.js";
import List from "./util/List.js"; // eslint-disable-line
import Token from "./Token.js";
import {Symbol} from "./Symbol.js";
import Reader from "./Reader.js";
import Primitives from "./Primitives.js";
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
    this._heap = Heap.mk();
    this._prg = prg;
    this._ix = 0;
  }

  /** @return {!Array<!Token>} */
  get stack () { return this._stack }

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
    const runner = Token.mkList(0, [
      this.popExc(Token.LIST), Token.mkSymbol(0, Symbol.mk("run"))
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
      this.fail(
        "Symbol " + Symbol.toStr(module) + " " +
        Symbol.toStr(fn) + " not found"
      );
    f(this);
  }

  /** @private */
  async _import () {
    const errorSymKv = Imports.readSymbol(this.pop());
    if (errorSymKv.left !== "") this.fail(errorSymKv.left);
    const source = errorSymKv.right.value;

    const sid = Symbol.toStr(source);
    const f = Path.canonical(
      Path.cat([Path.parent(this._source), sid + ".dms"])
    );
    const fid = f.substring(0, f.length - 4);
    const ssource = Symbol.mk(fid);

    if (!Imports.isOnWay(ssource) && Imports.take(ssource) === null) {
      Imports.putOnWay(ssource);
      const code = await Imports.load(f);
      const r = new Reader(fid, code);
      const m = Machine.isolateProcess(f, this._pmachines, r.process());
      Imports.add(ssource, m._heap);
      Imports.quitOnWay(ssource);
    }
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

    try {
      return m.cprocess();
    } catch (e) {
      if (e.name === "RuntimeError") throw e;
      Fails.fromException(m, e);
      return this; // Unreachable
    }
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
    try {
      return m.cprocess();
    } catch (e) {
      if (e.name === "RuntimeError") throw e;
      Fails.fromException(m, e);
      return this; // Unreachable
    }
  }

  /** @private */
  exit () {
    console.log("  Stack:");
    if (this._stack.length === 0) {
      console.log("    [EMPTY]");
    } else {
      let msg = "    ";
      this._stack.reverse();
      for (const tk of this._stack)
        msg += tk.toString() + " ";
      console.log(msg);
    }

    let ms = this._pmachines;
    while (!ms.isEmpty()) {
      const m = ms.head;
      const tk = m._prg.listValue[m._ix];
      console.log(m._source + ":" + tk.line + ":" + tk.toString());
      ms = ms.tail;
    }
    const e = new Error();
    e.name = "RuntimeError";
    throw e;
  }

  /**
    @private
    @return {void}
  **/
  _assert () {
    if (this.popExc(Token.INT).intValue === 1) return;
    console.log("Assert error:" + this._pmachines.count() + 1 + ":");
    this.exit();
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
      "Expect error:" + this._pmachines.count() + 1 + ":" +
      "\n  Expected: " + expect.toString() +
      "\n  Actual  : " + actual.toString()
    );
    this.exit();
  }

  /**
    @param {string | Error} msg
    @return {void}
  **/
  fail (msg) {
    console.log("Runtime error:" + this._pmachines.count() + 1 + ": " + msg);
    this.exit();
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
    const tk = this._stack.pop();
    if (tk === undefined)
      this.fail("Stack is empty");
    return tk.type === type ? tk : null;
  }

  async cprocess () {
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
          } else
            this.fail(
              "Symbol " + Symbol.toStr(module) + " " +
              Symbol.toStr(sym) + " not found"
            );
        } else {
          t = Heap.take(this._heap, sym);
          if (t === null) t = Heap.take(Imports.base(), sym);
          if (t !== null) {
            if (t.type === Token.SYMBOL) {
              const symbol = t.symbolValue;
              if (symbol === Symbol.EQUALS) {
                const tk = this.pop();
                if (tk.type === Token.LIST) {
                  const ch = Symbol.toStr(symbol).charAt(0);
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
                const ch = Symbol.toStr(symbol).charAt(0);
                if (ch >= "A" || ch <= "Z")
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
                  const ch = Symbol.toStr(symbol).charAt(0);
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
                const ch = Symbol.toStr(symbol).charAt(0);
                if (ch >= "A" || ch <= "Z")
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
        else if (symbol === Symbol.ASSERT) this._assert();
        else if (symbol === Symbol.EXPECT) this._expect();
        else if (symbol === Symbol.IMPORT) await this._import();
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
        if (t === null)
          this.fail(
            "Symbol " + Symbol.toStr(module) + " " +
            Symbol.toStr(sym) + " not found"
          );
      } else {
        t = Heap.take(this._heap, sym);
        if (t === null) t = Heap.take(Imports.base(), sym);
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
          --this._ix;
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

    return this;
  }

}
