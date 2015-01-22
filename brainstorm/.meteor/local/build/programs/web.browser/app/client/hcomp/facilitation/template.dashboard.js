(function(){
Template.__checkName("HcompDashboard");
Template["HcompDashboard"] = new Template("Template.HcompDashboard", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row hcomp-dashboard",
    id: "hcomp-dashboard-container"
  }, "\n		", HTML.DIV({
    "class": "ideas-view col-sm-3"
  }, "\n      ", Spacebars.include(view.lookupTemplate("HcompDashIdeabox")), "\n    "), "\n    ", HTML.DIV({
    "class": "notes-view col-sm-4"
  }, "\n      ", HTML.Raw("<!-- <h3>Understand What's Going On!</h3> -->"), "\n      ", Spacebars.include(view.lookupTemplate("HcompBigPictureViz")), "\n\n      ", HTML.Raw("<hr>"), "\n\n      ", Spacebars.include(view.lookupTemplate("HcompScratchPad")), "\n    "), " ", HTML.Raw("<!-- close notes-view col -->"), "\n    ", HTML.DIV({
    "class": "tasks-view col-sm-4"
  }, "\n      ", HTML.DIV({
    "class": "row fac-actions"
  }, "\n          ", Spacebars.include(view.lookupTemplate("HcompCreateTaskButton")), "\n\n          ", Spacebars.include(view.lookupTemplate("HcompBeginSynthesis")), "\n      "), "\n      ", HTML.DIV({
    "class": "row",
    id: "create-task-container"
  }, "\n	    ", Spacebars.include(view.lookupTemplate("CreateTask")), "\n      "), "\n      ", Spacebars.include(view.lookupTemplate("TaskCards")), "\n\n    "), "\n    \n    \n  "), HTML.Raw(" <!-- close dashboard container -->") ];
}));

Template.__checkName("HcompDashIdeabox");
Template["HcompDashIdeabox"] = new Template("Template.HcompDashIdeabox", (function() {
  var view = this;
  return [ HTML.H1(" ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), " "), "\n  ", HTML.DIV({
    "class": "ideas row"
  }, "\n    ", HTML.Raw("<!--List of Ideas-->"), "\n    ", HTML.Raw('<!-- <div class="col-md-8"> -->'), "\n      ", Spacebars.include(view.lookupTemplate("HcompFilterbox")), "\n    ", HTML.Raw("<!-- </div> -->"), "\n    ", HTML.Raw('<!-- <div id="filters" class="col-md-4"> -->'), "\n      ", HTML.Raw("<!-- <h3>Applied Filters</h3> -->"), "\n      ", HTML.Raw("<!-- {{> HcompActivefilters}} -->"), "\n    ", HTML.Raw("<!-- </div> -->"), "\n  "), HTML.Raw(" <!--End Ideas-->") ];
}));

Template.__checkName("HcompBigPictureViz");
Template["HcompBigPictureViz"] = new Template("Template.HcompBigPictureViz", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row",
    id: "big-picture-viz"
  }, "\n      ", HTML.DIV({
    "class": "col-md-1"
  }, "\n        ", Spacebars.include(view.lookupTemplate("HcompOverallStats")), "\n      "), "\n      ", HTML.DIV({
    "class": "col-md-10"
  }, "\n        ", Spacebars.include(view.lookupTemplate("HcompIdeaWordCloud")), "\n        ", HTML.Raw("<!-- {{> HcompTagCloud }} -->"), "\n      "), "\n  ");
}));

Template.__checkName("HcompOverallStats");
Template["HcompOverallStats"] = new Template("Template.HcompOverallStats", (function() {
  var view = this;
  return HTML.Raw('<span class="fa fa-lightbulb-o"></span>');
}));

Template.__checkName("HcompIdeaWordCloud");
Template["HcompIdeaWordCloud"] = new Template("Template.HcompIdeaWordCloud", (function() {
  var view = this;
  return HTML.DIV({
    id: "ideawordcloud"
  }, "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "  \n      ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("ideas"));
    }, function() {
      return [ "\n        ", HTML.SPAN({
        "class": "cloudItem",
        style: function() {
          return [ "font-size: ", Spacebars.mustache(view.lookup("getFontSize")), "px;" ];
        }
      }, "\n              ", HTML.Comment(' <a href="">{{getWord}}</a> '), "\n              ", Blaze.View(function() {
        return Spacebars.mustache(view.lookup("getWord"));
      }), "\n              "), "\n      " ];
    }), "\n    " ];
  }, function() {
    return "\n      No ideas yet!\n    ";
  }), "\n  ");
}));

Template.__checkName("HcompScratchPad");
Template["HcompScratchPad"] = new Template("Template.HcompScratchPad", (function() {
  var view = this;
  return HTML.DIV({
    "class": "row",
    id: "scratchpad"
  }, HTML.Raw("\n    <!-- <h3>Scratchpad</h3> -->\n    "), HTML.DIV({
    "class": "form-group"
  }, "\n      ", HTML.TEXTAREA({
    "class": "form-control scratchpad-form",
    id: "fac-notes",
    placeholder: "Take notes here..."
  }), "\n    "), "\n  ");
}));

Template.__checkName("HcompCreateTaskButton");
Template["HcompCreateTaskButton"] = new Template("Template.HcompCreateTaskButton", (function() {
  var view = this;
  return HTML.Raw('<!-- <div class="create-task-btn"> -->\n    <a data-toggle="collapse" data-parent="#create-task-container" href="#CreateTask">\n      <button class="create-task-btn btn btn-large btn-success">\n        New Inspiration\n      </button>\n    </a>\n  <!-- </div> -->');
}));

Template.__checkName("HcompBeginSynthesis");
Template["HcompBeginSynthesis"] = new Template("Template.HcompBeginSynthesis", (function() {
  var view = this;
  return HTML.Raw('<!-- <div class="ideator-control"> -->\n    <button class="begin-synthesis ideator-control btn btn-large btn-success">\n      Go To Synthesis\n    </button>\n  <!-- </div> -->');
}));

Template.__checkName("CreateTask");
Template["CreateTask"] = new Template("Template.CreateTask", (function() {
  var view = this;
  return HTML.DIV({
    id: "CreateTask",
    "class": "collapse"
  }, HTML.Raw('\n    <span class="card-description">Create a new inspiration</span>\n    <hr>\n		'), HTML.FORM({
    role: "form",
    "class": "form"
  }, "\n			", HTML.DIV({
    "class": "row"
  }, "\n		  		", HTML.DIV({
    "class": "col-xs-12"
  }, "\n					", HTML.Raw('<label class="sr-only" for="task-description">Task Instructions</label>'), "\n					", HTML.TEXTAREA({
    "class": "form-control",
    rows: "2",
    id: "task-description",
    placeholder: "Describe your inspiration..."
  }), "\n				"), "\n			"), "\n			", HTML.Raw('<div class="row task-main-options">\n				<div class="col-xs-7">\n          <form id="task-priority" role="form">\n            <label class="">Priority </label>\n            <label class="radio-inline">\n              <input type="radio" name="taskPriorityOptions" value="1"> Lo\n            </label>\n            <label class="radio-inline">\n              <input type="radio" name="taskPriorityOptions" value="2" checked=""> Mid\n            </label>\n            <label class="radio-inline">\n              <input type="radio" name="taskPriorityOptions" value="3"> Hi\n            </label>\n          </form>\n				</div>\n        <div class="form-group task-options col-xs-5 pull-right">\n          <button id="task-create-cancel" type="button" class="btn btn-default">\n            Cancel\n          </button>\n          <button id="task-create" type="button" class="btn btn-primary">\n            Create\n          </button>\n        </div>\n			</div>'), "\n			", HTML.Raw('<!-- <div class="row">\n				\n			</div> -->'), "\n	  	"), "\n	");
}));

Template.__checkName("TaskCards");
Template["TaskCards"] = new Template("Template.TaskCards", (function() {
  var view = this;
  return [ HTML.Raw("<h1>Inspirations</h1>\n  "), HTML.DIV({
    "class": "row",
    id: "task-card-list"
  }, "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n      ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("tasks"));
    }, function() {
      return [ "\n  			", Spacebars.include(view.lookupTemplate("TaskCard")), "\n  		" ];
    }), "\n    " ];
  }, function() {
    return "\n      No inspirations yet!\n    ";
  }), "\n	") ];
}));

Template.__checkName("TaskCard");
Template["TaskCard"] = new Template("Template.TaskCard", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isNotEdit"));
  }, function() {
    return [ " \n		", HTML.DIV({
      "class": "task-card",
      id: function() {
        return Spacebars.mustache(view.lookup("getID"));
      }
    }, "\n			", HTML.DIV({
      "class": "row task-card-main"
    }, "\n				", HTML.DIV({
      "class": "card-description col-xs-10"
    }, "\n					", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getDescription"));
    }), "\n				"), "\n        ", HTML.DIV({
      "class": "card-edit col-xs-2 col-xs-offset-2"
    }, "\n          ", HTML.SPAN({
      title: "Edit",
      "class": "glyphicon glyphicon-edit card-edit"
    }, " "), "    \n        "), "\n			"), "\n			", HTML.HR(), "\n			", HTML.DIV({
      "class": "task-data row"
    }, "\n        ", HTML.DIV({
      "class": "card-ideas col-xs-3"
    }, "\n          ", Blaze.If(function() {
      return Spacebars.call(view.lookup("getIdeas"));
    }, function() {
      return [ "\n            ", HTML.Comment(' <span title="Ideas" class="glyphicon glyphicon-exclamation-sign"> </span> '), "\n            ", HTML.SPAN({
        "class": "badge"
      }, Blaze.View(function() {
        return Spacebars.mustache(view.lookup("getIdeas"));
      })), " \n            ", HTML.A({
        "data-toggle": "collapse",
        "data-parent": function() {
          return [ "#task-", Spacebars.mustache(view.lookup("getID")), "-ideas-group" ];
        },
        href: function() {
          return [ "#task-", Spacebars.mustache(view.lookup("getID")), "-ideas" ];
        }
      }, HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), "ideas"), "\n          " ];
    }, function() {
      return [ "\n            ", HTML.SPAN({
        "class": "badge"
      }, Blaze.View(function() {
        return Spacebars.mustache(view.lookup("getIdeas"));
      })), " ", HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), "ideas\n          " ];
    }), "\n        "), "\n        ", HTML.DIV({
      "class": "card-priority card-other-data col-xs-1 col-xs-offset-1"
    }, "\n          ", HTML.SPAN({
      title: "Priority",
      "class": "glyphicon glyphicon-warning-sign"
    }, " "), "\n          ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getPriority"));
    }), "       \n        "), "\n        ", HTML.DIV({
      "class": "card-ideators card-other-data col-xs-1 col-xs-offset-1"
    }, "\n          ", HTML.SPAN({
      title: "Ideators",
      "class": "glyphicon glyphicon-user"
    }, " "), "\n          ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("getIdeators"));
    }), "     \n        "), "\n        ", HTML.Comment(' <div class="card-questions col-xs-3 btn">\n          <span title="Questions" class="glyphicon glyphicon-question-sign"> </span>\n          {{getQuestions}}      \n        </div> '), "\n        ", HTML.Comment(' <div class="card-edit col-xs-3 btn col-xs-offset-3">\n          <span title="Edit" class="glyphicon glyphicon-edit card-edit"> </span>    \n        </div> '), "\n      "), " ", HTML.Comment("close task-data row"), "\n      ", HTML.DIV({
      "class": "task-ideas row"
    }, "\n        ", HTML.DIV({
      id: function() {
        return [ "task-", Spacebars.mustache(view.lookup("getID")), "-ideas-group" ];
      }
    }, "\n          ", HTML.DIV({
      id: function() {
        return [ "task-", Spacebars.mustache(view.lookup("getID")), "-ideas" ];
      },
      "class": "collapse"
    }, "\n              ", HTML.UL({
      id: "task-idealist",
      "class": "ideadeck ui-sortable"
    }, "\n                ", HTML.LI({
      "class": "sort-disabled"
    }), "\n                    ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("ideaContents"));
    }, function() {
      return [ "\n                      ", Spacebars.include(view.lookupTemplate("HcompFilterBoxIdeaItem")), "\n                    " ];
    }), "\n              "), "\n          "), "\n        "), "\n      "), "\n		"), "\n	" ];
  }, function() {
    return [ " \n		", HTML.DIV({
      "class": "edit-task",
      id: function() {
        return Spacebars.mustache(view.lookup("getID"));
      }
    }, "\n      ", HTML.SPAN({
      "class": "card-description"
    }, "Editing this inspiration"), "\n      ", HTML.HR(), "\n			", HTML.FORM({
      role: "form",
      "class": "form"
    }, "\n				", HTML.DIV({
      "class": "row"
    }, "\n			  		", HTML.DIV({
      "class": "col-xs-12"
    }, "\n						", HTML.LABEL({
      "class": "sr-only"
    }, "Task Instructions"), "\n						", HTML.TEXTAREA({
      "class": "form-control task-description",
      rows: "2",
      id: "",
      placeholder: "Describe your inspiration...",
      value: function() {
        return Spacebars.mustache(view.lookup("getDescription"));
      }
    }), "\n					"), "\n				"), "\n				", HTML.DIV({
      "class": "row task-main-options"
    }, "\n					", HTML.DIV({
      "class": "col-xs-7"
    }, "\n            ", HTML.FORM({
      id: "task-priority",
      role: "form"
    }, "\n              ", HTML.LABEL({
      "class": ""
    }, "Priority "), "\n              ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("getPriority"), "Lo");
    }, function() {
      return [ "\n                ", HTML.LABEL({
        "class": "radio-inline"
      }, "\n                  ", HTML.INPUT({
        type: "radio",
        name: "taskPriorityOptions",
        value: "1",
        checked: ""
      }), " Lo\n                "), "\n                ", HTML.LABEL({
        "class": "radio-inline"
      }, "\n                  ", HTML.INPUT({
        type: "radio",
        name: "taskPriorityOptions",
        value: "2"
      }), " Mid\n                "), "\n                ", HTML.LABEL({
        "class": "radio-inline"
      }, "\n                  ", HTML.INPUT({
        type: "radio",
        name: "taskPriorityOptions",
        value: "3"
      }), " Hi\n                "), "\n              " ];
    }, function() {
      return [ "\n                ", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("getPriority"), "Mid");
      }, function() {
        return [ "\n                  ", HTML.LABEL({
          "class": "radio-inline"
        }, "\n                    ", HTML.INPUT({
          type: "radio",
          name: "taskPriorityOptions",
          value: "1"
        }), " Lo\n                  "), "\n                  ", HTML.LABEL({
          "class": "radio-inline"
        }, "\n                    ", HTML.INPUT({
          type: "radio",
          name: "taskPriorityOptions",
          value: "2",
          checked: ""
        }), " Mid\n                  "), "\n                  ", HTML.LABEL({
          "class": "radio-inline"
        }, "\n                    ", HTML.INPUT({
          type: "radio",
          name: "taskPriorityOptions",
          value: "3"
        }), " Hi\n                  "), "\n                " ];
      }, function() {
        return [ "\n                  ", Blaze.If(function() {
          return Spacebars.dataMustache(view.lookup("getPriority"), "Hi");
        }, function() {
          return [ "\n                    ", HTML.LABEL({
            "class": "radio-inline"
          }, "\n                      ", HTML.INPUT({
            type: "radio",
            name: "taskPriorityOptions",
            value: "1"
          }), " Lo\n                    "), "\n                    ", HTML.LABEL({
            "class": "radio-inline"
          }, "\n                      ", HTML.INPUT({
            type: "radio",
            name: "taskPriorityOptions",
            value: "2"
          }), " Mid\n                    "), "\n                    ", HTML.LABEL({
            "class": "radio-inline"
          }, "\n                      ", HTML.INPUT({
            type: "radio",
            name: "taskPriorityOptions",
            value: "3",
            checked: ""
          }), " Hi\n                    "), "\n                  " ];
        }), "\n                " ];
      }), "\n              " ];
    }), "\n            "), "\n					"), "\n          ", HTML.DIV({
      "class": "form-group task-options col-xs-5 pull-right"
    }, "\n            ", HTML.BUTTON({
      type: "button",
      "class": "btn btn-default task-update-cancel"
    }, "\n              Cancel\n            "), "\n            ", HTML.BUTTON({
      type: "button",
      "class": "btn btn-primary task-update"
    }, "\n              Save\n            "), "\n          "), "\n				"), "\n				", HTML.Comment(' <div class="row">\n					\n				</div> '), "\n		  	"), "\n		"), "\n	" ];
  });
}));

})();
