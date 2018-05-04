// This is necessary to trick moment-timezone into believing it is in node, otherwise it doesn't fire the "onLoad" method it defines. 
(function(undefined) {

    var self;
    if (typeof Package === "undefined") {
        self = this;
    } else {
        self = Package["momentjs:moment"];
    }

    if (this.require !== undefined) {
        this.__AC_OLD_REQUIRE = this.require;
    }
    this.require = function(packageName) {
        return self[packageName];
    };

    if (this.module !== undefined) {
        this.__AC_OLD_MODULE = this.module;
    }
    this.module = {
        exports: {}
    };

    if (this.exports !== undefined) {
        this.__AC_OLD_EXPORTS = this.exports;
    }
    this.exports = {};

}).call(this);