// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Paths");

goog.require("Global");
goog.require("Conf");
goog.require("PathsM");
goog.require("PathsV");
goog.require("I18n");

Paths = class {
  constructor () {
    /**
     * @private
     * @type {PathsM}
     */
    this._model = null
  }

  /** @return {!PathsM} */
  model () {
    if (this._model === null) {
      throw ("model is null");
    }
    return this._model;
  }

  run () {
    const self = this;
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Paths", "rq": "get"};
        client.send(data, rp => {
          const conf = Conf.restore(rp["conf"]);
          if (conf.lang() === "es") I18n.es(); else I18n.en();
          Global.setLanguage(conf.lang());
          conf.setPath("");

          data = {"page": "Paths", "rq": "setConf", "conf": conf.serialize()}
          client.send(data, _rp => {
            const paths = PathsM.pathsFromJson(rp["paths"]);
            this._model = new PathsM(conf, paths);
            if (paths.length > 0) {
              data = {
                "page" : "Paths",
                "rq": "exists",
                "paths" : It.from(paths).map(p => [p.id(), p.path()]).to()
              }
              client.send(data, rp => {
                let map = rp["paths"];
                It.from(paths).each(p => {
                  p.setValid(map[p.id()]);
                  if (!p.valid()) {
                    p.setShow(false);
                  }
                });
                new PathsV(self).show();
              });
            } else {
              new PathsV(self).show();
            }
          });
        });
      } else {
        location.assign("../Auth/index.html");
      }
    });
  }

  /**
   * @param {string} id
   * @param {string} path
   * @return {void}
   */
  newPath (id, path) {
    id = id.trim();
    path = path.trim();
    while (path.endsWith("/")) {
      path = path.substring(0, path.length - 1)
    }

    const vId = this._model.validateId(id);
    if (vId !== "") {
      alert(vId);
      return;
    }

    const vPath = this._model.validatePath(path);
    if (vPath !== "") {
      alert(vPath);
      return;
    }

    this._model.paths().push(new Path(id, path, true));
    let data = {
      "page": "Paths",
      "rq": "setPaths",
      "paths": this._model.pathsToJson()
    };
    Global.client().send(data, rp => {
      new Paths().run();
    });
  }

  /**
   * @param {string} id
   * @return {void}
   */
  modifyBegin (id) {
    let view = new PathsV(this);
    view.show();
    view.modify(id);
  }

  modifyPath (id, newId, path, newPath) {
    newId = newId.trim();
    newPath = newPath.trim();
    let vname = this._model.validateId(newId);
    let vpath = this._model.validatePath(newPath);

    if (newId !== id && vname !== "") {
      alert(vname);
    } else if (vpath !== "") {
      alert(vpath);
    } else {
      if (id === newId && path === newPath) {
        new Paths().run();
      } else {
        let p = It.from(this._model.paths()).findFirst(p => p.id() === id);
        if (p) {
          p.setId(newId);
          p.setPath(newPath);
          let data = {
            "page": "Paths",
            "rq": "setPaths",
            "paths": this._model.pathsToJson()
          };
          Global.client().send(data, rp => {
            new Paths().run();
          });
          return;
        }
        throw ("Path " + id  + " does not exists")
      }
    }
  }

  /**
   * @param {string} id
   * @return {void}
   */
  deletePath (id) {
    if (!confirm(_args(_("Delete %0?"), id))) {
      return;
    }
    const paths = this._model.paths();
    const ix = It.from(paths).indexf(p => p.id() === id);
    paths.splice(ix, 1);
    let data = {
      "page": "Paths",
      "rq": "setPaths",
      "paths": this._model.pathsToJson()
    };
    Global.client().send(data, rp => {
      new Paths().run();
    });
  }

  /**
   * @param {string} id
   * @param {boolean} sel
   * @param {boolean} err
   * @return {void}
   */
  selPath (id, sel, err) {
    if (err) {
      alert(_("This source can not be selected, because it does not exist"));
      return;
    }
    let p = It.from(this._model.paths()).findFirst(p => p.id() === id);
    if (p) {
      p.setShow(sel);
      let data = {
        "page": "Paths",
        "rq": "setPaths",
        "paths": this._model.pathsToJson()
      };
      Global.client().send(data, rp => {
        new Paths().run();
      });
      return;
    }
    throw ("Path " + id  + " does not exists")

  }

  /**
   * @return {void}
   */
  changeShowAll () {
    const conf = this._model.conf();
    conf.setShowAll(conf.showAll() ? false : true);
    let data = {"page": "Paths", "rq": "setConf", "conf": conf.serialize()};
    Global.client().send(data, rp => {
      new Paths().run();
    });
  }

  /**
   * @return {void}
   */
  changeLang () {
    const conf = this._model.conf();
    conf.setLang(conf.lang() === "es" ? "en" : "es");
    let data = {"page": "Paths", "rq": "setConf", "conf": conf.serialize()};
    Global.client().send(data, rp => {
      new Paths().run();
    });
  }

  /**
   * @return {void}
   */
  changePass () {
    location.assign("../Chpass/index.html");
  }

}
new Paths().run();

