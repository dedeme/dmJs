// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Control");

goog.require("Model");
goog.require("I18n");
goog.require("View");

Control = class {
  constructor () {
    /** @constant {!Model} */
    this.model = Model.mk();
    /** @type {View} */
    this.view = null;

    I18n.lang = this.model.language === "es" ? I18n.es : I18n.en;
  }

  /** @return {void} */
  run () {
    this.view = new View(this);
    this.view.show();
    this.draw();
  }

  /**
   * @param {string} lang
   * @return {void}
   */
  language(lang) {
    this.model.language = lang;
    I18n.lang = this.model.language === "es" ? I18n.es : I18n.en;
    this.run();
  }

  /**
   * @param {boolean} value
   * @return {void}
   */
  setPrecodeShow (value) {
    this.model.precodeShow = value;
    this.run();
  }

  /** @return {void} */
  draw () {
    this.view.viewer.draw();
    this.model.fcPush();
  }

  /**
   * @param {number} size
   * @return {void}
   */
  canvasSize (size) {
    this.model.canvasSize = size;
    this.run();
  }

  /** @return {void} */
  save () {
    let file = prompt(_("File name") + ":", "");
    if (file !== null && file !== "") {
      let hidden = $("a")
        .att("href", "data:text/csv;charset=utf-8," + this.model.saveFs())
        .att("download", file)
        .att("target", "_blank");
      hidden.e.click();
    }
  }

  /**
   * @param {?} files
   * @return {void}
   */
  load (files) {
    let self = this;
    let model = this.model;

    if (files.length != 1) {
      alert(_("Only can be uploaded one file"));
      return;
    }

    let reader = new FileReader();
    reader.onload = e => {
      model.loadFs(/** @type {string} */(reader.result));
      self.run();
    };
    reader.readAsText(files[0]);
  }

  /** @return {void} */
  redoPrecode () {
    this.model.precodeRedo();
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} color
   * @return {void}
   */
  redoColor (color) {
    this.model.fcRedo(color);
    this.run();
  }

  /** @return {void} */
  undoPrecode () {
    this.model.precodeUndo();
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} color
   * @return {void}
   */
  undoColor (color) {
    this.model.fcUndo(color);
    this.run();
  }

  /**
   * Colors are: 0-Red, 1-Green  and 2-Blue
   * @param {number} source
   * @param {number} target
   * @return {void}
   */
  changeColor (source, target) {
    this.model.fcChange(source, target);
    this.run();
  }

  /**
   * x e y are in pixels
   * @param {number} x
   * @param {number} y
   */
  setCoor (x, y) {
    this.model.setCoor(x, y);
    this.view.menu.setCoor();
  }

  /**
   * Show Galery page
   * @return {void}
   */
  gallery () {
    this.view.showGallery();
  }

  /**
   * Load a gallery image
   * @param {string} path
   * @return {void}
   */
  getGallery (path) {
    let self = this;
    Ui.upload(path, data => {
      self.model.loadFs(data);
      self.run();
    });
  }
}
