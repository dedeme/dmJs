//- tests.js
//- jdm/Test.js
//- fields.js
/*
 * Copyright 01-Mar-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global print, jdm, tests, fields */
(function () {
  "use strict";
  var ConfEntry = fields.ConfEntry;
  var PathsEntry = fields.PathsEntry;
  var PathsData = fields.PathsData;
  var ConfData = fields.ConfData;

  tests.appCom = function () {
    var t = new jdm.Test("app/com");

    t.mark("ConfEntry");

    var ce = new ConfEntry("abc", true, "123", "en");
    var ce2 = ConfEntry.restore(ce.serialize());
    t.yes(ce.path === ce2.path);
    t.yes(ce.visible === ce2.visible);
    t.yes(ce.pageId === ce2.pageId);
    t.yes(ce.lang === ce2.lang);
    t.eq("abc", ce2.path);
    t.eq(true, ce2.visible);
    t.eq("123", ce2.pageId);
    t.eq("en", ce2.lang);

    t.mark("PathsEntry");

    var pe = new PathsEntry("ab", "abc/dd", true);
    var pe2 = PathsEntry.restore(pe.serialize());
    t.yes(pe.name === pe2.name);
    t.yes(pe.path === pe2.path);
    t.yes(pe.visible === pe2.visible);
    t.eq("ab", pe2.name);
    t.eq("abc/dd", pe2.path);
    t.eq(true, pe2.visible);

    t.mark("PathsData");

    var de = new PathsData("ab", "abc/dd", true, false);
    var de2 = PathsData.restore(de.serialize());
    t.yes(de.name === de2.name);
    t.yes(de.path === de2.path);
    t.yes(de.visible === de2.visible);
    t.yes(de.existing === de2.existing);
    t.eq("ab", de2.name);
    t.eq("abc/dd", de2.path);
    t.eq(true, de2.visible);
    t.eq(false, de2.existing);

    t.mark("ConfData");

    var de3 = new PathsData("cd", "def/ee", false, true);
    var cd = new ConfData(ce, [de, de3]);
    var cd2 = ConfData.restore(cd.serialize());
    t.eq("abc", cd2.conf.path);
    t.eq(true, cd2.conf.visible);
    t.eq("123", cd2.conf.pageId);
    t.eq("en", cd2.conf.lang);
    t.eq("ab", cd2.paths[0].name);
    t.eq("abc/dd", cd2.paths[0].path);
    t.eq(true, cd2.paths[0].visible);
    t.eq(false, cd2.paths[0].existing);
    t.eq("cd", cd2.paths[1].name);
    t.eq("def/ee", cd2.paths[1].path);
    t.eq(false, cd2.paths[1].visible);
    t.eq(true, cd2.paths[1].existing);

    t.log();

  };

}());

