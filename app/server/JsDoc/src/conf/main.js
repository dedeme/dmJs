//- app/global.js
//- dm/i18n.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global window, dm, app */

(() => {
  const global = app.global;
  const _ = dm.i18n._; // eslint-disable-line
  const showAllStore = "JsDoc__conf_showAll"; // eslint-disable-line

  const control = {};

  // Client -
  control.run = client => {
    window.alert(client.app);
  };

  //# -
  function main () {
    let client = global.client();
    client.close();
    client = global.client();

    client.send("conf/index.js", "start", {
    }, d => { // eslint-disable-line
      alert("here"); // eslint-disable-line
    });
  }

  main();

})();

