//- conf/View.js
//- conf/Model.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global window, conf, fields */

(() => {
  const ConfData = fields.ConfData;

  class Control {
    constructor (client) {
      this._client = client;
      this._model = null;
    }

    //# dm.Client
    get client () { return this._client; }
    //# Model
    get model () { return this._model; }

    run () {
      const self = this;
      this.client.send("conf/index.js", "init", {}, function (confData) {
        const cd = ConfData.restore(confData);
        self._model = new conf.Model(cd.conf, cd.paths);

        new conf.View(self).show();
      });
    }

    closeSession () {
      this.client.close();
      window.location.assign("../main/index.html");
    }
  }
  conf.Control = Control;

})();

