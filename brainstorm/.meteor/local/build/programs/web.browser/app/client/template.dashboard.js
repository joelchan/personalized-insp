(function(){
Template.__define__("Dashboard", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row dashboard"
  }, "\n		", HTML.DIV({
    "class": "ideas-view col-sm-3"
  }, "\n      ", Spacebars.include(view.lookupTemplate("Ideabox")), "\n    "), "\n    ", HTML.DIV({
    "class": "themes-view col-sm-4"
  }, "\n      ", Spacebars.include(view.lookupTemplate("ThemeViz")), "\n      ", HTML.Raw("<h3>Chat with Theme Finders</h3>"), "\n      ", Spacebars.include(view.lookupTemplate("ChatMessages")), "\n      ", Spacebars.include(view.lookupTemplate("ChatInput")), "\n    "), "\n    ", HTML.DIV({
    "class": "ideators-stats col-sm-5"
  }, "\n      ", Spacebars.include(view.lookupTemplate("IdeatorPanels")), "\n    "), " ", HTML.Raw("<!-- close ideator-stats col -->"), "\n  "), HTML.Raw(" <!-- close dashboard container -->") ];
}));

Template.__define__("ThemeViz", (function() {
  var view = this;
  return HTML.DIV({
    "class": "vizes row"
  }, "\n	  ", HTML.DIV({
    "class": "col-md-12"
  }, HTML.Raw("<h3>Themes</h3>"), "\n		  ", HTML.DIV({
    "class": "tab-content"
  }, "\n			  ", HTML.Raw("<!--Tag Cloud Viz-->"), "\n			  ", HTML.DIV({
    "class": "viz tab-pane active",
    id: "tagcloudwrapper"
  }, "\n				  ", Spacebars.include(view.lookupTemplate("TagCloud")), "\n			  "), "\n		  "), "\n	  "), "\n  ");
}));

Template.__define__("Ideabox", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "ideas row"
  }, "\n		", HTML.Raw("<!--List of Ideas-->"), "\n		", HTML.DIV({
    "class": "col-md-8"
  }, "\n			", Spacebars.include(view.lookupTemplate("IdeaWordCloud")), "\n			", HTML.H3("Ideas \n				", HTML.SPAN({
    "class": "quantity"
  }, "\n					(", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numIdeas"));
  }), ")\n				"), "\n			"), "\n                        \n			", Spacebars.include(view.lookupTemplate("filterbox")), "\n		"), "\n		", HTML.DIV({
    id: "filters",
    "class": "col-md-4"
  }, "\n			", HTML.Raw("<h3>Applied Filters</h3>"), "\n			", Spacebars.include(view.lookupTemplate("activefilters")), "\n		"), "\n	"), HTML.Raw(" <!--End Ideas-->") ];
}));

Template.__define__("IdeatorPanels", (function() {
  var view = this;
  return HTML.DIV({
    id: "people-view"
  }, "\n    ", Spacebars.include(view.lookupTemplate("IdeatorMessaging")), HTML.Raw("\n		<hr>\n		"), HTML.DIV({
    id: "people"
  }, "\n			", HTML.Raw('<div class="row">\n				<div class="col-md-2" style="margin-bottom:15px">\n          <h3>People</h3>\n        </div>\n			</div>'), "\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("users"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("UserProfile")), "\n			" ];
  }), "\n		"), "\n    ", Spacebars.include(view.lookupTemplate("ChangePromptModal")), "\n    ", Spacebars.include(view.lookupTemplate("SendExamplesModal")), "\n    ", Spacebars.include(view.lookupTemplate("SendThemeModal")), "\n	");
}));

Template.__define__("IdeatorMessaging", (function() {
  var view = this;
  return HTML.Raw('<div class="row" id="actions">\n	  <div class="col-md-2">\n      <h3>Actions</h3>\n    </div>\n	  <div class="col-md-9" style="padding-top:10px">\n		  <span class="btn-group">\n			  <a href="#" class="show-modal" id="changebutton" data-toggle="modal" data-target="#changemodal">\n          <button type="button" class="btn btn-primary" style="background-color:#428bca;">\n            Send Message\n          </button>\n        </a>\n			  <a href="#" class="show-modal" id="sendexbutton" data-toggle="modal" data-target="#sendExModal">\n          <button type="button" class="btn btn-primary" style="background-color:#449d44;">\n            Send Examples\n          </button>\n        </a>\n			  <a href="#" class="show-modal" id="sendthemebutton" data-toggle="modal" data-target="#sendThemeModal">\n          <button type="button" class="btn btn-primary" style="background-color:#d58512;">\n            Send Theme\n          </button>\n        </a>\n	    </span>\n	  </div>\n  </div>');
}));

Template.__define__("ChangePromptModal", (function() {
  var view = this;
  return [ HTML.Raw("<!--Change Prompt Modal-->\n	"), HTML.DIV({
    "class": "modal fade",
    id: "changemodal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "basicModal",
    "aria-hidden": "true"
  }, "\n    ", HTML.DIV({
    "class": "modal-dialog "
  }, "\n      ", HTML.DIV({
    "class": "modal-content"
  }, "\n        ", HTML.Raw('<div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n            &times;\n          </button>\n          <h3 class="modal-title" id="myModalLabel">Send Message</h3>\n        </div>'), " ", HTML.Raw("<!-- close modal-header -->"), "\n        ", HTML.DIV({
    "class": "modal-body"
  }, "\n          ", HTML.Raw("<h4>Select Users</h4>"), "\n          ", HTML.DIV({
    "class": "userSelectList"
  }, "\n            ", HTML.Raw('<div class="radio userSelection">\n              <label>\n                <input type="radio" name="userSelectRadios" id="allUsers" value="allUsers">\n                Everyone\n              </label>\n            </div>'), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("participants"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("userSelection")), "\n            " ];
  }), "\n          "), "\n          ", HTML.Raw("<h4>\n            Send some guidance, feedback, hints, or general encouragement (or anything else you think might help) to the selected users\n          </h4>"), "\n          ", HTML.DIV({
    "class": "form-group"
  }, "\n						", HTML.TEXTAREA({
    "class": "form-control",
    rows: "3",
    id: "new-prompt",
    placeholder: "Type message here...",
    value: "            "
  }), "\n					"), "\n        "), " ", HTML.Raw("<!-- close modal-body -->"), "\n        ", Spacebars.include(view.lookupTemplate("ModalButtons")), "\n    	"), " ", HTML.Raw("<!-- close modal-content -->"), "\n  	"), " ", HTML.Raw("<!-- close modal-dialog -->"), "\n	"), HTML.Raw(" <!-- close changeModal -->") ];
}));

Template.__define__("SendExamplesModal", (function() {
  var view = this;
  return [ HTML.Raw("<!--Send Examples Modal-->\n	"), HTML.DIV({
    "class": "modal fade",
    id: "sendExModal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "basicModal",
    "aria-hidden": "true"
  }, "\n    ", HTML.DIV({
    "class": "modal-dialog modal-lg"
  }, "\n      ", HTML.DIV({
    "class": "modal-content"
  }, "\n        ", HTML.Raw('<div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n            &times;\n          </button>\n          <h3 class="modal-title" id="myModalLabel">\n            Send Examples\n          </h3>\n        </div>'), "\n        ", HTML.DIV({
    "class": "modal-body"
  }, "\n          ", HTML.Raw("<h4>Select Users</h4>"), "\n          ", HTML.DIV({
    "class": "userSelectList"
  }, "\n            ", HTML.Raw('<div class="radio userSelection">\n              <label>\n                <input type="radio" name="userSelectRadios" id="allUsers" value="allUsers">\n                	Everyone\n              </label>\n            </div>'), " ", HTML.Raw("<!-- close userSelection -->"), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("participants"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("userSelection")), "\n            " ];
  }), "\n          "), " ", HTML.Raw("<!-- close userSelectList -->"), "\n          ", HTML.Raw("<h4>Choose examples to send to the selected users</h4>"), "\n          ", HTML.DIV({
    "class": "send-examples-filterbox"
  }, "\n            ", Spacebars.include(view.lookupTemplate("filterbox")), "\n          "), "\n          ", HTML.DIV("\n            ", HTML.Raw("<h3>Applied Filters</h3>"), "\n            ", Spacebars.include(view.lookupTemplate("activefilters")), "\n          "), "\n        "), " ", HTML.Raw("<!-- close modal-body -->"), "\n        ", Spacebars.include(view.lookupTemplate("ModalButtons")), "\n      "), " ", HTML.Raw("<!-- close modal-content -->"), "\n  	"), " ", HTML.Raw("<!-- close modal-dialog -->"), "\n	"), HTML.Raw(" <!-- close sendExModal -->") ];
}));

Template.__define__("SendThemeModal", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "modal fade",
    id: "sendThemeModal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "basicModal",
    "aria-hidden": "true"
  }, "\n    ", HTML.DIV({
    "class": "modal-dialog "
  }, "\n      ", HTML.DIV({
    "class": "modal-content"
  }, "\n        ", HTML.Raw('<div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n            &times;\n          </button>\n          <h3 class="modal-title" id="myModalLabel">\n            Send Theme\n          </h3>\n        </div>'), " ", HTML.Raw("<!-- close modal-header -->"), "\n        ", HTML.DIV({
    "class": "modal-body"
  }, "\n          ", HTML.Raw("<h4>Select Users</h4>"), "\n          ", HTML.DIV({
    "class": "userSelectList"
  }, "\n            ", HTML.Raw('<div class="radio userSelection">\n              <label>\n                <input type="radio" name="userSelectRadios" id="allUsers" value="allUsers">\n                Everyone\n              </label>\n            </div>'), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("participants"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("userSelection")), "\n            " ];
  }), "\n          "), " ", HTML.Raw("<!-- close userSelectList -->"), "\n          ", HTML.Raw("<h4>Choose a theme to send to the selected users</h4>"), "\n          ", HTML.DIV({
    id: "sendThemeModal-clusterlist"
  }, "\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n							", Spacebars.include(view.lookupTemplate("theme")), "\n						" ];
  }), "	\n					"), "\n			  "), " ", HTML.Raw("<!-- close modal-body -->"), "\n        ", Spacebars.include(view.lookupTemplate("ModalButtons")), "\n      "), " ", HTML.Raw("<!-- close modal-content -->"), "\n    "), " ", HTML.Raw("<!-- close modal-dialog -->"), "\n  "), HTML.Raw(" <!-- close sendThemeModal -->") ];
}));

Template.__define__("ModalButtons", (function() {
  var view = this;
  return HTML.Raw('<div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal">\n      Close\n    </button>\n    <button type="button" class="btn btn-primary" data-dismiss="modal">\n      Send\n    </button>\n  </div>');
}));

Template.__define__("idea", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
    },
    "class": "idea"
  }, "\n  ", HTML.I({
    "class": function() {
      return [ "fa fa-lg ", Blaze.If(function() {
        return Spacebars.call(Spacebars.dot(view.lookup("."), "isGamechanger"));
      }, function() {
        return " \n    fa-star ";
      }, function() {
        return " fa-star-o ";
      }), "gamechangestar" ];
    }
  }, "\n  "), "\n  ", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "content"));
  }), " \n");
}));

Template.__define__("theme", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
    },
    "class": "radio theme"
  }, "\n		", HTML.LABEL(HTML.INPUT({
    type: "radio",
    name: "themeRadios",
    id: function() {
      return [ "themeRadios", Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id")) ];
    },
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
    }
  }), "\n			", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
  }), "\n		"), "\n	");
}));

Template.__define__("userSelection", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
    },
    "class": "radio userSelection"
  }, "\n		", HTML.LABEL(HTML.INPUT({
    type: "radio",
    name: "userSelectRadios",
    id: function() {
      return [ "userSelectRadios", Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id")) ];
    },
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
    }
  }), "\n			", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
  }), "\n		"), "\n	");
}));

Template.__define__("TagCloud", (function() {
  var view = this;
  return HTML.DIV({
    id: "tagcloud"
  }, "\n		", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n			", HTML.SPAN({
      "class": "tagname",
      style: function() {
        return [ "font-size: ", Spacebars.mustache(view.lookup("getFontSize")), "px;" ];
      },
      id: function() {
        return [ "cl-", Spacebars.mustache(view.lookup("_id")) ];
      }
    }, "\n        ", HTML.A({
      href: ""
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("name"));
    }), " (", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getClusterSize"));
    }), ")"), "\n      "), "\n		" ];
  }), "\n	");
}));

Template.__define__("HelpMessage", (function() {
  var view = this;
  return HTML.Raw('<span class="alert-msg">\n    Help Requested\n  </span>');
}));

Template.__define__("UserProfile", (function() {
  var view = this;
  return HTML.DIV({
    "class": "profile row",
    id: function() {
      return [ "userprofile-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n    ", HTML.DIV({
    id: function() {
      return [ "uname-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": "form-inline col-sm-2"
  }, "\n      ", HTML.A({
    href: ""
  }, "\n        ", HTML.SPAN({
    "class": "userprofilename"
  }, "\n          ", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
  }), "\n        "), "\n      "), "\n  			", HTML.Raw('<!-- <span class="userprofilename" href="">{{this.name}}</span> -->'), "\n  			", HTML.Raw('<!-- <div class="checkbox">\n      			<input class="selectpart" type="checkbox" value="{{this._id}}">\n      			<a class="userprofilename" href=""><label>{{this.name}}</label></a>\n  			</div> -->'), "\n  			", HTML.Raw('<!--<div class="name-icon"><i class="fa fa-user fa-2x"></i></div>-->'), "\n  	"), "\n		", Spacebars.TemplateWith(function() {
    return Spacebars.call(view.lookup("."));
  }, function() {
    return Spacebars.include(view.lookupTemplate("userseries"));
  }), "\n	");
}));

Template.__define__("userseries", (function() {
  var view = this;
  return HTML.Raw('<div class="series col-sm-10">\n	</div>');
}));

Template.__define__("filter-UI", (function() {
  var view = this;
  return "";
}));

Template.__define__("ideawordcloud", (function() {
  var view = this;
  return HTML.Raw('<div id="ideawordcloud">\n		Word Cloud\n	</div>');
}));

Template.__define__("IdeaWordCloud", (function() {
  var view = this;
  return HTML.DIV({
    id: "ideawordcloud"
  }, "\n		", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n			", HTML.SPAN({
      "class": "cloudItem",
      style: function() {
        return [ "font-size: ", Spacebars.mustache(view.lookup("getFontSize")), "px;" ];
      }
    }, "\n        		", HTML.A({
      href: ""
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getWord"));
    }), " (", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getWordCount"));
    }), ")"), "\n      			"), "\n		" ];
  }), "\n	");
}));

})();
