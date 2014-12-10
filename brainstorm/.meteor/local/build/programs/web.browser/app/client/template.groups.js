(function(){
Template.__define__("RoleMembers", (function() {
  var view = this;
  return HTML.LI({
    "class": "list-group-item"
  }, "\n  ", HTML.SPAN({
    "class": "role-label"
  }, HTML.STRONG(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), "s "), "(max users: ", HTML.EM(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("size"), view.lookup("num"));
  }), ")"), ":"), "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("assigned"));
  }, function() {
    return [ "\n      ", HTML.SPAN({
      "class": "label label-default"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("name"));
    })), "\n    " ];
  }), "\n  ");
}));

Template.__define__("GroupPanel", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return [ "group-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": "menu-box clickable panel panel-info"
  }, HTML.Raw('\n    <div class="panel-heading">\n      <span>Join this group</span>\n    </div>\n    '), HTML.DIV({
    "class": "panel-row"
  }, "\n      ", HTML.UL({
    "class": "list-group role-list-group"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.dataMustache(view.lookup("assignedRoles"), view.lookup("."));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("RoleMembers")), "\n        " ];
  }), "\n      "), "\n    "), "\n  ");
}));

Template.__define__("RoleSize", (function() {
  var view = this;
  return HTML.DIV("\n    ", HTML.H4("Number of ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  }), ": (-1 = unlimited):"), "\n    ", HTML.INPUT({
    type: "number",
    id: function() {
      return [ Spacebars.mustache(view.lookup("title")), "-num" ];
    },
    "class": "modal-number-input",
    placeholder: function() {
      return [ "# of ", Spacebars.mustache(view.lookup("Title")), "s" ];
    }
  }), "\n  ");
}));

Template.__define__("GroupPage", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.H1(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("title"));
  })), "\n    ", HTML.H3(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("question"));
  })), "\n  "), HTML.Raw(' <!-- End Row -->\n  <div class="row">\n    <center>  \n      <!--<button id="new-group-btn" class="createGroup new-group-btn btn btn-xlarge2 btn-default btn-primary" data-toggle="modal" data-target="#newGroupModal"> -->\n      <button id="new-group-btn" class="createGroup new-group-btn btn btn-xlarge2 btn-default btn-primary">\n        New Group\n      </button> \n    </center>\n  </div> <!-- End Row -->\n\n  <!-- Modal -->\n    '), HTML.DIV({
    "class": "modal fade",
    id: "newGroupModal",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "myModalLabel",
    "aria-hidden": "true"
  }, "\n      ", HTML.DIV({
    "class": "modal-dialog"
  }, "\n        ", HTML.DIV({
    "class": "modal-content"
  }, " \n          ", HTML.Raw('<div class="modal-header">\n            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n            <h4 class="modal-title" id="newGroupLabel">Create New Brainstorming Group</h4>\n          </div>'), "\n          ", HTML.DIV({
    "class": "modal-body"
  }, "\n            ", HTML.Raw("<h5>Brainstorming group:</h5>"), "\n            ", HTML.Raw('<input type="text" id="group-text" class="modal-box" placeholder="New Question">'), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("groupRole"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("RoleSize")), "\n            " ];
  }), "\n          "), "\n          ", HTML.Raw('<div class="modal-footer">\n            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n            <!--<button id="createGroup" type="button" class="createGroup btn btn-primary" data-toggle="modal" data-dismiss="modal">Save</button> -->\n          </div>'), " ", HTML.Raw("<!-- End modal footer -->"), "\n        "), " ", HTML.Raw("<!-- End modal content -->"), "\n      "), " ", HTML.Raw("<!-- End modal dialog -->"), "\n    "), HTML.Raw(" <!-- End modal -->\n  \n    "), HTML.DIV({
    "class": "row group-list"
  }, " \n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("groups"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("GroupPanel")), "\n        " ];
  }), "\n    ") ];
}));

})();
