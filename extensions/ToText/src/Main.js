// Copyright 01-Jul-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "./dmjs/Ui.js";

const $ = Ui.$;

function app (el) {
  el.querySelectorAll(
    "#sc_intxt_container, " +
    "#news-body-center > div.news-body-date, " +
    "#container-animation, " +
    "div.videoAdUi"
  ).forEach(el => {
    el.style["display"] = "none";
  });

  el.querySelectorAll("iframe").forEach(el => el.remove());

  el.querySelectorAll("#content").forEach(el => {
    el.querySelectorAll(
      "div.left-fixed-ad, div.right-fixed-ad, " +
      "div.content-areas > div > section.market-ticker, " +
      "div.hide-div"
    ).forEach(el => {
      el.style["display"] = "none";
    });
    el.querySelectorAll("div.news-container").forEach(el => {
      el.querySelectorAll(
        "div.news-side-arrow"
      ).forEach(el => {
        el.style["display"] = "none";
      });
      el.querySelectorAll(
        "div.news-body > div.news-body-default"
      ).forEach(el => {
        el.querySelectorAll(
          "aside"
        ).forEach(el => {
          el.style["display"] = "none";
        });
      });
    });
  });
}

export default class Main {

  /** return {void} */
  run () {
    if (location.hostname !== "www.elconfidencial.com") {
      return;
    }
    window.onload = () => {
      app($("@body").e);
    };
  }
}
