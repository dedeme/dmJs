// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("Global");
goog.require("Conf");

Main = class {
  run () {
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Main"};
        client.send(data, rp => {
          let path = Conf.restore(rp["conf"]).path();
          if (path === "") {
            location.assign("../Paths/index.html");
          } else if (path.indexOf("@") === -1) {
            location.assign("../Index/index.html?" + path);
          } else {
            if (path.indexOf("&") === -1) {
              location.assign("../Module/index.html?" + path);
            } else {
              location.assign("../Code/index.html?" + path);
            }
          }
        });
      } else {
        location.assign("../Auth/index.html");
      }
    });
  }
}
new Main().run();
