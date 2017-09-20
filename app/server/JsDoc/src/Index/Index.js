// Copyright 14-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Index");

goog.require("Global");
goog.require("Conf");
goog.require("I18n");
goog.require("Path");
goog.require("IndexV");

{
  /**
   * @param {string} json
   * @return {!Array<!Path>}
   */
  function pathsFromJson (json) {
    if (json === "") {
      return [];
    }
    let data = /** @type {!Array<!Array<?>>} */(JSON.parse(json))
    return It.from(data).map(s => Path.restore(s)).to()
  }

  /** @return {string} */
  function getSelected () {
    return Ui.url()["0"];
  }

Index = class {
  run () {
    const self = this;
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Index", "rq": "get"};
        client.send(data, rp => {
          const conf = Conf.restore(rp["conf"]);
          if (conf.lang() === "es") I18n.es(); else I18n.en();
          Global.setLanguage(conf.lang());
          const selected = getSelected();
          conf.setPath(selected);

          data = {"page": "Index", "rq": "setConf", "conf": conf.serialize()}
          client.send(data, _rp => {
            const paths = pathsFromJson(rp["paths"]);
            const p = It.from(paths).findFirst(p => p.id() === selected);
            if (p === undefined) {
              alert(_args(_("Library %0 not found"), selected));
              location.assign("../Paths/index.html")
              return;
            }
            if (paths.length > 0) {
              data = {
                "page" : "Index",
                "rq": "path",
                "path" : p.path()
              }
              client.send(data, rp => {
                let tree = IndexTree.restore(rp["tree"]);
                if (tree.help() === null && tree.entries() === null) {
                  alert(_args(_("Error reading %0"), selected))
                  location.assign("../Paths/index.html")
                  return;
                }
                new IndexV(self).show(paths, selected, tree);
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
new Index().run();

