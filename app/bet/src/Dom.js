// Copyright 13-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "./dmjs/Ui.js";
import It from "./dmjs/It.js";
import Dec from "./dmjs/Dec.js";
import {_, _args} from "./I18n.js";
// eslint-disable-next-line
import Domo from "./dmjs/Domo.js";
// eslint-disable-next-line
import Main from "./Main.js";

const $ = Ui.$;

export default class Dom {
  /** @param {!Main} control Control */
  constructor (control) {
    /** @private */
    this._control = control;
  }

  /** @return {void} */
  show () {
    const self = this;
    const control = self._control;
    const model = control.model();
    const lang = model.lang();

    const betsDiv = $("div");
    const profits = $("input").att("type", "text").klass("frame")
      .style("width:100px;color:#000000;text-align:center").disabled(true);

    /** @type {!Array<!Domo>} */
    let bets = [];

    function calculate () {
      const err = It.from(bets).reduce("", (s, e) => {
        if (s !== "") {
          return s;
        }
        const v = e.value().trim().replace(",", ".");
        if (v === "") {
          return _("There are missing values");
        }
        if (!Dec.isNumber(v)) {
          return _args(_("%0 is not a valid number"), v);
        }
        if (Number(v) <= 1) {
          return _args(_("%0: values must be greater than 1"), v);
        }
        return "";
      });
      if (err !== "") {
        alert(err);
        return;
      }
      const r = model.calculate(
        bets.map(e => Number(e.value().trim().replace(",", ".")))
      );
      profits.value(lang === "es" ? r.toEu() : r.toEn());
    }

    function clear () {
      It.from(bets).each(e => {
        e.value("");
      });
      profits.value("");
    }

    function mkBet (i) {
      const next = i === model.options() - 1 ? "calculate" : "bet-" + (i + 1);
      const r = Ui.field(next).att("id", "bet-" + i).klass("frame")
        .style("width:60px;color:#000000;")
        .on("focus", ev => {
          ev.target.select();
        })
        .on("mousedown", ev => {
          if (ev.button !== 0) {
            profits.value("");
          }
        }).on("keydown", () => {
          profits.value("");
        });
      return lang === "es" ? Ui.changePoint(r) : r;
    }

    function updateBets () {
      const lg = bets.length;
      const op = model.options();

      bets = [...It.range(op).map(i => {
        const field = mkBet(i);
        if (i < lg) {
          field.value(bets[i].value());
        }
        return field;
      }).to()];
      betsDiv.removeAll().add($("table").att("align", "center")
        .adds(bets.map(e => $("tr").add($("td").add(e))))
      );
      profits.value("");

      bets[0].e().focus();
    }

    function op (n) {
      return $("td").klass("frame")
        .add(Ui.link(() => {
          model.setOptions(n);
          updateBets();
        })
          .add($("span").style("font-family:monospace")
            .html("&nbsp;" + n + "&nbsp")));
    }

    function body () {
      return $("div")
        .add($("p").klass("title").html(model.appName()))
        .add($("hr"))
        .add($("table").att("align", "center").add($("tr")
          .adds([...It.range(2, 7).map(i => op(i)).to()])))
        .add($("br"))
        .add($("table").att("align", "center")
          .add($("tr")
            .add($("td").style("text-align:center;width:120px")
              .html("<b>" + _("Bets") + "</b>"))
            .add($("td").style("text-align:center;width:120px")
              .html("<b>" + _("Profits") + "</b>")))
          .add($("tr")
            .add($("td").add(betsDiv))
            .add($("td").style("vertical-align:top")
              .add($("table").att("align", "center")
                .add($("tr").add($("td").add(profits)))
                .add($("tr").add($("td").style("text-align:center;")
                  .add($("button").style("width:100px").text(_("Calculate"))
                    .att("id", "calculate")
                    .on("click", calculate))))
              )))
        )
        .add($("div").style("text-align:center")
          .add($("button").style("width:100px").text(_("Clear"))
            .on("click", clear)))
      ;
    }

    Ui.$$("body")[0].removeAll().add(
      $("div")
        .add(body())
        .add($("p").html("&nbsp;"))
        .add($("hr"))
        .add($("table").klass("main")
          .add($("tr")
            .add($("td")
              .add($("a")
                .att("href", "doc_" + lang + "/about.html")
                .html("<small>" + _("Help & Credits") + "</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. " + model.appName() +
                " (" + model.version() + ") -"))))
    );

    updateBets();
  }
}
