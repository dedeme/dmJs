// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("main")
goog.require("TpTest");
goog.require("HashTest");
goog.require("ListTest");
goog.require("ItTest");
goog.require("DateDmTest");
goog.require("DecTest");
goog.require("B64Test");
goog.require("CrypTest");
goog.require("RndTest");

main = () => {

  TpTest.run();
  HashTest.run();
  ItTest.run();
  ListTest.run();
  DateDmTest.run();
  DecTest.run();
  B64Test.run();
  CrypTest.run();
  RndTest.run();

};

main();
