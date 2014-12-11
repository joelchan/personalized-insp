(function(){
Template.__define__("TestSummary", (function() {
  var view = this;
  return HTML.DIV({
    "class": "test-report"
  }, "\n    ", HTML.DIV({
    "class": "server-results"
  }, "\n      ", HTML.Raw("<h1> Server Test Results</h1>"), "\n        ", Spacebars.include(view.lookupTemplate("serverTestReport")), "\n    "), "\n    ", HTML.DIV({
    "class": "client-results"
  }, "\n      ", HTML.Raw("<h1> Client Test Results</h1>"), "\n        ", Spacebars.include(view.lookupTemplate("mochaTestReport")), "\n    "), "\n  ");
}));

})();
