//- dm/DateDm.js
/*
 * Copyright 12-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(function () {
  "use strict";

  var It = dm.It;

  dm.store = {};
  var store = dm.store;

  /// Removes all keys of local storage
  //# -
  store.clear = function () { window.localStorage.clear(); };

  /// Removes the key [key]  of local storage
  //# str -
  store.del = function (key) { window.localStorage.removeItem(key); };

  /**
   * Removes some [keys] past the time [time] since it was called itself.<p>
   * If it has not called ever delete keys too.
   *   name : Storage key for saving the time
   *   keys : Array with the keys to remove
   *   time : Time in hours
   */
  //# str - Arr<str> - num -
  store.expires = function (name, keys, time) {
    var dt = new Date(Date.now()).getTime();
    var ks = store.get(name);
    if (ks === null || dt > +ks) {
      It.from(keys).each(function (k) { store.del(k); });
    }
    store.put(name, "" + (dt + time * 3600000));
  };

  /// Returns the value of key [key] or <b>null</b> if it does not exists
  /// of local storage
  //# str - ?str
  store.get = function (key) { return window.localStorage.getItem(key); };

  /// Returns the key in position [ix] of local storage
  //# num - ?str
  store.key = function (ix) { return window.localStorage.key(ix); };

  /// Returns a It with all keys of local storage
  //# - It<str>
  store.keys = function () {
    var sz = store.size();
    var c = 0;
    return new It(
      function () { return c < sz; },
      function () { return store.key(c++); }
    );
  };

  /// Puts a new value in local storage
  //# str - str -
  store.put = function (key, value) {
    window.localStorage.setItem(key, value);
  };

  /// Returns the number of elements of local storage
  //# - num
  store.size = function () { return window.localStorage.length; };

  /// Returns a It with all values of local storage
  //# - It<str>
  store.values = function () {
    return store.keys().map(function (e) { return store.get(e); });
  };

  /// Removes all keys of session storage
  //# -
  store.sessionClear = function () { window.sessionStorage.clear(); };

  /// Removes the key [key]  of session storage
  //# str -
  store.sessionDel = function (key) { window.sessionStorage.removeItem(key); };

  /// Returns the value of key [key] or <b>null</b> if it does not exists
  /// of session storage
  //# str - ?str
  store.sessionGet = function (key) {
    return window.sessionStorage.getItem(key);
  };

  /// Returns the key in position [ix] of session storage
  //# num - ?str
  store.sessionKey = function (ix) { return window.sessionStorage.key(ix); };

  /// Returns a It with all keys of session storage
  //# - It<str>
  store.sessionKeys = function () {
    var sz = store.sessionSize();
    var c = 0;
    return new It(
      function () { return c < sz; },
      function () { return store.sessionKey(c++); }
    );
  };

  /// Puts a new value in session storage
  //# str - str -
  store.sessionPut = function (key, value) {
    window.sessionStorage.setItem(key, value);
  };

  /// Returns the number of elements of session storage
  //# - num
  store.sessionSize = function () { return window.sessionStorage.length; };

  /// Returns a It with all values of session storage
  //# - It<str>
  store.sessionValues = function () {
    return store.sessionKeys().map(
      function (e) { return store.sessionGet(e); }
    );
  };

}());
