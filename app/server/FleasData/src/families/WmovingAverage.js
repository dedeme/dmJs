// Copyright 10-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("families_WmovingAverage");
goog.require("Family");

families_WmovingAverage = class {
  /**
   * @param {number} len
   * @param {number} buyStrip
   * @param {number} sellStrip
   */
  constructor (len, buyStrip, sellStrip) {
    /** @private */
    this._len = len;
    /** @private */
    this._buyStrip = buyStrip;
    /** @private */
    this._sellStrip = sellStrip;
  }

  /** @return {number} */
  id () {
    return Flea.wmovingAverage();
  }

  /** @return {number} */
  len () {
    return this._len;
  }

  /** @return {number} */
  buyStrip () {
    return this._buyStrip;
  }

  /** @return {number} */
  sellStrip () {
    return this._sellStrip;
  }

  mkFamily () {
    const self = this;

    function thl() {
      return $("td").klass("frame4")
        .style("text-align:right;font-family:monospace;");
    }
    function tdl() {
      return $("td").klass("frame").style("text-align:right");
    }
    function td() {
      return  $("td").klass("frame");
    }
    function tdIf(value) {
      return $("td")
        .klass(value ? "frame" : "frame5")
        .style("text-align: left");
    }

    function bests(intFormat, floatFormat, span) {
      return It.from([
          tdl().att("title", _("Length"))
            .html(intFormat((self.len() + 1) * 5)),
          tdl().att("title", _("Buy Strip"))
            .html(floatFormat(self.buyStrip() * 0.5) + "%"),
          tdl().att("title", _("Sell Strip"))
            .html(floatFormat(self.sellStrip() * 0.5) + "%")
        ]).addIt(It.range(span - 3).map(i => tdl()));
    }

    function trace(intFormat, floatFormat, head, body) {
      return $("table")
        .add($("tr")
          .addIt(head)
          .addIt(It.from([
              thl().html(_("Length")),
              thl().html(_("Buy Strip")),
              thl().html(_("Sell Strip"))
            ]))
        )
        .add($("tr")
          .addIt(body)
          .addIt(It.from([
              tdl().html(intFormat((self.len() + 1) * 5)),
              tdl().html(floatFormat(self.buyStrip() * 0.5) + "%"),
              tdl().html(floatFormat(self.sellStrip() * 0.5) + "%")
            ]))
        );
    }

    function traceError(quotes, t, r) {
      const textra = t.extra();
      const flen =  (self.len() + 1) * 5;
      const quotesExp = Quote.getN(quotes, t.nick(), t.quote().date(), 1);
      const lastClose = quotesExp[0].close();
      const tlen = textra[0];
      const avg = textra[1];

      return r ||
        Math.abs(flen - tlen > 0.01) ||
        lastClose < avg !== textra[2] ||
        lastClose > avg !== textra[3]
      ;
    }

    function traceBody(quotes, t) {
      const textra = t.extra();
      const flen =  (self.len() + 1) * 5;
      const quotesExp = Quote.getN(quotes, t.nick(), t.quote().date(), 1);
      const lastClose = quotesExp[0].close();
      const tlen = textra[0];
      const avg = textra[1];
      return It.from([
        $("tr")
          .add(tdIf(Math.abs(flen - tlen) < 0.01).html(_("Length")))
          .add(td().html("" + tlen))
          .add(td().html("" + flen)),
        $("tr")
          .add(tdIf(lastClose < avg === textra[2]).html(_("Can buy")))
          .add(td().html(textra[2]))
          .add(td().html(
              "" + lastClose + " < " + avg + " => " + (lastClose < avg)
            )),
        $("tr")
          .add(tdIf(lastClose > avg === textra[3]).html(_("Can sell")))
          .add(td().html(textra[3]))
          .add(td().html(
              "" + lastClose + " > " + avg + " => " + (lastClose > avg)
            ))
      ]);
    }

    return new Family(
      3,
      bests,
      trace,
      traceError,
      traceBody
    );
  }

}
