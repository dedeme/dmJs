// Copyright 8-Dic-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("FleasData");

goog.require("Flea");
goog.require("Trace");


FleasData = class {
  /**
   * @param {!Main} control
   * @param {number} time
   * @param {number} initialCash
   * @param {Array<string>} fleaNames
   * @param {number} newFlea
   * @param {number} cycle
   * @param {number} newBest
   * @param {!Object<string, !Array<!Flea>>} bests
   * @param {!Array<!Flea>} fleas
   * @param {Flea} tracedFlea
   * @param {!Array<Trace>} traces
   */
  constructor (
    control, time,
    initialCash, fleaNames,
    newFlea, cycle, newBest, bests, fleas,
    tracedFlea, traces
  ) {
    /** @private */
    this._control = control
   /** @private */
    this._time = time;

    /** @private */
    this._initialCash = initialCash;
    /** @private */
    this._fleaNames = fleaNames;
    /** @private */
    this._newFlea = newFlea;
    /** @private */
    this._cycle = cycle;
    /** @private */
    this._newBest = newBest;
    /** @private */
    this._bests = bests;
    /** @private */
    this._fleas = fleas;
    /** @private */
    this._tracedFlea = tracedFlea;
    /** @private */
    this._traces = traces;
  }

  /** @return {number} */
  initialCash () {
    return this._initialCash;
  }

  /** @return {Array<string>} */
  fleaNames () {
    return this._fleaNames;
  }

  /** @return {number} */
  newFlea () {
    return this._newFlea;
  }

  /** @return {number} */
  cycle () {
    return this._cycle;
  }

  /** @return {number} */
  newBest () {
    return this._newBest;
  }

  /** @return {!Object<string, !Array<!Flea>>} */
  bests () {
    return this._bests;
  }

  /** @return {!Array<!Flea>} */
  fleas () {
    return this._fleas;
  }

  /** @return {Flea} */
  tracedFlea () {
    return this._tracedFlea;
  }

  /** @return {!Array<Trace>} */
  traces () {
    return this._traces;
  }

  /**
   * @param {function(boolean):void} f 'f' receives 'true' if data is changed
   * @return {void}
   */
  update (f) {
    const self = this;
    const control = self._control;
    control.readLastModification (t => {
      if (t !== self._time) {
        control.readFleasData(t, d => {
          const fd = FleasData.restore(control, t, d)
          self._time = fd._time;
          self._initialCash = fd._initialCash;
          self._fleaNames = fd._fleaNames;
          self._newFlea = fd._newFlea;
          self._cycle = fd._cycle;
          self._newBest = fd._newBest;
          self._bests = fd._bests;
          self._fleas = fd._fleas;
          self._tracedFlea = fd._tracedFlea;
          self._traces = fd._traces;
          f(true);
        })
      } else {
        f(false);
      }
    })
  }

  /**
   * @param {!Main} control
   * @param {number} time
   * @param {string} data
   * @return {!FleasData}
   */
  static restore (control, time, data) {
    const serial = /** @type {!Array<?>} */ (JSON.parse(data));
    const bests = /** @type {!Object<string, !Array<?>>} */ (serial[5])
    return new FleasData (
      control,
      time,
      serial[0],
      serial[1],
      serial[2],
      serial[3],
      serial[4],
      It.keys(bests).reduce({}, (s, k) => {
          s[k] = It.from(bests[k]).map(e => Flea.restore(e)).to()
          return s;
        }),
      It.from(serial[6]).map(e => Flea.restore(e)).to(),
      serial[7] === null ? null : Flea.restore(serial[7]),
      It.from(serial[8]).map(e => Trace.restore(e)).to()
    );
  }

  /**
   * @return {number}
   */
  static buyAndHold () {
    return 0
  }

  /**
   * @return {number}
   */
  static movingAverage () {
    return 1
  }
  /**
   * @return {number}
   */
  static wmovingAverage () {
    return 2
  }
}
