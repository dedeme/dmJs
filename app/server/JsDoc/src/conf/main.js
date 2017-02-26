//- app/global.js
//- dm/i18n.js
//- conf/Control.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, app, conf */

(() => {
  const global = app.global;
  const _ = dm.i18n._; // eslint-disable-line
  const showAllStore = "JsDoc__conf_showAll"; // eslint-disable-line

  //# -
  function main () {
    const client = global.client();
    new conf.Control(client).run();
  }
/*
    client.send("conf/index.js", "start", {
    }, d => { // eslint-disable-line
      alert("here"); // eslint-disable-line
    });
  }
*/
  main();

})();

