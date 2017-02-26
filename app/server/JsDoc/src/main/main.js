//- app/global.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global window, app */

(() => {
  const global = app.global;

  //# -
  function main () {
    var client = global.client();
    client.send("main/index.js", "pagePath", {}, function (path) {
      if (path === "@") {
        window.location.assign("../conf/index.html");
      } else {
        throw "Bad page type number.";
      }
    });
  }

  main();

})();
