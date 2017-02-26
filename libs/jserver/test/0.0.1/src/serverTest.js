//- jdm/Test.js
//- jdm/Server.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global */

function serverTest() {
  var Server = jdm.Server;
  var io = jdm.io;

  var t = new jdm.Test("Server");

  t.mark("constructor");

  var server = new Server("test", 0.15);

  t.eq("test", server.app);
  t.eq(540000, server.expiration);
  t.yes(server.root.endsWith("dmcgi/test"));

  server.init();
  io.del(io.cat([server.root, "sessions.db"]));
  io.del(io.cat([server.root, "users.db"]));
  io.del(server.root);

  t.log();
}
