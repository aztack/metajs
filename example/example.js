/**
 * file description
 * @fileOverview: some text
 */

(function() {
    // BMap
    if (typeof(window.BMap) == "undefined") {
        window.BMap = {};
    }
    var exports = BMap;


    //constants
    exports.PI = 3.14;
    exports.WM_PAINT = function() {
        return 'hello';
    };
    var TWOPI = 2 * PI;

    //variables

    //functions

    //modules
    var M = {
        //test it
        test: function() {
            return "test";
        },
        //say hello
        greeting: function() {
            return "hello world";
        }
    };

    //interfaces
    //The I interface
    exports.I = function(x, y) {};
    //f1's doc
    exports.I.prototype.f1 = function() {};
    //f2's doc
    exports.I.prototype.f2 = function() {};

    //classes
    /**
     * point that contains 
     * latitue/longitue value
     */
    exports.Point = function(lat, lng) {
        this._lat = lat || 0;
        this._lng = lng || 0;
        this.__init__();
    }
    exports.Point.prototype.__init__ = function() {
        //latitue
        this.lat = 0;
        //longitute
        this.lng = 0;
    };
    exports.Point.prototype = new B();
    //the origin point
    exports.Point.ORIGIN = {
        "lat": 0,
        "lng": 0
    };
    //get point from pixel on map
    exports.Point.fromPixel = function(encoded) {

    };
    //return latitute of the point
    exports.Point.prototype.lat = function() {
        //single line comment
        return this._lat;
    };
    //return longitute of the point
    exports.Point.prototype.lng = function() {
        return this._lng;
    };
    //mixin M
    for (var i in M) {
        if (M.hasOwnProperty(i)) {
            Point.prototype[i] = M.prototype[i];
        }
    }
})();
