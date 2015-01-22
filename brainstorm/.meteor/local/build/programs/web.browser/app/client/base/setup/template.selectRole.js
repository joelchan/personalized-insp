(function(){
Template.__checkName("RoleButton");
Template["RoleButton"] = new Template("Template.RoleButton", (function() {
  var view = this;
  return HTML.BUTTON({
    id: function() {
      return [ "role-", Spacebars.mustache(view.lookup("title")) ];
    },
    "class": "select-role-btn new-bs btn btn-block btn-xlarge2 btn-default btn-primary"
  }, "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "\n  ");
}));

Template.__checkName("RoleSelectPage");
Template["RoleSelectPage"] = new Template("Template.RoleSelectPage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "role-select"
  }, "\n  ", HTML.CENTER("\n    ", HTML.DIV({
    "class": "page-header",
    id: "clusterprompt"
  }, "\n    ", HTML.H1(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  })), "\n  "), "\n  ", HTML.Raw("<h3>Select which role you would like to perform</h3>"), "\n  ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("roles"));
  }, function() {
    return [ "\n    ", Spacebars.include(view.lookupTemplate("RoleButton")), "\n  " ];
  }), "\n  "), "\n");
}));

})();
