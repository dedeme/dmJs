//- dm/java.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

function b41Test() {
  "use strict";

  var b41 = dm.b41;

  var t = new dm.Test("b41");

  t.mark("b2n-n2b");
  t.eq("R", b41.n2b(b41.b2n("R")));
  t.eq("f", b41.n2b(b41.b2n("f")));
  t.eq("F", b41.n2b(b41.b2n("F")));
  t.eq(0, b41.b2n("R"));
  t.eq(14, b41.b2n("f"));
  t.eq(40, b41.b2n("F"));
  t.eq("R", b41.n2b(0));
  t.eq("f", b41.n2b(14));
  t.eq("F", b41.n2b(40));

  t.mark("encode");

  var s = "ARazrmona Gómez, Antonio (€)";
  t.eq("RSpRTRRTgRTFRTxRTsRTuRTtRTgRRxRSvRWDRTsRTkRTFRSURRxRSpRTt" +
    "RTzRTuRTtRToRTuRRxRRFVFRRSR", b41.encode(s));
  t.eq(s, b41.decode(b41.encode(s)));

  t.mark("compress");

  t.eq("RSp7RgFxsutgRRxRSvRWD2skFRSURRxRSp5tzutouRRxRRFVFRRSR",
    b41.compress(s));
  t.eq(s, b41.decompress(b41.compress(s)));

  var a = [0, 23, 116, 225];
  t.eq("RRoixx", b41.encodeBytes(a));
  t.eq(JSON.stringify(a),
    JSON.stringify(b41.decodeBytes(b41.encodeBytes(a))));

  var a2 = [0, 23, 5, 116, 225];
  t.eq("RRoRzTWl", b41.encodeBytes(a2));
  t.eq(JSON.stringify(a2),
    JSON.stringify(b41.decodeBytes(b41.encodeBytes(a2))));

  t.log();
}

