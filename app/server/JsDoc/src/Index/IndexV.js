// Copyright 14-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("IndexTree");
goog.provide("IndexV");

goog.require("Dom");
goog.require("Conf");

IndexTree = class {
  /**
   * @param {string} id
   * @param {string} help
   * @param {Array<!IndexTree>} entries
   */
  constructor (
    id,
    help,
    entries
  ) {
    /** @private */
    this._id = id;
    /** @private */
    this._help = help;
    /** @private */
    this._entries = entries;
  }

  /** @return {string} */
  id () {
    return this._id;
  }

  /**
   * @private
   * @param {string} value
   */
  setId (value) {
    throw("id is read only");
  }

  /** @return {?string} */
  help () {
    return this._help;
  }

  /**
   * @private
   * @param {?string} value
   */
  setHelp (value) {
    throw("help is read only");
  }

  /** @return {Array<!IndexTree>} */
  entries () {
    return this._entries;
  }

  /**
   * @private
   * @param {Array<!IndexTree>} value
   */
  setEntries (value) {
    throw("entries is read only");
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._id,
      this._help,
      this._entries === null
        ? null
        : It.from(this._entries).map(e => e.serialize()).to()
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!IndexTree}
   */
  static restore (serial) {
    return new IndexTree (
      serial[0],
      serial[1],
      serial[2] === null
        ? null
        : It.from(serial[2]).map(s => IndexTree.restore(s)).to()
    );
  }
}

{
    const cmp = (s1, s2) => s1.toUpperCase() > s2.toUpperCase() ? 1 : -1;

    const sort = (e1, e2) =>
      e1._help === null
        ? e2._help === null
          ? cmp(e1._id, e2._id)
          : 1
        : e2._help === null
          ? -1
          : cmp(e1._id, e2._id);

IndexV = class {

  /** @param {!Index} control */
  constructor (control) {
    /** @const {!Index} */
    this._control = control;
  }

  /**
   * @param {!Array<!Path>} paths
   * @param {string} selected
   * @param {!IndexTree} tree
   * @return {void}
   */
  show (paths, selected, tree) {
    const table = $("table").att("class", "frame").att("width", "100%");

    /**
     * @param {List<string>} prefix
     * @param {List<string>} path
     * @param {Array<!IndexTree>} ies
     * @return {void}
     */
    function addTrs(prefix, path, ies) {
      if (ies === null) {
        throw ("Array of IndexTree is null");
      }
      It.from(ies).sortf(sort).each(ie => {
        if (ie._help === null) {
          table.add($("tr")
            .add($("td")
              .att("style", "text-align:left;width:5px")
              .html(prefix.head() + "<b>" + ie._id + "</b>"))
            .add($("td"))
            .add($("td"))
          );
          addTrs(
            prefix.cons(prefix.head() + "&nbsp;&nbsp;&nbsp;&nbsp;"),
            prefix.cons(path.head() + (path.head() == "" ? "" : "/") + ie._id),
            ie._entries
          );
        } else {
          const modName = ie._id.substring(0, ie._id.length - 3)
          table.add($("tr")
            .add($("td")
              .att("style", "text-align:left;font-weight:bold;width:5px")
              .html("<a href='../Module/index.html?" +
                selected + "@" + path.head() +
                (path.head() == "" ? "" : "/") +
                modName +
                "'>" +
                prefix.head() + modName +
                "</a>"))
            .add($("td").att("style", "width:5px").text("  "))
            .add($("td").html(ie._help))
          );
        }
      });
    }

    addTrs(new List().cons(""), new List().cons(""), tree._entries);
    Dom.show(paths, selected, table);
    $$("title").next().text("JsDoc : " + selected);
  }
}}
