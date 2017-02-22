//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(() => {
  const Tp = dm.Tp;

  class It {
    //# T :: ( - bool) - ( - T) - It
    constructor (hasNext, next) {
      this._hasNext = hasNext;
      this._next = next;
    }

    //#  - bool
    get hasNext () {
      return this._hasNext;
    }

    //# T :: - T
    get next () {
      return this._next;
    }

    /// Returns [this] with [element] added at end or at [i] if [i] is
    /// not null
    //# T - ?num - It<T>
    add (e, i) {
      const self = this;
      let c = 0;
      if (!i) {
        return new It(
          () => c === 0,
          () => {
            if (self.hasNext()) return self.next();
            ++c;
            return e;
          }
        );
      }
      return new It(
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

    /// Returns [this] with [e] added at begin
    //# T - It<T>
    add0 (e) {
      const self = this;
      let isNotAdd = true;
      return new It(
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

    /// Inserts an iterator in [this] at [i] or at end if [i] is null.
    //# It<T> - ?num - It<T>
    addIt (it, i) {
      const self = this;
      let c = 0;
      return new It(
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

    /// Returns <b>true</b> if all elements give <b>true</b> with [f]
    //# (T - bool) - bool
    all (f) {
      while (this.hasNext())
        if (!f(this.next())) return false;
      return true;
    }

    /// Returns <b>true</b> if any element of [this] is equals (===) to [e]
    //# T - bool
    contains (e) {
      while (this.hasNext())
        if (e === this.next())  return true;
      return false;
    }

    /// Returns <b>true</b> if any element of [this] returns true with [f]
    //# (T - bool) - bool
    containsf (f) {
      while (this.hasNext())
        if (f(this.next())) return true;
      return false;
    }

    /// Returns the number of elements whish give <b>true</b> with [f] <p>
    /// Number of all the elements is returned by [size()]
    //# (T - bool) - num
    count (f) {
      return this.filter(f).size();
    }

    /// Returns rest of [this] after call [take ()]
    //# num - It<T>
    drop (n) {
      const r = this.take(n);
      while (r.hasNext()) r.next();
      return this;
    }

    /// Returns rest of [It] after call [takeWhile()]
    //# (T - bool) - It<T>
    dropWhile (f) {
      return this.dropUntil(e => !f(e));
    }

    /// Returns rest of It after call[ takeUntil()]
    //# (T - bool) - It<T>
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
      return new It(
        () => nx,
        () => {
          const r = last;
          if (self.hasNext()) last = self.next();
          else nx = false;
          return r;
        }
      );
    }

    //# (T - ) -
    each (f) {
      while (this.hasNext()) f(this.next());
    }

    //# (T - num - ) -
    eachIx (f) {
      let c = -1;
      while (this.hasNext()) f(this.next(), ++c);
    }

    /// Equals comparing with "!=="
    //# It<T> - bool
    eq (i) {
      if (!i) return false;
      while (this.hasNext() && i.hasNext())
        if (this.next() !== i.next()) return false;
      if (this.hasNext() || i.hasNext()) return false;
      return true;
    }

    /// Equals comparing with [f]
    //# It<T> - (T - T - bool) - bool
    eqf (i, f) {
      if (!i) return false;
      while (this.hasNext() && i.hasNext())
        if (!f(this.next(), i.next())) return false;
      if (this.hasNext() || i.hasNext()) return false;
      return true;
    }

    /**
     * Filters [this], returning a subset of collection.
     *   f      : Function to select values
     */
    //# (T - bool) - It<T>
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
      return new It(
        () => nx,
        () => {
          const r = last;
          nnext();
          return r;
        }
      );
    }

    /// Returns those elements that gives <b>true</b> with [f].
    //# (T - bool) - Arr<T>
    find (f) {
      let a = [];
      this.each(e => {
        if (f(e)) a.push(e);
      });
      return a;
    }

    /// Returns the first element that gives <b>true</b> with [f] or null
    //# (T - bool) - T
    findFirst (f) {
      while (this.hasNext()) {
        let e = this.next();
        if (f(e)) return e;
      }
      return null;
    }

    /// Returns the index of first element that is equals (===) to [e]
    //# T - num
    index (e) {
      let i = 0;
      while (this.hasNext()) {
        if (this.next() === e) return i;
        ++i;
      }
      return -1;
    }

    /// Returns the index of first element that gives <b>true</b> with [f]
    /// or -1 if [this] has nothing
    //# (T - bool) - num
    indexf (f) {
      let i = 0;
      while (this.hasNext()) {
        if (f(this.next())) return i;
        ++i;
      }
      return -1;
    }

    /// Returns the index of first element that is equals (===) to [e]
    //# T - num
    lastIndex (o) {
      let r = -1;
      let i = 0;
      this.each(e => {
        if (e === o) r = i;
        ++i;
      });
      return r;
    }

    /// Returns the index of last element that gives <b>true</b> with [f]
    /// or -1 if [this] has nothing
    //# (T - bool) - num
    lastIndexf (f) {
      let r = -1;
      let i = 0;
      this.each(e => {
        if (f(e)) r = i;
        ++i;
      });
      return r;
    }

    /// Returns the iterator whish results of apply 'f' to every element
    /// of 'this'
    //# U :: (T - U) - It<U>
    map (f) {
      const self = this;
      return new It(() => self.hasNext(), () => f(self.next()));
    }

    /// Returns the result of applying [f]([f]([seed], e1), e2)... over
    /// every element of [this].
    //# R :: R - (R - T - R) - R
    reduce (seed, f) {
      while (this.hasNext()) seed = f(seed, this.next());
      return seed;
    }

    /// Returns [this] in reverse order
    ///   Creates an array!
    //# - It<T>
    reverse () {
      return It.from(this.to().reverse());
    }

    /// Returns the number of elements of [this].
    //# - num
    size () {
      let r = 0;
      this.each(() => {
        ++r;
      });
      return r;
    }

    /// Sort [this] in natural order (lowercase after uppercase)
    ///   Creates an array!
    //# - It<T>
    sort () {
      return It.from(this.to().sort());
    }

    /// Sort [this] conforming [compare] function
    ///   Creates an array!
    //# (T - T - num) - It<T>
    sortf (f) {
      return It.from(this.to().sort(f));
    }

    /// Returns an iterator over elements of [this] mixed
    ///   Creates an array!
    //# - It<T>
    shuffle () {
      let ni;
      const a = this.to();
      let i = a.length;
      if (!i) return It.empty();
      while (--i) {
        ni = Math.floor(Math.random() * (i + 1));
        if (ni !== i) {
          let tmp = a[i];
          a[i] = a[ni];
          a[ni] = tmp;
        }
      }
      return It.from(a);
    }

    /**
     * Returns n first elements.<p>
     * If [this] has less elements than 'n' returns all of theirs.<p>
     * [this] can be used for the rest of data after consume 'take'.
     */
    //# num - It<T>
    take (n) {
      const self = this;
      return new It(
        () => self.hasNext() && n > 0,
        () => {
          --n;
          return self.next();
        }
      );
    }

    /// Returns the first elements of [it] whish give <b>true</b> with [f]
    //# (T - bool) - It<T>
    takeWhile (f) {
      const self = this;
      let last = null;
      let hnx = false;
      if (self.hasNext()) {
        last = self.next();
        hnx = true;
      }
      return new It(
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

    /// Returns the n first elements of [it] whish give <b>false</b> with [f]
    //# (T - bool) - It<T>
    takeUntil (f) {
      return this.takeWhile(e => !f(e));
    }

    //# - Arr<T>
    to () {
      let a = [];
      this.each(o => {
        a.push(o);
      });
      return a;
    }

    //# - str
    toString () {
      return "[" + It.join(this, ", ") + "]";
    }
  }

  dm.It = It;


// ----------------------------------------------- //

  //# - It<*>
  It.empty = () => new It(() => false, () => null);

  /// Create an It from an array
  //# T :: Arr<T> - It<T>
  It.from = a => {
    const len = a.length;
    let i = 0;
    return new It(() => i < len, () => a[i++]);
  };

  /// Return an [It] over a Bytes object.
  //# Uint8Array - It<num>
  It.fromBytes = bs => {
    const l = bs.length;
    let c = 0;
    return new It(() => c < l, () => bs[c++]);
  };

  /// Returns an [It] over String characters.
  //# str - It<str>
  It.fromStr = s => {
    const l = s.length;
    let c = 0;
    return new It(() => c < l, () => s[c++]);
  };

  //# It<str> - ?str - str
  It.join = (i, sep) => {
    if (!sep) sep = "";
    if (!i.hasNext()) return "";
    let r = i.next();
    i.each(o => {
      r += sep + o;
    });
    return r;
  };

  //# K, V :: Obj<K, V> - It<K>
  It.keys = o => {
    let tmp = [];
    for (let k in o) {
      if (o.hasOwnProperty(k)) tmp.push(k);
    }
    return It.from(tmp);
  };

  /**
   * Iterates over a range. If end is null the range is [0 - startEnd),
   * otherwise the range is [starEnd - end)
   */
  //# num - ?num - It<num>
  It.range = (startEnd, end) => {
    if (!end) {
      end = startEnd;
      startEnd = 0;
    }

    if (startEnd < 0) startEnd = 0;

    return new It(() => startEnd < end, () => startEnd++);
  };

  /// Divide [s] by [sep]
  //# str - str - It<str>
  It.split = (s, sep) => {
    if (sep === "") return It.fromStr(s);
    const len = sep.length;
    let nx = true;
    let p = 0;
    return new It(
      () => nx,
      () => {
        let ix = s.indexOf(sep, p);
        if (ix < 0) {
          nx = false;
          return s.substring(p);
        }
        const r = s.substring(p, ix);
        p = ix + len;
        return r;
      }
    );
  };

  /// Sorts an It of strings in locale and returns it.
  //# It<str> - It<str>
  It.sortl = i => i.sortf((e1, e2) => e1.localeCompare(e2));

  /// Returns two iterators from one It<Tp2>
  ///   Creates two arrays!
  //# A, B :: It<Tp<A, B>> - Tp<It<A>, It<B>>
  It.unzip = i => {
    let a1 = [];
    let a2 = [];
    i.each(tp => {
      a1.push(tp.e1);
      a2.push(tp.e2);
    });
    return new Tp(It.from(a1), It.from(a2));
  };

  /// Returns three iterators from one It<Tp3>
  ///   Creates three arrays!
  //# A, B, C :: It<Tp3<A, B, C>> - Tp3<It<A>, It<B>, It<C>>
  It.unzip3 = i => {
    let a1 = [];
    let a2 = [];
    let a3 = [];
    i.each(tp => {
      a1.push(tp.e1);
      a2.push(tp.e2);
      a3.push(tp.e3);
    });
    return new Tp(It.from(a1), It.from(a2), It.from(a3));
  };

  /// Returns a iterator with elements of [it1] and [it2].<p>
  /// The number of elements of resultant iterator is the least of both ones.
  //# A, B :: It<A> - It<B> - It<Tp<A, B>>
  It.zip = (i1, i2) => new It(
    () => i1.hasNext() && i2.hasNext(),
    () => new Tp(i1.next(), i2.next())
  );

  /// Returns a iterator with elements of [it1], [it2] and [it3].<p>
  /// The number of elements of resultant iterator is the least of three ones.
  //# A, B, C :: It<A> - It<B> - It<C> - It<Tp3<A, B, C>>
  It.zip3 = (i1, i2, i3) => new It(
    () => i1.hasNext() && i2.hasNext() && i3.hasNext(),
    () => new Tp(i1.next(), i2.next(), i3.next())
  );

})();

