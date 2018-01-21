// Copyright 21-Jan-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("families_Follow");
goog.require("Family");

families_Follow = class {
  /**
   * @param {number} interval
   * @param {number} level
   */
  constructor (interval, level) {
    /** @private */
    this._fieldsNumber = 2;
    /** @private */
    this._interval = interval;
    /** @private */
    this._level = level;
  }

  /** @return {number} */
  id () {
    return Flea.follow();
  }

  /** @return {number} */
  interval () {
    return this._interval;
  }

  /** @return {number} percentage */
  level () {
    return this._level;
  }

  mkFamily () {
    const self = this;

    function bests(intFormat, floatFormat, span) {
      function tdl() {
        return $("td").klass("frame").style("text-align:right");
      }
      return It.from([
        tdl().att("title", _("Interval"))
          .html(intFormat(self.interval() + 5)),
        tdl().att("title", _("Level"))
          .html(intFormat(self.level()) + "%")
      ]).addIt(It.range(span - self._fieldsNumber).map(i => tdl()));
    }

    function trace(intFormat, floatFormat, head, body) {
      return $("span").html(_("Follow trace data"))
    }

    function traceError(quotes, t, r) {
      return r;
    }

    function traceBody(quotes, t) {
      return It.empty();
    }

    return new Family(
      this._fieldsNumber,
      bests,
      trace,
      traceError,
      traceBody
    );
  }

}
