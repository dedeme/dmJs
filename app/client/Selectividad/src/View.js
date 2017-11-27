// Copyright 16-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("View");

View = class {

  /**
   * @param {Main} control
   */
  constructor (control) {
    /**
     * @private
     * @type {Main}
     */
    this._control = control;

  }



  show () {
    const control = this._control;
    const md = control.md();
    const page = control.page();

    function formatUnit (i) {
      const tx = "0" + i;
      return tx.substring(tx.length - 2);
    }

    /** @return {!Domo} */
    function mkMenu () {
      /** @return {!Domo} */
      function entry(id, target) {
        return Ui.link(ev => { control.go([target, ""]) })
          .klass(target === page[0] ? "frame" : "link").html(id);
      }

      /** @return {!Domo} */
      function separator() {
        return $("span").html(" · ");
      }

      const opts = [
        entry("Exámenes", "exams"),
        separator(),
        entry("Temas", "topics"),
        separator(),
        entry("Ejercicios", "exes"),
      ];
      return $("table").klass("main").add($("tr")
      .add($("td")
        .addIt(It.from(opts))));
    }

    /** @return {!Domo} */
    function mkExams(exam) {
      const viewer = $("div").klass("frame");

      function show (k) {
        function td(topic) {
          return topic === ""
            ? $("td")
            : $("td").klass("frame")
              .add(Ui.link(ev => {
                  control.go(["topics", topic]);
                }).klass("link").html(topic));
        }
        viewer.removeAll().add($("table").klass("main")
          .addIt(It.from(md.exas()[k]).map(tp =>
            $("tr")
              .add($("td").klass("frame3").add($("table")
                .att("align", "center")
                .add($("tr")
                  .add(td(tp[1][0]))
                  .add(td(tp[1][1])))
                .add($("tr")
                  .add(td(tp[1][2]))
                  .add(td(tp[1][3])))))
              .add($("td").klass("frame").html(tp[0]))
        )));
      }

      if (exam !== "") {
        show(exam);
      }

      return $("table").klass("main").add($("tr")
        .add($("td").style("width:5px;white-space: nowrap;vertical-align:top;")
          .add($("div")
            .klass("frame")
            .addIt(It.keys(md.exas()).sort().reverse().map(k =>
              Ui.link(ev => { control.go(["exams", k]); }).klass("link")
                .html(exam === k
                  ? "<b>" + k + "</b><br>"
                  : k + "<br>")
            ))))
        .add($("td").style("vertical-align:top;").add(viewer))
      );
    }

    /** @return {!Domo} */
    function mkTopics(topic) {
      const viewer = $("div").klass("frame");

      function show (t) {
        const data = [];
        const exas = md.exas();
        It.keys(exas).each(k => {
          It.from(exas[k]).each(tp => {
            const ts = tp[1];
            if (ts[0] === t || ts[1] === t || ts[2] === t || ts[3] === t) {
              data.push([k, tp[0]]);
            }
          });
        });

        It.from(itemsButtons).eachIx((bt, i) => {
          bt.klass(i + 1 === +t ? "frame3" : "frame");
        });
        viewer.removeAll().add($("table").klass("main")
          .addIt(It.from(data)
            .sortf((d1, d2) => d1 < d2 ? 1 : d1 > d2 ? -1 : 0)
            .map(tp =>
              $("tr")
                .add($("td").klass("frame3").style("white-space:nowrap")
                  .add(Ui.link(ev => { control.go(["exams", tp[0]]); })
                    .klass("link").html(tp[0])))
                .add($("td").klass("frame").html(tp[1]))
        )));
      }

      const itemsButtons = [];
      function mkExerciseButton (ix) {
        const tx = formatUnit(ix);
        return $("div").klass("frame")
          .style("cursor:pointer;font-family:monospace;font-size:12px")
          .html(tx)
          .on("click", ev => { show(tx); });
      }
      It.range(1, 15).each(i => { itemsButtons.push(mkExerciseButton(i)); });

      if (topic !== "") {
        show(topic);
      }

      return $("table").klass("main")
        .add($("tr")
          .add($("td").add($("table").att("align", "center").add($("tr")
            .addIt(It.from(itemsButtons).map(bt => $("td").add(bt)))))))
        .add($("tr")
          .add($("td").add(viewer)))
      ;
    }

    /** @return {!Domo} */
    function mkExes() {
      let i = -1;
      return $("table").att("align", "center")
        .add($("tr").add($("td").att("colspan", 4).add($("hr"))))
        .addIt(It.from(Model.exes()).reduce(It.empty(), (it, e) =>
          it
            .add(
              $("tr")
                .add($("td").html(e[0]))
                .add($("td").html(e[1]))
                .add($("td").html(
                  "· <a href='exe/s" +
                    formatUnit(++i) +
                    ".pdf'>Ejercicio</a>"))
                .add($("td")
                  .html(e[2]
                    ? " · <a href='exe/s" +
                        formatUnit(i) +
                        "S.pdf'>Solución</a>"
                    : "")))
           .add($("tr").add($("td").att("colspan", 4).add($("hr"))))
        ));
    }

    $$("body").next().removeAll().add($("table").klass("main")
      .add($("tr")
        .add($("td").style("width:5px")
          .add(Ui.link(ev => { location.assign("../../../"); })
            .add(Ui.img("logo"))))
        .add($("td")))
      .add($("tr")
        .add($("td").style("text-align:center")
          .add(Ui.link(ev => { location.assign("../"); })
            .add(Ui.img("back"))))
        .add($("td").klass("title").html("BH2 - Selectividad")))
      .add($("tr").add($("td").att("colspan", 2).add($("hr"))))
      .add($("tr").add($("td").att("colspan", 2).add(mkMenu())))
      .add($("tr").add($("td").att("colspan", 2).add($("hr"))))
      .add($("tr").add($("td").att("colspan", 2).add(
            page[0] === "exams" ? mkExams(page[1])
          : page[0] === "topics" ? mkTopics(page[1])
          : page[0] === "exes" ? mkExes()
          : $("p").html(page + " is unkown")
        )))
      .add($("tr").add($("td").att("colspan", 2).add($("hr"))))
      .add($("tr").add($("td").att("colspan", 2)
        .add($("table").klass("main")
          .add($("tr")
            .add($("td")
              .add($("a")
                .att("href", "doc/about.html")
                .att("target", "blank")
                .html("<small>Ayuda y créditos</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. " + Main.app() + " (" +
                Main.version() + ") -"))))))
    );
  }

}
