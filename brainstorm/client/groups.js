// Configure logger for Tools
var logger = new Logger('Client:Groups');
// Comment out to use global logging level
Logger.setLevel('Client:Groups', 'trace');
//Logger.setLevel('Client:Groups', 'debug');
//Logger.setLevel('Client:Groups', 'info');
//Logger.setLevel('Client:Groups', 'warn');


Template.GroupPage.helpers({
  groups: function() {
    /********************************************************************
    * Return the list of all groups with this prompt
    * *****************************************************************/
    //Get only the groups related to the current prompt
    var prompt = Prompts.findOne({_id: Session.get("currentPrompt")._id});
    return Groups.find({promptIDs: prompt._id});
  }, 
});

Template.GroupPage.rendered = function() {
  window.scrollTo(0,0);
}

/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.GroupPage.events({
    'click button.nextPage': function () {
        //Go to next page
    },

    'click button.createGroup': function () {
      //For now just create a group using the default template
      var prompt = Session.get("currentPrompt");
      var group = GroupManager.create(prompt.template);
      Session.set("currentPrompt", 
        PromptManager.addGroups(prompt, [group]));
    },

    'click div.clickable': function () {
      // Set the current group
      var group = Groups.findOne({'_id': this._id});
      logger.debug("group selected: " + JSON.stringify(this));


      if (group) {
        logger.trace("found current group with id: " + group._id);
        Session.set("currentGroup", group);
        logger.debug("Group selected");
        //Check if user is in group
        var user = Session.get("currentUser");
        if (GroupManager.hasUser(group, user)) {
          var role = GroupManager.getRole(group, user);
          logger.trace("User is already in group, setting role to: " +
            JSON.stringify(role));
          Session.set("currentRole", role);
              
        }
        Router.goToNextPage();
      } else {
        logger.error("couldn't find current group with id: " + 
            group._id);
      }
    },

});

Template.GroupPanel.helpers({
  assignedRoles: function(group) {
    /****************************************************************
     * Parse the assignments into an object wity an array of objects
     * where each object has 3 fields title, size, and assigned
     ***************************************************************/
    logger.debug("testing 'this' in template context \n" + 
        JSON.stringify(group));
    var result = [];
    var roles = group.template.roles;
    roles.forEach(function(role) {
      var obj = {};
      obj.title = role.title;
      obj.num = role.num;
      obj.assigned = group.assignments[role.title];
      result.push(obj);
    });
    logger.debug("got list of assigned roles: " + 
      JSON.stringify(result));
    return result;
  },
});

Template.RoleMembers.helpers({
  size: function(num) {
    logger.trace("determining size of group assignment");
    logger.debug(num);
    return (parseInt(num) < 0) ? "unlimited" : num;
  },
});
