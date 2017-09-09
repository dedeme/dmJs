// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Precode");

{
  const buttonsDiv = $("div").style("text-align:center");
  const codeDiv = $("div");

Precode = class {
  /** @param {!Control} control */
  constructor (control) {
    /** @const {!Control} */
    this.control = control;
    /** @const {!Model} */
    this.model = control.model;
  }

  /** @return {!Domo} */
  mkButtons () {
    let control = this.control;

    let separator = () => $("span").html("&nbsp;");

    let mkUndo = () =>
      Ui.link(ev => { control.undoPrecode(); }).add(Ui.img("undo"));

    let mkRedo = () =>
      Ui.link(ev => { control.redoPrecode(); }).add(Ui.img("redo"));

    buttonsDiv.removeAll();
    if (this.model.precodeShow) {
      buttonsDiv.add(mkUndo()).add(separator()).add(mkRedo());
    }

    return buttonsDiv;
  }

  /** @return {!Domo}*/
  mkCode () {
    let model = this.model;
    let mkTextEntry = () => $("textarea").att("rows", 15).att("cols", "30");

    codeDiv.removeAll();
    if (model.precodeShow) {
      let entry = mkTextEntry().value(model.precode[0]);
      entry.on("change", ev => { model.precodeSet(entry.value()); });
      codeDiv.add(entry);
    }

    return codeDiv;
  }
}}
