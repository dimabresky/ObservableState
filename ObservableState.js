/**
 * @version: 1.1
 * @author: dimabresky https://github.com/dimabresky
 * @copyright: Copyright (c) 2017 dimabresky. Все права защищены.
 * @license: MIT лицензия http://www.opensource.org/licenses/mit-license.php
 */
(function (root, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([], function () {
            return (root.ObservableState = factory());
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.ObservableState = factory();
    }
})(this, function () {
    "use strict";

    function ObservableState(state) {
        var self = this;

        var __subscribes = {};

        var __state = state;

        var __stateHistory = [];

        function __add2history(message, debug_mode) {

            var out = `ObservableState: ${new Date()} ${message}`;

            this.push(out);

            if (debug_mode) {
                __log(out);
            }
        }

        function __kex(key) {

            var keys = [];
            if (key.indexOf(".") !== -1) {
                keys = key.split(".");
                return __kex.apply(this[keys[0]], [(function (keys) {
                        var ks = [];
                        for (var i = 1; i <= keys.length - 1; i++) {
                            ks.push(keys[i]);
                        }
                        return ks.join(".");
                    })(keys)]);
            } else {

                return this.hasOwnProperty(key);
            }
        }

        function __warn(message) {
            console.warn(message);
        }

        function __log(message) {
            console.log(message);
        }

        function __knfWarn(k) {
            __warn(`ObservableState: key "${k}" is not found in state object`);
        }

        /**
         * Return array of history state change
         * @return {Boolean}
         */
        self.getHistory = function () {
            return __stateHistory;
        };

        /**
         * Set value of state
         * @param  {String} k
         * @param  {Mixed} v
         * @return {Boolean}
         */
        self.set = function (k, v) {
            var kvofs = __state, keys = [];
            if (__kex.apply(__state, [k])) {
                if (k.indexOf('.') !== -1) {
                    keys = k.split('.');
                    for (var i = 0; i < keys.length - 1; i++) {
                        kvofs = kvofs[keys[i]];
                    }
                    kvofs[keys[keys.length - 1]] = v;
                } else {
                    __state[k] = v;
                }


                __add2history.apply(__stateHistory, [
                    `set value "${v}" in key "${k}"`,
                    self.DEBUG_MODE
                ]);

                if (typeof __subscribes[k] === "function") {
                    __subscribes[k].apply(self, []);
                }

                return true;
            }

            __knfWarn.apply(self, [k]);

            return false;
        };

        /**
         * Return value of state
         * @param  {String} k
         * @return {Mixed}
         */
        self.get = function (k) {
            if (__kex.apply(__state, [k])) {
                return __state[k];
            }

            __knfWarn(k);

            return undefined;
        };

        /**
         * Subscribe on change of state
         * @param  {String}   k
         * @param  {Function} cb
         * @return {Boolean}
         */
        self.subscribe = function (k, cb) {
            if (__kex.apply(__state, [k])) {
                if (typeof cb === "function") {
                    __subscribes[k] = cb;

                    __add2history.apply(__stateHistory, [
                        `subscribed on "${k}"`,
                        self.DEBUG_MODE
                    ]);

                    return true;
                }

                __warn(
                        `ObservableState: cb parameter for subscribe method must be is function type`
                        );
            }

            __knfWarn(k);

            return false;
        };

        /**
         * Unsubscribe of change value of state
         * @param  {String}   k
         * @param  {Function} cb
         * @return {Boolean}
         */
        self.unsubscribe = function (k, cb) {
            if (__kex(k)) {
                if (typeof __subscribes[k] === "function") {
                    delete __subscribes[k];
                }

                __add2history.apply(__stateHistory, [
                    `unsubscribed on "${k}"`,
                    self.DEBUG_MODE
                ]);
                return true;
            }

            __knfWarn(k);

            return false;
        };
        
        /**
         * Return source state
         * @returns {}
         */
        self.getSource = function () {
            return __state;
        };
    }

    ObservableState.prototype.DEBUG_MODE = false;

    return ObservableState;
});
