﻿define([
           "dojo/_base/declare",
            "dojo/_base/lang",
            "dojo/when"
       ], function (declare, lang, when){

    return declare([], {
        runner : null,
        timeout : 5000,
        _errLst : null,
        constructor : function (args){
            lang.mixin(this, args);

            this._errLst = [];
        },
        complete : function (){
            if (this.done && !this.done.isResolved()){
                this.done.resolve(this);
            }

            return this.done;
        },
        exec : function (test){
            if (!this.runner){
                console.error("Missing Test Runner!!!");
                return;
            }

            this.inherited(arguments);
        },
        assertFail : function (ex){
            var assertion = "Assert " + (ex.assertion || "Fail") + ": " + (ex.hint || "");
            this.runner.logError(this, assertion, ex);
            return this.complete();
        },
        assertEqual : function (expected, actual, hint){
            if (expected !== actual){
                throw {
                    assertion : "Equal",
                    hint : hint,
                    message : "\nexpected:\n" + expected + "\nactual:\n" + actual
                }
            }
            this.runner.renderSuccess(this, "Assert Equal:", "val=", expected, hint);
        },
        assertNotEqual : function (expected, actual, hint){
            if (expected === actual){
                throw {
                    assertion : "Not Equal",
                    hint : hint,
                    message : "\nactual:\n" + actual
                }
            }
            this.runner.renderSuccess(this, "Assert Not Equal:", "p1=", expected, "p2=", actual, hint);
        },
        assertTrue : function (actual, hint){
            if (true !== actual){
                throw {
                    assertion : "True",
                    hint : hint,
                    message : "\nvalue:\n" + actual
                }
            }
            this.runner.renderSuccess(this, "Assert True", hint);
        },
        assertFalse : function (actual, hint){
            if (false !== actual){
                throw {
                    assertion : "False",
                    hint : hint,
                    message : "\nvalue:\n" + actual
                }
            }
            this.runner.renderSuccess(this, "Assert False", hint);
        },
        whenResolved: function(promise, fn){
            var test = this;
            return when(promise, fn, function(error){
                test.assertFail(error);
            })
        }
    });
});
