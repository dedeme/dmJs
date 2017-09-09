// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("GalleryAux");

GalleryAux = class {
  /** @return {!Hash<!Array<string>>} */
  static getData () {
    let r = new Hash();
    r.put("HenonAttractor", [
      "egg-0",
      "egg-1",
      "margin-0",
      "margin-1",
      "O-0",
      "O-1",
      "sin-0",
      "sin-1",
      "tubular-0",
      "tubular-1",
      "waves-0",
      "waves-1"
    ]);
    r.put("MultiscrollAttractor-1", [
      "belt-0",
      "belt-1",
      "cirrus",
      "crossedBars-0",
      "flyingStains",
      "handcuff-0",
      "handcuff-1",
      "minimalCross-0",
      "minimalCross-1",
      "minimalCross-2",
      "motherboard-0",
      "motherboard-1",
      "motherboard-2",
      "motherboard-3",
      "motherboard-4",
      "semiface"
    ]);
    r.put("MultiscrollAttractor-2", [
      "car-0",
      "ghost-0",
      "ghost-1",
      "ghost-2",
      "ghost-3",
      "masks-1",
      "organic",
      "tower-0",
      "tower-1"
    ]);
    return r;
  }
}
