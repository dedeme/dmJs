// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Formulae");

Formulae = class {
  /** @param {!Control} control */
  constructor (control) {
    /** @const {!Model} */
    this.model = control.model;
  }

  mk () {
    let model = this.model;

    let mkTextEntry = () => $("textarea").att("rows", 15).att("cols", "30");

    let mkTd = () => $("td")
      .style("text-align:center;vertical-align:top;width:10px;");

    let fcs = It.range(3).map(i => mkTextEntry()
      .value(model.fcs[i][0])
      .on("change", ev => { model.fcSet(i, fcs[i].value()); })
    ).to();

    return [
      mkTd().add(fcs[0]),
      mkTd().add(fcs[1]),
      mkTd().add(fcs[2])
    ];
  }
}
