//- dm/dm.js
//- dm/Domo.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window dm */

/// Functions to manipulate strings
(() => {
  const Domo = dm.Domo;
  const It = dm.It;
  const document = window.document;

  dm.ui = {};
  const ui = dm.ui;

  /**
   * <p>Returns a new o existent Domo.</p>
   * <p>If 'o' is a string and its name starts with "#" it returns an
   * existent object. Otherwise it returns a new object.</p>
   * <p>For example:<br>
   * <tt>$("#entry")</tt> returns the object with id 'entry'.<br>
   * <tt>$("td")</tt> Creates an returns an <tt>TD</tt> object.</p>
   * <p>If 'o' is other kind of object than string, it returns a
   * <tt>dm.Domo</tt> which wraps such one.<p>
   *   o    : Object descriptor
   *   atts : Array of functions which define attributes (ui.att, ui.klass, etc)
   *   chn  : Objects children of 'o'
   */
  //# Element|HTMLElement|Node|string - ?Arr<(Domo - Domo)> - ?Arr<Domo> - Domo
  ui.$ = (o, atts, chn) => {
    atts = atts || [];
    chn = chn || [];
    const fd = () =>
      typeof o === "string"
        ? o.charAt(0) === "#"
          ? new Domo(document.getElementById(o.substring(1)))
          : new Domo(document.createElement(o))
        : new Domo(o);
    const d = fd();
    It.from(atts).each(f => {
      f(d);
    });
    It.from(chn).each(ch => {
      d.add(ch);
    });
    return d;
  };

  /**
   * <p>Returns an Iterator of Elements.</p>
   * <p>If 'id' is "" returns al elements in page.<br>
   * if 'id' is of form "%xxx" returns elements with name "xxx".<br>
   * if it is of form ".xxx" returns elements of class 'xxx'.<br>
   * if it is of form "xxx" returns elements with tag name 'xxx'.</p>
   */
  //# str - It<Domo>
  ui.$$ = id => {
    const toIt = arr => {
      let c = 0;
      const length = arr.length;
      return new It(() => c < length, () => new Domo(arr[c++]));
    };
    return id === ""
      ? toIt(document.getElementsByTagName("*"))
      : (id.charAt(0) === "%")
        ? toIt(document.getElementsByName(id.substring(1)))
        : (id.charAt(0) == ".")
          ? toIt(document.getElementsByClassName(id.substring(1)))
          : toIt(document.getElementsByTagName(id));
  };

  /// Sets an attribute in $
  //# str - * - (Domo - *)
  ui.att = (k, v) => d => d.att(k, v);

  /// Sets style in $
  //# str - (Domo - *)
  ui.style = s => d => d.style(s);

  /// Sets html in $
  //# str - (Domo - *)
  ui.html = s => d => d.html(s);

  /// Sets text in $
  //# str - (Domo - *)
  ui.text = s => d => d.text(s);

  /// Sets class in $
  //# str - (Domo - *)
  ui.klass = s => d => d.klass(s);

  /// Sets disabled in $
  //# bool - (Domo - *)
  ui.disabled = v => d => d.disabled(v);

  /// Sets checked in $
  //# bool - (Domo - *)
  ui.checked = v => d => d.checked(v);

  /// Sets value in $
  //# ? - (Domo - *)
  ui.value = v => d => d.value(v);

  /**
   * <p>Extracts variables of URL. Returns a map with next rules:<p>
   * <ul>
   * <li>Expresions 'key = value' are changed in {"key" : "value"}</li>
   * <li>Expresion only with value are changes by {"its-order-number" "value"}.
   *   (order-number is zero based)</li>
   * </ul>
   * <p>Example:</p>
   * <p><tt>foo.com/bar?v1&k1=v2&v3 -> {"0" : v1, "k1" : v2, "2" : v3}</tt></p>
   * <p>NOTE: <i>keys and values are not trimized.</i></p>
   */
  //# - Obj<str, str>
  ui.url = () => {
    const search = window.location.search;
    if (search === "") return {};

    let r = {};
    let c = 0;
    It.from(search.substring(1).split("&")).each(e => {
      let ix = e.indexOf("=");
      if (ix == -1) r[`${c}`] = decodeURI(e);
      else r[decodeURI(e.substring(0, ix))] = decodeURI(e.substring(ix + 1));
      ++c;
    });
    return r;
  };

  // Obj<str, Domo>
  const scripts = [];

  ///Loads dynamically a javascript or css file.
  //# str - ( - ) -
  ui.load = (path, action) => {
    const head = document.getElementsByTagName("head")[0];

    if (It.from(scripts).contains(path)) {
      action();
      return;
    }
    scripts.push(path);

    let element;
    if (path.substring(path.length - 3) === ".js") {
      element = document.createElement('script');
      element.setAttribute("type", "text/javascript");
      element.setAttribute("src", path);
    } else if (path.substring(path.length - 4) === ".css") {
      element = document.createElement('link');
      element.setAttribute("rel", "stylesheet");
      element.setAttribute("type", "text/css");
      element.setAttribute("href", path);
    } else throw "'#path' is not a .js or .css file";

    head.appendChild(element);
    element.onload = () => {
      action();
    };
  };

  /// Loads dynamically several javascript or css files. (they can go mixed).
  ///   paths  : Array with complete paths, including .js or .css extension.
  ///   action : Action after loading
  //# Arr<str> - ( - ) -
  ui.loads = (paths, action) => {
    const lload = () => {
      if (paths.length === 0) action();
      else ui.load(paths.shift(), lload);
    };
    lload();
  };

  /**
   * Management of Drag and Drop of files over an object.
   *   o      : Object over which is going to make Drag and Drop.
   *   back   : Background indicative of DragOver efect. Default
   *            'rgb(240, 245, 250)'
   *   action : Action to make with files.
   *
   * NOTE: <i>For accessing to single files use <tt>fileList.item(n)</tt>. You
   * can know the file number of files with <tt>fileList.length</tt>.</i>
   */
  //# Domo - (FileList - ) - ?str - Domo
  ui.ifiles = (o, action, back) => {
    back = back || "rgb(240, 245, 250)";
    const style = o.style();
    const handleDragOver = evt => {
      o.style(style + `;background-color: ${back} ;`);
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    };

    o.o.addEventListener("dragover", handleDragOver, false);

    o.o.addEventListener(
      "dragleave",
      () => { o.style(style); },
      false
    );

    const handleDrop = evt => {
      o.style(style);
      evt.stopPropagation();
      evt.preventDefault();
      action(evt.dataTransfer.files);
    };

    o.o.addEventListener("drop", handleDrop, false);

    return o;
  };

  /// Changes key point of keyboard number block by comma.
  ///   inp : An input of text type.
  //# Domo - Domo
  ui.changePoint = input =>
    input.on(el => {
      el.onkeydown = e => {
        if (e.keyCode == 110) {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          const text = el.value;
          el.value = text.substring(0, start) + "," + text.substring(end);
          el.selectionStart = start + 1;
          el.selectionEnd = start + 1;
          return false;
        }
        return true;
      };
    });

  /**
   * Creates a image with border='0'.
   *   name : Image name without extension ('.png' will be used).
   *     It must be placed in a directory named 'img'.
   */
  //# str - Domo
  ui.img = name => ui.$(
    "img", [
      ui.att("src", `img/${name}.png`),
      ui.att("border", "0")
    ]
  );

  /**
   * Creates a image with border='0' and a 'opacity:0.4'.
   *   name : Image name without extension ('.png' will be used).
   *          It must be placed in a directory named 'img'.
   */
  //# str - Domo
  ui.lightImg = name => ui.img(name).att("style", "opacity:0.4");

  /// Creates a text field which passes focus to another element.</p>
  ///   targetId : Id of element which will receive the focus.
  //# str - Domo
  ui.field = targetId => ui.$("input").att("type", "text").on(o => {
    o.onkeydown = e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        ui.$('#' + targetId).o.focus();
      }
    };
  });

  /// Creates a password field which passes focus to another element.
  //# str - Domo
  ui.pass = targetId => ui.$("input").att("type", "password").on(o => {
    o.onkeydown = e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        ui.$('#' + targetId).o.focus();
      }
    };
  });

  /// Create a link to a function.
  //# (MouseEvent - ) - Domo
  ui.link = f => ui.$("span").att("style", "cursor:pointer").on(o => {
    o.onclick = f;
  });

  /**
   * Create a select with list as entries. Every option has an id formed with
   * 'idPrefix' + "_" + 'its list name' and a name equals to 'idPrefix'.
   * Also select widget has name 'idPrefix'.
   *    idPrefix: Prefix to make option id.
   *    list    : Entries of select. Default selected goes
   *              marked with '+' (e.g. ["1", "+2", "3"])
   */
  //# str - Arr<str> - Domo
  ui.select = (idPrefix, list) => {
    const r = ui.$("select").att("id", idPrefix);
    It.from(list).each(tx => {
      const op = ui.$("option");
      if (tx.length > 0 && tx.charAt(0) === "+") {
        tx = tx.substring(1);
        op.att("selected", "true");
      }
      op.text(tx)
        .att("name", idPrefix)
        .att("id", idPrefix + "_" + tx);
      r.o.add(op.o);
    });
    return r;
  };

  /// Returns x position of mouse in browser window
  //# MouseEvent - num
  ui.winX = evt => document.documentElement.scrollLeft +
    document.body.scrollLeft +
    evt.clientX;

  /// Returns y position of mouse in browser window
  //# MouseEvent - num
  ui.winY = evt => document.documentElement.scrollTop +
    document.body.scrollTop +
    evt.clientY;

})();

