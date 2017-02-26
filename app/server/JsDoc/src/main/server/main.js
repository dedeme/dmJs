//- jdm/NoDb.js
//- app/server/jglobal.js
//- app/com/fields.js
/*
 * Copyright 26-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global jdm, fields, jglobal */


function pagePath(data) { // eslint-disable-line
  var server = jglobal.mkServer();
  var io = jdm.io;
  var ConfEntry = fields.ConfEntry;
  var PathsEntry = fields.PathsEntry;
  var conf;

  if (!io.isDirectory(server.root)) {
    server.init();
    conf = new jdm.NoDb(server, "data/conf.db", ConfEntry);
    conf.add(new ConfEntry("@", true, ""));
    new jdm.NoDb(server, "data/paths.db", PathsEntry);
  }

  conf = new jdm.NoDb(server, "data/conf.db", ConfEntry);
  return server.rp(data, function () {
    return conf.read().next().path;
  });
}

