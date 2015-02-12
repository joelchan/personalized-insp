(function(){
Template.__checkName("CrowdBrainstorm");
Template["CrowdBrainstorm"] = new Template("Template.CrowdBrainstorm", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return [ "prompt-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": "menu-box prompt-panel"
  }, "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-sm-8 prompt-data"
  }, "\n        ", HTML.DIV({
    "class": "center-block"
  }, "\n          ", HTML.Raw("<strong>Title:  </strong>"), "\n          ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), HTML.Raw("<br>"), "\n          ", HTML.Raw("<strong>Prompt: </strong>"), " ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("question"));
  }), HTML.Raw("<br>"), "\n          ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasTime"));
  }, function() {
    return [ "\n            ", HTML.STRONG("Session Length: ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("length"));
    }), " minutes"), HTML.BR(), "\n          " ];
  }), "\n          ", HTML.Raw("<strong>Number of Workers: </strong>"), " ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numWorkers"));
  }), HTML.Raw("<br>"), "\n          ", HTML.Raw("<!--<strong>URL: </strong> {{urlFor route='HcompDashboard' data=_id}} <h3>id: {{_id}}</h3> -->"), "\n          ", Spacebars.With(function() {
    return Spacebars.call(view.lookup("promptID"));
  }, function() {
    return [ "\n            ", HTML.STRONG("Crowd Ideator URL: "), " \n              ", HTML.A({
      href: function() {
        return [ Spacebars.mustache(view.lookup("formUrl")), Spacebars.mustache(view.lookup("pathFor"), "MturkLoginPage") ];
      }
    }, "\n                ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("formUrl"));
    }), Blaze.View(function() {
      return Spacebars.mustache(view.lookup("pathFor"), "MturkLoginPage");
    }), "\n              "), "\n          " ];
  }), "\n        "), "\n      "), "\n      ", HTML.Raw('<div class="col-sm-2 dash-button clickable">\n        <h3 class="center-vertical">View Brainstorm Progress</h3>\n      </div>'), "\n      ", HTML.Raw('<div class="col-sm-2 review-button clickable">\n          <h3 class="center-vertical">Review Ideas</h3>\n      </div>'), "\n    "), "\n  ");
}));

Template.__checkName("CrowdPromptPage");
Template["CrowdPromptPage"] = new Template("Template.CrowdPromptPage", (function() {
  var view = this;
  return [ HTML.Raw('<div class="row ">\n    <center>  \n      <button id="new-bs" class="new-bs btn btn-xlarge2 btn-default btn-primary" data-toggle="modal" data-target="#newPromptModal">\n        New Brainstorm\n      </button> \n    </center>\n  </div> <!-- End Row -->\n\n  <!-- Modal -->\n  <div class="modal fade" id="newPromptModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n    <div class="modal-dialog">\n      <div class="modal-content"> \n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n          <h4 class="modal-title" id="newPromptLabel">Create New Brainstorming Prompt</h4>\n        </div>\n        <div class="modal-body">\n          <h5>Brainstorming prompt:</h5>\n          <input type="text" id="prompt-text" class="modal-box" placeholder="New Question">\n          <h5>Brainstorming title:</h5>\n          <input type="text" id="prompt-title" class="modal-box" placeholder="Shortened Brainstorm title">\n          <h4>Brainstorm Length(minutes):</h4>\n          <input type="number" id="prompt-length" class="modal-number-input" placeholder="minutes">\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n          <button id="createPrompt" type="button" class="createPrompt btn btn-primary" data-toggle="modal" data-dismiss="modal">Save</button>\n        </div> <!-- End modal footer -->\n      </div> <!-- End modal content -->\n    </div> <!-- End modal dialog -->\n  </div> <!-- End modal -->\n \n  '), HTML.DIV({
    "class": "row hcomp-prompt-list"
  }, " \n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("prompts"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("CrowdBrainstorm")), "\n    " ];
  }), "\n  ") ];
}));

})();
