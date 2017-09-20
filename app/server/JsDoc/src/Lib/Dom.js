// Copyright 12-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Dom");

goog.require("Path")
goog.require("github.dedeme");
goog.require("Dom0");

Dom = class {
 /**
   * @param {!Array<!Path>} paths
   * @param {string} selected
   * @param {!Domo} o
   * @return {void}
   */
  static show (paths, selected, o) {
    let mkMenu = () =>
      $("table").att("border", "0").att("width", "100%")
        .add($("tr")
          .add($("td")
            .add((selected === ""
              ? $("a").klass("frame")
                .att("href", "../Paths/index.html")
              : $("a").att("href", "../Paths/index.html")
              )
              .add(Dom.img("asterisk").att("align", "top")))
            .addIt(
              It.from(paths).filter(r =>
                r.show()
              ).sortf((r1, r2) =>
                r1.id() > r2.id() ? 1 : -1
              ).map(row => {
                let sourceName = row.id();
                return $("span").text(" · ")
                  .add(
                    (selected === sourceName
                    ? $("span").att("class", "frame")
                      .add($("a")
                        .att("href", "../Index/index.html?" + sourceName)
                        .text(sourceName))
                    : $("a").att("href", "../Index/index.html?" + sourceName)
                      .text(sourceName)
                    )
                  );
              })))
          .add($("td").style("text-align:right;")
            .add(Ui.link(ev => {
                location.assign("../Logout/index.html");
              })
              .add(Dom.img("cross").att("align", "middle")))));

    Dom0.show(
      $("table").att("class", "main")
      .add($("tr")
        .add($("td").add(mkMenu())))
        .add($("tr")
          .add($("td").add($("hr"))))
        .add($("tr")
          .add($("td").add(o)))
    );
  }

  /**
   * @param {string} id
   * @return {!Domo}
   */
  static img (id) {
    return $("img")
      .att("src", "../img/" + (id.endsWith(".gif") ? id : id + ".png"))
      .att("border", "0");
  }

  /**
   * @param {string} id
   * @return {!Domo}
   */
  static lightImg (id) {
    return Dom.img(id).style("opacity:0.4");
  }
}
