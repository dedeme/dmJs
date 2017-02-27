//- dm/dm.js
//- dm/It.js
/*
 * Copyright 14-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(function () {
  const It = dm.It;
  const ui = dm.ui;
  const $ = ui.$;
  const Box = dm.Box;

  //#
  class Captcha {
    //# - Catcha
    constructor () {
      this._value = "11110000";
      this._oneColor = "#6060d0";
      this._zeroColor = "#d06060";
      this._checks = [];
    }

    /// Captcha 0-1 distribution. Its order will be changed by make()
    //# str
    get value () { return this._value; }
    set value (n) { this._value = n; }

    /// Color of squares with value 1
    //# str
    get oneColor () { return this._oneColor; }
    set oneColor (n) { this._oneColor = n; }

    /// Color of squares with value 0
    //# str
    get zeroColor () { return this._zeroColor; }
    set zeroColor (n) { this._zeroColor = n; }


    /// Returns code selected by user
    //# - str
    selection () {
      return It.join(It.from(this._checks).map(c => c.o.checked ? "1" : "0"));
    }

    /// Returns true if selection() == value
    //# - bool
    match () { return this.selection() === this.value; }

    /// Makes widget
    //# - !Domo
    mk () {
      this._checks = [];
      const tds = [];
      It.range(this.value.length).each(ix => {
        const back = this.value.charAt(ix) === "1"
          ? this.oneColor
          : this.zeroColor;
        const check = $("input").att("type", "checkbox");
        this._checks.push(check);
        tds.push($("td", [
          ui.style("border: 1px solid;background-color: " + back)
        ],[check]));
      });

      const box = new Box(tds);
      const tr1 = $("tr");
      const tr2 = $("tr");
      It.range(this.value.length).each(ix => {
        const tr = ix < this.value.length / 2 ? tr1 : tr2;
        tr.add(box.next());
      });

      return $("table", [
        ui.att("border", 0),
        ui.style('border: 1px solid;background-color: #fffff0')
      ], [tr1, tr2]);
    }
  }
  dm.Captcha = Captcha;

}());

