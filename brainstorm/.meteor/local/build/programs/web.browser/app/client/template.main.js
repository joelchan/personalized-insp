(function(){
Template.__body__.__contentParts.push(Blaze.View('body_content_'+Template.__body__.__contentParts.length, (function() {
  var view = this;
  return "";
})));
Meteor.startup(Template.__body__.__instantiate);

Template.__define__("loading", (function() {
  var view = this;
  return HTML.Raw('<div class="full-page">\n	  <h1>Loading</h1>\n  </div>');
}));

Template.__define__("IdeaGen", (function() {
  var view = this;
  return [ HTML.Raw("<!-- Navbar -->\n  "), HTML.DIV({
    id: "header",
    "class": "navbar navbar-default navbar-fixed-top",
    role: "navigation"
  }, "\n    ", HTML.DIV({
    "class": "container-fluid"
  }, "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", HTML.Raw('<div class="col-lg-3">\n          <div class="navbar-header">\n            <a class="navbar-brand" href="/">Protolab IdeaGens</a>\n          </div>\n        </div>'), "\n        ", HTML.DIV({
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
    }, "\n                ", HTML.STRONG("Welcome"), " ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("currentUserName"));
    }), "\n              "), "\n              ", HTML.BUTTON({
      id: "submitLogout",
      "class": "submitLogout btn-login"
    }, "Logout"), "\n            " ];
  }, function() {
    return [ "\n            ", HTML.Comment('\n              User Name:\n              <input type="text" id="userLogin" class="userLogin" placeholder="username">\n              <button id="submitLogin" class="submitLogin btn-login">Login</button>\n              '), "\n            " ];
  }), "\n          "), "\n        "), "\n      "), "\n    "), "\n  "), "\n\n\n  ", HTML.DIV({
    "class": "container-fluid",
    id: "ideastorm"
  }, "\n    ", Spacebars.include(view.lookupTemplate("yield")), "\n  "), HTML.Raw(" <!-- /container -->") ];
}));

Template.__define__("Timer", (function() {
  var view = this;
  return HTML.Raw('<div class="timer">\n    <span id="time">15</span><span> minutes remaining</span>\n  </div>');
}));

Template.__define__("ExitStudy", (function() {
  var view = this;
  return HTML.Raw('<button id="exitStudy" class="exitStudy nav-btn">\n    Exit Early\n  </button>');
}));

})();
