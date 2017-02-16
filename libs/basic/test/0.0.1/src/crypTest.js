//- dm/Test.js
//- dm/cryp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

const crypTest = () => {
  const cryp = dm.cryp;

  const t = new dm.Test("cryp");

  t.mark("s2b-b2s");

  t.eq("0g", cryp.s2b("a"));
  t.eq("a", cryp.b2s(cryp.s2b("a")));
  t.eq("1ghRRx0iRWBRWr", cryp.s2b("ab cñç"));
  t.eq("ab cñç", cryp.b2s(cryp.s2b("ab cñç")));
  t.eq("RRbRRa0gVFR0hRRx0i", cryp.s2b("\n\ta€b c"));
  t.eq("\n\ta€b c", cryp.b2s(cryp.s2b("\n\ta€b c")));

  t.mark("key");

  t.eq(6, cryp.genK(6).length);
  t.eq("WpYzY", cryp.key("Generaro", 5));
  t.eq("VTlxr", cryp.key("Generara", 5));

  t.mark("cryp");

  t.eq("01", cryp.decryp("abc", cryp.cryp("abc", "01")));
  t.eq("11", cryp.decryp("abcd", cryp.cryp("abcd", "11")));
  t.eq("", cryp.decryp("abc", cryp.cryp("abc", "")));
  t.eq("a", cryp.decryp("c", cryp.cryp("c", "a")));
  t.eq("ab c", cryp.decryp("xxx", cryp.cryp("xxx", "ab c")));
  t.eq("\n\ta€b c", cryp.decryp("abc", cryp.cryp("abc", "\n\ta€b c")));

  t.mark("autoCryp");

  t.eq("01", cryp.autoDecryp(cryp.autoCryp(8, "01")));
  t.eq("11", cryp.autoDecryp(cryp.autoCryp(4, "11")));
  t.eq("", cryp.autoDecryp(cryp.autoCryp(2, "")));
  t.eq("a", cryp.autoDecryp(cryp.autoCryp(8, "a")));
  t.eq("ab c", cryp.autoDecryp(cryp.autoCryp(4, "ab c")));
  t.eq("\n\ta€b c", cryp.autoDecryp(cryp.autoCryp(2, "\n\ta€b c")));

  t.mark("encode");

  t.eq("01", cryp.decode("abc", cryp.encode("abc", 2, "01")));
  t.eq("11", cryp.decode("abcd", cryp.encode("abcd", 1, "11")));
  t.eq("", cryp.decode("abc", cryp.encode("abc", 2, "")));
  t.eq("a", cryp.decode("c", cryp.encode("c", 6, "a")));
  t.eq("ab c", cryp.decode("xxx", cryp.encode("xxx", 40, "ab c")));
  t.eq("\n\ta€b c", cryp.decode("abc", cryp.encode("abc", 2, "\n\ta€b c")));

  t.mark("encodeURIComponent");

  t.eq("01", decodeURIComponent(encodeURIComponent("01")));
  t.eq("W", encodeURIComponent("W"));
  t.eq(decodeURIComponent(encodeURIComponent("W")), "W");
  t.eq("", encodeURIComponent(""));
  t.eq("", decodeURIComponent(encodeURIComponent("")));
  t.eq("ab", encodeURIComponent("ab"));
  t.eq(decodeURIComponent(encodeURIComponent("ab")), "ab");
  t.eq("ab%20c", encodeURIComponent("ab c"));
  t.eq(decodeURIComponent(encodeURIComponent("ab c")), "ab c");
  t.eq("%0A%09a%E2%82%ACb%20c", encodeURIComponent("\n\ta€b c"));
  t.eq(decodeURIComponent(encodeURIComponent("\n\ta€b c")), "\n\ta€b c");


  t.log();
};

