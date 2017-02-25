//- jdm/Server.js
/*
 * Copyright 25-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global jdm */

(function () {
  "use strict"; // eslint-disable-line

  var Server = jdm.Server;

  //# - Server
  jdm.mkServer = function () {
    return new Server("JsDoc", 0.5);
  };

}());
