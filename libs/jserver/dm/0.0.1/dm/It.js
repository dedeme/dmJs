//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(function () {
  "use strict";
  var Tp = dm.Tp;

  //# T :: ( - bool) - ( - T) - It
  dm.It = function (hasNext, next) {
    //#  - bool
    this.hasNext = hasNext;
    //# T :: - T
    this.next = next;
  };

  var It = dm.It;
  var it = It.prototype;

  /// Returns [this] with [element] added at end or at [i] if [i] is
  /// not null
  //# T - ?num - !It<T>
  it.add = function (e, i) {
    var self = this;
    var c = 0;
    if (!i) {
      return new It(
        function () { return c === 0; },
        function () {
          if (self.hasNext()) { return self.next(); }
          ++c;
          return e;
        }
      );
    }
    return new It(
      function () { return self.hasNext() || c < i; },
      function () {
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
  };

  /// Returns [this] with [e] added at begin
  //# T - !It<T>
  it.add0 = function (e) {
    var self = this;
    var isNotAdd = true;
    return new It(
      function () { return self.hasNext() || isNotAdd; },
      function () {
        if (isNotAdd) {
          isNotAdd = false;
          return e;
        }
        return self.next();
      }
    );
  };

  /// Inserts an iterator in [this] at [i] or at end if [i] is null.
  //# !It<T> - num= - !It<T>
  it.addIt = function (it, i) {
    var self = this;
    var c = 0;
    return new It(
      function () { return self.hasNext() || it.hasNext(); },
      function () {
        if (!i) {
          if (self.hasNext()) { return self.next(); }
          return it.next();
        }
        if (c < i) {
          if (self.hasNext()) {
            ++c;
            return self.next();
          }
          c = i;
        }
        if (it.hasNext()) { return it.next(); }
        return self.next();
      }
    );
  };

  /// Returns <b>true</b> if all elements give <b>true</b> with [f]
  //# (T - bool) - bool
  it.all = function (f) {
    while (this.hasNext()) { if (!f(this.next())) { return false; } }
    return true;
  };

  /// Returns <b>true</b> if any element of [this] is equals (===) to [e]
  //# T - bool
  it.contains = function (e) {
    while (this.hasNext()) { if (e === this.next()) { return true; } }
    return false;
  };

  /// Returns <b>true</b> if any element of [this] returns true with [f]
  //# func(T):bool - bool
  it.containsf = function (f) {
    while (this.hasNext()) { if (f(this.next())) { return true; } }
    return false;
  };

  /// Returns the number of elements whish give <b>true</b> with [f] <p>
  /// Number of all the elements is returned by [size()]
  //# (T - bool) - num
  it.count = function (f) { return this.filter(f).size(); };

  /// Returns rest of [this] after call [take ()]
  //# num - !It<T>
  it.drop = function (n) {
    var r = this.take(n);
    while (r.hasNext()) { r.next(); }
    return this;
  };

  /// Returns rest of [It] after call [takeWhile()]
  //# (T - bool) - !It<T>
  it.dropWhile = function (f) {
    return this.dropUntil(function (e) { return !f(e); });
  };

  /// Returns rest of It after call[ takeUntil()]
  //# (T - bool) - !It<T>
  it.dropUntil = function (f) {
    var self = this;
    var last = null;
    var nx = true;
    while (true) {
      if (self.hasNext()) {
        last = self.next();
        if (f(last)) { break; }
      } else {
        nx = false;
        break;
      }
    }
    return new It(
      function () { return nx; },
      function () {
        var r = last;
        if (self.hasNext()) { last = self.next(); } else { nx = false; }
        return r;
      }
    );
  };

  //# (T - ) -
  it.each = function (f) {
    while (this.hasNext()) { f(this.next()); }
  };

  //# (T - num - ) -
  it.eachIx = function (f) {
    var c = -1;
    while (this.hasNext()) { f(this.next(), ++c); }
  };

  /// Equals comparing with "!=="
  //# It<T> - bool
  it.eq = function (i) {
    if (!i) { return false; }
    while (this.hasNext() && i.hasNext()) {
      if (this.next() !== i.next()) { return false; }
    }
    if (this.hasNext() || i.hasNext()) { return false; }
    return true;
  };

  /// Equals comparing with [f]
  //# It<T> - (T - T - bool) - bool
  it.eqf = function (i, f) {
    if (!i) { return false; }
    while (this.hasNext() && i.hasNext()) {
      if (!f(this.next(), i.next())) { return false; }
    }
    if (this.hasNext() || i.hasNext()) { return false; }
    return true;
  };

  /**
   * Filters [this], returning a subset of collection.
   *   f      : Function to select values
   */
  //# (T - bool) - !It<T>
  it.filter = function (f) {
    var self = this;
    var last = null;
    var nx = true;
    var nnext = function () {
      while (true) {
        if (self.hasNext()) {
          last = self.next();
          if (f(last)) {
            break;
          }
        } else {
          nx = false;
          break;
        }
      }
    };
    nnext();
    return new It(
      function () { return nx; },
      function () {
        var r = last;
        nnext();
        return r;
      }
    );
  };

  /// Returns those elements that gives <b>true</b> with [f].
  //# (T - bool) - !Arr<T>
  it.find = function (f) {
    var a = [];
    this.each(function (e) { if (f(e)) { a.push(e); } });
    return a;
  };

  /// Returns the first element that gives <b>true</b> with [f] or null
  //# (T - bool) - T
  it.findFirst = function (f) {
    var e;
    while (this.hasNext()) {
      e = this.next();
      if (f(e)) { return e; }
    }
    return null;
  };

  /// Returns the index of first element that is equals (===) to [e]
  //# T - num
  it.index = function (e) {
    var i = 0;
    while (this.hasNext()) {
      if (this.next() === e) { return i; }
      ++i;
    }
    return -1;
  };

  /// Returns the index of first element that gives <b>true</b> with [f]
  /// or -1 if [this] has nothing
  //# (T - bool) - num
  it.indexf = function (f) {
    var i = 0;
    while (this.hasNext()) {
      if (f(this.next())) { return i; }
      ++i;
    }
    return -1;
  };

  /// Returns the index of first element that is equals (===) to [e]
  //# T - num
  it.lastIndex = function (o) {
    var r = -1;
    var i = 0;
    this.each(function (e) {
      if (e === o) { r = i; }
      ++i;
    });
    return r;
  };

  /// Returns the index of last element that gives <b>true</b> with [f]
  /// or -1 if [this] has nothing
  //# (T - bool) - num
  it.lastIndexf = function (f) {
    var r = -1;
    var i = 0;
    this.each(function (e) {
      if (f(e)) { r = i; }
      ++i;
    });
    return r;
  };

  /// Returns the iterator whish results of apply 'f' to every element
  /// of 'this'
  //# U :: (T - U) - !It<U>
  it.map = function (f) {
    var self = this;
    return new It(
      function () { return self.hasNext(); },
      function () { return f(self.next()); }
    );
  };

  /// Returns the result of applying [f]([f]([seed], e1), e2)... over
  /// every element of [this].
  //# R :: R - (R - T - R) - R
  it.reduce = function (seed, f) {
    while (this.hasNext()) { seed = f(seed, this.next()); }
    return seed;
  };

  /// Returns [this] in reverse order
  ///   Creates an array!
  //# - !It<T>
  it.reverse = function () { return It.from(this.to().reverse()); };

  /// Returns the number of elements of [this].
  //# - num
  it.size = function () {
    var r = 0;
    this.each(function () { ++r; });
    return r;
  };

  /// Sort [this] in natural order (lowercase after uppercase)
  ///   Creates an array!
  //# - !It<T>
  it.sort = function () { return It.from(this.to().sort()); };

  /// Sort [this] conforming [compare] function
  ///   Creates an array!
  //# (T - T - num) - !It<T>
  it.sortf = function (f) { return It.from(this.to().sort(f)); };

  /// Returns an iterator over elements of [this] mixed
  ///   Creates an array!
  //# - !It<T>
  it.shuffle = function () {
    var tmp;
    var ni;
    var a = this.to();
    var i = a.length;
    if (!i) { return It.empty(); }
    while (--i) {
      ni = Math.floor(Math.random() * (i + 1));
      if (ni !== i) {
        tmp = a[i];
        a[i] = a[ni];
        a[ni] = tmp;
      }
    }
    return It.from(a);
  };

  /**
   * Returns n first elements.<p>
   * If [this] has less elements than 'n' returns all of theirs.<p>
   * [this] can be used for the rest of data after consume 'take'.
   */
  //# num - !It<T>
  it.take = function (n) {
    var self = this;
    return new It(
      function () { return self.hasNext() && n > 0; },
      function () {
        --n;
        return self.next();
      }
    );
  };

  /// Returns the first elements of [it] whish give <b>true</b> with [f]
  //# (T - bool) - !It<T>
  it.takeWhile = function (f) {
    var self = this;
    var last = null;
    var hnx = false;
    if (self.hasNext()) {
      last = self.next();
      hnx = true;
    }
    return new It(
      function () { return hnx && f(last); },
      function () {
        var r = last;
        last = null;
        hnx = false;
        if (self.hasNext()) {
          last = self.next();
          hnx = true;
        }
        return r;
      }
    );
  };

  /// Returns the n first elements of [it] whish give <b>false</b> with [f]
  //# (T - bool) - !It<T>
  it.takeUntil = function (f) {
    return this.takeWhile(function (e) { return !f(e); });
  };

  //# - !Arr<T>
  it.to = function () {
    var a = [];
    this.each(function (o) { a.push(o); });
    return a;
  };

  //# - str
  it.toString = function () { return "[" + It.join(this, ", ") + "]"; };

// ----------------------------------------------- //

  //# - !It<?>
  It.empty = function () {
    return new It(
      function () { return false; },
      function () { return null; }
    );
  };

  /// Create an It from an array
  //# T :: Arr<T> - It<T>
  It.from = function (a) {
    var i = 0;
    var len = a.length;
    return new It(
      function () { return i < len; },
      function () { return a[i++]; }
    );
  };

  /// Return an [It] over a Bytes object.
  //# Uint8Array - !It<num>
  It.fromBytes = function (bs) {
    var l = bs.length;
    var c = 0;
    return new It(
      function () { return c < l; },
      function () { return bs[c++]; }
    );
  };

  /// Returns an [It] over String characters.
  //# str - !It<str>
  It.fromStr = function (s) {
    var l = s.length;
    var c = 0;
    return new It(
      function () { return c < l; },
      function () { return s[c++]; }
    );
  };

  //# !It<str> - ?str - str
  It.join = function (i, sep) {
    if (!sep) { sep = ""; }
    if (!i.hasNext()) { return ""; }
    var r = i.next();
    i.each(function (o) { r += sep + o; });
    return r;
  };

  //# K, V :: !Obj<K, V> - !It<K>
  It.keys = function (o) {
    var k;
    var tmp = [];
    for (k in o) { if (o.hasOwnProperty(k)) { tmp.push(k); } }
    return It.from(tmp);
  };

  /**
   * Iterates over a range. If end is null the range is [0 - startEnd),
   * otherwise the range is [starEnd - end)
   */
  //# num - ?num - !It<num>
  It.range = function (startEnd, end) {
    if (!end) {
      end = startEnd;
      startEnd = 0;
    }

    if (startEnd < 0) { startEnd = 0; }

    return new It(
      function () { return startEnd < end; },
      function () { return startEnd++; }
    );
  };

  /// Divide [s] by [sep]
  //# str - str - !It<str>
  It.split = function (s, sep) {
    if (sep === "") { return It.fromStr(s); }
    var nx = true;
    var p = 0;
    var len = sep.length;
    return new It(
      function () { return nx; },
      function () {
        var ix = s.indexOf(sep, p);
        if (ix < 0) {
          nx = false;
          return s.substring(p);
        }
        var r = s.substring(p, ix);
        p = ix + len;
        return r;
      }
    );
  };

  /// Sorts an It of strings in locale and returns it.
  //# !It<str> - !It<str>
  It.sortl = function (i) {
    var a = i.map(function (e) { return e.replace(/ /g, " ! "); }).to();
    return dm.It.from(
      a.sort(function (e1, e2) { return e1.localeCompare(e2); })
    ).map(function (e) { return e.replace(/ ! /g, " "); });
  };

  /// Returns two iterators from one It<Tp2>
  ///   Creates two arrays!
  //# A, B :: !It<!Tp<A, B>> - !Tp<!It<A>,!It<B>>
  It.unzip = function (i) {
    var a1 = [];
    var a2 = [];
    i.each(function (tp) {
      a1.push(tp.e1);
      a2.push(tp.e2);
    });
    return new Tp(It.from(a1), It.from(a2));
  };

  /// Returns three iterators from one It<Tp3>
  ///   Creates three arrays!
  //# A, B, C :: !It<!Tp3<A, B, C>> - !Tp3<!It<A>,!It<B>,!It<C>>
  It.unzip3 = function (i) {
    var a1 = [];
    var a2 = [];
    var a3 = [];
    i.each(function (tp) {
      a1.push(tp.e1);
      a2.push(tp.e2);
      a3.push(tp.e3);
    });
    return new Tp(It.from(a1), It.from(a2), It.from(a3));
  };

  /// Returns a iterator with elements of [it1] and [it2].<p>
  /// The number of elements of resultant iterator is the least of both ones.
  //# A, B :: !It<A> - !It<B> - !It<!Tp<A, B>>
  It.zip = function (i1, i2) {
    return new It(
      function () { return i1.hasNext() && i2.hasNext(); },
      function () { return new Tp(i1.next(), i2.next()); }
    );
  };

  /// Returns a iterator with elements of [it1], [it2] and [it3].<p>
  /// The number of elements of resultant iterator is the least of three ones.
  //# A, B, C :: !It<A> - !It<B> - !It<C> - !It<!Tp3<A, B, C>>
  It.zip3 = function (i1, i2, i3) {
    return new It(
      function () { return i1.hasNext() && i2.hasNext() && i3.hasNext(); },
      function () { return new Tp(i1.next(), i2.next(), i3.next()); }
    );
  };

}());

