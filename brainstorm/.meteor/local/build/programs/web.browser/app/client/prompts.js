(function(){// Configure logger for Tools
var logger = new Logger('Client:Prompts');
// Comment out to use global logging level
Logger.setLevel('Client:Prompts', 'trace');
//Logger.setLevel('Client:Prompts', 'debug');
//Logger.setLevel('Client:Prompts', 'info');
//Logger.setLevel('Client:Prompts', 'warn');

/********************************************************************
 * Return the list of all prompts
 * *****************************************************************/
Template.PromptPage.prompts = function() {
  return Prompts.find();
};

Template.PromptPage.rendered = function() {
  window.scrollTo(0,0);
}

Template.Brainstorm.helpers({
  question: function() {
    return this.question;
  },
  participants: function() {
    logger.debug("current prompt: " + JSON.stringify(this));
    var groups = Groups.find({_id: {$in: this.groupIDs}});
    var users = [];
    groups.forEach(function(group) {
      users = users.concat(group.users);
    });
    return users.map(function(user) {
      return user.name;
    });
  },
  hasTime: function() {
    if (this.hasOwnProperty("length")) {
      logger.trace("Prompt has session length defined: " + this.length);
      if (this.length > 0) {
        return true;
      } else {
        return false;
      } 
    } else {
      logger.trace("Prompt does not have session length defined");
      return false;
    }
  },
  hasUsers: function() {
    var groups = Groups.find({_id: {$in: this.groupIDs}});
    var users = [];
    groups.forEach(function(group) {
    logger.debug("Looking at groups: " + JSON.stringify(group));
      logger.debug("group has users: " + JSON.stringify(group.users));
      users = users.concat(group.users);
      logger.debug("users list is now: " + JSON.stringify(users));
    });
    logger.debug("list of users:" + JSON.stringify(users));
    if (users.length > 0) {
      logger.trace("Prompt has users");
      return true;
    } else {
      logger.trace("Prompt has no users");
      return false;
    }
  }
});



/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.PromptPage.events({
    'click button.nextPage': function () {
        //Go to next page
    },

    'click button.new-bs': function () {
        //Create Modal for creating a new prompt 
        //$('#newPromptModal').modal('toggle');
        
    },

    'click button.createPrompt': function () {
      //Create a new Experiment with 1 condition and a default group template
      var newQuestion = $("input#prompt-text").val();
      var newTitle = $("input#prompt-title").val();
      var minutes = parseInt($("input#prompt-length").val());
      logger.debug("Session will be: " + minutes + " long");
      var newPrompt = PromptManager.create(newQuestion);
      if (newTitle.trim() !== "") {
        PromptManager.setTitle(newPrompt, newTitle);
      }
      if (!isNaN(minutes)) {
        PromptManager.setLength(newPrompt, parseInt(minutes));
      }
    },

    'click div.clickable': function () {
      // Set the current prompt
      var prompt = Prompts.findOne({'_id': this._id});


      if (prompt) {
        logger.trace("found current prompt with id: " + prompt._id);
        Session.set("currentPrompt", prompt);
        logger.debug("Prompt selected");
        Router.goToNextPage();
      } else {
        logger.error("couldn't find current prompt with id: " + 
            prompt._id);
      }
    },

});

})();