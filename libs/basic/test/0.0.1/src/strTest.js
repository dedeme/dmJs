//- dm/Test.js
//- dm/It.js
//- dm/str.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

const strTest = () => {

  const It = dm.It;
  const str = dm.str;

  const t = new dm.Test("str");

  t.mark("cutLeft");

  t.eq(str.cutLeft("", 3), "");
  t.eq(str.cutLeft("ab", 3), "ab");
  t.eq(str.cutLeft("abcde", 4), "...e");
  t.eq(str.cutLeft("abcd", 3), "...");
  t.eq(str.cutLeft("abcd", 1), "...");

  t.mark("cutRight");
  t.eq(str.cutRight("", 3), "");
  t.eq(str.cutRight("ab", 3), "ab");
  t.eq(str.cutRight("abcde", 4), "a...");
  t.eq(str.cutRight("abcd", 3), "...");
  t.eq(str.cutRight("abcd", 1), "...");

  t.mark("ltrim");

  t.eq("", str.ltrim("   "));
  t.eq("a  ", str.ltrim("  a  "));
  t.eq("a", str.ltrim("  a"));
  t.eq("a  ", str.ltrim("a  "));
  t.eq("a", str.ltrim("a"));

  t.mark("rtrim");

  t.eq("", str.rtrim("   "));
  t.eq("  a", str.rtrim("  a  "));
  t.eq("  a", str.rtrim("  a"));
  t.eq("a", str.rtrim("a  "));
  t.eq("a", str.rtrim("a"));

  t.mark("isSpace");

  t.not(str.isSpace(""));
  t.yes(str.isSpace(" "));
  t.not(str.isSpace("v"));
  t.not(str.isSpace("_"));
  t.not(str.isSpace("2"));
  t.not(str.isSpace("."));
  t.not(str.isSpace("v-"));
  t.not(str.isSpace("_-"));
  t.not(str.isSpace("2-"));
  t.not(str.isSpace(".-"));

  t.mark("isLetter");

  t.not(str.isLetter(""));
  t.not(str.isLetter(" "));
  t.yes(str.isLetter("v"));
  t.yes(str.isLetter("_"));
  t.not(str.isLetter("2"));
  t.not(str.isLetter("."));
  t.yes(str.isLetter("v-"));
  t.yes(str.isLetter("_-"));
  t.not(str.isLetter("2-"));
  t.not(str.isLetter(".-"));

  t.mark("isDigit");

  t.not(str.isDigit(""));
  t.not(str.isDigit(" "));
  t.not(str.isDigit("v"));
  t.not(str.isDigit("_"));
  t.yes(str.isDigit("2"));
  t.not(str.isDigit("."));
  t.not(str.isDigit("v-"));
  t.not(str.isDigit("_-"));
  t.yes(str.isDigit("2-"));
  t.not(str.isDigit(".-"));

  t.mark("isLetterOrDigit");

  t.not(str.isLetterOrDigit(""));
  t.not(str.isLetterOrDigit(" "));
  t.yes(str.isLetterOrDigit("v"));
  t.yes(str.isLetterOrDigit("_"));
  t.yes(str.isLetterOrDigit("2"));
  t.not(str.isLetterOrDigit("."));
  t.yes(str.isLetterOrDigit("v-"));
  t.yes(str.isLetterOrDigit("_-"));
  t.yes(str.isLetterOrDigit("2-"));
  t.not(str.isLetterOrDigit(".-"));

  t.mark("compare");

  let arr = ["pérez", "pera", "p zarra", "pizarra"];
  let arr2 = It.from(arr).sortf(str.compare).to();
  t.eq(["p zarra", "pera", "pizarra", "pérez"].toString(), arr2.toString());
  arr2 = It.from(arr).sortf(str.localeCompare).to();
  t.eq(["p zarra", "pera", "pérez", "pizarra"].toString(), arr2.toString());

  t.mark("sub");

  t.eq(str.sub("", -100), "");
  t.eq(str.sub("", -2), "");
  t.eq(str.sub("", 0), "");
  t.eq(str.sub("", 2), "");
  t.eq(str.sub("", 100), "");
  t.eq(str.sub("a", -100), "a");
  t.eq(str.sub("a", -2), "a");
  t.eq(str.sub("a", 0), "a");
  t.eq(str.sub("a", 2), "");
  t.eq(str.sub("a", 100), "");
  t.eq(str.sub("12345", -100), "12345");
  t.eq(str.sub("12345", -2), "45");
  t.eq(str.sub("12345", 0), "12345");
  t.eq(str.sub("12345", 2), "345");
  t.eq(str.sub("12345", 100), "");

  t.eq(str.sub("", -100, -100), "");
  t.eq(str.sub("", -2, -100), "");
  t.eq(str.sub("", 0, -100), "");
  t.eq(str.sub("", 2, -100), "");
  t.eq(str.sub("", 100, -100), "");

  t.eq(str.sub("", -100, -2), "");
  t.eq(str.sub("", -2, -2), "");
  t.eq(str.sub("", 0, -2), "");
  t.eq(str.sub("", 2, -2), "");
  t.eq(str.sub("", 100, -2), "");

  t.eq(str.sub("", -100, 0), "");
  t.eq(str.sub("", -2, 0), "");
  t.eq(str.sub("", 0, 0), "");
  t.eq(str.sub("", 2, 0), "");
  t.eq(str.sub("", 100, 0), "");

  t.eq(str.sub("", -100, 2), "");
  t.eq(str.sub("", -2, 2), "");
  t.eq(str.sub("", 0, 2), "");
  t.eq(str.sub("", 2, 2), "");
  t.eq(str.sub("", 100, 2), "");

  t.eq(str.sub("", -100, 100), "");
  t.eq(str.sub("", -2, 100), "");
  t.eq(str.sub("", 0, 100), "");
  t.eq(str.sub("", 2, 100), "");
  t.eq(str.sub("", 100, 100), "");

  t.eq(str.sub("a", -100, -100), "");
  t.eq(str.sub("a", -2, -100), "");
  t.eq(str.sub("a", 0, -100), "");
  t.eq(str.sub("a", 2, -100), "");
  t.eq(str.sub("a", 100, -100), "");

  t.eq(str.sub("a", -100, -2), "");
  t.eq(str.sub("a", -2, -2), "");
  t.eq(str.sub("a", 0, -2), "");
  t.eq(str.sub("a", 2, -2), "");
  t.eq(str.sub("a", 100, -2), "");

  t.eq(str.sub("a", -100, 0), "");
  t.eq(str.sub("a", -2, 0), "");
  t.eq(str.sub("a", 0, 0), "");
  t.eq(str.sub("a", 2, 0), "");
  t.eq(str.sub("a", 100, 0), "");

  t.eq(str.sub("a", -100, 2), "a");
  t.eq(str.sub("a", -2, 2), "a");
  t.eq(str.sub("a", 0, 2), "a");
  t.eq(str.sub("a", 2, 2), "");
  t.eq(str.sub("a", 100, 2), "");

  t.eq(str.sub("a", -100, 100), "a");
  t.eq(str.sub("a", -2, 100), "a");
  t.eq(str.sub("a", 0, 100), "a");
  t.eq(str.sub("a", 2, 100), "");
  t.eq(str.sub("a", 100, 100), "");

  t.eq(str.sub("12345", -100, -100), "");
  t.eq(str.sub("12345", -2, -100), "");
  t.eq(str.sub("12345", 0, -100), "");
  t.eq(str.sub("12345", 2, -100), "");
  t.eq(str.sub("12345", 100, -100), "");

  t.eq(str.sub("12345", -100, -2), "123");
  t.eq(str.sub("12345", -2, -2), "");
  t.eq(str.sub("12345", 0, -2), "123");
  t.eq(str.sub("12345", 2, -2), "3");
  t.eq(str.sub("12345", 100, -2), "");

  t.eq(str.sub("12345", -100, 0), "");
  t.eq(str.sub("12345", -2, 0), "");
  t.eq(str.sub("12345", 0, 0), "");
  t.eq(str.sub("12345", 2, 0), "");
  t.eq(str.sub("12345", 100, 0), "");

  t.eq(str.sub("12345", -100, 2), "12");
  t.eq(str.sub("12345", -2, 2), "");
  t.eq(str.sub("12345", 0, 2), "12");
  t.eq(str.sub("12345", 2, 2), "");
  t.eq(str.sub("12345", 100, 2), "");

  t.eq(str.sub("12345", -100, 100), "12345");
  t.eq(str.sub("12345", -2, 100), "45");
  t.eq(str.sub("12345", 0, 100), "12345");
  t.eq(str.sub("12345", 2, 100), "345");
  t.eq(str.sub("12345", 100, 100), "");

  t.log();
};
