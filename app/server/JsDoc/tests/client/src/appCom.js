//- tests.js
//- dm/Test.js
//- fields.js
/*
 * Copyright 01-Mar-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm, tests, fields */
(() => {
  const ConfEntry = fields.ConfEntry;
  const PathsEntry = fields.PathsEntry;

  tests.appCom = () => {
    const t = new dm.Test("app/com");

    t.mark("ConfEntry");

    const ce = new ConfEntry("abc", true, "123");
    const ce2 = ConfEntry.restore(ce.serialize());
    t.yes(ce.path === ce2.path);
    t.yes(ce.visible === ce2.visible);
    t.yes(ce.pageId === ce2.pageId);
    t.eq("abc", ce2.path);
    t.eq(true, ce2.visible);
    t.eq("123", ce2.pageId);

    t.mark("PathsEntry");

    const pe = new PathsEntry("ab", "abc/dd", true);
    const pe2 = PathsEntry.restore(pe.serialize());
    t.yes(pe.name === pe2.name);
    t.yes(pe.path === pe2.path);
    t.yes(pe.visible === pe2.visible);
    t.eq("ab", pe2.name);
    t.eq("abc/dd", pe2.path);
    t.eq(true, pe2.visible);

    t.log();

  };

})();

