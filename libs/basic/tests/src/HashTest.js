// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("HashTest");
goog.require("github.dedeme");

HashTest = class {
  static run() {
    const t = new Test("Hash");

    /** @type {Hash<?number>} */
    let h = new Hash();

    t.eq(h.length, 0);
    h.put("one", 1);
    h.put("two", 2);
    h.put("three", 3);
    t.eq(h.length, 3);
    t.eq(h.take("one"), 1);
    t.eq(h.take("two"), 2);
    t.eq(h.take("three"), 3);
    t.eq(h.take("zero"), undefined);
    t.neq(h.take("zero"), null);
    h.put("one", null);
    h.put("zero", 0);
    t.eq(h.take("zero"), 0);
    t.neq(h.take("one"), undefined);
    t.eq(h.take("one"), null);
    h.del("one");
    t.eq(h.take("one"), undefined);
    t.eq(h.length, 3);
    let s = 0;
    h.keys().forEach((k) => s += h.take(k));
    t.eq(s, 5);


    let hb = /** @type {Hash<?number>} */ (Hash.fromJson(h.toJson()));
    t.eq(hb.length, 3);
    t.eq(hb.take("two"), 2);
    t.eq(hb.take("three"), 3);
    t.eq(hb.take("zero"), 0);
    hb.put("zero", 33);

    /** @type {!Object<string, string>} */
    let o= { "first" : "A", "second" : "B" };

    let h2 = Hash.from(o);
    t.eq(h2.length, 2);
    h2.put("first", "B");
    t.eq(h2.take("first"), "B");
    t.eq(o["first"], "B");

    t.log();
  }
}

