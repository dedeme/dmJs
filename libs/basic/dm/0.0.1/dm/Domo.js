//- dm/dm.js
//- dm/It.js
/*
 * Copyright 20-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(function () {
  const It = dm.It;

  /// Class for envelopping DOM objects
  class Domo {
    //# * - Domo
    constructor (o) {
      //# *
      this._o = o;
    }

    get o () {
      return this._o;
    }

    //# str - Domo || - str
    html (tx) {
      if (tx === undefined) return this._o.innerHTML;
      this._o.innerHTML = tx;
      return this;
    }

    //# str - Domo || - str
    text (tx) {
      if (tx === undefined) return this._o.textContent;
      this._o.textContent = tx;
      return this;
    }

    //# str - Domo || - str
    klass (tx) {
      if (tx === undefined) return this._o.className;
      this._o.className = tx;
      return this;
    }

    //# str - Domo || - str
    style (s) {
      if (s === undefined) return this._o.getAttribute("style");
      this._o.setAttribute("style", s);
      return this;
    }
    ///

    //# str - * - Domo || str -  - *
    att (key, value) {
      if (value === undefined) return this._o.getAttribute(key);
      this._o.setAttribute(key, value);
      return this;
    }

    //# bool - Domo || - bool
    disabled (value) {
      if (value === undefined) return this._o.disabled;
      this._o.disabled = value;
      return this;
    }

    //# bool - !Domo || - bool
    checked (value) {
      if (value === undefined) return this._o.checked;
      this._o.checked = value;
      return this;
    }

    //# * - Domo || - *
    value (v) {
      if (v === undefined) return this._o.value;
      this._o.value = v;
      return this;
    }

    /// Appends a child element.
    //# Domo - Domo
    add (el) {
      this._o.appendChild(el._o);
      return this;
    }

    /// Adds an iterator over rows ("tr") in a table.
    //# It<Domo> - Domo
    addIt (els) {
      els.each(el => {
        this._o.appendChild(el.o);
      });
      return this;
    }

    /// Removes a child element.
    //# Domo - Domo
    remove (el) {
      this._o.removeChild(el.o);
      return this;
    }

    /// Removes all child elements
    //# - Domo
    removeAll () {
      this._o.innerHTML = "";
      return this;
    }

    /// Iterator over child elements.
    //# - It<Domo>
    nodes () {
      let nextNode = this._o.firstChild;
      return new It(
        () => nextNode !== null,
        () => {
          const r = nextNode;
          nextNode = nextNode.nextSibling;
          new Domo(r);
        }
      );
    }

    /**
     * Intended to execute callbacks. Executes function 'f' whith
     * <tt>this.o</tt> as argument and returns 'this'.
     * <p>Example:
     *   x.on(peer => {
     *     peer.onclick = e => {
     *       control.add($('#newName').value(););
     *     }
     *   }
     */
    //# ((Element|HTMLElement|Node|str) - ) - Domo
    on (f) {
      f(this._o);
      return this;
    }

  }
  dm.Domo = Domo;

}());
