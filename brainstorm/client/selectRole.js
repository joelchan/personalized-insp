Template.RoleSelectPage.helpers({
  prompt: function() {
    return Session.get("currentPrompt").question;
  },
  roles: function() {
    var prompt = Session.get("currentPrompt");
    return roles = prompt.template.roles;
  }
});


