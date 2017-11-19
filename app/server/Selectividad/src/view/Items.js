// Copyright 13-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Items");

view_Items = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
  }

  /**
   * @return {void}
   */
  show () {
    const control = this._control;
    const db = control.db();

    const editor = $("div");
    const units = It.range(4).map(i =>
      Ui.select(
        "u",
        It.range(14).map(n => ("0" + n).substring(("0" + n).length - 2))
          .add0("+--").to()
      )
    ).to();

    function isUnitsEmpty(arr) {
      return It.from(arr).all(u => u === "");
    }

    function mkUnitsSelector(td, item) {
      const arr = item[1];
      const div = $("div");

      function mkSs(arr) {
        const us = It.keys(Db.units()).filter(u =>
          !It.from(arr).contains(u)
        ).sort().to();
        const ss = It.from(arr).map(au => {
          const r = Ui.select(
            "u",
            au === ""
              ? It.from(us).add0("+  ").to()
              : It.from(us).takeWhile(u => u < au)
                .add("+" + au)
                .addIt(It.from(us).dropWhile(u => u < au))
                .add0("  ").to()
          ).on("change", ev => {
            const v = r.value().trim();
            let first = true;
            item[1] = It.from(arr).map(unit => {
                if (first && unit === au) {
                  first = false;
                  return v;
                }
                return unit
              }).to();
            control.sendDb(() => {
              setTable(mkSs(item[1]));
              td.klass(isUnitsEmpty(item[1]) ? "frame2" : "frame")
            });
          });
          return r;
        }).to();
        return ss;
      }

      function setTable(ss) {
        div.removeAll().add($("table")
          .add($("tr")
            .add($("td").add(ss[0]))
            .add($("td").add(ss[1])))
          .add($("tr")
            .add($("td").add(ss[2]))
            .add($("td").add(ss[3])))
        );
      }

      setTable(mkSs(arr));

      return div;
    }

    function selectExam(e) {
      const exam = db.exas()[e];
      editor.removeAll().add($("table").klass("main")
        .addIt(It.from(exam).map(item => {
          const td = $("td");
          return $("tr")
            .add($("td")
              .klass("frame3")
              .style("width:5px;white-space: nowrap;")
              .add(mkUnitsSelector(td, item)))
            .add(td
              .klass(isUnitsEmpty(item[1]) ? "frame2" : "frame")
              .style("text-align:left;vertical-align:top;")
              .html(item[0]))
        })));
    }

    const left = $("table")
      .addIt(It.keys(db.exas()).sort().reverse().map(e =>
        $("tr")
          .add($("td").style("text-align:left;white-space:nowrap;")
            .add(Ui.link(ev => {
              selectExam(e);
            }).klass("link").html(e)))
      ));

    const right = $("div")
      .add($("p").html("<b>" + _("Items") + "</b>"))
      .add(editor.removeAll());

    control.dom().show("items", $("table").klass("main").add($("tr")
      .add($("td").style("vertical-align:top;text-align:left;width:5px")
        .klass("frame")
        .add(left))
      .add($("td").style("vertical-align:top;text-align:center")
        .add(right))));
  }
}


