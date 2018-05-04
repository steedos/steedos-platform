// This file undoes all the trickery that we needed to get timezone working.
(function(undefined) {

    if (this.__AC_OLD_REQUIRE) {
        this.require = this.__AC_OLD_REQUIRE;
        delete this.__AC_OLD_REQUIRE;
    } else {
        delete this.require;
    }

    if (this.__AC_OLD_MODULE) {
        this.module = this.__AC_OLD_MODULE;
        delete this.__AC_OLD_MODULE;
    } else {
        delete this.module;
    }

    if (this.__AC_OLD_EXPORTS) {
        this.exports = this.__AC_OLD_EXPORTS;
        delete this.__AC_OLD_EXPORTS;
    } else {
        delete this.exports;
    }

}).call(this);