//- app/global.js
//- dm/i18n.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global window, dm, app */

(() => {
  const global = app.global;
  const _ = dm.i18n._;
  const showAllStore = "DmjsDoc__conf_showAll";

  const control = {};

  // Client -
  control.run = client => {
    window.alert(client.app);
  };

  //# -
  function main () {
    global.language();
    const client = global.client();
    if (client) control.run(client);
    else window.location.assign("../auth/index.html");
  }

  main();

})();

