//- dm/Test.js
//- dm/Server.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global */

function serverTest() {
  var Server = dm.Server;

  var t = new dm.Test("Server");

  t.mark("constructor");

  var server = new Server("test", 0.15);

  t.eq("test", server.app);
  t.eq(540000, server.expiration);
  t.yes(server.root.endsWith("dmcgi/test"));

  server.init();

  t.log();
}
