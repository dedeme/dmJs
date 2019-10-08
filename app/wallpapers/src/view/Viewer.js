// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Domo from "../dmjs/Domo.js"; //eslint-disable-line
import Ui from "../dmjs/Ui.js";
import Main from "../Main.js"; //eslint-disable-line
import Model from "../Model.js"; //eslint-disable-line

const $ = Ui.$;
const divCanvas = $("div").style("text-align:center;");

export default class Viewer {

  /** @param {!Main} control */
  constructor (control) {
    /** @const {!Main} */
    this._control = control;
    /** @const {!Model} */
    this._model = control.model();

    /** @const {!Domo} */
    this._canvas = $("canvas");
    const cv = this._canvas.e;
    cv.width = this._model.canvasw();
    cv.height = this._model.canvash();
    cv.onclick = ev => {
      const rect = cv.getBoundingClientRect();
      this._control.setCoor(
        ev.clientX/**/ - rect.left/**/, ev.clientY/**/ - rect.top/**/
      );
    };
  }

  /** @return {!Domo} */
  mk () {
    const canvas = this._canvas;
    divCanvas.removeAll()
      .add($("table").att("align", "center").add($("tr")
        .add($("td").style(
          "background-color: rgb(250, 250, 250);" +
          "border: 1px solid rgb(110,130,150);" +
          "padding: 4px 4px 0px 4px;border-radius: 4px;"
        ).add(canvas))));
    return divCanvas;
  }

  /** @return {void} */
  draw () {
    const model = this._model;
    const cv = this._canvas.e;
    const ctx = cv.getContext("2d");
    const w = model.canvaspw();
    const h = model.canvasph();
    const maxy = model.canvash() - 1;

    const plot = (partx, party) => {
      const idata = ctx.createImageData(w, h);
      const data = idata.data/**/;
      for (let y = 0; y < h; ++y) {
        const y2 = maxy - party * h - y;
        for (let x = 0; x < w; ++x) {
          const x2 = partx * w + x;
          const px = (y * w + x) * 4;

          data[px] = model.fCalc(0, x2, y2);
          data[px + 1] = model.fCalc(1, x2, y2);
          data[px + 2] = model.fCalc(2, x2, y2);
          data[px + 3] = 255;
        }
      }
      ctx.putImageData(idata, partx * w, party * h);
    };

    let partx = 0;
    let party = 0;

    const timer = setInterval(() => {
      plot(partx, party);
      ++partx;
      if (partx === model.canvaspx()) {
        partx = 0;
        ++party;
        if (party === model.canvaspy()) {
          clearInterval(timer);
        }
      }
    }, 10);
  }
}

