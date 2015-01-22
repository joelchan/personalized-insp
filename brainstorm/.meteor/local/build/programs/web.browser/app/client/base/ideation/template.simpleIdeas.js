(function(){
Template.__checkName("IdeationPage");
Template["IdeationPage"] = new Template("Template.IdeationPage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.DIV("\n      ", Spacebars.include(view.lookupTemplate("NotificationDrawer")), "\n    "), "\n    ", HTML.DIV({
    id: "ideation-pane",
    "class": "push ideation-pane col-md-9"
  }, "\n      ", HTML.DIV({
    "class": "header",
    "data-spy": "affix",
    "data-offset-top": "50"
  }, " \n        ", HTML.DIV({
    "class": "row"
  }, "\n          ", Spacebars.include(view.lookupTemplate("Prompt")), "\n        "), "\n        ", HTML.Raw('<!-- <div class="row">\n          {{> Priming }}\n        </div> -->'), "\n      "), " \n      ", HTML.Raw("<!-- close header -->"), "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", Spacebars.include(view.lookupTemplate("IdeaBox")), "\n      "), "\n  \n      ", HTML.DIV({
    "class": "push footer navbar-fixed-bottom",
    "data-spy": "affix",
    "data-offset-top": "50"
  }, " \n        ", Spacebars.include(view.lookupTemplate("SubmitIdeas")), "\n      "), "\n\n      ", HTML.Raw('<div class="modal fade" id="acknowledgeModal" tabindex="-1" role="dialog" aria-labelledby="acknowledgeModal" aria-hidden="true">\n        <div class="modal-dialog modal-sm">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n              <h4 class="modal-title" id="myModalLabel">Help Requested</h4>\n            </div>\n            <div class="modal-body">\n              <h3>Help is on the way! You should hear from the facilitator soon!</h3>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n            </div>\n          </div>\n        </div>\n      </div>'), "\n    "), "\n  ");
}));

Template.__checkName("simpleIdea");
Template["simpleIdea"] = new Template("Template.simpleIdea", (function() {
  var view = this;
  return HTML.DIV({
    "class": "list-item",
    draggable: "true"
  }, "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("isStarred"));
  }, function() {
    return [ "\n      ", HTML.I({
      "class": "fa fa-star gamechangestar"
    }), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("NotificationDrawer");
Template["NotificationDrawer"] = new Template("Template.NotificationDrawer", (function() {
  var view = this;
  return [ HTML.Raw('<!-- <div id="notifications" class="panel" role="navigation"> -->\n  '), HTML.DIV({
    id: "notifications",
    "class": "panel"
  }, "   \n    ", HTML.DIV({
    "class": "panel-group",
    id: "accordion"
  }, "\n      ", HTML.Raw("<!--Directions-->"), " \n      ", HTML.DIV({
    "class": "panel panel-default notification-item"
  }, "\n        ", HTML.Raw('<div class="panel-heading">\n          <h5 class="panel-title">\n            <!-- <a data-toggle="collapse" data-parent="#accordion" href="#directions"> -->\n            <a data-toggle="collapse" data-target="#directions" href="#directions">  \n              <i class="fa fa-info-circle"></i> Directions\n            </a>\n          </h5>\n        </div>'), "\n        ", HTML.DIV({
    id: "directions",
    "class": "panel-collapse collapse-in"
  }, "\n          ", HTML.DIV({
    "class": "panel-body"
  }, "\n            ", Spacebars.include(view.lookupTemplate("Directions")), "\n          "), "\n        "), "\n      "), "\n      ", HTML.Raw("<!-- for priming -->"), "\n      ", HTML.Raw('<!-- <div class="panel panel-default notification-item {{#unless handled}} unhandled {{/unless}}"> -->'), "\n      ", HTML.Raw('<!-- <div class="panel panel-default notification-item"> -->'), "\n        ", HTML.Raw('<!-- <div class="panel-heading"> -->'), "\n          ", HTML.Raw('<!-- <h5 class="panel-title"> -->'), "\n            ", HTML.Raw('<!-- <a data-toggle="collapse" data-target="#priming" href="#priming">   -->'), "\n              ", HTML.Raw('<!-- <i class="fa fa-info-circle"></i> Initial inspiration -->'), "\n              ", HTML.Raw("<!-- </a> -->"), "\n            ", HTML.Raw("<!-- </h5> -->"), "\n          ", HTML.Raw("<!-- </div> -->"), "\n        ", HTML.Raw('<!-- <div id="priming" class="panel-collapse collapse in"> -->'), "\n          ", HTML.Raw('<!-- <div class="panel-body"> -->'), "\n            ", HTML.Raw("<!-- {{ > Priming }} -->"), "\n            ", HTML.Raw("<!-- </div> -->"), "\n          ", HTML.Raw("<!-- </div> -->"), "\n        ", HTML.Raw("<!-- </div> -->"), "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("notifications"));
  }, function() {
    return [ "\n        ", Blaze.Unless(function() {
      return Spacebars.call(view.lookup("directions"));
    }, function() {
      return [ "\n          ", Spacebars.include(view.lookupTemplate("NotifyItem")), "\n        " ];
    }), "\n      " ];
  }), "\n    "), "\n  ") ];
}));

Template.__checkName("NotifyItem");
Template["NotifyItem"] = new Template("Template.NotifyItem", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "panel panel-default notification-item ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("handled"));
      }, function() {
        return " unhandled ";
      }) ];
    }
  }, "\n    ", HTML.DIV({
    "class": "panel-heading"
  }, "\n      ", HTML.H4({
    "class": "panel-title"
  }, "\n        ", HTML.LABEL({
    "class": "time-label"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("time"));
  })), "\n        ", HTML.A({
    "data-toggle": "collapse",
    "data-parent": function() {
      return [ "#", Spacebars.mustache(view.lookup("_id")) ];
    },
    href: function() {
      return [ "#", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n          ", HTML.Raw('<i class="fa fa-chevron-circle-right"></i>'), " ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "  \n        "), "\n      "), "\n    "), "\n    ", HTML.DIV({
    id: function() {
      return Spacebars.mustache(view.lookup("_id"));
    },
    "class": "panel-collapse collapse"
  }, "\n      ", HTML.DIV({
    "class": "panel-body"
  }, "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("isExamples"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("sentexamples")), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("isPrompt"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("sentprompt")), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("isTheme"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("senttheme")), "\n        " ];
  }), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("sentexamples");
Template["sentexamples"] = new Template("Template.sentexamples", (function() {
  var view = this;
  return [ HTML.Raw('<h5 class="notify-label">Consider these ideas: </h5>\n    '), Blaze.Each(function() {
    return Spacebars.call(view.lookup("examples"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      id: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
      },
      "class": "idea"
    }, "\n        ", HTML.I({
      "class": "idea-bullet fa fa-lightbulb-o"
    }), " \n        ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "content"));
    }), " \n      "), "\n    " ];
  }) ];
}));

Template.__checkName("Priming");
Template["Priming"] = new Template("Template.Priming", (function() {
  var view = this;
  return [ HTML.Raw("<p>To get you started, here are some ideas others have generated for this problem. These ideas are simply here for your inspiration. Feel free to ignore them, build on them, or combine them as you see fit.</p>\n    "), Blaze.Each(function() {
    return Spacebars.call(view.lookup("primeIdeas"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      "class": "idea"
    }, "\n        ", HTML.I({
      "class": "idea-bullet fa fa-lightbulb-o"
    }), " \n        ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    }), " \n      "), "\n    " ];
  }) ];
}));

Template.__checkName("sentprompt");
Template["sentprompt"] = new Template("Template.sentprompt", (function() {
  var view = this;
  return [ HTML.Raw('<h5 class="notify-label">The facilitator says: </h5>\n  '), HTML.DIV({
    "class": "notify-prompt"
  }, "\n    ", HTML.Raw('<!-- <i class="fa fa-question-circle"></i> -->'), "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n  ") ];
}));

Template.__checkName("senttheme");
Template["senttheme"] = new Template("Template.senttheme", (function() {
  var view = this;
  return [ HTML.Raw('<h5 class="notify-label">Try generating ideas under the following theme: </h5>\n  '), HTML.DIV("\n    ", HTML.Raw('<i class="fa fa-bolt"></i>'), "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("theme"));
  }), "\n  "), HTML.Raw('\n  <h6 class="themehint">Need more help? Click here to see other ideas in this theme.</h6>\n  '), HTML.DIV({
    "class": "themeexamples"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("themeexamples"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      id: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
      },
      "class": "idea"
    }, "\n        ", HTML.I({
      "class": "idea-bullet fa fa-lightbulb-o"
    }), " \n        ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "content"));
    }), " \n      "), "\n    " ];
  }), "\n  ") ];
}));

Template.__checkName("Directions");
Template["Directions"] = new Template("Template.Directions", (function() {
  var view = this;
  return HTML.Raw('<div class="directions">\n    <p>This is a brainstorming task. There are a few rules for brainstorming:</p>\n    <ol>\n      <li>There are no bad ideas. Defer judgement on your ideas.</li>\n      <li>Wild ideas are okay</li>\n      <li>Go for quantity</li>\n      <li>Combinations of ideas count as new ideas.</li>\n    </ol>\n    <!-- <p>Keep in mind if at any point you must exit the study early, you can click the button in the top right corner of the screen. You will be compensated on a pro-rated basis according to your participation time.</p> -->\n  </div><!-- end sidebar -->');
}));

Template.__checkName("Prompt");
Template["Prompt"] = new Template("Template.Prompt", (function() {
  var view = this;
  return HTML.DIV({
    "class": "prompt-box"
  }, HTML.Raw('\n    <!-- <p class="heading"> -->\n    '), HTML.P("\n      ", Blaze.View(function() {
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("prompt")));
  }), "\n    "), "\n  ");
}));

Template.__checkName("IdeaBox");
Template["IdeaBox"] = new Template("Template.IdeaBox", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ideabox"
  }, HTML.Raw("\n    <p>Each of your submitted ideas will be listed here for your review:</p>\n    "), Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("simpleIdea")), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("SubmitIdeas");
Template["SubmitIdeas"] = new Template("Template.SubmitIdeas", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.DIV({
    "class": "col-md-7"
  }, "\n        ", HTML.TEXTAREA({
    id: "nextIdea",
    "class": "idea-input",
    placeholder: [ "Enter your idea here \n(press the ", HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }), " key or the ", HTML.CharRef({
      html: "&quot;",
      str: '"'
    }), "Enter Idea", HTML.CharRef({
      html: "&quot;",
      str: '"'
    }), " button to the right after each \ncomplete idea)" ]
  }), "\n    "), HTML.Raw('\n    <div class="col-md-2">\n        <button id="submitIdea" class="submitIdea btn-default btn-primary"> Enter Idea </button>\n    </div>\n    <div class="col-md-2">\n        <a href="" data-toggle="modal" data-target="#acknowledgeModal">\n          <button id="request-help" class="getHelp btn-default btn-danger" style=""> I\'m Stuck! </button></a>\n    </div>\n  '));
}));

})();
