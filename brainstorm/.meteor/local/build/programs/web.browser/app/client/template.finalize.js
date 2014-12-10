(function(){
Template.__define__("FinalizePage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", HTML.H1("Your verification code is: ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("code"));
  })), "\n	");
}));

})();
