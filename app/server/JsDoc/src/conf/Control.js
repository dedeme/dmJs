//- conf/View.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global window, conf */

(() => {

  class Control {
    constructor (client) {
      this._client = client;
    }

    get client () { return this._client; }

    run () {
      new conf.View(this).show();
    }

    closeSession () {
      this.client.close();
      window.location.assign("../main/index.html");
    }
  }
  conf.Control = Control;

})();

