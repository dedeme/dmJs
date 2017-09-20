// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Buttons");

Buttons = class {
  /** @param {!Control} control */
  constructor (control) {
    /** @const {!Control} */
    this._control = control;
  }

  /** @return {!Array<!Domo>} */
  mk () {
    /**
     * @param {number} c
     * @return {!Domo}
     */
    let mkTd = c => {
      const control = this._control;

      let separator = () => $("span").html("&nbsp;");

      let mkUndo = color =>
        Ui.link(ev => { control.undoColor(color); }).add(Ui.img("undo"));

      let mkRedo = color =>
        Ui.link(ev => { control.redoColor(color) }).add(Ui.img("redo"));

      let mkColor = color => Ui.img(
          color === 0 ? "redColor" : color == 1 ? "greenColor" : "blueColor"
        );

      let mkLed = (source, target) =>
        Ui.link(ev => {
            control.changeColor(source, target);
          }).add(Ui.img(
            target == 0 ? "redPin" : target == 1 ? "greenPin" : "bluePin"
          ));

      let undo = mkUndo(c);
      let redo = mkRedo(c);
      let color = mkColor(c);
      let led1 = mkLed(c, 2);
      let led2 = mkLed(c, 1);
      if (c === 1) {
        led1 = mkLed(c, 0);
        led2 = mkLed(c, 2);
      } else if (c == 2) {
        led1 = mkLed(c, 1);
        led2 = mkLed(c, 0);
      }
      return $("td").style("text-align:center;width:10px;")
        .add(undo)
        .add(separator())
        .add(redo)
        .add(separator())
        .add(color)
        .add(separator())
        .add(led1)
        .add(separator())
        .add(led2)
      ;
    }

    return [mkTd(0), mkTd(1), mkTd(2)];
  }

}

