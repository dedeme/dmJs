// Copyright 8-Dec-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Bests");

view_Bests = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;

    const data = control.fleasData();
    const bests = data.bests();
    /**
     * @private
     * @type {!Array<string>}
     */
    this._keys = It.keys(bests).sortf((a, b) => +a < +b ? 1 : -1).to();

    this._interval = setInterval(function () {
      data.update(changed => {
        if (changed) {
          clearInterval(this._interval);
          control.run2();
        }
      });
    }, 10000)

  }

  interval () {
    return this._interval;
  }

  /**
   * @return {void}
   */
  show () {
    const self = this;
    const control = self._control;
    const db = control.db();
    const data = control.fleasData();
    const bests = data.bests();
    const keys = self._keys;
    let selected = db.bestsId();
    if (selected === "last" || !It.from(keys).contains(selected)) {
      selected = this._keys[0];
    }

    function evalCont(fid, post) {
      return post === null
        ? "blank"
        : It.from(post).containsf(e => e.id() === fid) ? "well" : "cross"
      ;
    }

    function evalUpDown(fid, ix, pre) {
      if (pre === null) {
        return "blank";
      }
      const preIx = It.from(pre).indexf(e => e.id() === fid);
      if (preIx === -1) {
        return "blank";
      }
      const dif = preIx - ix;
      return dif > 10 ? "up2"
        : dif > 5 ? "up"
        : dif < -10 ? "down2"
        : dif < -5 ? "down"
        : "blank"
    }

    function th() {
      return $("td").klass("frame4").style("font-family:monospace;");
    }

    function thl() {
      return $("td").klass("frame4")
        .style("text-align:right;font-family:monospace;");
    }

    function td() {
      return  $("td").klass("frame");
    }

    function tdl() {
      return $("td").klass("frame").style("text-align:right");
    }

    const thSpecialData = th().html(_("Special data"));

    function toTrs(key) {
      function intFormat (n) {
        return db.fDec(new Dec(n, 0))
      }
      function floatFormat (n) {
        return db.fDec(new Dec(n, 2))
      }
      function spanSpecial (f) {
        switch (f.family()){
          case FleasData.buyAndHold(): return 1;
          case FleasData.movingAverage(): return 3;
          case FleasData.wmovingAverage(): return 3;
          default: throw("Unknow flea family");
        }
      }
      function specialCols (d, span) {
        if (d === null) {
          return It.from([td().att("colspan", span)]);
        }
        switch (d.id()){
          case FleasData.movingAverage():
          case FleasData.wmovingAverage(): return It.from([
              tdl().att("title", _("Length"))
                .html(intFormat(d.len() * 5)),
              tdl().att("title", _("Buy Strip"))
                .html(floatFormat(d.buyStrip() * 0.5) + "%"),
              tdl().att("colspan", span - 2).att("title", _("Sell Strip"))
                .html(floatFormat(d.sellStrip() * 0.5) + "%")
            ]);
          default: throw("Unknow flea family");
        }
      }

      const bs = bests[key];
      const postBests = key === keys[0]
        ? null
        : bests[keys[It.from(keys).index(key) - 1]];
      const preBests = key === keys[keys.length - 1]
        ? null
        : bests[keys[It.from(keys).index(key) + 1]];
      const ls = [];
      const rs = [];
      let span = 1;
      It.from(bs).each(f => {
        if (spanSpecial(f) > span) {
          span = spanSpecial(f);
        }
      })

      thSpecialData.att("colspan", span);

      let i = 1;
      return It.from(bs).map(f =>
        $("tr")
          .add(td().add(Ui.img(evalCont(f.id(), postBests))))
          .add(td().add(Ui.img(evalUpDown(f.id(), i - 1, preBests))))
          .add(tdl().html(i++))
          .add(tdl().html(intFormat(f.id())))
          .add(td().html(data.fleaNames()[f.family()]))
          .add(tdl().html(intFormat(f.cycle())))
          .add(tdl().html(intFormat(f.bet() * 5000)))
          .add(tdl().html(intFormat(f.ibex())))
          .add(tdl().html(intFormat(f.mutability())))
          .addIt(specialCols(f.extraData(), span))
          .add(tdl().html(floatFormat(f.stats().cash())))
          .add(tdl().html(intFormat(f.stats().buys())))
          .add(tdl().html(intFormat(f.stats().sells())))
      );
    }

    const viewer = $("table").att("align", "center")
      .style("border-collapse:collapse;border:0px;")
      .add($("tr")
        .add(th())
        .add(th())
        .add(thl().html(_("Ix")))
        .add(thl().html(_("Id")))
        .add(th().html(_("Type")))
        .add(thl().html(_("Cycle")))
        .add(thl().html(_("Bet")))
        .add(thl().html(_("Ibex")))
        .add(thl().html(_("Mut.")))
        .add(thSpecialData)
        .add(thl().html(_("Incomes")))
        .add(thl().html(_("Buys")))
        .add(thl().html(_("Sells"))))
      .addIt(toTrs(selected))
    ;

    const left = $("td").style("width:5px;vertical-align:top;")
      .add($("table").klass("frame")
        .add($("tr").add($("td").html(_("FLEAS"))))
        .add($("tr").add($("td").html("<hr>")))
        .addIt(It.from(keys).map(k =>
            $("tr").add($("td").style("text-align:right")
              .add(Ui.link(ev => {
                  control.setBestsId(k === keys[0] ? "last" : k);
                }).klass("link")
                .html(k === selected ? "<b>" + k + "</b>" : k))
          ))))
    ;

    const right = $("td").style("text-align:center;vertical-align:top")
      .add($("h2").html(_("Bests")))
      .add(viewer)
    ;

    control.dom().show(
      "bests",
      $("table").klass("main").add($("tr").add(left).add(right))
    );
  }

}

