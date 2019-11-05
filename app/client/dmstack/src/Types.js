// Copyright 05-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js";
import Machine from "./Machine.js"; // eslint-disable-line
import {Symbol} from "./Symbol.js";
import Tk from "./Tk.js";
import List from "./util/List.js";

/**
  @param {!Array<!Token>} stack
  @param {string} type
  @return {string}
**/
function check (stack, type) {
  if (type === "") {
    const sz = stack.length;
    if (sz !== 0)
      return sz + " value" + (sz === 1 ? "" : "s") + " in stack";
    return "";
  }
  return Token.checkType(List.fromArrayReverse(stack), type);
}

/** Types management. */
export default class Types {
  /**
    Check types of stack values and raise a fail if checking not succeeds.
    @param {!Machine} m
    @return {void}
  */
  static fail (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    const checked = check(m.stack, t);
    if (checked !== t)
      m.fail(
        "Stack type check failed. Expected: '@" + t +
        "'. Actual: '@" + checked + "'"
      );
  }

  /**
    Check types of stack values and push in stack '1' if checking succeeds.
    @param {!Machine} m
    @return {void}
  */
  static check (m) {
    const t = Symbol.toStr(Tk.popList(m)[0].symbolValue);
    const checked = check(m.stack, t);
    m.push(Token.mkInt(t === checked ? 1 : 0));
  }
}
