// Configure logger for Tools
var logger = new Logger('Client:SelectRole');
// Comment out to use global logging level
Logger.setLevel('Client:SelectRole', 'trace');
//Logger.setLevel('Client:SelectRole', 'debug');
//Logger.setLevel('Client:SelectRole', 'info');
//Logger.setLevel('Client:SelectRole', 'warn');


Template.RoleSelectPage.rendered = function() {
  logger.debug("rendered role select");
  window.scrollTo(0,0);
};

Template.RoleSelectPage.helpers({
  prompt: function() {
    return Session.get("currentPrompt").question;
  },
  roles: function() {
    var prompt = Session.get("currentPrompt");
    logger.debug(prompt);
    return roles = prompt.template.roles;
  }
});


Template.RoleSelectPage.events({
  'click button.select-role-btn': function(event) {
    logger.debug("Pressed button with id: " + $(event.target).attr('id'));
    var id = $(event.target).attr('id');
    var roleTitle = trimFromString(id, 'role-');
    var role = RoleManager.getTemplate(roleTitle);
    logger.debug(role);
    Session.set("currentRole", role);
    Router.goToNextPage();

  }
});




