//- dm/DateDm.js
/*
 * Copyright 12-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window, dm */

(() => {
  const It = dm.It;

  dm.store = {};
  const store = dm.store;

  /// Removes all keys of local storage
  //# -
  store.clear = () => {
    window.localStorage.clear();
  };

  /// Removes the key [key]  of local storage
  //# str -
  store.del = key => {
    window.localStorage.removeItem(key);
  };

  /**
   * Removes some [keys] past the time [time] since it was called itself.<p>
   * If it has not called ever delete keys too.
   *   name : Storage key for saving the time
   *   keys : Array with the keys to remove
   *   time : Time in hours
   */
  //# str - Arr<str> - num -
  store.expires = (name, keys, time) => {
    const dt = new Date(Date.now()).getTime();
    const ks = store.get(name);
    if (ks === null || dt > +ks) {
      It.from(keys).each(k => {
        store.del(k);
      });
    }
    store.put(name, "" + (dt + time * 3600000));
  };

  /// Returns the value of key [key] or <b>null</b> if it does not exists
  /// of local storage
  //# str - ?str
  store.get = key => window.localStorage.getItem(key);

  /// Returns the key in position [ix] of local storage
  //# num - ?str
  store.key = ix => window.localStorage.key(ix);

  /// Returns a It with all keys of local storage
  //# - It<str>
  store.keys = () => {
    const sz = store.size();
    let c = 0;
    return new It(() => c < sz, () => store.key(c++));
  };

  /// Puts a new value in local storage
  //# str - str -
  store.put = (key, value) => {
    window.localStorage.setItem(key, value);
  };

  /// Returns the number of elements of local storage
  //# - num
  store.size = () => window.localStorage.length;

  /// Returns a It with all values of local storage
  //# - It<str>
  store.values = () => store.keys().map(e => store.get(e));

  /// Removes all keys of session storage
  //# -
  store.sessionClear = () => {
    window.sessionStorage.clear();
  };

  /// Removes the key [key]  of session storage
  //# str -
  store.sessionDel = key => {
    window.sessionStorage.removeItem(key);
  };

  /// Returns the value of key [key] or <b>null</b> if it does not exists
  /// of session storage
  //# str - ?str
  store.sessionGet = key => window.sessionStorage.getItem(key);

  /// Returns the key in position [ix] of session storage
  //# num - ?str
  store.sessionKey = ix => window.sessionStorage.key(ix);

  /// Returns a It with all keys of session storage
  //# - It<str>
  store.sessionKeys = () => {
    const sz = store.sessionSize();
    let c = 0;
    return new It(() => c < sz, () => store.sessionKey(c++));
  };

  /// Puts a new value in session storage
  //# str - str -
  store.sessionPut = (key, value) => {
    window.sessionStorage.setItem(key, value);
  };

  /// Returns the number of elements of session storage
  //# - num
  store.sessionSize = () => window.sessionStorage.length;

  /// Returns a It with all values of session storage
  //# - It<str>
  store.sessionValues = () => store.sessionKeys().map(e => store.sessionGet(e));

})();
