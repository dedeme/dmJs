// Copyright 12-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Edit");

view_Edit = class {
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
    const idField = $("input");
    const editArea = $("textarea").att("cols", 90).att("rows", 20);
    let editText = "";
    const resultArea = $("div").klass("frame2");
    const accept = $("button").html("Aceptar")
      .on("click", ev => {
        const id = idField.value().trim();
        const tx = editArea.value().trim();
        if (id === "") {
          alert(_("Exercise indentifier is missing"));
          return;
        }
        if (tx === "") {
          alert(_("Text is empty"));
          return;
        }
        if (It.keys(db.exas()).findFirst(i => i === id) !== undefined) {
          if (!confirm(
            _args(_("An identifier called '%0' already exists.\n"), id) +
            _("Overwrite?")
          )) {
            return;
          }
        }
        control.setExam(id, tx);
      });

    function editClick() {
      editor.removeAll().add($("table").klass("main")
        .add($("tr")
          .add($("td").style("text-align:left;")
            .add($("span").html("Identificador: "))
            .add(idField))
          .add($("td").style("text-align:right;")
            .add(accept)))
        .add($("tr").add($("td").att("colspan", 2)
          .style("text-align:center;")
          .add(editArea)))
        .add($("tr").add($("td").att("colspan", 2)
          .style("text-align:center;")
          .add(resultArea.addStyle("width:100%;"))))
      );

      control.setEndInterval(false);
      const interval = setInterval(() => {
        if (editText !== editArea.value()) {
          editText = editArea.value();
          resultArea.removeAll()
            .add($("p").style("text-align:left;").html(editText));
        }
        if (control.endInterval()) {
          clearInterval(interval);
        }
      }, 500)
    }

    const left = $("table")
      .add($("tr")
        .add($("td").style("width:5px;"))
        .add($("td").style("text-align:left;white-space:nowrap;")
          .add(Ui.link(ev => {
            control.setEndInterval(true);
            editClick();
            idField.value("");
            editArea.value("");
          }).klass("link").html(_("New Exam")))))
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .addIt(It.keys(db.exas()).sort().reverse().map(e =>
        $("tr")
          .add($("td").add(Ui.link(ev => {
              if (confirm("¿Eliminar '" + e + "'?")) {
                control.delExam(e);
              }
            })
            .add(Ui.img("delete"))))
          .add($("td").style("text-align:left;white-space:nowrap;")
            .add(Ui.link(ev => {
              control.setEndInterval(true);
              editClick();
              idField.value(e);
              editArea.value(It.from(db.exas()[e]).reduce("", (s, tp) =>
                s += "<div>\n" + tp[0] + "\n</div>\n\n"
              ));
            }).klass("link").html(e)))
      ));

    const right = $("div")
      .add($("p").html("<b>" + _("Edit") + "</b>"))
      .add(editor.removeAll());

    control.dom().show("edit", $("table").klass("main").add($("tr")
      .add($("td").style("vertical-align:top;text-align:left;width:5px")
        .klass("frame")
        .add(left))
      .add($("td").style("vertical-align:top;text-align:center")
        .add(right))));
  }
}


