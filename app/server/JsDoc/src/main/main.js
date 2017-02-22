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
    switch (global.getPageType()) {
    case (global.confPage):
      window.location.assign("../conf/index.html");
      break;
    default:
      throw "Bad page type number.";
    }
  }

  main();

})();
