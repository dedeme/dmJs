// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Image loader */
goog.provide("github.dedeme.Tracker");

goog.require("github.dedeme.It");

github.dedeme.Tracker = class {
  /**
   * Load images in background. It create a dictionary
   * {id:String, img:DomObject} where 'id' is the name of the image without
   * the extension.
   * Parameters:
   *  dir  : Relative path of images. By default is "img"
   *  imgs : Array with name of files. If it is a '.png' image, it is not
   *         necessary to put the extension.
   *  Examples of call:
   *    new Tracker(["a", "b.gif", "c"]);
   *    new Tracker("main/img", ["a", "b", "c"]);
   * @param {!Array<string>} imgs
   * @param {string=} dir Default "img"
   */
  constructor (imgs, dir) {
    dir = dir || "img";
    dir = dir + "/";
    /**
     * @private
     * @type {!Hash<!Domo>}
     */
    this.imgs = new Hash();
    github.dedeme.It.from(imgs).each(name => {
      let ix = name.indexOf(".");
      return (ix == -1)
        ? this.imgs.put(
            name,
            new Domo(new Image()).att("src", dir + name + ".png")
          )
        : this.imgs.put(
            name.substring(0, ix),
            new Domo(new Image()).att("src", dir + name)
          );
    });
  }

  /**
   * Retrieves the image with the name 'id' or 'null' if 'id' does not exist.
   * @param {string} id
   * @return {Domo}
   */
  take (id) {
    return this.imgs.take(id);
  }

  /**
   * Equals to 'get()' but retrieves a bright image.
   * @param {string} id
   * @return {Domo}
   */
  light (id) {
    let r = this.imgs.take(id);
    return r === null ? null : /** @type {!Domo} */(r.style("opacity:0.4"));
  }

  /**
   * Equals to 'get()' but retrieves a gray image.
   * @param {string} id
   * @return {Domo}
   */
  grey (id) {
    let r = this.imgs.take(id);
    return r === null
      ? null
      : /** @type {!Domo} */(r.style("filter: grayscale(100%)"));
  }
}
