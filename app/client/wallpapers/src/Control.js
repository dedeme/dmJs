// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Control");

goog.require("Model");
goog.require("I18n");
goog.require("View");

Control = class {
  constructor () {
    /** @private */
    this._model = Model.mk();
    /** @private */
    this._view = null;

    if (this._model.language() === "es") I18n.es(); else I18n.en();
  }

  /** @return {!Model} */
  model () {
    return this._model;
  }

  /** @return {View} */
  view () {
    return this._view;
  }

  /** @param {View} value */
  setView (value) {
    this._view = value;
  }

  /** @return {void} */
  run () {
    this._view = new View(this);
    this._view.show();
    this.draw();
  }

  /**
   * @param {string} lang
   * @return {void}
   */
  language(lang) {
    this._model.setLanguage(lang);
    if (this._model.language() === "es") I18n.es(); else I18n.en();
    this.run();
  }

  /**
   * @param {boolean} value
   * @return {void}
   */
  setPrecodeShow (value) {
    this._model.setPrecodeShow(value);
    this.run();
  }

  /** @return {void} */
  draw () {
    this._view.viewer().draw();
    this._model.fcPush();
  }

  /**
   * @param {number} size
   * @return {void}
   */
  canvasSize (size) {
    this._model.setCanvasSize(size);
    this.run();
  }

  /** @return {void} */
  save () {
    let file = prompt(_("File name") + ":", "");
    if (file !== null && file !== "") {
      let hidden = $("a")
        .att("href", "data:text/csv;charset=utf-8," + this._model.saveFs())
        .att("download", file)
        .att("target", "_blank");
      hidden.e().click();
    }
  }

  /**
   * @param {?} files
   * @return {void}
   */
  load (files) {
    let self = this;
    let model = this._model;

    if (files.length != 1) {
      alert(_("Only can be uploaded one file"));
      return;
    }

    let reader = new FileReader();
    reader.onload/**/ = e => {
      model.loadFs(/** @type {string} */(reader.result/**/));
      self.run();
    };
    reader.readAsText(files[0]);
  }

  /** @return {void} */
  redoPrecode () {
    this._model.precodeRedo();
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} color
   * @return {void}
   */
  redoColor (color) {
    this._model.fcRedo(color);
    this.run();
  }

  /** @return {void} */
  undoPrecode () {
    this._model.precodeUndo();
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} color
   * @return {void}
   */
  undoColor (color) {
    this._model.fcUndo(color);
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} source
   * @param {number} target
   * @return {void}
   */
  changeColor (source, target) {
    this._model.fcChange(source, target);
    this.run();
  }

  /**
   * x e y are in pixels
   * @param {number} x
   * @param {number} y
   */
  setCoor (x, y) {
    this._model.setCoor(x, y);
    this._view.menu().setCoor();
  }

  /**
   * Show Galery page
   * @return {void}
   */
  gallery () {
    this._view.showGallery();
  }

  /**
   * Load a gallery image
   * @param {string} path
   * @return {void}
   */
  getGallery (path) {
    let self = this;
    Ui.upload(path, data => {
      self._model.loadFs(data);
      self.run();
    });
  }
}
