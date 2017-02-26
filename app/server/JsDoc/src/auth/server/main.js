//- app/server/jglobal.js
/*
 * Copyright 25-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global jglobal */


function authentication (data) { // eslint-disable-line
  var server = jglobal.mkServer();
  return server.authRp(data);
}
