// Copyright 12-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Logout");

goog.require("Global");
goog.require("Conf");
goog.require("Dom0");
goog.require("I18n");

Logout = class {
  run () {
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Logout"};
        client.send(data, rp => {
          const conf = Conf.restore(rp["conf"]);
          if (conf.lang() === "es") I18n.es(); else I18n.en();
          Dom0.show(
            $("div")
              .add($("div").style("text-align:center;")
                .html("&nbsp;<br>" +
                  "<a href='../Auth/index.html' class='title'>" +
                  Global.app() + "</a><br>&nbsp;"))
              .add($("div")
                .add($("table")
                  .att("class", "border")
                  .att("width", "100%")
                  .att("style",
                    "background-color: #f8f8f8;" +
                    "border-collapse: collapse;")
                  .add($("tr")
                    .add($("td")
                      .att("style", "padding:0px 10px 0px 10px;")
                      .html(_args(_("Logout-message%0"), Global.app()))))))
          );
        });
      } else {
        location.assign("../Auth/index.html");
      }
    });
  }
}

new Logout().run();
