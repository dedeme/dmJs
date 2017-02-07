//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(ns => {
  "use strict";
  //# T :: ( - bool) - ( - T) - It
  ns.It = function (hasNext, next) {
    var self;
    self = this;

    /// Returns [this] with [element] added at end or at [i] if [i] is
    /// not null
    //# T - ?num - !It<T>
    this.add = (e, i) => {
      var c;
      c = 0;
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
      var isNotAdd;
      isNotAdd = true
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
      var c;
      c = 0;
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

    /// Returns rest of [this] after call [take ()]
    //# num - !It<T>
    this.drop = n => {
      var r;
      r = self.take(n);
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
      var last, nx;
      last = null;
      nx = true;
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
          var r;
          r = last;
          if (hasNext()) last = next();
          else nx = false;
          return r;
        });
    }

    //# (T - ) -
    this.each = f => { while (hasNext()) f(next()); }

    //# (T - num - ) -
    this.eachIx = f => {
      var c;
      c = -1;
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

    //# - bool
    this.hasNext = () => hasNext();

    //# - T
    this.next = () => next();

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
      var last, hnx;
      last = null;
      hnx = false;
      if (hasNext()) {
        last = next();
        hnx = true;
      }
      return new dm.It(
        () => hnx && f(last),
        () => {
          var r;
          r = last;
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
      var a;
      a = [];
      self.each(o => a.push(o));
      return a;
    }

    //# - str
    this.toString = () => "[" + dm.It.join(self, ", ") + "]";

  }

// ----------------------------------------------- //

  //# - !It<?>
  ns.It.empty = () => new dm.It (() => false, () => null);
  /// Create an It from an array
  //# T :: Arr<T> - It<T>
  ns.It.from = a => {
    var i, len;
    i = 0;
    len = a.length;
    return new dm.It(
      () => i < len,
      () => a[i++]
    );
  }
  /// Return an [It] over a Bytes object.
  //# Uint8Array - !It<num>
  ns.It.fromBytes = bs => {
    var l, c;
    l = bs.length;
    c = 0;
    return new dm.It (() => c < l, () => bs[c++]);
  }
  /// Returns an [It] over String characters.
  //# str - !It<str>
  ns.It.fromStr = s => {
    var l, c;
    l = s.length;
    c = 0;
    return new dm.It (() => c < l, () => s[c++]);
  }
  //# !It<str> - ?str - str
  ns.It.join = (i, sep) => {
    var r;
    if (!sep) sep = "";
    if (!i.hasNext()) return "";
    r = i.next();
    i.each(o => r += sep + o);
    return r;
  }
  //# K, V :: !Obj<K, V> - !It<K>
  ns.It.keys = o => {
    var tmp, k;
    tmp = [];
    for (k in o)
      tmp.push(k);
    return dm.It.from(tmp)
  }

})(dm);

