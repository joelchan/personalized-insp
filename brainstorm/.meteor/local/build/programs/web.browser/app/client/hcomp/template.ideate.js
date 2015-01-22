(function(){
Template.__checkName("MturkIdeationPage");
Template["MturkIdeationPage"] = new Template("Template.MturkIdeationPage", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row hcomp-ideation-pane"
  }, "\n    ", HTML.DIV({
    "class": "col-md-3 main-prompt"
  }, "\n      ", Spacebars.include(view.lookupTemplate("MturkMainPrompt")), "\n    "), "\n    ", HTML.DIV({
    "class": "col-md-9 task-lists"
  }, "\n      ", Spacebars.include(view.lookupTemplate("MturkTaskLists")), "\n    "), "\n  "), "\n  ", Spacebars.include(view.lookupTemplate("HcompNoNewTaskModal")) ];
}));

Template.__checkName("MturkMainPrompt");
Template["MturkMainPrompt"] = new Template("Template.MturkMainPrompt", (function() {
  var view = this;
  return [ HTML.Raw('<div class="ideator-directions">\n    <h3> Directions</h3>\n    <p> 1) Begin entering ideas for the main prompt here.<br>\n        2) If you get stuck, hit the "Inspire Me!" button for a new stream of thought.<br>\n        3) Continue to ideate until the time is up.\n    </p>\n  </div>\n  '), HTML.DIV({
    "class": "general-idea-entry"
  }, "\n    ", Spacebars.include(view.lookupTemplate("MturkIdeaEntryBox")), "\n    ", Spacebars.include(view.lookupTemplate("MturkIdeaList")), "\n  ") ];
}));

Template.__checkName("MturkIdeaEntryBox");
Template["MturkIdeaEntryBox"] = new Template("Template.MturkIdeaEntryBox", (function() {
  var view = this;
  return HTML.DIV({
    "class": "idea-input-box"
  }, "\n    ", HTML.TEXTAREA({
    "class": "idea-input",
    placeholder: "Enter your ideas here"
  }), HTML.Raw('\n    <div class="btn btn-primary btn-large submit-idea">\n      Submit\n    </div>\n  '));
}));

Template.__checkName("MturkIdeaList");
Template["MturkIdeaList"] = new Template("Template.MturkIdeaList", (function() {
  var view = this;
  return HTML.DIV({
    "class": "idea-list-box"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("MturkIdeabox")), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("MturkIdeabox");
Template["MturkIdeabox"] = new Template("Template.MturkIdeabox", (function() {
  var view = this;
  return HTML.DIV({
    "class": "idea-box"
  }, "\n    ", HTML.SPAN(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  })), "\n    ", HTML.SPAN({
    "class": "vote-box"
  }, " \n      ", HTML.Raw('<span class="up-vote vote glyphicon glyphicon-thumbs-up"></span>'), "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("voteNum"));
  }), "\n    "), "\n  ");
}));

Template.__checkName("MturkTaskLists");
Template["MturkTaskLists"] = new Template("Template.MturkTaskLists", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row task-list-header"
  }, "\n    ", HTML.DIV({
    "class": "header"
  }, "\n      ", HTML.Raw('<div class="btn btn-success btn-large get-task col-xs-2">\n        Inspire Me!\n      </div>'), "\n      ", HTML.DIV({
    "class": "col-xs-8"
  }, "\n        ", HTML.H1(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  })), " ", HTML.Raw("<br>"), "\n      "), "\n      ", HTML.Raw('<!--\n      <div class="btn btn-success btn-large begin-synthesis col-xs-2">\n        Begin Synthesis\n      </div>\n      -->'), "\n    "), "\n  "), "\n  ", HTML.DIV({
    "class": "task-list-pane"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("getMyTasks"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("MturkIdeateTask")), "\n    " ];
  }), "\n  ") ];
}));

Template.__checkName("MturkIdeateTask");
Template["MturkIdeateTask"] = new Template("Template.MturkIdeateTask", (function() {
  var view = this;
  return HTML.DIV({
    "class": "ideate-task"
  }, "\n    ", HTML.H3({
    "class": "task-header"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("desc"));
  })), "\n    ", Spacebars.include(view.lookupTemplate("MturkIdeaEntryBox")), "\n    ", Spacebars.include(view.lookupTemplate("TaskIdeaList")), "\n  ");
}));

Template.__checkName("TaskIdeaList");
Template["TaskIdeaList"] = new Template("Template.TaskIdeaList", (function() {
  var view = this;
  return HTML.DIV({
    "class": "idea-list-box"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("MturkIdeabox")), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("HcompNoNewTaskModal");
Template["HcompNoNewTaskModal"] = new Template("Template.HcompNoNewTaskModal", (function() {
  var view = this;
  return HTML.Raw('<!--Change Prompt Modal-->\n  <div class="modal fade" id="hcomp-new-task-modal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">\n    <div class="modal-dialog modal-sm">\n      <div class="modal-content">\n        <h3 class="modal-title" id="myModalLabel">\n          No New Tasks Available\n        </h3>\n        <button type="button" class="btn btn-success popup-continue" data-dismiss="modal">\n          Continue\n        </button>\n      </div> <!-- close modal-content -->\n    </div> <!-- close modal-dialog -->\n  </div> <!-- close changeModal -->');
}));

})();
