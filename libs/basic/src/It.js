// Copyright 02-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("github.dedeme.It");
goog.require("github.dedeme.List");
goog.require("github.dedeme.Tp");
goog.require("github.dedeme.Tp3");

/** @template T */
github.dedeme.It = class {
  /**
   * @param {function ():boolean} hasNext
   * @param {function ():T} next
   */
  constructor (hasNext, next) {
    /** @private */
    this._hasNext = hasNext;
    /** @private */
    this._next = next;
  }

  /** @return {boolean} */
  hasNext () {
    return this._hasNext();
  }

  /** @return {T} */
  next () {
    return this._next();
  }

  /**
   * Returns [this] with [element] added at end or at [i] if [i] is
   * not null
   * @param {T} e
   * @param {number=} i
   * @return {!github.dedeme.It<T>}
   */
  add (e, i) {
    const self = this;
    let c = 0;
    if (!i) {
      return new github.dedeme.It(
        () => c === 0,
        () => {
          if (self.hasNext()) return self.next();
          ++c;
          return e;
        }
      );
    }
    return new github.dedeme.It(
      () => self.hasNext() || c < i,
      () => {
        if (c <= i) {
          if (self.hasNext() && c < i) {
            ++c;
            return self.next();
          }
          c = i + 1;
          return e;
        }
        return self.next();
      }
    );
  }

  /**
   * Returns [this] with [e] added at the beginning
   * @param {T} e
   * @return {!github.dedeme.It<T>}
   */
  add0 (e) {
    const self = this;
    let isNotAdd = true;
    return new github.dedeme.It(
      () => self.hasNext() || isNotAdd,
      () => {
        if (isNotAdd) {
          isNotAdd = false;
          return e;
        }
        return self.next();
      }
    );
  }

  /**
   * Inserts an iterator in [this] at [i] or at end if [i] is null.
   * @param {!github.dedeme.It<T>} it
   * @param {number=} i
   * @return {!github.dedeme.It<T>}
   */
  addIt (it, i) {
    const self = this;
    let c = 0;
    return new github.dedeme.It(
      () => self.hasNext() || it.hasNext(),
      () => {
        if (!i) {
          if (self.hasNext()) return self.next();
          return it.next();
        }
        if (c < i) {
          if (self.hasNext()) {
            ++c;
            return self.next();
          }
          c = i;
        }
        if (it.hasNext()) return it.next();
        return self.next();
      }
    );
  }

  /**
   * Returns <b>true</b> if all elements give <b>true</b> with [f]
   * @param {function (T):boolean} f
   * @return {boolean}
   */
  all (f) {
    while (this.hasNext())
      if (!f(this.next())) return false;
    return true;
  }

  /**
   * Returns <b>true</b> if any element of [this] is equals (===) to [e]
   * @param {T} e
   * @return {boolean}
   */
  contains (e) {
    while (this.hasNext())
      if (e === this.next())  return true;
    return false;
  }

  /**
   * Returns <b>true</b> if any element of [this] returns true with [f]
   * @param {function (T):boolean} f
   * @return {boolean}
   */
  containsf (f) {
    while (this.hasNext())
      if (f(this.next())) return true;
    return false;
  }

  /**
   * Returns the number of elements whish give <b>true</b> with [f] <p>
   * Number of all the elements is returned by [size()]
   * @param {function (T):boolean} f
   * @return {number}
   */
  count (f) {
    return this.filter(f).size();
  }

  /**
   * Returns rest of [this] after call [take ()]
   * @param {number} n
   * @return  {!github.dedeme.It<T>}
   */
  drop (n) {
    const r = this.take(n);
    while (r.hasNext()) r.next();
    return this;
  }

  /**
   * Returns rest of [It] after call [takeWhile()]
   * @param {function (T):boolean} f
   * @return  {!github.dedeme.It<T>}
   */
  dropWhile (f) {
    return this.dropUntil(e => !f(e));
  }

  /**
   * Returns rest of It after call[ takeUntil()]
   * @param {function (T):boolean} f
   * @return  {!github.dedeme.It<T>}
   */
  dropUntil (f) {
    const self = this;
    let last = null;
    let nx = true;
    for (;;) {
      if (self.hasNext()) {
        last = self.next();
        if (f(last)) break;
      } else {
        nx = false;
        break;
      }
    }
    return new github.dedeme.It(
      () => nx,
      () => {
        const r = last;
        if (self.hasNext()) last = self.next();
        else nx = false;
        return r;
      }
    );
  }

  /** @param {function (T)} f */
  each (f) {
    while (this.hasNext()) f(this.next());
  }

  /** @param {function (T, number)} f */
  eachIx (f) {
    let c = -1;
    while (this.hasNext()) f(this.next(), ++c);
  }

  /**
   * Equals comparing with "!=="
   * @param {!github.dedeme.It<T>} i
   * @return {boolean}
   */
  eq (i) {
    while (this.hasNext() && i.hasNext())
      if (this.next() !== i.next()) return false;
    if (this.hasNext() || i.hasNext()) return false;
    return true;
  }

  /**
   * Equals comparing with [f]
   * @param {!github.dedeme.It<T>} i
   * @param {function(T, T):boolean} f
   * @return {boolean}
   */
  eqf (i, f) {
    while (this.hasNext() && i.hasNext())
      if (!f(this.next(), i.next())) return false;
    if (this.hasNext() || i.hasNext()) return false;
    return true;
  }

  /**
   * Filters [this], returning a subset of collection.
   * @param {function (T):boolean} f Function to select values
   * @return {!github.dedeme.It<T>}
   */
  filter (f) {
    const self = this;
    let last = null;
    let nx = true;
    const nnext = function () {
      for (;;) {
        if (self.hasNext()) {
          last = self.next();
          if (f(last)) break;
        } else {
          nx = false;
          break;
        }
      }
    };
    nnext();
    return new github.dedeme.It(
      () => nx,
      () => {
        const r = last;
        nnext();
        return r;
      }
    );
  }

  /**
   * Returns those elements that gives <b>true</b> with [f].
   * @param {function (T):boolean} f
   * @return {!Array<T>}
   */
  find (f) {
    let a = [];
    this.each(e => {
      if (f(e)) a.push(e);
    });
    return a;
  }

  /**
   * Returns the first element that gives <b>true</b> with [f] or undefined
   * @param {function (T):boolean} f
   * @return {T | null | undefined}
   */
  findFirst (f) {
    while (this.hasNext()) {
      let e = this.next();
      if (f(e)) return e;
    }
    return undefined;
  }

  /**
   * Returns the last element that gives <b>true</b> with [f] or undefined
   * @param {function (T):boolean} f
   * @return {T | null | undefined}
   */
  findLast (f) {
    let r = undefined;
    while (this.hasNext()) {
      let e = this.next();
      if (f(e)) r = e;
    }
    return r;
  }

  /**
   * Returns the index of first element that is equals (===) to [e]
   * @param {T} e
   * @return {number}
   */
  index (e) {
    let i = 0;
    while (this.hasNext()) {
      if (this.next() === e) return i;
      ++i;
    }
    return -1;
  }

  /**
   * Returns the index of first element that gives <b>true</b> with [f]
   * or -1 if [this] has nothing
   * @param {function (T):boolean} f
   * @return {number}
   */
  indexf (f) {
    let i = 0;
    while (this.hasNext()) {
      if (f(this.next())) return i;
      ++i;
    }
    return -1;
  }

  /**
   * Returns the index of first element that is equals (===) to [e]
   * @param {T} e
   * @return {number}
   */
  lastIndex (e) {
    let r = -1;
    let i = 0;
    while (this.hasNext()) {
      if (this.next() === e) r = i;
      ++i;
    }
    return r;
  }

  /**
   * Returns the index of last element that gives <b>true</b> with [f]
   * or -1 if [this] has nothing
   * @param {function (T):boolean} f
   * @return {number}
   */
  lastIndexf (f) {
    let r = -1;
    let i = 0;
    this.each(e => {
      if (f(e)) r = i;
      ++i;
    });
    return r;
  }

  /**
   * Returns the iterator whish results of apply 'f' to every element
   * of 'this'
   * @template U
   * @param {function (T):U} f
   * @return {!github.dedeme.It<U>}
   */
  map (f) {
    const self = this;
    return new github.dedeme.It(() => self.hasNext(), () => f(self.next()));
  }

  /**
   * Returns the result of applying [f]([f]([seed], e1), e2)... over
   * every element of [this].
   * @template R
   * @param {R} seed
   * @param {function (R, T):R} f
   * @return {R}
   */
  reduce (seed, f) {
    while (this.hasNext()) seed = f(seed, this.next());
    return seed;
  }

  /**
   * Returns [this] in reverse order.<p>
   * <i>NOTE: This function creates an array!</i>.
   * @return {!github.dedeme.It<T>}
   */
  reverse () {
    return github.dedeme.It.from(this.to().reverse());
  }

  /**
   * Returns the number of elements of [this].
   * @return {number}
   */
  size () {
    let r = 0;
    this.each(() => {
      ++r;
    });
    return r;
  }

  /**
   * Sorts [this] in "natural order" (In strings lowercase goes after
   * uppercase).<p>
   * <i>NOTE: This function creates an array!.</i>
   * @return {!github.dedeme.It<T>}
   */
  sort () {
    return github.dedeme.It.from(this.to().sort());
  }

  /**
   * Sort [this] conforming [compare] function.<p>
   * <i>NOTE: This function creates an array!.</i>
   * @param {function (T, T):number} f
   * @return {!github.dedeme.It<T>}
   */
  sortf (f) {
    return github.dedeme.It.from(this.to().sort(f));
  }

  /**
   * Returns an iterator over elements of [this] mixed.
   * <i>NOTE: This function creates an array!.</i>
   * @return {!github.dedeme.It<T>}
   */
  shuffle () {
    let ni;
    const a = this.to();
    let i = a.length;
    if (!i) return github.dedeme.It.empty();
    while (--i) {
      ni = Math.floor(Math.random() * (i + 1));
      if (ni !== i) {
        let tmp = a[i];
        a[i] = a[ni];
        a[ni] = tmp;
      }
    }
    return github.dedeme.It.from(a);
  }

  /**
   * Returns n first elements.<p>
   * If [this] has less elements than 'n' returns all of theirs.<p>
   * [this] can be used for the rest of data after consume 'take'.
   * @param {number} n
   * @return  {!github.dedeme.It<T>}
   */
  take (n) {
    const self = this;
    return new github.dedeme.It(
      () => self.hasNext() && n > 0,
      () => {
        --n;
        return self.next();
      }
    );
  }

  /**
   * Returns the first elements of [it] whish give <b>true</b> with [f]
   * @param {function (T):boolean} f
   * @return  {!github.dedeme.It<T>}
   */
  takeWhile (f) {
    const self = this;
    let last = null;
    let hnx = false;
    if (self.hasNext()) {
      last = self.next();
      hnx = true;
    }
    return new github.dedeme.It(
      () => hnx && f(last),
      () => {
        const r = last;
        last = null;
        hnx = false;
        if (self.hasNext()) {
          last = self.next();
          hnx = true;
        }
        return r;
      }
    );
  }

  /**
   * Returns the n first elements of [it] whish give <b>false</b> with [f]
   * @param {function (T):boolean} f
   * @return  {!github.dedeme.It<T>}
   */
  takeUntil (f) {
    return this.takeWhile(e => !f(e));
  }

  /** @return {!Array<T>} */
  to () {
    let a = [];
    this.each(o => {
      a.push(o);
    });
    return a;
  }

  /** @return {!github.dedeme.List<T>} */
  toList () {
    let l = new github.dedeme.List();
    this.each(o => {
      l = l.cons(o);
    });
    return l.reverse();
  }

  /** @return {string} */
  toString () {
    return "[" + github.dedeme.It.join(this, ", ") + "]";
  }

  /**
   * Empty iterator
   * @return {!github.dedeme.It<?>}
   */
  static empty () {
    return new github.dedeme.It(() => false, () => null);
  }


  /**
   * Create an It from an array
   * @template T
   * @param {!Array<T>} a
   * @return {!github.dedeme.It<T>}
   */
  static from (a) {
    const len = a.length;
    let i = 0;
    return new github.dedeme.It(() => i < len, () => a[i++]);
  }

  /**
   * Create an It from a List
   * @template T
   * @param {!github.dedeme.List<T>} l
   * @return {!github.dedeme.It<T>}
   */
  static fromList (l) {
    return new github.dedeme.It(
      () => l.tail !== null,
      () => {
        let r = l.head;
        l = l.tail || l;
        return r;
      }
    );
  }

  /**
   * Create an It from an array
   * @param {!Uint8Array} a
   * @return {!github.dedeme.It<number>}
   */
  static fromBytes (a) {
    const len = a.length;
    let i = 0;
    return new github.dedeme.It(() => i < len, () => a[i++]);
  }

  /**
   * @template T
   * @param {!github.dedeme.It<T>} i
   * @param {string=} sep
   * @return {string}
   */
  static join (i, sep) {
    if (!i.hasNext()) return "";
    sep = sep || "";
    let r = i.next();
    i.each(o => {
      r += sep + o;
    });
    return r;
  }

  /**
   * Returns an iterator over an Hash keys
   * @param {!github.dedeme.Hash<?>} h
   * @return {!github.dedeme.It<string>}
   */
  static keys (h) {
    return github.dedeme.It.from(h.keys());
  }

  /**
   * Iterates over a range. If end is null the range is [0 - startEnd),
   * otherwise the range is [startEnd - end)
   * @param {number} startEnd
   * @param {number=} end
   * @return {!github.dedeme.It<number>}
   */
  static range (startEnd, end) {
    if (!end) {
      end = startEnd;
      startEnd = 0;
    }

    return new github.dedeme.It(() => startEnd < end, () => startEnd++);
  }

  /**
   * Sorts an It of strings in locale and returns it..<p>
   * <i>NOTE: This function creates an array!.</i>
   * @param {!github.dedeme.It<string>} i
   * @return {!github.dedeme.It<string>}
   */
  static sortLocale (i) {
    return i.sortf((e1, e2) => e1.localeCompare(e2));
  }

  /**
   * Returns two iterators from one It<Tp>.
   * <i>NOTE: This function creates two arrays!.</i>
   * @template A
   * @template B
   * @param {!github.dedeme.It<!github.dedeme.Tp<A, B>>} i
   * @return {!github.dedeme.Tp<!github.dedeme.It<A>,
   *                            !github.dedeme.It<B>>}
   */
  static unzip (i) {
    let a1 = [];
    let a2 = [];
    i.each(tp => {
      a1.push(tp.e1);
      a2.push(tp.e2);
    });
    return new github.dedeme.Tp(
      github.dedeme.It.from(a1),
      github.dedeme.It.from(a2)
    );
  }

  /**
   * Returns three iterators from one It<Tp3>
   * <i>NOTE: This function creates three arrays!.</i>
   * @template A
   * @template B
   * @template C
   * @param {!github.dedeme.It<!github.dedeme.Tp3<A, B, C>>} i
   * @return {!github.dedeme.Tp3<!github.dedeme.It<A>,
   *                             !github.dedeme.It<B>,
   *                             !github.dedeme.It<C>>}
   */
  static unzip3 (i) {
    let a1 = [];
    let a2 = [];
    let a3 = [];
    i.each(tp => {
      a1.push(tp.e1);
      a2.push(tp.e2);
      a3.push(tp.e3);
    });
    return new github.dedeme.Tp3(
      github.dedeme.It.from(a1),
      github.dedeme.It.from(a2),
      github.dedeme.It.from(a3)
    );
  }

  /**
   * Returns a iterator with elements of [it1] and [it2].<p>
   * The number of elements of resultant iterator is the least of both ones.
   * @template A
   * @template B
   * @param {!github.dedeme.It<A>} i1
   * @param {!github.dedeme.It<B>} i2
   * @return {!github.dedeme.It<!github.dedeme.Tp<A, B>>}
   */
  static zip (i1, i2) {
    return new github.dedeme.It(
      () => i1.hasNext() && i2.hasNext(),
      () => new github.dedeme.Tp(i1.next(), i2.next())
    );
  }

  /**
   * Returns a iterator with elements of [it1], [it2] and [it3].<p>
   * The number of elements of resultant iterator is the least of three ones.
   * @template A
   * @template B
   * @template C
   * @param {!github.dedeme.It<A>} i1
   * @param {!github.dedeme.It<B>} i2
   * @param {!github.dedeme.It<C>} i3
   * @return {!github.dedeme.It<!github.dedeme.Tp3<A, B, C>>}
   */
  static zip3 (i1, i2, i3) {
    return new github.dedeme.It(
      () => i1.hasNext() && i2.hasNext() && i3.hasNext(),
      () => new github.dedeme.Tp3(i1.next(), i2.next(), i3.next())
    );
  }

}
