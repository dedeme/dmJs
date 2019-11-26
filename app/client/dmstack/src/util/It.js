// Copyright 18-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "../Token.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js"; // eslint-disable-line

/** Iterator. */
export default class It {
  /**
    @param {function():Token} f
  **/
  constructor (f) {
    this._f = f;
    this._has = false;
    this._value = null;

    this.next();
  }

  /** @return {boolean} */
  get has () { return this._has }

  /** @return {Token} */
  get peek () { return this._value }

  /** @return {Token} */
  next () {
    const rs = this._value;
    const r = this._f();
    if (r) {
      this._has = true;
      this._value = r;
    } else {
      this._has = false;
      this._value = null;
    }
    return rs;
  }

  /**
    @param {!It} it
    @return {!It}
  **/
  cat (it) {
    return new It(() =>
      this.has ? this.next()
        : it.has ? it.next()
          : null
    );
  }

  /**
    @param {!Token} tk
    @return {!It}
  **/
  push (tk) {
    return this.cat(It.from([tk]));
  }

  /**
    @param {!Token} tk
    @return {!It}
  **/
  push0 (tk) {
    return It.from([tk]).cat(this);
  }

  /**
    @param {number} n
    @return {!It}
  **/
  drop (n) {
    for (let i = 0; i < n; ++i) {
      if (this._has) this.next();
      else break;
    }
    return this;
  }

  /**
    @param {function(!Token):boolean} f
    @return {!It}
  **/
  dropf (f) {
    for (;;) {
      if (this._has && f(/** @type {!Token} */ (this._value))) this.next();
      else break;
    }
    return this;
  }

  /**
    @param {function(!Token):boolean} f
    @return {!It}
  **/
  filter (f) {
    return new It(() => {
      while (this._has && !f(/** @type {!Token} */ (this._value)))
        this.next();
      return this._has ? this.next() : null;
    });
  }

  /**
    @param {function(!Token):!Token} f
    @return {!It}
  **/
  map (f) {
    return new It(() =>
      this._has ? f(/** @type {!Token} */ (this.next())) : null
    );
  }

  /**
    @param {number} n
    @return {!It}
  **/
  take (n) {
    let i = 0;
    return new It(() =>
      this._has && i++ < n ? this.next() : null
    );
  }

  /**
    @param {function(!Token):boolean} f
    @return {!It}
  **/
  takef (f) {
    let more = true;
    return new It(() => {
      if (more && this._has && f(/** @type {!Token} */ (this._value)))
        return this.next();
      more = false;
      return null;
    });
  }

  /**
    @param {!It} it
    @return {!It}
  **/
  zip (it) {
    return new It(() =>
      this._has && it._has ? Token.mkList([this.next(), it.next()]) : null
    );
  }

  /**
    @param {!It} it1
    @param {!It} it2
    @return {!It}
  **/
  zip3 (it1, it2) {
    return new It(() =>
      this._has && it1._has && it2._has
        ? Token.mkList([this.next(), it1.next(), it2.next()])
        : null
    );
  }

  /**
    @param {function(!Token):boolean} f
    @return {!Token}
  **/
  all (f) {
    while (this._has)
      if (!f(/** @type {!Token} */ (this.next()))) return Token.mkInt(0);
    return Token.mkInt(1);
  }

  /**
    @param {function(!Token):boolean} f
    @return {!Token}
  **/
  any (f) {
    while (this._has)
      if (f(/** @type {!Token} */ (this.next()))) return Token.mkInt(1);
    return Token.mkInt(0);
  }

  /** @return {!Token} **/
  count () {
    let n = 0;
    while (this._has) {
      this.next();
      ++n;
    }
    return Token.mkInt(n);
  }

  /**
    @param {function(!Token, !Token):boolean} f
    @return {!Token}
  **/
  duplicates (f) {
    const a = this.to();
    const d = [];
    const r = [];

    for (const tk of a) {
      if (r.some(tk2 => f(tk, tk2))) {
        if (!d.some(tk2 => f(tk, tk2))) d.push(tk);
      } else {
        r.push(tk);
      }
    }

    return Token.mkList([Token.mkList(d), Token.mkList(r)]);
  }

  /**
    @param {function(!Token):void} f
    @return {void}
  **/
  each (f) {
    while (this._has) f(/** @type {!Token} */ (this.next()));
  }

  /**
    @param {function(!Token, number):void} f
    @return {void}
  **/
  eachIx (f) {
    let n = 0;
    while (this._has) f(/** @type {!Token} */ (this.next()), n++);
  }

  /**
    @param {!It} it
    @param {function(!Token, !Token):boolean} f
    @return {!Token}
  **/
  eq (it, f) {
    while (this._has && it._has)
      if (!f(
        /** @type {!Token} */ (this.next()),
        /** @type {!Token} */ (it.next())
      )) return Token.mkInt(0);

    if (this._has || it._has)
      return Token.mkInt(0);

    return Token.mkInt(1);
  }

  /**
    @param {!It} it
    @param {function(!Token, !Token):boolean} f
    @return {!Token}
  **/
  neq (it, f) {
    while (this._has && it._has)
      if (!f(
        /** @type {!Token} */ (this.next()),
        /** @type {!Token} */ (it.next())
      )) return Token.mkInt(1);

    if (this._has || it._has)
      return Token.mkInt(1);

    return Token.mkInt(0);
  }

  /**
    @param {function(!Token):boolean} f
    @return {!Token}
  **/
  find (f) {
    while (this._has) {
      const tk = /** @type {!Token} */ (this.next());
      if (f(tk)) return Token.fromPointer(Symbol.OPTION_, tk);
    }
    return Token.fromPointer(Symbol.OPTION_, null);
  }

  /**
    @param {function(!Token):boolean} f
    @return {!Token}
  **/
  index (f) {
    let n = 0;
    while (this._has) {
      const tk = /** @type {!Token} */ (this.next());
      if (f(tk)) return Token.mkInt(n);
      ++n;
    }
    return Token.mkInt(-1);
  }

  /**
    @param {function(!Token):boolean} f
    @return {!Token}
  **/
  lastIndex (f) {
    let r = -1;
    let n = 0;
    while (this._has) {
      const tk = /** @type {!Token} */ (this.next());
      if (f(tk)) r = n;
      ++n;
    }
    return Token.mkInt(r);
  }

  /**
    @param {!Token} seed
    @param {function(!Token, !Token):!Token} f
    @return {!Token}
  **/
  reduce (seed, f) {
    while (this._has)
      seed = f(seed, /** @type {!Token} */ (this.next()));
    return seed;
  }

  /** @return !Array<!Token> */
  to () {
    const a = [];
    while (this._has) a.push(this.next());
    return a;
  }

  /** @return {!It} */
  static empty () {
    return new It(() => null);
  }

  /**
    @param {!Array<!Token>} a
    @return {!It}
  **/
  static from (a) {
    let i = 0;
    return new It(() => i >= a.length ? null : a[i++]);
  }

  /**
    @param {number} begin
    @param {number} end
  **/
  static range (begin, end) {
    return new It(() => begin >= end ? null : Token.mkInt(begin++));
  }

  /**
    @param {number} n
  **/
  static range0 (n) {
    return It.range(0, n);
  }
}
