//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Template = Package.templating.Template;
var _ = Package.underscore._;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;

/* Package-scope variables */
var MochaWebSuites;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/mrt:mocha-web/template.testReport.js                                                      //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
                                                                                                      // 1
Template.__define__("mochaTestReport", (function() {                                                  // 2
  var view = this;                                                                                    // 3
  return HTML.Raw('<div class="mochaTestReport">\n    <div id="mocha"></div>\n  </div>');             // 4
}));                                                                                                  // 5
                                                                                                      // 6
Template.__define__("serverTestReport", (function() {                                                 // 7
  var view = this;                                                                                    // 8
  return [ HTML.Raw("<hr>\n  "), Spacebars.With(function() {                                          // 9
    return Spacebars.call(view.lookup("testReport"));                                                 // 10
  }, function() {                                                                                     // 11
    return [ "\n    ", HTML.H2("Server Test Report"), "\n    ", HTML.H3(Blaze.View(function() {       // 12
      return Spacebars.mustache(view.lookup("failures"));                                             // 13
    }), " failing, ", Blaze.View(function() {                                                         // 14
      return Spacebars.mustache(view.lookup("passes"));                                               // 15
    }), " passing, ", Blaze.View(function() {                                                         // 16
      return Spacebars.mustache(view.lookup("pending"));                                              // 17
    }), " pending"), "\n  " ];                                                                        // 18
  }), "\n\n  ", HTML.DIV({                                                                            // 19
    "class": "mochaTestReport"                                                                        // 20
  }, "\n    ", HTML.UL({                                                                              // 21
    id: "mocha-report"                                                                                // 22
  }, "\n      ", Blaze.Each(function() {                                                              // 23
    return Spacebars.call(view.lookup("rootSuites"));                                                 // 24
  }, function() {                                                                                     // 25
    return [ "\n        ", Spacebars.include(view.lookupTemplate("mochaTestObject")), "\n      " ];   // 26
  }), "\n    "), "\n  ") ];                                                                           // 27
}));                                                                                                  // 28
                                                                                                      // 29
Template.__define__("mochaTestObject", (function() {                                                  // 30
  var view = this;                                                                                    // 31
  return Blaze.If(function() {                                                                        // 32
    return Spacebars.call(view.lookup("suite"));                                                      // 33
  }, function() {                                                                                     // 34
    return [ "\n    ", HTML.LI({                                                                      // 35
      "class": "suite"                                                                                // 36
    }, "\n      ", HTML.H1(Blaze.View(function() {                                                    // 37
      return Spacebars.mustache(view.lookup("title"));                                                // 38
    })), "\n      ", Blaze.Each(function() {                                                          // 39
      return Spacebars.call(view.lookup("children"));                                                 // 40
    }, function() {                                                                                   // 41
      return [ "\n        ", Spacebars.include(view.lookupTemplate("mochaTestObject")), "\n      " ]; // 42
    }), "\n    "), "\n  " ];                                                                          // 43
  }, function() {                                                                                     // 44
    return [ "\n    ", HTML.LI({                                                                      // 45
      "class": function() {                                                                           // 46
        return [ "test ", Spacebars.mustache(view.lookup("stateClass")), " ", Spacebars.mustache(view.lookup("speed")) ];
      }                                                                                               // 48
    }, "\n      ", HTML.H2(Blaze.View(function() {                                                    // 49
      return Spacebars.mustache(view.lookup("title"));                                                // 50
    }), " ", HTML.SPAN({                                                                              // 51
      "class": "duration"                                                                             // 52
    }, Blaze.View(function() {                                                                        // 53
      return Spacebars.mustache(view.lookup("duration"));                                             // 54
    }), "ms")), "\n      ", Blaze.If(function() {                                                     // 55
      return Spacebars.call(view.lookup("err"));                                                      // 56
    }, function() {                                                                                   // 57
      return [ "\n      ", HTML.PRE(HTML.CODE(Blaze.View(function() {                                 // 58
        return Spacebars.mustache(Spacebars.dot(view.lookup("err"), "stack"));                        // 59
      }))), "\n      " ];                                                                             // 60
    }), "\n    "), "\n  " ];                                                                          // 61
  });                                                                                                 // 62
}));                                                                                                  // 63
                                                                                                      // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/mrt:mocha-web/testReport.js                                                               //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var MochaWebTests = null                                                                              // 1
var MochaWebTestReports = null                                                                        // 2
                                                                                                      // 3
Meteor.startup(function(){                                                                            // 4
  MochaWebTests = new Meteor.Collection("mochaWebTests");                                             // 5
  MochaWebTestReports = new Meteor.Collection("mochaWebTestReports");                                 // 6
  MochaWebSuites = new Meteor.Collection("mochaWebSuites");                                           // 7
                                                                                                      // 8
  Meteor.subscribe("mochaServerSideTests", {includeAll: true});                                       // 9
  Meteor.subscribe("mochaServerSideTestReports");                                                     // 10
  Meteor.subscribe("mochaServerSideSuites");                                                          // 11
});                                                                                                   // 12
                                                                                                      // 13
Template.serverTestReport.helpers({                                                                   // 14
  failedTests: function(){                                                                            // 15
    return MochaWebTests.find({state: "failed"});                                                     // 16
  },                                                                                                  // 17
                                                                                                      // 18
  testReport: function(){                                                                             // 19
    return MochaWebTestReports.findOne();                                                             // 20
  },                                                                                                  // 21
                                                                                                      // 22
  rootSuites: function(){                                                                             // 23
    var rootSuites = [];                                                                              // 24
    //TODO add sort                                                                                   // 25
    return MochaWebSuites.find({parentSuiteId: null});                                                // 26
  }                                                                                                   // 27
});                                                                                                   // 28
                                                                                                      // 29
Template.mochaTestObject.helpers({                                                                    // 30
  children: function(){                                                                               // 31
    var suites = MochaWebSuites.find({parentSuiteId: this._id}).fetch();                              // 32
    var tests = MochaWebTests.find({parentSuiteId: this._id}).fetch();                                // 33
    return tests.concat(suites);                                                                      // 34
  },                                                                                                  // 35
                                                                                                      // 36
  stateClass: function(){                                                                             // 37
    if (this.state == "passed")                                                                       // 38
      return "pass";                                                                                  // 39
    if (this.state == "failed")                                                                       // 40
      return "fail";                                                                                  // 41
    return this.state;                                                                                // 42
  }                                                                                                   // 43
})                                                                                                    // 44
                                                                                                      // 45
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:mocha-web'] = {};

})();

//# sourceMappingURL=7aeaf0eed54fbb952ab6059b24eee5c16e5414db.map
