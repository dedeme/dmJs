// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "../dmjs/Ui.js";
import Domo from "../dmjs/Domo.js";
import It from "../dmjs/It.js";
import GalleryAux from "./GalleryAux.js";
import {_} from "../I18n.js";
import Main from "../Main.js";

const $ = Ui.$;

export default class Gallery {
  /** @param {!Main} control */
  constructor (control) {
    /** @const {!Main} */
    this._control = control;
  }

  /** @return {!Domo} */
  mkGoBack () {
    let control = this._control;
    return $("table").att("align", "center").add($("tr")
      .add($("td").klass("frame")
        .add(Ui.link(ev => { control.run(); })
          .klass("link").html(_("Go back")))));
  }

  /** @return {!Domo} */
  mk () {
    let control = this._control;
    /** @type {!Object<string, !Array<string>>} */
    let map = GalleryAux.data();

    let span = () => $("span").style("padding-right:4px;padding-bottom:4px");

    let entries = Object.keys(map).sort((s1, s2) =>
        s1.toUpperCase() > s2.toUpperCase() ? 1 : -1
      ).map(k =>
        $("li")
          .html("<a href='#' onclick='return false;'>" + k + "</a>")
          .add($("ul").att("id", "hlist")
            .style("list-style:none;padding-left:20px;padding-top:8px;")
            .add($("li").add($("div")
              .adds([...It.from(map[k]).sort((s1, s2) =>
                  s1.toUpperCase() > s2.toUpperCase() ? 1 : -1
                ).map(e => {
                  let p = "stock/" + k + "/" + e;
                  return span().add(Ui.link(ev => {
                      control.getGallery(p);
                    }).add($("img")
                      .klass("frame")
                      .att("src", p + ".png")
                      .att("title", p.substring(p.lastIndexOf("/") + 1))));
                })])
          ))));


    return $("div")
      .add($("ul").style("list-style:none;padding-left:0px;margin-top:0px;")
        .adds(entries)
      );
  }
}
