// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Prompts');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Prompts', 'trace');
//Logger.setLevel('Client:Hcomp:Prompts', 'debug');
//Logger.setLevel('Client:Hcomp:Prompts', 'info');
//Logger.setLevel('Client:Hcomp:Prompts', 'warn');

/********************************************************************
 * Return the list of all prompts
 * *****************************************************************/
Template.CrowdPromptPage.helpers({
  prompts: function() {
    return Prompts.find();
  },
});

  Template.CrowdPromptPage.rendered = function() {
  window.scrollTo(0,0);
}

Template.CrowdBrainstorm.rendered = function() {
  var buttons = $(this.firstNode).find(".center-vertical")
  buttons.each(function(index, elm) {
    var ah = $(elm).height();
    var ph = $(elm).parent().height();
    var mh = Math.ceil((ph-ah) / 2);
    $(elm).css('margin-top', mh);
  });
};

Template.CrowdBrainstorm.helpers({
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
  },
  numWorkers: function() {
    logger.debug("current prompt: " + JSON.stringify(this));
    var groups = Groups.find({_id: {$in: this.groupIDs}});
    var users = [];
    groups.forEach(function(group) {
      users = users.concat(group.users);
    });
    return users.length;
  },
  formUrl: function() {
    //Get absolute base url and trim trailing slash
    return Meteor.absoluteUrl().slice(0,-1);
  },
  promptID: function() {
    return {promptID: this._id};
  },
});

Template.CrowdBrainstorm.events({
  'click .dash-button': function() {
    console.log("go to dash");
    Router.go("HcompDashboard", {promptID: this._id});
  },
  'click .review-button': function() {
    console.log("go to reviewpage");
    Router.go("HcompResultsPage", {promptID: this._id});
  },
});



/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.CrowdPromptPage.events({
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
      var group = GroupManager.create(newPrompt.template);
      PromptManager.addGroups(prompt, group);
    },

    'click .dash-button': function () {
      // Set the current prompt
      var prompt = Prompts.findOne({'_id': this._id});
      Session.set("currentPrompt", prompt);
      var group = Groups.findOne({'_id': this.groupIDs[0]});
      Session.set("currentGroup", group);
      if (prompt) {
        logger.trace("found current prompt with id: " + prompt._id);
        Session.set("currentPrompt", prompt);
        logger.debug("Prompt selected");
        Router.go('HcompDashboard', {promptID: prompt._id});
      } else {
        logger.error("couldn't find current prompt with id: " + 
            prompt._id);
      }
    },

    'click .review-button': function () {
      // Set the current prompt
      var prompt = Prompts.findOne({'_id': this._id});
      Session.set("currentPrompt", prompt);
      var group = Groups.findOne({'_id': this.groupIDs[0]});
      Session.set("currentGroup", group);
      if (prompt) {
        logger.trace("found current prompt with id: " + prompt._id);
        Session.set("currentPrompt", prompt);
        logger.debug("Prompt selected");
        Router.go('HcompResultsPage', {promptID: prompt._id});
      } else {
        logger.error("couldn't find current prompt with id: " + 
            prompt._id);
      }
    },

});
