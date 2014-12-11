(function(){
Template.__define__("ExpAdminPage", (function() {
  var view = this;
  return [ HTML.Raw('<div class="row">\n    <center>  \n      <button id="new-exp" class="new-bs btn btn-xlarge2 \n        btn-default btn-primary" data-toggle="modal" data-target="#newExpModal">\n        New Experiment \n      </button> \n    </center>\n  </div> <!-- End Row -->\n\n  <!-- Modal -->\n    '), HTML.DIV({
    "class": "modal fade",
    id: "newExpModal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "myModalLabel",
    "aria-hidden": "true"
  }, "\n      ", HTML.DIV({
    "class": "modal-dialog"
  }, "\n        ", HTML.DIV({
    "class": "modal-content"
  }, " \n          ", HTML.Raw('<div class="modal-header">\n            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n            <h4 class="modal-title" id="newExpLabel">Create New Brainstorming Experiment</h4>\n          </div>'), HTML.Raw("<!-- End modal-header -->"), "\n          ", HTML.DIV({
    "class": "modal-body"
  }, "\n            ", HTML.DIV({
    "class": "modal-form-elm"
  }, "\n              ", HTML.Raw("<h5>Brainstorming prompt:</h5>"), "\n              ", HTML.TEXTAREA({
    type: "text",
    id: "exp-prompt-text",
    "class": "modal-box",
    placeholder: "New Question"
  }), "\n            "), "\n            ", HTML.DIV({
    "class": "modal-form-elm"
  }, "\n              ", HTML.Raw("<h5>Description of experiment:</h5>"), "\n              ", HTML.TEXTAREA({
    id: "exp-desc-text",
    "class": "modal-form-textbox",
    rows: "2",
    cols: "80",
    placeholder: "Your description of experiment objectives"
  }), "\n            "), "\n            ", HTML.Raw('<div class="modal-form-elm">\n              <h5>Number of Groups:</h5>\n              <input id="exp-num-groups" type="number" min="1" step="1" value="1">\n            </div>'), "\n            ", HTML.DIV({
    "class": "modal-form-elm"
  }, "\n              ", HTML.Raw("<h5>Group Template:</h5>"), "\n              Role: ", HTML.SELECT({
    id: "exp-role1",
    "class": "exp-role"
  }, " \n                ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("roles"));
  }, function() {
    return [ "\n                  ", Spacebars.include(view.lookupTemplate("EPRoleSelect")), "\n                " ];
  }), "\n                "), "\n              Number in this Role(-1=unlimited): \n              ", HTML.Raw('<input id="exp-num-role1" class="exp-num-role" type="number" min="-1" step="1" value="-1">'), "\n            "), "\n          "), HTML.Raw("<!-- End Modal-body -->"), "\n          ", HTML.Raw('<div class="modal-footer">\n            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n            <button id="createExperiment" type="button" class="createExperiment btn btn-primary" data-toggle="modal" data-target="#newExpModal">Save</button>\n          </div>'), " ", HTML.Raw("<!-- End modal footer -->"), "\n        "), " ", HTML.Raw("<!-- End modal content -->"), "\n      "), " ", HTML.Raw("<!-- End modal dialog -->"), "\n    "), HTML.Raw(" <!-- End modal -->\n  \n    "), HTML.DIV({
    "class": "row"
  }, " \n      ", HTML.DIV({
    name: "experiment-list"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("experiments"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("EPExperiment")), "\n        " ];
  }), "\n      "), "\n    ") ];
}));

Template.__define__("EPRoleSelect", (function() {
  var view = this;
  return HTML.OPTION({
    value: function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "\n  ");
}));

Template.__define__("EPExperiment", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return [ "exp-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": "menu-box clickable panel panel-info"
  }, "\n    ", HTML.DIV({
    "class": "panel-heading"
  }, "\n      ", HTML.Raw("<strong>Prompt: </strong>"), " ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>Description: </strong>"), Blaze.View(function() {
    return Spacebars.mustache(view.lookup("description"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>Number of Groups: </strong>"), Blaze.View(function() {
    return Spacebars.mustache(view.lookup("groupNum"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>Group Member Roles: </strong>"), "\n      ", Spacebars.include(view.lookupTemplate("EPGroupMakeup")), "\n    "), "\n    ", HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.Raw("<strong>URL: </strong>"), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("formUrl"));
    }
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("formUrl"));
  })), "\n    "), "\n  ");
}));

Template.__define__("EPGroupMakeup", (function() {
  var view = this;
  return HTML.DIV({
    "class": "label label-primary"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("groupTemplate"), "roles"));
  }, function() {
    return [ "\n    ", HTML.SPAN({
      "class": "role-label"
    }, "\n      ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "title"));
    }), "\n    "), "\n    ", HTML.SPAN({
      "class": "role-num-label"
    }, "\n      (", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("num"));
    }), " people)\n    "), "\n    " ];
  }), "\n  ");
}));

})();
