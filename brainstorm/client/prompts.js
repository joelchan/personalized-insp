// Configure logger for Tools
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
    var groups = Groups.find({_id: this.groupIDs});
    var users = [];
    groups.forEach(function(group) {
      users.concat(group.users);
    });
    return users;
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
    var groups = Groups.find({_id: this.groupIDs});
    var users = [];
    groups.forEach(function(group) {
      users.concat(group.users);
    });
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
        PromptManager.setTitle(newTitle);
      }
      if (!isNaN(minutes)) {
        PromptManager.setLength(newPrompt, parseInt(minutes));
      }
      //Session.set("currentPrompt", newPrompt);
///////////////////////////////////////////////////////////////////////
      //var exp = new Experiment();
      //exp.description = "Regular brainstorming activity"
      //exp._id = Experiments.insert(exp);
      //var cond1 = new ExpCondition(1,
          //exp._id,
          //newQuestion,
          //"Brainstorming activity",
          //100 
          //);
      //var template = GroupTemplates.findOne({isDefault: true});
      //cond1.groupTemplate = template;
      //cond1._id = Conditions.insert(cond1);
      //exp.conditions = [cond1];
      //Experiments.update({_id: exp._id},
          //{$set: {conditions: exp.conditions}}
           //);
      //ExperimentManager.initGroupRefs(exp);
      //Prompts.update({_id: newPrompt._id},
          //{$set: {expID: exp._id, condID: cond1._id}}
          //);

///////////////////////////////////////////////////////////////////////
      //Router.go('IdeationPage', {'_id': currentPrompt[0]._id});
      //$('.modal').addClass('testclass');
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
