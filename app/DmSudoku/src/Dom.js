// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Domo from "./dmjs/Domo.js"; //eslint-disable-line
import Ui from "./dmjs/Ui.js";
import Main from "./Main.js";
import {Model} from "./Model.js";
import {_} from "./I18n.js";

const $ = Ui.$;
const $$ = Ui.$$;

export default class Dom {
  /**
   * @param {!Domo} o
   */
  static show (o) {
    $$("body")[0].removeAll().add(
      $("div")
        .add(o)
        .add($("p").html("&nbsp;"))
        .add($("hr"))
        .add($("table").klass("main")
          .add($("tr")
            .add($("td")
              .add($("a")
                .att("href", "doc_" + Model.mdata().lang() + "/about.html")
                .html("<small>" + _("Help & Credits") + "</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. DmSudoku (" + Main.version() + ") -"))))
    );
  }
}
