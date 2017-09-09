// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Gallery");
goog.require("GalleryAux");

Gallery = class {
  /** @param {!Control} control */
  constructor (control) {
    /** @const {!Control} */
    this.control = control;
  }

  /** @return {!Domo} */
  mkGoBack () {
    let control = this.control;
    return $("table").att("align", "center").add($("tr")
      .add($("td").klass("frame")
        .add(Ui.link(ev => { control.run(); })
          .klass("link").html(_("Go back")))));
  }

  /** @return {!Domo} */
  mk () {
    let control = this.control;
    /** @type {!Hash<!Array<string>>} */
    let hash = GalleryAux.getData();

    let span = () => $("span").style("padding-right:4px;padding-bottom:4px");

    let entries = It.keys(hash).map(k =>
      $("li")
        .html("<a href='#' onclick='return false;'>" + k + "</a>")
        .add($("ul").att("id", "hlist")
          .style("list-style:none;padding-left:20px;padding-top:8px;")
          .add($("li").add($("div")
            .addIt(It.from(hash.take(k)).map(e => {
              let p = "stock/" + k + "/" + e;
              return span().add(Ui.link(ev => {
                  control.getGallery(p);
                }).add($("img")
                  .klass("frame")
                  .att("src", p + ".png")
                  .att("title", p.substring(p.lastIndexOf("/") + 1))));
            }))
        ))));


    return $("div")
      .add($("ul").style("list-style:none;padding-left:0px;margin-top:0px;")
        .addIt(entries)
      );
  }
}
