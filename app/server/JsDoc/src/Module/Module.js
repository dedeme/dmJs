// Copyright 14-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Module");

goog.require("Global");
goog.require("Conf");
goog.require("I18n");
goog.require("Path");
goog.require("ModuleV");

{
  function pathsFromJson (json) {
    if (json === "") {
      return [];
    }
    let data = /** @type {!Array<!Array<?>>} */(JSON.parse(json))
    return It.from(data).map(s => Path.restore(s)).to()
  }

  function getSelectedPath () {
    const u = Ui.url()["0"];
    const ix = u.indexOf("@")
    if (ix == -1) {
      throw("@ is missing");
    }
    return new Tp(u.substring(0, ix), u.substring(ix + 1));
  }

Module = class {
  run () {
    const self = this;
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Module", "rq": "get"};
        client.send(data, rp => {
          const conf = Conf.restore(rp["conf"]);
          if (conf.lang() === "es") I18n.es(); else I18n.en();
          Global.setLanguage(conf.lang());
          const selected = getSelectedPath().e1();
          const rpath = getSelectedPath().e2();
          conf.setPath(selected + "@" + rpath);

          data = {"page": "Module", "rq": "setConf", "conf": conf.serialize()}
          client.send(data, _rp => {
            const paths = pathsFromJson(rp["paths"]);
            const p = It.from(paths).findFirst(p => p.id() === selected);

            if (p === undefined) {
              alert(_args(_("Library %0 not found"), selected));
              location.assign("../Paths/index.html")
              return;
            }

            const modPath = p.path() + "/" + rpath;
            const filePath = modPath + ".js";
            if (paths.length > 0) {
              data = {
                "page" : "Module",
                "rq": "code",
                "path" : filePath
              }
              client.send(data, rp => {
                ModuleV.show(paths, selected, rpath, rp["text"]);
              });
            } else {
              throw("Number of paths is 0");
            }
          });
        });
      } else {
        location.assign("../Auth/index.html");
      }
    });
  }
}}
new Module().run();

