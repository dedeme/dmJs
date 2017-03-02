//- app/server/jglobal.js
//- app/com/fields.js
//- jdm/NoDb.js
/*
 * Copyright 25-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global jdm, jglobal, fields */


function init (data) { // eslint-disable-line
  var cryp = jdm.cryp;
  var ConfEntry = fields.ConfEntry;
  var PathsEntry = fields.PathsEntry;
  var PathsData = fields.PathsData;
  var ConfData = fields.ConfData;

  var server = jglobal.mkServer();
  return server.rp(data, function () {
    var confDb = new jdm.NoDb(server, "data/conf.db", ConfEntry);
    var pathsDb = new jdm.NoDb(server, "data/paths.db", PathsEntry);
    var conf;
    var paths;

    confDb.modify(function (cf) {
      cf.path = "";
      cf.pageId = cryp.genK(120);
      return cf;
    });
    conf = confDb.read().next();

    paths = pathsDb.read().map(function (pe) {
      var existing = pe.visible;  // TO MODIFY
      return new PathsData(
        pe.name,
        pe.path,
        pe.visible,
        existing
      );
    }).to();

    return new ConfData(conf, paths).serialize();
  });
}
