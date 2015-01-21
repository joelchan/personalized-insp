(function(){
Template.__checkName("Dashboard");
Template["Dashboard"] = new Template("Template.Dashboard", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row dashboard"
  }, "\n		", HTML.DIV({
    "class": "ideas-view col-sm-3"
  }, "\n      ", Spacebars.include(view.lookupTemplate("Ideabox")), "\n    "), "\n    ", HTML.DIV({
    "class": "themes-view col-sm-4"
  }, "\n      ", Spacebars.include(view.lookupTemplate("ThemeViz")), "\n      ", HTML.Raw("<h3>Chat with Theme Finders</h3>"), "\n      ", Spacebars.include(view.lookupTemplate("ChatMessages")), "\n      ", Spacebars.include(view.lookupTemplate("ChatInput")), "\n    "), " ", HTML.DIV({
    "class": "ideators-stats col-sm-5"
  }, "\n      ", Spacebars.include(view.lookupTemplate("IdeatorPanels")), "\n    "), " ", HTML.Raw("<!-- close ideator-stats col -->"), "\n  "), HTML.Raw(" <!-- close dashboard container -->") ];
}));

Template.__checkName("Ideabox");
Template["Ideabox"] = new Template("Template.Ideabox", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "ideas row"
  }, "\n    ", HTML.Raw("<!--List of Ideas-->"), "\n    ", HTML.DIV({
    "class": "col-md-8"
  }, "\n      ", HTML.H3("Ideas \n        ", HTML.SPAN({
    "class": "quantity"
  }, "\n          (", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numIdeas"));
  }), ")\n        "), "\n      "), "\n      ", Spacebars.include(view.lookupTemplate("filterbox")), "\n    "), "\n    ", HTML.DIV({
    id: "filters",
    "class": "col-md-4"
  }, "\n      ", HTML.Raw("<h3>Applied Filters</h3>"), "\n      ", Spacebars.include(view.lookupTemplate("activefilters")), "\n    "), "\n  "), HTML.Raw(" <!--End Ideas-->") ];
}));

Template.__checkName("TaskList");
Template["TaskList"] = new Template("Template.TaskList", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.DIV({
    id: "tasks",
    "class": "panel"
  }, "   \n      ", HTML.DIV({
    "class": "panel-group",
    id: "accordion"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("TaskItem")), "\n        " ];
  }), "\n      "), "\n    "), "\n    ", Spacebars.include(view.lookupTemplate("NewTaskModal")), "\n    ", Spacebars.include(view.lookupTemplate("EditTaskModal")), "\n  ");
}));

Template.__checkName("TaskItem");
Template["TaskItem"] = new Template("Template.TaskItem", (function() {
  var view = this;
  return HTML.DIV({
    "class": "panel panel-default task-item"
  }, "\n    ", HTML.DIV({
    "class": "panel-heading"
  }, "\n      ", HTML.H4({
    "class": "panel-title"
  }, "\n        ", HTML.Raw('<!-- <label class="time-label">{{time}}</label> -->'), "\n        ", HTML.A({
    "data-toggle": "collapse",
    "data-parent": function() {
      return [ "#", Spacebars.mustache(view.lookup("_id")) ];
    },
    href: function() {
      return [ "#", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n          ", HTML.Raw('<i class="fa fa-chevron-circle-right"></i>'), " \n          ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "  \n          ", HTML.Raw('<span class="priority-label" style="float:right;"></span>'), "\n        "), "\n        ", HTML.SPAN({
    style: "float:right;"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("totalTaskIdeas"));
  })), "\n      "), "\n      \n    "), "\n    ", HTML.DIV({
    id: function() {
      return Spacebars.mustache(view.lookup("_id"));
    },
    "class": "panel-collapse collapse"
  }, "\n      ", HTML.DIV({
    "class": "panel-body"
  }, "\n        ", HTML.DIV({
    "class": "row task-descr"
  }, "\n          ", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "desc"));
  }), "\n        "), "\n        ", HTML.DIV({
    "class": "row"
  }, "\n          ", HTML.DIV({
    "class": "col-md-3 task-metadata"
  }, "\n            ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("activeIdeators"));
  }), " active ideators\n          "), "\n          ", HTML.Raw('<div class="col-md-1 task-edit" style="float:right;">\n            <a href="#" class="show-modal" id="edit-task-btn" data-toggle="modal" data-target="#edit-task-modal">\n              <span class="fa fa-edit"></span>\n            </a>\n          </div>'), "\n        "), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("NewTaskModal");
Template["NewTaskModal"] = new Template("Template.NewTaskModal", (function() {
  var view = this;
  return [ HTML.Raw("<!--Change Prompt Modal-->\n  "), HTML.DIV({
    "class": "modal fade",
    id: "new-task-modal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "basicModal",
    "aria-hidden": "true"
  }, "\n    ", HTML.DIV({
    "class": "modal-dialog "
  }, "\n      ", HTML.DIV({
    "class": "modal-content"
  }, "\n        ", HTML.Raw('<div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n            &times;\n          </button>\n          <h3 class="modal-title" id="myModalLabel">New Task</h3>\n        </div>'), " ", HTML.Raw("<!-- close modal-header -->"), "\n        ", HTML.DIV({
    "class": "modal-body"
  }, "\n          ", HTML.DIV({
    "class": "form-group"
  }, "\n            ", HTML.TEXTAREA({
    "class": "form-control",
    rows: "5",
    id: "new-prompt",
    placeholder: "Enter task instructions here...",
    value: "            "
  }), "\n          "), "\n        "), " ", HTML.Raw("<!-- close modal-body -->"), "\n        ", Spacebars.include(view.lookupTemplate("ModalButtons")), "\n      "), " ", HTML.Raw("<!-- close modal-content -->"), "\n    "), " ", HTML.Raw("<!-- close modal-dialog -->"), "\n  "), HTML.Raw(" <!-- close changeModal -->") ];
}));

Template.__checkName("EditTaskModal");
Template["EditTaskModal"] = new Template("Template.EditTaskModal", (function() {
  var view = this;
  return [ HTML.Raw("<!--Change Prompt Modal-->\n  "), HTML.DIV({
    "class": "modal fade",
    id: "edit-task-modal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "basicModal",
    "aria-hidden": "true"
  }, "\n    ", HTML.DIV({
    "class": "modal-dialog "
  }, "\n      ", HTML.DIV({
    "class": "modal-content"
  }, "\n        ", HTML.Raw('<div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n            &times;\n          </button>\n          <h3 class="modal-title" id="myModalLabel">New Task</h3>\n        </div>'), " ", HTML.Raw("<!-- close modal-header -->"), "\n        ", HTML.DIV({
    "class": "modal-body"
  }, "\n          ", HTML.DIV({
    "class": "form-group"
  }, "\n            ", HTML.TEXTAREA({
    "class": "form-control",
    rows: "5",
    id: "new-prompt",
    placeholder: "Enter task instructions here...",
    value: "            "
  }), "\n          "), "\n        "), " ", HTML.Raw("<!-- close modal-body -->"), "\n        ", Spacebars.include(view.lookupTemplate("ModalButtons")), "\n      "), " ", HTML.Raw("<!-- close modal-content -->"), "\n    "), " ", HTML.Raw("<!-- close modal-dialog -->"), "\n  "), HTML.Raw(" <!-- close changeModal -->") ];
}));

Template.__checkName("ModalButtons");
Template["ModalButtons"] = new Template("Template.ModalButtons", (function() {
  var view = this;
  return HTML.DIV({
    "class": "modal-footer"
  }, "\n    ", Spacebars.include(view.lookupTemplate("TaskOptions")), HTML.Raw('\n    <button type="button" class="btn btn-default" data-dismiss="modal">\n      Close\n    </button>\n    <button type="button" class="btn btn-primary" data-dismiss="modal">\n      Send\n    </button>\n  '));
}));

Template.__checkName("TaskOptions");
Template["TaskOptions"] = new Template("Template.TaskOptions", (function() {
  var view = this;
  return HTML.Raw('<span id="task-options">   \n    <label>Priority </label>\n    <div class="btn-group">\n      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">\n        <span data-bind="label">Select One</span>&nbsp;<span class="caret"></span>\n      </button>\n      <ul class="dropdown-menu" role="menu">\n        <li><a href="#">High</a></li>\n        <li><a href="#">Medium</a></li>\n        <li><a href="#">Low</a></li>\n        <li><a href="#">Closed</a></li>\n      </ul>\n    </div> <!-- close btn-body -->\n    ( <a href="">more options</a> | <a href="">presets</a> )\n  </span>');
}));

Template.__checkName("BigPictureViz");
Template["BigPictureViz"] = new Template("Template.BigPictureViz", (function() {
  var view = this;
  return HTML.Raw('<div class="row">\n  </div>');
}));

Template.__checkName("ScratchPad");
Template["ScratchPad"] = new Template("Template.ScratchPad", (function() {
  var view = this;
  return HTML.Raw('<div class="row">\n  </div>');
}));

Template.__checkName("TagCloud");
Template["TagCloud"] = new Template("Template.TagCloud", (function() {
  var view = this;
  return HTML.DIV({
    id: "tagcloud"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n      ", HTML.SPAN({
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
    }), ")"), "\n      "), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("ThemeViz");
Template["ThemeViz"] = new Template("Template.ThemeViz", (function() {
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

Template.__checkName("IdeatorPanels");
Template["IdeatorPanels"] = new Template("Template.IdeatorPanels", (function() {
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

Template.__checkName("IdeatorMessaging");
Template["IdeatorMessaging"] = new Template("Template.IdeatorMessaging", (function() {
  var view = this;
  return HTML.Raw('<div class="row" id="actions">\n	  <div class="col-md-2">\n      <h3>Actions</h3>\n    </div>\n	  <div class="col-md-9" style="padding-top:10px">\n		  <span class="btn-group">\n			  <a href="#" class="show-modal" id="changebutton" data-toggle="modal" data-target="#changemodal">\n          <button type="button" class="btn btn-primary" style="background-color:#428bca;">\n            Send Message\n          </button>\n        </a>\n			  <a href="#" class="show-modal" id="sendexbutton" data-toggle="modal" data-target="#sendExModal">\n          <button type="button" class="btn btn-primary" style="background-color:#449d44;">\n            Send Examples\n          </button>\n        </a>\n			  <a href="#" class="show-modal" id="sendthemebutton" data-toggle="modal" data-target="#sendThemeModal">\n          <button type="button" class="btn btn-primary" style="background-color:#d58512;">\n            Send Theme\n          </button>\n        </a>\n	    </span>\n	  </div>\n  </div>');
}));

Template.__checkName("ChangePromptModal");
Template["ChangePromptModal"] = new Template("Template.ChangePromptModal", (function() {
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

Template.__checkName("SendExamplesModal");
Template["SendExamplesModal"] = new Template("Template.SendExamplesModal", (function() {
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

Template.__checkName("SendThemeModal");
Template["SendThemeModal"] = new Template("Template.SendThemeModal", (function() {
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

Template.__checkName("idea");
Template["idea"] = new Template("Template.idea", (function() {
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

Template.__checkName("theme");
Template["theme"] = new Template("Template.theme", (function() {
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

Template.__checkName("userSelection");
Template["userSelection"] = new Template("Template.userSelection", (function() {
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

Template.__checkName("HelpMessage");
Template["HelpMessage"] = new Template("Template.HelpMessage", (function() {
  var view = this;
  return HTML.Raw('<span class="alert-msg">\n    Help Requested\n  </span>');
}));

Template.__checkName("UserProfile");
Template["UserProfile"] = new Template("Template.UserProfile", (function() {
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
  }), "\n        "), "\n      "), "\n  			", HTML.Raw('<!-- <span class="userprofilename" href="">{{this.name}}</span> -->'), "\n  			", HTML.Raw('<!-- <div class="checkbox">\n      			<input class="selectpart" type="checkbox" value="{{this._id}}">\n      			<a class="userprofilename" href=""><label>{{this.name}}</label></a>\n  			</div> -->'), "\n  			", HTML.Raw('<!--<div class="name-icon"><i class="fa fa-user fa-2x"></i></div>-->'), "\n  	"), "\n		", Blaze._TemplateWith(function() {
    return Spacebars.call(view.lookup("."));
  }, function() {
    return Spacebars.include(view.lookupTemplate("userseries"));
  }), "\n	");
}));

Template.__checkName("userseries");
Template["userseries"] = new Template("Template.userseries", (function() {
  var view = this;
  return HTML.Raw('<div class="series col-sm-10">\n	</div>');
}));

Template.__checkName("filter-UI");
Template["filter-UI"] = new Template("Template.filter-UI", (function() {
  var view = this;
  return "";
}));

})();
