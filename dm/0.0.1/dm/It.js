//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(ns => {
  "use strict";
  //# T :: ( - bool) - ( - T) - It
  ns.It = function (hasNext, next) {
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

  }

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

// ----------------------------------------------- //

  //# - !It<?>
  ns.It.empty = () => new dm.It (() => false, () => null);


})(dm);

