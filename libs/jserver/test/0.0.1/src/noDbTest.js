//- jdm/Test.js
//- jdm/NoDb.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global */

function noDbTest() {
  "use strict";

  var Server = jdm.Server;
  var io = jdm.io;
  var NoDb = jdm.NoDb;

  var Elem = function (n, s) {
    this.n = n;
    this.s = s;
    this.serialize = function () {
      return [this.n, this.s];
    };
  }
  Elem.restore = function (s) {
    return new Elem(s[0], s[1]);
  };

  var t = new jdm.Test("NoDb");

  t.mark("constructor");

  var server = new Server("test", 0.5);
  var noDb = new NoDb(server, "noDbTest.db", Elem);
  noDb.delFile();

  noDb = new NoDb(server, "noDbTest.db", Elem);
  t.eq("noDbTest.db", noDb.path);
  t.eq(0, noDb.read().size());

  var e1 = new Elem(1, "one");
  noDb.add(e1);
  t.eq(1, noDb.read().size());

  var e2 = new Elem(2, "two");
  var e3 = new Elem(3, "three");
  noDb.add(e2);
  noDb.add(e3);
  t.eq(3, noDb.read().size());
  t.eq("one", noDb.findFirst(function (e) { return e.n === 1; }).s);
  t.eq(2, noDb.find(function (e) { return e.n < 3; }).length);

  noDb.del(function (e) { return e.n === 2; });
  t.eq(2, noDb.read().size());
  t.eq("one", noDb.findFirst(function (e) { return e.n === 1; }).s);
  t.eq(null, noDb.findFirst(function (e) { return e.n === 2; }));

  noDb.modify(function (e) { return e.n === 1 ? new Elem(6, "six") : e; });
  t.eq(2, noDb.read().size());
  t.eq("three", noDb.findFirst(function (e) { return e.n === 3; }).s);
  t.eq("six", noDb.findFirst(function (e) { return e.n === 6; }).s);
  t.not(noDb.findFirst(function (e) { return e === 1; }));

  noDb.del(function () { return true; });
  t.eq(0, noDb.read().size());

  io.del(io.cat([server.root, noDb.path]));
  io.del(server.root);

  t.log();
}
