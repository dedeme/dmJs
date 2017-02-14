//- dm/Test.js
//- dm/store.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

function storeTest() {
  "use strict";

  var store = dm.store;

  var t = new dm.Test("store");

  t.mark("put-get");

  store.expires("ex1", ["k1"], 0);
  store.expires("ex2", ["k2"], 1);

  store.put("k1", "one");
  store.put("k2", "");
  store.put("", "none");
  t.eq("one", store.get("k1"));
  t.eq("", store.get("k2"));
  t.eq("none", store.get(""));
  t.eq(null, store.get("xx"));

  t.mark("contains");

  t.eq(5, store.size());
  t.yes(store.keys().contains("k2"));
  t.yes(store.keys().contains("k1"));
  t.yes(store.keys().contains(""));
  t.yes(store.keys().size() === 5);
  t.yes(store.values().contains("none"));
  t.yes(store.values().contains("one"));
  t.yes(store.values().contains(""));
  t.yes(store.values().size() === 5);

  t.mark("del");

  store.del("");
  store.del("xx");
  t.yes(store.size() === 4);

  t.mark("expires");

  store.expires("ex1", ["k1"], 0);
  store.expires("ex2", ["k2"], 0);
  t.not(store.keys().contains("k1"));
  t.yes(store.keys().contains("k2"));

  t.mark("clear");

  store.clear();
  t.yes(store.size() === 0);

  t.log();
}

