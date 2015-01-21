(function(){
Template.body.addContent((function() {
  var view = this;
  return "";
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("loading");
Template["loading"] = new Template("Template.loading", (function() {
  var view = this;
  return HTML.Raw('<div class="full-page">\n	  <h1>Loading</h1>\n  </div>');
}));

Template.__checkName("IdeaGen");
Template["IdeaGen"] = new Template("Template.IdeaGen", (function() {
  var view = this;
  return [ HTML.Raw("<!-- Navbar -->\n  "), HTML.DIV({
    id: "header",
    "class": "navbar navbar-default navbar-fixed-top",
    role: "navigation"
  }, "\n    ", HTML.DIV({
    "class": "container-fluid"
  }, "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", HTML.Raw('<div class="col-lg-3">\n          <div class="navbar-header">\n            <a class="navbar-brand" href="/"><img src="/logo_small.png"> &nbsp; IdeaGens</a>\n          </div>\n        </div>'), "\n        ", HTML.DIV({
    "class": "col-lg-9",
    id: "nav-right"
  }, "\n          ", HTML.DIV({
    "class": "login",
    id: "login-info"
  }, "\n            ", Blaze.If(function() {
    return Spacebars.call(view.lookup("loggedIn"));
  }, function() {
    return [ "\n              ", HTML.SPAN({
      "class": "userName"
    }, "\n                ", HTML.STRONG("Welcome,"), " ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("currentUserName"));
    }), "\n              "), "\n              ", HTML.BUTTON({
      id: "submitLogout",
      "class": "submitLogout btn-login"
    }, "Logout"), "\n            " ];
  }), "\n          "), "\n        "), "\n      "), "\n    "), "\n  "), "\n\n\n  ", HTML.DIV({
    "class": "container-fluid",
    id: "ideastorm"
  }, "\n    ", Spacebars.include(view.lookupTemplate("yield")), "\n  "), HTML.Raw(" <!-- /container -->") ];
}));

Template.__checkName("Timer");
Template["Timer"] = new Template("Template.Timer", (function() {
  var view = this;
  return HTML.Raw('<div class="timer">\n    <span id="time">15</span><span> minutes remaining</span>\n  </div>');
}));

Template.__checkName("ExitStudy");
Template["ExitStudy"] = new Template("Template.ExitStudy", (function() {
  var view = this;
  return HTML.Raw('<button id="exitStudy" class="exitStudy nav-btn">\n    Exit Early\n  </button>');
}));

})();
