//- tests.js
//- jdm/Test.js
//- jdm/io.js
//- jglobal.js
/*
 * Copyright 01-Mar-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global print, jdm, tests, jglobal */
(function () {
  "use strict";
  var io = jdm.io;

  tests.appServer = function () {
    var t = new jdm.Test("app/server");

    var s = jglobal.mkServer();
    t.eq("JsDoc", s.app);
    t.eq(1800000, s.expiration);
    s.init();
    t.yes(io.isDirectory(s.root));
    var f1 = io.cat([s.root, "sessions.db"]);
    var f2 = io.cat([s.root, "users.db"]);
    t.yes(io.exists(f1));
    t.yes(io.exists(f2));

    io.del(f1);
    io.del(f2);
    io.del(s.root);

    t.log();
  };

}());


