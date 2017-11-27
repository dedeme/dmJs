// Copyright 22-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Reader");

Reader = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
  }

  /**
   * @param {string} key Company key
   * @param {number} nPage Number of historic page
   * @return {string} Invertia URL.
   */
  static invertiaUrl (key, nPage) {
    const date = DateDm.now();
    return "https://www.invertia.com/es/mercados/bolsa/empresas/" +
      "historico?p_p_id=cotizacioneshistoricas_WAR_ivfrontmarketsportlet" +
      "&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view" +
      "&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2" +
      "&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet_init=" +
      "20%2F07%2F11&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet_" +
      "end=" +
      date.format("%d%%2F%m%%2F%y") +
      "&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet" +
      "_idtel=" +
      key +
      "&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet_delta=34" +
      "&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet_keywords=" +
      "&_cotizacioneshistoricas_WAR_ivfrontmarketsportlet_" +
      "advancedSearch=false&_cotizacioneshistoricas_WAR_" +
      "ivfrontmarketsportlet_andOperator=true&_cotizacioneshistoricas_" +
      "WAR_ivfrontmarketsportlet_resetCur=false&_cotizacioneshistoricas_" +
      "WAR_ivfrontmarketsportlet_cur=" +
      nPage;
  }

  /**
   * @param {string} page
   * @return {Tp<string, !Array<Quote>>} Tp[error, data]
   */
  static readPage (page) {
    /**
     * @param {string} number
     * @return {number}
     */
    function rn(number) {
      return +number.trim()
        .replace(new RegExp("\\.", "g"), "")
        .replace(",", ".");
    }

    let ix = page.indexOf("<tbody class=\"table-data\">")
    if (ix === -1) {
      return new Tp(_("Reader: Missing start page"), []);
    }
    let end = page.indexOf("<tr class=\"lfr-template\">", ix);
    if (end === -1) {
      return new Tp(_("Reader: Missing end page"), []);
    }

    const quotes = [];
    let row = page.indexOf("<tr class=\" \" >", ix);
    while (row !== -1 && row < end) {
      let col = "date";
      ix = page.indexOf("<td", row);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      let ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      let date = null;
      try {
        date = DateDm.fromEu(page.substring(ix0 + 1, ix).trim()).toBase();
      } catch (err) {
        return new Tp(_args(
          _("Reader: Error '%0' in %1"), err.message/**/, col), quotes);
      }

      col = "close";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      let close = rn(page.substring(ix0 + 1, ix).trim());

      col = "open";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      const open = rn(page.substring(ix0 + 1, ix).trim());

      col = "variation";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }

      col = "max";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      const max = rn(page.substring(ix0 + 1, ix).trim());

      col = "min";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      const min = rn(page.substring(ix0 + 1, ix).trim());

      col = "vol";
      ix = page.indexOf("<td", ix);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<td' in %0"), col), quotes);
      }
      ix0 = page.indexOf(">", ix);
      if (ix0 === -1) {
        return new Tp(_args(_("Reader: Missing '>' in %0"), col), quotes);
      }
      ix = page.indexOf("<", ix0);
      if (ix === -1) {
        return new Tp(_args(_("Reader: Missing '<' in %0"), col), quotes);
      }
      const vol = rn(page.substring(ix0 + 1, ix).trim());

      quotes.push(new Quote(date, open, close, max, min, vol, false));

      row = page.indexOf("<tr class=\" \" >", ix);
    }

    return new Tp("", quotes);
  }

  /**
   * Reads an Array<Quote> and adds them to previous quotes in db.quotes()
   * @param {string} nick
   * @param {string} page
   * @return {string} Error or ""
   */
  readCreate (nick, page) {
    const tp = Reader.readPage(page);
    if (tp.e1() === "") {
      const quotes = this._control.db().quotes()[nick];
      It.from(tp.e2()).each(q => { quotes.push(q); });
    }
    return tp.e1();
  }
}
