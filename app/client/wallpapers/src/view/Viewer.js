// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Viewer");

{
  const divCanvas = $("div").style("text-align:center;");

Viewer = class {
  /** @param {!Control} control */
  constructor (control) {
    /** @const {!Control} */
    this._control = control;
    /** @const {!Model} */
    this._model = control.model();

    /** @const {!Domo} */
    this._canvas = $("canvas");
    let cv = this._canvas.e();
    cv.width = this._model.canvasw();
    cv.height = this._model.canvash();
    cv.onclick = ev => {
      let rect = cv.getBoundingClientRect();
      this._control.setCoor(ev.clientX - rect.left, ev.clientY - rect.top);
    }

  }

  /** @return {!Domo} */
  mk () {
    let canvas = this._canvas;
    let cv = canvas.e();
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
    let model = this._model;
    let cv = this._canvas.e();
    let ctx = cv.getContext("2d");
    let w = model.canvaspw();
    let h = model.canvasph();
    let maxy = model.canvash() - 1;

    let plot = (partx, party) => {
      let idata = ctx.createImageData(w, h);
      let data = idata.data;
      for (let y = 0; y < h; ++y) {
        let y2 = maxy - party * h - y;
        for (let x = 0; x < w; ++x) {
          let x2 = partx * w + x;
          let px = (y * w + x) * 4;

          data[px] = model.fCalc(0, x2, y2);
          data[px + 1] = model.fCalc(1, x2, y2);
          data[px + 2] = model.fCalc(2, x2, y2);
          data[px + 3] = 255;
        }
      }
      ctx.putImageData(idata, partx * w, party * h);
    }

    let partx = 0;
    let party = 0;

    let timer = setInterval(() => {
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

}}

