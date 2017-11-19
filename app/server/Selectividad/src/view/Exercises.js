// Copyright 14-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Exercises");

view_Exercises = class {
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

    const exercisesShow = $("div");
    const idField = $("input");
    let cutSelect = $("select");
    const accept = $("button").html("Aceptar")
      .on("click", ev => {
        const id = idField.value().trim();
        if (id === "") {
          alert(_("Exercise indentifier is missing"));
          return;
        }
        const cut = cutSelect.value().trim();
        control.setExercise(id, exercisesList, cut === "" ? 0 : +cut);
      });
    /**
     * @type {!Array<?>} Where Array<?> is
     *  [exaId:str, exIx:number]
     */
    const exercisesList = [];

    const itemsShow = $("div");
    const itemsButtons = [];

    let cut = 0;
    let unit = "";

    function inExercisesList(tp) {
      return It.from(exercisesList).containsf(t =>
        t[0] === tp[0] && t[1] === tp[1]
      );
    }

    function mkCutSelect() {
      cutSelect = Ui.select("c", It.range(10).map(i =>
          i === 0
            ? cut === 0 ? "+" : ""
            : cut === i ? ("+" + i) : ("" + i)
        ).to());
      cutSelect.on("change", () => {
        const v = cutSelect.value().trim();
        cut = v === "" ? 0 : +v;
        mkCutSelect();
      });
    }

    function mkExercisesTable () {
      let i = 0;
      return $("table").klass("main")
        .addIt(It.from(exercisesList)
          .map(tp => {
            const ix = i;
            const r = $("tr")
              .add($("td").style("width:5px")
                .add(ix === 0
                  ? Ui.img("blank").klass("frame")
                  : Ui.link(ev => {
                      const tp = exercisesList[ix];
                      exercisesList[ix] = exercisesList[ix - 1]
                      exercisesList[ix - 1] = tp;
                      editClick();
                    }).add(Ui.img("arrow-up").klass("frame"))))
              .add($("td").style("width:5px")
                .add(ix === exercisesList.length - 1
                  ? Ui.img("blank").klass("frame")
                  : Ui.link(ev => {
                      const tp = exercisesList[ix];
                      exercisesList[ix] = exercisesList[ix + 1]
                      exercisesList[ix + 1] = tp;
                      editClick();
                    }).add(Ui.img("arrow-down").klass("frame"))))
              .add($("td").style("width:5px")
                .add(Ui.link(ev => {
                    exercisesList.splice(ix, 1);
                    editClick();
                    itemsShow.removeAll().add(mkItemsTable())
                  }).add(Ui.img("list-remove").klass("frame"))))
              .add($("td").style("width:5px;white-space:nowrap;")
                .html(tp[0]))
              .add($("td").style("text-align:left").klass("frame")
                .html(db.exas()[tp[0]][tp[1]][0]));
            ++i;
            return r;
        }))
    }

    function mkItemsTable () {
      if (unit === "") {
        return $("table").klass("main").add($("tr").add($("td")));
      }
      return $("table").klass("main")
        .addIt(It.from(db.itemsList(unit))
          .filter(tp => !inExercisesList(tp))
          .map(tp =>
            $("tr")
              .add($("td").style("width:5px")
                .add(Ui.link(ev => {
                    exercisesList.push([tp[0], tp[1]]);
                    editClick();
                    itemsShow.removeAll().add(mkItemsTable())
                  }).add(Ui.img("list-add").klass("frame"))))
              .add($("td").style("width:5px;white-space:nowrap;")
                .html(tp[0]))
              .add($("td").style("text-align:left").klass("frame")
                .html(db.exas()[tp[0]][tp[1]][0]))
        ))
    }

    function mkExerciseButton (ix) {
      let tx = "0" + ix;
      tx = tx.substring(tx.length - 2);
      return $("div").klass("frame")
        .style("cursor:pointer;font-family:monospace;font-size:12px")
        .att("title", Db.units()[tx])
        .html(tx)
        .on("click", ev => {
            It.from(itemsButtons).eachIx((bt, i) => {
              bt.klass(i + 1 === ix ? "frame3" : "frame");
              unit = tx;
              itemsShow.removeAll().add(mkItemsTable())
            });
          });
    }
    It.range(1, 15).each(i => { itemsButtons.push(mkExerciseButton(i)); });

    function editClick() {
      mkCutSelect();
      const pdfLink = $("span").klass("frame")
        .html(It.range(25).reduce("", (s, i) => s + "&nbsp"));
      exercisesShow.removeAll().add($("table").klass("main")
        .add($("tr")
          .add($("td").style("text-align:left;")
            .add($("span").html(_("Identifier") + ": "))
            .add(idField)
            .add($("span").html("&nbsp;&nbsp;&nbsp;"))
            .add(Ui.link(ev => {
                pdfLink.removeAll().add($("img").att("src", "img/wait.gif"));
                control.printExercise(
                  idField.value(), exercisesList, cut, () => {
                    pdfLink.html("<a href='tmp/exercise.pdf'>exercise.pdf</a>");
                  }
                );
              }).add(Ui.img("pdf").klass("frame")
                .style("vertical-align:middle")
              ))
            .add($("span").html("&nbsp;&nbsp;"))
            .add(pdfLink)
            .add($("span").html("&nbsp;&nbsp;&nbsp;"))
            .add($("span").html(_("cut") + ": "))
            .add(cutSelect))
          .add($("td").style("text-align:right;")
            .add(accept)))
        .add($("tr")
          .add($("td").att("colspan", 2)
            .add(mkExercisesTable())))
      );
    }

    const upLeft = $("table")
      .add($("tr")
        .add($("td").style("width:5px;"))
        .add($("td").style("text-align:left;white-space:nowrap;")
          .add(Ui.link(ev => {
            idField.value("");
            exercisesList.splice(0, exercisesList.length);
            cut = 0;
            editClick();
            itemsShow.removeAll().add(mkItemsTable())
          }).klass("link").html(_("New Exercise")))))
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .addIt(It.keys(db.exes()).sort().map(e =>
        $("tr")
          .add($("td").add(Ui.link(ev => {
              if (confirm("¿Eliminar '" + e + "'?")) {
                control.delExercise(e);
              }
            })
            .add(Ui.img("delete"))))
          .add($("td").style("text-align:left;white-space:nowrap;")
            .add(Ui.link(ev => {
              idField.value(e);
              exercisesList.splice(0, exercisesList.length);
              const exe = db.exes()[e];
              It.from(exe[0]).each(tp => { exercisesList.push(tp); });
              cut = exe[1];
              editClick();
              itemsShow.removeAll().add(mkItemsTable())
            }).klass("link").html(e)))
      ));

    const upRight = $("div").add(exercisesShow);

    control.dom().show("exercises", $("table").klass("main")
      .add($("tr").add($("td").att("colspan", 2).style("text-align:center;")
        .add($("p").html("<b>" + _("Exercices") + "</b>"))))
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr")
        .add($("td").style("vertical-align:top;text-align:left;width:5px")
          .klass("frame")
          .add(upLeft))
        .add($("td").style("vertical-align:top;text-align:center")
          .add(upRight)))
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr").add($("td").att("colspan", 2)
        .add($("table").att("align", "center").add($("tr")
          .addIt(It.from(itemsButtons).map(bt => $("td").add(bt)))
        ))))
      .add($("tr").add($("td").att("colspan", 2).add(itemsShow)))
    );
  }
}


