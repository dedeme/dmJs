// Copyright 16-Jan-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("families_Rsi");
goog.require("Family");

families_Rsi = class {
  /**
   * @param {number} type
   * @param {number} len
   * @param {number} upLevel
   * @param {number} downLevel
   */
  constructor (type, len, upLevel, downLevel) {
    /** @private */
    this._type = type;
    /** @private */
    this._len = len;
    /** @private */
    this._upLevel = upLevel;
    /** @private */
    this._downLevel = downLevel;
  }

  /** @return {number} */
  id () {
    return Flea.rsi();
  }

  /**
   * @return {number} Its meaning is:
   *    0: Normal rsi
   *    1: Anti rsi
   *    2: Double rsi (sell when crossing down upLevel and buy when crossing
   *       up downlevel.
   */
  type () {
    return this._type;
  }

  /** @return {number} */
  len () {
    return this._len;
  }

  /** @return {number} Percentage */
  upLevel () {
    return this._upLevel;
  }

  /** @return {number} Percentage */
  downLevel () {
    return this._downLevel;
  }

  mkFamily () {
    const self = this;

    function bests(intFormat, floatFormat, span) {
      function tdl() {
        return $("td").klass("frame").style("text-align:right");
      }
      return It.from([
        tdl().att("title", _("Type"))
          .html(
            self.type() === 0
              ? _("Normal")
              : self.type() === 1 ? _("Anti") : _("Double")
          ),
        tdl().att("title", _("Length"))
          .html(intFormat((self.len() + 1) * 5)),
        tdl().att("title", _("Up Level"))
          .html(intFormat(60 + self.upLevel()) + "%"),
        tdl().att("title", _("Down level"))
          .html(intFormat(40 - self.downLevel()) + "%")
      ]).addIt(It.range(span - 4).map(i => tdl()));
    }

    function trace(intFormat, floatFormat, head, body) {
      return $("span").html(_("BH trace data"))
    }

    function traceError(quotes, t, r) {
      return r;
    }

    function traceBody(quotes, t) {
      return It.empty();
    }

    return new Family(
      4,
      bests,
      trace,
      traceError,
      traceBody
    );
  }

}
