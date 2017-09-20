// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Model");

goog.require("github.dedeme");

{
  const StorePrefix = "dm_wallpapers_";
  const MAX_FUNCTIONS = 10;
  const EMPTY_INSTRUCTION = "return 0;";

Model = class {
  /**
   * @param {string} language
   * @param {boolean} precodeShow
   * @param {!Array<string>} precode
   * @param {!Array<!Array<string>>} fcs
   * @param {number} canvasSize From 1 to 12
   * @param {!Tp<number, number>} lastCoor
   */
  constructor(
    language,
    precodeShow,
    precode,
    fcs,
    canvasSize,
    lastCoor
  ) {
    /** @private */
    this._language = language;
    /** @private */
    this._precodeShow = precodeShow;
    /** @private */
    this._precode = precode;
    /** @private */
    this._fcs = fcs;
    /** @private */
    this._fcs2 = It.range(3).map(i => this.fcNormalize(fcs[i][0])).to();

    /** @private */
    this._canvasSize = canvasSize;
    /** @private */
    this._canvaspx = 0;
    /** @private */
    this._canvaspy = 0;
    /** @private */
    this._canvaspw = 0;
    /** @private */
    this._canvasph = 0;
    /** @private */
    this._canvasw = 0;
    /** @private */
    this._canvash = 0;

    /** @private */
    this._lastx = lastCoor.e1();
    /** @private */
    this._lasty = lastCoor.e2();

    this.canvasSizeCalc();
  }

  /** @return {!Array<string>} */
  precode () {
    return this._precode;
  }

  /** @return {!Array<!Array<string>>} */
  fcs () {
    return this._fcs;
  }

  /** @return {!Array<string>} */
  fc2 () {
    return this._fcs2;
  }

  /** @return {string} */
  language () {
    return this._language;
  }

  /** @param {string} value */
  setLanguage (value) {
    this._language = value;
    this.save();

  }

  /** @return {boolean} */
  precodeShow () {
    return this._precodeShow;
  }

  /** @param {boolean} value*/
  setPrecodeShow (value) {
    this._precodeShow = value;
    this.save();

  }

  /** @return {number} */
  canvasSize () {
    return this._canvasSize;
  }

  /** @param {number} value */
  setCanvasSize (value) {
    this._canvasSize = value;
    this.canvasSizeCalc();
    this.save();
  }

  /** @return {number} */
  canvaspx () {
    return this._canvaspx;
  }

  /** @return {number} */
  canvaspy () {
    return this._canvaspy;
  }

  /** @return {number} */
  canvaspw () {
    return this._canvaspw;
  }

  /** @return {number} */
  canvasph () {
    return this._canvasph;
  }

  /** @return {number} */
  canvasw () {
    return this._canvasw;
  }

  /** @return {number} */
  canvash () {
    return this._canvash;
  }

  /** @return {number} */
  lastx () {
    return this._lastx;
  }

  /** @return {number} */
  lasty () {
    return this._lasty;
  }

  /** @private */
  canvasSizeCalc() {
    this._canvaspx = this._canvaspy = this._canvasSize;
    this._canvaspw = 100;
    this._canvasph = 75;
    if (this._canvasSize == 6) {
      this._canvaspx = this._canvaspy = 5;
      this._canvaspw = 128;
      this._canvasph = 96;
    } else if (this._canvasSize == 7) {
      this._canvaspx = this._canvaspy = 8;
    } else if (this._canvasSize == 8) {
      this._canvaspx = this._canvaspy = 8;
      this._canvaspw = 128;
      this._canvasph = 96;
    } else if (this._canvasSize == 9) {
      this._canvaspx = this._canvaspy = 10;
      this._canvaspw = 128;
      this._canvasph = 80;
    } else if (this._canvasSize == 10) {
      this._canvaspx = this._canvaspy = 10;
      this._canvaspw = 128;
      this._canvasph = 96;
    } else if (this._canvasSize == 11) {
      this._canvaspx = 10;
      this._canvaspy = 8;
      this._canvaspw = this._canvasph = 128;
    } else if (this._canvasSize == 12) {
      this._canvaspx = this._canvaspy = 10;
      this._canvaspw = 140;
      this._canvasph = 105;
    } else if (this._canvasSize == 13) {
      this._canvaspx = this._canvaspy = 10;
      this._canvaspw = 160;
      this._canvasph = 120;
    }

    this._canvasw = this._canvaspx * this._canvaspw;
    this._canvash = this._canvaspy * this._canvasph;
  }

  /**
   * @private
   * @param {string} tx
   * @return {string}
   */
  fcNormalize (tx) {
    tx = this._precode[0] + tx;
    return "(function(){let x = valuex; let y = valuey;\n" +
      tx.split("#").join("Math.").split("·").join("Math.") +
      "\n}())";
  }

  /** @private */
  save () {
    Store.put(StorePrefix + "data", JSON.stringify(this.serialize()));
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setCoor (x, y) {
    this._lastx = x / this._canvasw;
    this._lasty = 1 - y / this._canvash;
    this.save();
  }

  /**
   * Changes last precode
   * @param {string} tx
   */
  precodeSet (tx) {
    this._precode[0] = tx;
    for (let i = 0; i < 3; ++i) {
      this._fcs2[i] = this.fcNormalize(this._fcs[i][0]);
    }
    this.save();
  }

  /**
   * Changes the last formula for color ix (0-Red, 1-Green, 2-Blue)
   * @param {number} ix
   * @param {string} tx
   */
  fcSet (ix, tx) {
    this._fcs[ix][0] = tx;
    this._fcs2[ix] = this.fcNormalize(tx);
    this.save();
  }

  /** Adds precode and fcs to historic */
  fcPush () {
    if (this._precode[0] !== this._precode[1]) {
      for (let i = 1; i < MAX_FUNCTIONS; ++i) {
        this._precode[MAX_FUNCTIONS - i] = this._precode[MAX_FUNCTIONS - 1 - i];
      }
    }
    for (let ix = 0; ix < 3; ++ix) {
      if (this._fcs[ix][0] !== this._fcs[ix][1]) {
        for (let i = 1; i < MAX_FUNCTIONS; ++i) {
          this._fcs[ix][MAX_FUNCTIONS - i] =
            this._fcs[ix][MAX_FUNCTIONS - 1 - i];
        }
      }
    }
    this.save();
  }

  /** Undo precode */
  precodeUndo () {
    if (this._precode[0] === this._precode[1]) {
      for (let i = 0; i < MAX_FUNCTIONS - 1; ++i) {
        this._precode[i] = this._precode[i + 1];
      }
      this._precode[MAX_FUNCTIONS - 1] = this._precode[0];
    }
    this.precodeSet(this._precode[1]);
  }

  /**
   * Undo fcs[ix]
   * @param {number} ix
   */
  fcUndo (ix) {
    if (this._fcs[ix][0] === this._fcs[ix][1]) {
      for (let i = 0; i < MAX_FUNCTIONS - 1; ++i) {
        this._fcs[ix][i] = this._fcs[ix][i + 1];
      }
      this._fcs[ix][MAX_FUNCTIONS - 1] = this._fcs[ix][0];
    }
    this.fcSet(ix, this._fcs[ix][1]);
  }

  /** Redo precode */
  precodeRedo () {
    this._precode[0] = this._precode[MAX_FUNCTIONS - 1];
    for (let i = 1; i < MAX_FUNCTIONS; ++i) {
      this._precode[MAX_FUNCTIONS - i] = this._precode[MAX_FUNCTIONS - 1- i];
    }
    this.precodeSet(this._precode[1]);
  }

  /**
   * Redo fcs[ix]
   * @param {number} ix
   */
  fcRedo (ix) {
    this._fcs[ix][0] = this._fcs[ix][MAX_FUNCTIONS - 1];
    for (let i = 1; i < MAX_FUNCTIONS; ++i) {
      this._fcs[ix][MAX_FUNCTIONS - i] = this._fcs[ix][MAX_FUNCTIONS - 1- i];
    }
    this.fcSet(ix, this._fcs[ix][1]);
  }

  /**
   * @param {number} source
   * @param {number} target
   */
  fcChange (source, target) {
    let tmp = this._fcs[source];
    this._fcs[source] = this._fcs[target];
    this._fcs[target] = tmp;
    this.fcSet(source, this._fcs[source][0]);
    this.fcSet(target, this._fcs[target][0]);
  }

  /**
   * Returns the value of fcs[ix] for values 'x', 'y'
   * @param {number} ix
   * @param {number} x0
   * @param {number} y0
   * @return {number}
   */
  fCalc (ix, x0, y0) {
    window["valuex"] = x0 / this._canvasw;
    window["valuey"] = y0 / this._canvash;
    let fr = /** @type {number} */(eval(this._fcs2[ix]));
    if (fr >= 1) {
      return 255;
    }
    if (fr < 0) {
      return 0;
    }
    return Math.floor(fr * 256);
  }

  /** @return {string} */
  saveFs () {
    return B64.encode(JSON.stringify([
      this._precode[0], this._fcs[0][0], this._fcs[1][0], this._fcs[2][0]
    ]));
  }

  /**
   * @param {string} fss
   * @return {void}
   */
  loadFs (fss) {
    let fs = /** @type {!Array<string>} */(JSON.parse(B64.decode(fss)));
    this.precodeSet(fs[0]);
    this.fcSet(0, fs[1]);
    this.fcSet(1, fs[2]);
    this.fcSet(2, fs[3]);
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._language,
      this._precodeShow,
      this._precode,
      this._fcs,
      this._canvasSize,
      this._lastx,
      this._lasty
    ];
  }

  /**
   * @param {!Array<?>} s
   * @return {!Model}
   */
  static restore (s) {
    return new Model(s[0], s[1], s[2], s[3], s[4], new Tp(s[5], s[6]));
  }

  /** @return {!Model} */
  static mk () {
//    Store.del(StorePrefix + "data");

    let data = Store.get(StorePrefix + "data");
    if (data === null) {
      let language = "es";
      let precodeShow = false;
      let precode = It.range(MAX_FUNCTIONS).map(i => "").to();
      let fcs = It.range(3).map(i =>
        It.range(MAX_FUNCTIONS).map(j => EMPTY_INSTRUCTION).to()
      ).to();
      let canvasSize = 1;
      let lastCoor = new Tp(0, 0);
      let model = new Model(
        language, precodeShow, precode, fcs, canvasSize, lastCoor
      );
      model.save();
      return model;
    }
    return Model.restore(/** @type {!Array<*>} */(JSON.parse(data)));
  }

}}
