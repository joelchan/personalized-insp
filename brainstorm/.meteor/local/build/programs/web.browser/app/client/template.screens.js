(function(){
Template.__define__("ScreensReviewPage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row"
  }, " \n      ", HTML.DIV({
    name: "screens-list"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("screens"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("SRScreen")), "\n        " ];
  }), "\n      "), "\n    ");
}));

Template.__define__("SRScreen", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return [ "screen-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": "menu-box clickable panel panel-info"
  }, "\n    ", HTML.DIV({
    "class": "panel-heading"
  }, "\n      ", HTML.Raw("<strong>Screen Name: </strong>"), " ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>Description: </strong>"), Blaze.View(function() {
    return Spacebars.mustache(view.lookup("description"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>URL: </strong>"), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("formUrl"));
    }
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("formUrl"));
  })), "\n    "), "\n  ");
}));

})();
