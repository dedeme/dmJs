//- app/dom.js
//- conf/conf.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, app, conf */

(() => {
  const ui = dm.ui;
  const $ = ui.$;

  class View {
    constructor (control) {
      this._control = control;
    }

    get control () { return this._control; }

    show () {
      const closeSession =  () =>  this.control.closeSession();
      app.dom0.show(
        ui.link(closeSession).add(
          $("span", [ui.klass("link"), ui.html("close")]))
      );
    }
  }
  conf.View = View;

})();

