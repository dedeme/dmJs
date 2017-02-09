//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(() => {
  "use strict";
  let Tp = dm.Tp;

  //# T :: ( - bool) - ( - T) - It
  dm.It = function (hasNext, next) {
    let self = this;

    /// Returns [this] with [element] added at end or at [i] if [i] is
    /// not null
    //# T - ?num - !It<T>
    this.add = (e, i) => {
      let c = 0;
      if (!i) return new dm.It(
        () => c == 0,
        () => {
          if (hasNext()) return next();
          ++c;
          return e;
        });
      return new dm.It(
        () => hasNext() || c < i,
        () => {
          if (c <= i) {
            if (hasNext() && c < i) {
              ++c;
              return next();
            }
            c = i + 1;
            return e;
          }
          return next();
        });
    }

    /// Returns [this] with [e] added at begin
    //# T - !It<T>
    this.add0 = e => {
      let isNotAdd = true
      return new dm.It(
        () => hasNext() || isNotAdd,
        () => {
          if (isNotAdd) {
            isNotAdd = false;
            return e;
          }
          return next();
        });
    }

    /// Inserts an iterator in [this] at [i] or at end if [i] is null.
    //# !It<T> - num= - !It<T>
    this.addIt = (it, i) => {
      let c = 0;
      return new dm.It(
        () => hasNext() || it.hasNext(),
        () => {
          if (!i) {
            if (hasNext()) return next();
            return it.next();
          }
          if (c < i) {
            if (hasNext()) {
              ++c;
              return next()
            }
            c = i;
          }
          if (it.hasNext()) return it.next();
          return next();
        });
    }

    /// Returns <b>true</b> if all elements give <b>true</b> with [f]
    //# (T - bool) - bool
    this.all = f => {
      while (hasNext()) if (!f(next())) return false;
      return true;
    }

    /// Returns <b>true</b> if any element of [this] is equals (===) to [e]
    //# T - bool
    this.contains = e => {
      while (hasNext()) if (e === next()) return true;
      return false;
    }

    /// Returns <b>true</b> if any element of [this] returns true with [f]
    //# func(T):bool - bool
    this.containsf = f => {
      while (hasNext()) if (f(next())) return true;
      return false;
    }

    /// Returns the number of elements whish give <b>true</b> with [f] <p>
    /// Number of all the elements is returned by [size()]
    //# (T - bool) - num
    this.count = f => self.filter(f).size();

    /// Returns rest of [this] after call [take ()]
    //# num - !It<T>
    this.drop = n => {
      let r = self.take(n);
      while (r.hasNext())
        r.next();
      return self;
    }

    /// Returns rest of [It] after call [takeWhile()]
    //# (T - bool) - !It<T>
    this.dropWhile = f => self.dropUntil(e => !f(e));

    /// Returns rest of It after call[ takeUntil()]
    //# (T - bool) - !It<T>
    this.dropUntil = f => {
      let last = null;
      let nx = true;
      while (true)
        if (hasNext()) {
          last = next();
          if (f(last)) break;
        } else {
          nx = false;
          break;
        }
      return new dm.It(
        () => nx,
        () => {
          let r = last;
          if (hasNext()) last = next();
          else nx = false;
          return r;
        });
    }

    //# (T - ) -
    this.each = f => { while (hasNext()) f(next()); }

    //# (T - num - ) -
    this.eachIx = f => {
      let c = -1;
      while (hasNext())
        f(next(), ++c);
    }

    /// Equals comparing with "!=="
    //# It<T> - bool
    this.eq = i => {
      if (!i) return false;
      while (hasNext() && i.hasNext())
        if (next() !== i.next()) return false;
      if (hasNext() || i.hasNext()) return false;
      return true;
    }

    /// Equals comparing with [f]
    //# It<T> - (T - T - bool) - bool
    this.eqf = (i, f) => {
      if (!i) return false;
      while (hasNext() && i.hasNext())
        if (!f(next(), i.next())) return false;
      if (hasNext() || i.hasNext()) return false;
      return true;
    }

    /**
     * Filters [this], returning a subset of collection.
     *   f      : Function to select values
     */
    //# (T - bool) - !It<T>
    this.filter = (f) => {
      let last = null
      let nx = true
      let nnext = () => {
        while (true)
          if (hasNext()) {
            last = next();
            if (f(last)) break;
          } else {
            nx = false;
            break;
          }
      }
      nnext();
      return new It(
        () => nx,
        () => {
          let r = last;
          nnext();
          return r
        });
    }

    /// Returns those elements that gives <b>true</b> with [f].
    //# (T - bool) - !Arr<T>
    this.find = f => {
      let a = []
      self.each(e => { if (f(e)) a.push(e); });
      return a;
    }

    /// Returns the first element that gives <b>true</b> with [f] or null
    //# (T - bool) - T
    this.findFirst = f => {
      while (hasNext()) {
        let e = next();
        if (f(e)) return e;
      }
      return null;
    }

    //# - bool
    this.hasNext = () => hasNext();

    /// Returns the index of first element that is equals (===) to [e]
    //# T - num
    this.index = e => {
      let i = 0;
      while (hasNext()) {
        if (next() === e) return i;
        ++i;
      }
      return -1;
    }

    /// Returns the index of first element that gives <b>true</b> with [f]
    /// or -1 if [this] has nothing
    //# (T - bool) - num
    this.indexf = f => {
      let i = 0;
      while (hasNext()) {
        if (f(next())) return i;
        ++i;
      }
      return -1;
    }

    /// Returns the index of first element that is equals (===) to [e]
    //# T - num
    this.lastIndex = o => {
      let r = -1;
      let i = 0;
      self.each(e => {
        if (e == o) r = i;
        ++i;
      });
      return r;
    }

    /// Returns the index of last element that gives <b>true</b> with [f]
    /// or -1 if [this] has nothing
    //# (T - bool) - num
    this.lastIndexf = f => {
      let r = -1;
      let i = 0;
      self.each(e => {
        if (f(e)) r = i;
        ++i;
      });
      return r;
    }

    /// Returns the iterator whish results of apply 'f' to every element
    /// of 'this'
    //# U :: (T - U) - !It<U>
    this.map = f => new It (() => hasNext(), () => f(next()));

    //# - T
    this.next = () => next();

    /// Returns the result of applying [f]([f]([seed], e1), e2)... over
    /// every element of [this].
    //# R :: R - (R - T - R) - R
    this.reduce = (seed, f) => {
      while (hasNext()) seed = f(seed, next());
      return seed;
    }

    /// Returns [this] in reverse order
    ///   Creates an array!
    //# - !It<T>
    this.reverse = () => It.from(self.to().reverse());

    /// Returns the number of elements of [this].
    //# - num
    this.size = () => {
      let r = 0
      self.each(e => ++r);
      return r;
    }

    /// Sort [this] in natural order (lowercase after uppercase)
    ///   Creates an array!
    //# - !It<T>
    this.sort = () => It.from(self.to().sort());

    /// Sort [this] conforming [compare] function
    ///   Creates an array!
    //# (T - T - num) - !It<T>
    this.sortf = f => It.from(self.to().sort(f));

    /// Returns an iterator over elements of [this] mixed
    ///   Creates an array!
    //# - !It<T>
    this.shuffle = () => {
      let a = self.to();
      let i = a.length;
      if (!i) return It.empty();
      while (--i) {
        let ni = Math.floor(Math.random() * (i + 1));
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
    //# num - !It<T>
    this.take = n => new dm.It(
      () => hasNext() && n > 0,
      () => {
        --n;
        return next();
      });

    /// Returns the first elements of [it] whish give <b>true</b> with [f]
    //# (T - bool) - !It<T>
    this.takeWhile = f => {
      let last = null;
      let hnx = false;
      if (hasNext()) {
        last = next();
        hnx = true;
      }
      return new dm.It(
        () => hnx && f(last),
        () => {
          let r = last;
          last = null;
          hnx = false;
          if (hasNext()) {
            last = next();
            hnx = true;
          }
          return r;
        });
    }

    /// Returns the n first elements of [it] whish give <b>false</b> with [f]
    //# (T - bool) - !It<T>
    this.takeUntil = f => self.takeWhile(e => !f(e));

    //# - !Arr<T>
    this.to = () => {
      let a = [];
      self.each(o => a.push(o));
      return a;
    }

    //# - str
    this.toString = () => "[" + dm.It.join(self, ", ") + "]";

  }

// ----------------------------------------------- //

  let It = dm.It;

  //# - !It<?>
  It.empty = () => new It (() => false, () => null);

  /// Create an It from an array
  //# T :: Arr<T> - It<T>
  It.from = a => {
    let i = 0;
    let len = a.length;
    return new It(() => i < len, () => a[i++]);
  }

  /// Return an [It] over a Bytes object.
  //# Uint8Array - !It<num>
  It.fromBytes = bs => {
    let l = bs.length;
    let c = 0;
    return new It (() => c < l, () => bs[c++]);
  }

  /// Returns an [It] over String characters.
  //# str - !It<str>
  It.fromStr = s => {
    let l = s.length;
    let c = 0;
    return new It (() => c < l, () => s[c++]);
  }

  //# !It<str> - ?str - str
  It.join = (i, sep) => {
    if (!sep) sep = "";
    if (!i.hasNext()) return "";
    let r = i.next();
    i.each(o => r += sep + o);
    return r;
  }

  //# K, V :: !Obj<K, V> - !It<K>
  It.keys = o => {
    let tmp = [];
    for (let k in o)
      tmp.push(k);
    return It.from(tmp)
  }

  /**
   * Iterates over a range. If end is null the range is [0 - startEnd),
   * otherwise the range is [starEnd - end)
   */
  //# num - ?num - !It<num>
  It.range = (startEnd, end) => {
    if (!end) {
      end = startEnd;
      startEnd = 0;
    }

    if (startEnd < 0)
      startEnd = 0;

    return new It(() => startEnd < end, () => startEnd++);
  }

  /// Sorts an It of strings in locale
  //# !It<str> - !It<str>
  It.sortl = i => i.sortf((e1, e2) => e1.localeCompare(e2));

  /// Returns two iterators from one It<Tp2>
  ///   Creates two arrays!
  //# A, B :: !It<!Tp<A, B>> - !Tp<!It<A>,!It<B>>
  It.unzip = i => {
    let a1 = [];
    let a2 = [];
    i.each(tp => {
      a1.push(tp._1);
      a2.push(tp._2);
    });
    return new Tp(It.from(a1), It.from(a2));
  }

  /// Returns three iterators from one It<Tp3>
  ///   Creates three arrays!
  //# A, B, C :: !It<!Tp3<A, B, C>> - !Tp3<!It<A>,!It<B>,!It<C>>
  It.unzip3 = i => {
    let a1 = [];
    let a2 = [];
    let a3 = [];
    i.each(tp => {
      a1.push(tp._1);
      a2.push(tp._2);
      a3.push(tp._3);
    });
    return new Tp(It.from(a1), It.from(a2), It.from(a3));
  }

  /// Returns a iterator with elements of [it1] and [it2].<p>
  /// The number of elements of resultant iterator is the least of both ones.
  //# A, B :: !It<A> - !It<B> - !It<!Tp<A, B>>
  It.zip = (i1, i2) =>
    new It(
      () => i1.hasNext() && i2.hasNext(),
      () => new Tp(i1.next(), i2.next())
    );

  /// Returns a iterator with elements of [it1], [it2] and [it3].<p>
  /// The number of elements of resultant iterator is the least of three ones.
  //# A, B, C :: !It<A> - !It<B> - !It<C> - !It<!Tp3<A, B, C>>
  It.zip3 = (i1, i2, i3) =>
    new It(
      () => i1.hasNext() && i2.hasNext() && i3.hasNext(),
      () => new Tp(i1.next(), i2.next(), i3.next())
    );

})();

