// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Domo from "../dmjs/Domo.js";
import Ui from "../dmjs/Ui.js";
import It from "../dmjs/It.js";
import {_} from "../I18n.js";
import Main from "../Main.js";
import Model from "../Model.js";

const $ = Ui.$;

/** @const {!Domo} */
const coorDiv = $("div");

export default class Menu {
  /** @param {!Main} control */
  constructor (control) {
    /** @const {!Main} */
    this._control = control;
    /** @const {!Model} */
    this._model = control.model();
  }

  setCoor () {
    let format = x => {
      let v = "" + Math.abs(x);
      return (x < 0 ? "-= " : "+= ") + (v.length > 6 ? v.substring(0, 6) : v);
    }

    let x = "x " + format(this._model.lastx() - 0.5) + ";";
    let y = "y " + format(this._model.lasty() - 0.5) + ";";

    coorDiv.removeAll().add($("span").html(`<code>${x}<br>${y}</code>`));
  }

  mk () {
    const control = this._control;

    let mkTd = () => $("td").style("text-align:left;white-space: nowrap;");

    let mkTdc = () => $("td").style("text-align:center;white-space: nowrap;");

    /**
     * @param {string} active
     * @param {!Array<string>} values
     * @param {function (string)} f
     */
    let mkOptions = (active, values, f) => {
      let mkOption = value =>
        (value === active)
          ? $("span").html("<b>" + value + "</b>")
          : Ui.link(ev => { f(value); }).klass("link").html(value);

      let r = mkTdc();
      r.add(mkOption(values[0]));
      for (let i = 1; i < values.length; ++i) {
        r.add($("span").html(" · ")).add(mkOption(values[i]));
      }
      return r;
    }

    let separator = () => $("td").html("<hr>");

    let mkLabel = (value) => mkTd().html("<i>" + value + "</i>");

    let mkDraw = () => mkTd()
      .add(Ui.link(e => { control.draw();}).klass("link").html(_("Draw")));

    let mkCanvasSize = () => {
      let act = " " + this._model.canvasSize() + " ";
      return mkOptions(act, [" 1 ", " 2 ", " 3 ", " 4 ", " 5 "], v => {
        control.canvasSize(parseInt(v, 10));
      });
    }

    let mkDownload = () => {
      let sizes = [
        "640x480", "800x600", "1024x768", "1280x800", "1280x960",
        "1280x1024", "1400x1050", "1600x1200"
      ];
      return mkTd()
        .add($("ul").style("list-style:none;padding-left:0px;margin-top:0px;")
          .add($("li")
            .html("<a href='#' onclick='return false;'>" +
              _("Download") + "</a>")
            .add($("ul").att("id", "hlist")
              .style("list-style:none;padding-left:10px;")
              .adds([...It.from(sizes).map(sz =>
                $("li")
                  .add(Ui.link(ev => {
                    let n = It.from(sizes).index(sz);
                    control.canvasSize(n + 6);
                  }).klass("link").html("<code>" + sz + "</code>"))
              )]))));
    }

    let mkCoor = () => {
      this.setCoor();
      return mkTd().add(coorDiv);
    }

    let mkPrecode = () => {
      let act = this._model.precodeShow()
        ? _("On")
        : _("Off");
      return mkOptions(act, [_("On"), _("Off")], v => {
        control.setPrecodeShow(v == _("On"));
      });
    }

    let mkSave = () =>
      mkTd().add(Ui.link(ev => { control.save(); }).klass("link")
        .html(_("Save Functions")));

    let mkGallery = () =>
      mkTd().add(Ui.link(ev => { control.gallery(); }).klass("link")
        .html(_("Gallery")));

    let mkLoad = () => {
      let drag = e => {
        e.stopPropagation();
        e.preventDefault();
      }

      let drop = e => {
        e.stopPropagation();
        e.preventDefault();

        let dt = e.dataTransfer/**/;
        let files = dt.files/**/;

        control.load(files);
      }

      let dropbox = $("div").klass("frame").style("width:120px;height:40px;");
      dropbox.e.addEventListener("dragenter", drag, false);
      dropbox.e.addEventListener("dragover", drag, false);
      dropbox.e.addEventListener("drop", drop, false);

      return $("td").style("text-align:center;").add(dropbox);
    }

    let mkLang = () => {
      let act = this._model.language().toUpperCase();
      return mkOptions(act, ["EN", "ES"], v => {
        control.language(v.toLowerCase());
      });
    }


    return $("table").klass("frame")
      .add($("tr").add(mkDraw()))
      .add($("tr").add(mkLabel(_("Preview"))))
      .add($("tr").add(mkCanvasSize()))
      .add($("tr").add(mkDownload()))
      .add($("td").add($("hr").style("height:0px;margin-top:-10px")))
      .add($("tr").add(mkLabel(_("Coordinates"))))
      .add($("tr").add(mkCoor()))
      .add($("tr").add(mkLabel(_("Precode"))))
      .add($("tr").add(mkPrecode()))
      .add(separator())
      .add($("tr").add(mkSave()))
      .add($("tr").add(mkLabel(_("Load Functions"))))
      .add($("tr").add(mkLoad()))
      .add($("tr").add(mkGallery()))
      .add(separator())
      .add($("tr").add(mkLabel(_("Language"))))
      .add($("tr").add(mkLang()))
    ;
  }
}

