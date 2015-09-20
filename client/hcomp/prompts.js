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
});

Template.PromptsTab.helpers({
  prompts: function() {
    return Prompts.find(
        {userIDs: Session.get("currentUser")._id}, 
        {sort: {time: -1}}
    );
  },
});

Template.ExperimentsTab.helpers({
  experiments: function() {
    //TODO: make experiments owned by a user
    return Experiments.find({},{sort: {creationTime: -1}}); 
  },
});

Template.DataProcessingTab.helpers({
  dataSets: function() {
    //return all the datasets for which there is a preprocessed forest
    //done
    var graphs = Graphs.find({type: 'data_forest', is_processed: true});
    var results = []
    graphs.forEach(function(graph) {
      var result = graph;
      var prompt = Prompts.findOne({_id: graph.promptID}); 
      result['title'] = prompt.title;
      result['question'] = prompt.question;
      result['userID'] = Session.get('currentUser')._id;
      results.push(result)
    });
    logger.trace(JSON.stringify(results));
    return results;
  },
});

/********************************************************************
 * Prompts tab helpers and events
 * *****************************************************************/
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
  getData: function() {
    logger.debug("Data context: " + JSON.stringify(this._id));
    logger.debug("current user: " + JSON.stringify(Session.get("currentUser")));
    var result = {'promptID': this._id, 'userID': Session.get("currentUser")._id};
    logger.debug("Data object: " + JSON.stringify(result));
    return result;
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
  isNotPrepped: function() {
    var prompt = Prompts.findOne({_id: this._id})
    logger.trace(prompt)
    if (typeof this['forestGraphID'] === 'undefined') {
      return true;
    } else {
      return false;      
    }
  },
});

Template.CrowdBrainstorm.events({
  //'click .dash-button': function() {
    //console.log("go to dash");
    //Router.go("HcompDashboard", 
      //{promptID: this._id,
        //userID: Session.get('currentUser')});
  //},
  //'click .review-button': function() {
    //console.log("go to reviewpage");
    //Router.go("HcompResultsPage", 
      //{promptID: this._id, userID: Session.get("currentUser")});
  //},
  'click .prep-forest': function () {
    logger.debug("Prepping db for dataforest analysis");
    logger.debug(this);
    ForestManager.initForest(this);
    //var prompt = this;
    //var group = Groups.findOne({_id: prompt.groupIDs[0]});
    //var user = Session.get("currentUser");
    //var type = "data_forest";
    //var data = {is_processed: false};
    //graphID = GraphManager.createGraph(prompt, group, user, type, data);
    //Prompts.update({_id: prompt._id}, {$set: {forestGraphID: graphID}});
  },
});


Template.PromptsTab.events({
    'click button.createPrompt': function () {
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
      PromptManager.addGroups(newPrompt, group);
      GroupManager.addUser(group, Session.get("currentUser"),
          RoleManager.defaults['HcompFacilitator'].title);
      //Clear textfield values
      $("input#prompt-text").val("");
      $("input#prompt-title").val("");
      $("input#prompt-length").val(0);
      
    },
    //'click .dash-button': function () {
      //// Set the current prompt
      //var prompt = Prompts.findOne({'_id': this._id});
      //Session.set("currentPrompt", prompt);
      //var group = Groups.findOne({'_id': this.groupIDs[0]});
      //Session.set("currentGroup", group);
      //var user = Session.get("currentUser");
      //if (prompt) {
        //logger.trace("found current prompt with id: " + prompt._id);
        //Session.set("currentPrompt", prompt);
        //logger.debug("Prompt selected");
        //Router.go('HcompDashboard', 
            //{promptID: prompt._id, userID: user._id});
      //} else {
        //logger.error("couldn't find current prompt with id: " + 
            //prompt._id);
      //}
    //},
    //'click .review-button': function () {
      //// Set the current prompt
      //var prompt = Prompts.findOne({'_id': this._id});
      //Session.set("currentPrompt", prompt);
      //var group = Groups.findOne({'_id': this.groupIDs[0]});
      //Session.set("currentGroup", group);
      //var user = Session.get("currentUser");
      //if (prompt) {
        //logger.trace("found current prompt with id: " + prompt._id);
        //Session.set("currentPrompt", prompt);
        //logger.debug("Prompt selected");
        //Router.go('Visualization', {promptID: prompt._id, userID: user._id});
      //} else {
        //logger.error("couldn't find current prompt with id: " + 
            //prompt._id);
      //}
    //},
});

/********************************************************************
 * Experiments tab helpers and events
 * *****************************************************************/
Template.CrowdExperiment.helpers({
  desc: function() {
    return this.description;
  },
  question: function() {
    var prompt = Prompts.findOne({_id: this.promptID});
    return prompt.question;
  },
  timeLimit: function() {
    var prompt = Prompts.findOne({_id: this.promptID});
    if (prompt.length > 0) {
      return prompt.length;
    } else {
      return "Unlimited";
    }
  },
  expURL: function() {
    return this.url;
  },
  conditions: function() {
    return Conditions.find({expID: this._id},
      {sort: {description: 1}});
  },
  partNumber: function() {
    if (this.conditions[0].partNum) {
      return this.conditions[0].partNum;
    } else {
      return 0;
    }
  },
  getData: function() {
    logger.debug("Data context: " + JSON.stringify(this._id));
    logger.debug("current user: " + JSON.stringify(Session.get("currentUser")));
    var result = {'promptID': this.promptID, 
        'userID': Session.get("currentUser")._id,
        'expID': this._id};
    logger.debug("Data object2 " + JSON.stringify(result));
    return result;
  },
  excludeUsers: function() {
    return this.excludeUsers;
  },
  numExcluded: function() {
    if (this.excludeUsers) {
      return this.excludeUsers.length;
    } else {
      return 0;
    }
  },
});
Template.NewExperimentModal.helpers({
  prompts: function() {
    logger.trace("Getting prompts...");
    return Prompts.find();
  },
});

Template.ExperimentPromptItem.helpers({
  question: function() {
    return this.question;
  },
  timeLimit: function() {
    if (this.length > 0) {
      return this.length;
    } else {
      return "No time limit";
    }
  },
});


Template.CrowdExperimentExcludeUser.helpers({
  thisID: function() {
    // buggy at the moment, not sure why
    var userName = this;
    logger.trace("Username to exclude: " + JSON.stringify(userName));
    var user = MyUsers.findOne({"name": userName});
    logger.trace(user);
    // logger.trace("Excluded user: " + JSON.stringify(user));
    return user._id;
  },
});

Template.CrowdExperimentCondition.helpers({
  desc: function() {
    return this.description;
  },
  numAssigned: function() {
    return this.assignedParts.length;
  },
  numBegan: function() {
    var numBegan = 0;
    this.assignedParts.forEach(function(p) {
      var thisP = Participants.findOne({_id: p});
      if (thisP.hasStarted) {
        numBegan += 1;
      }
    });
    return numBegan;
  },
  numCompleted: function() {
    return this.completedParts.length;
  },
  readyProgress: function() {
    var numReady = this.readyParts.length;
    var numAssigned = this.assignedParts.length;
    var progress;
    if (numAssigned == 0) {
      logger.trace("No assigned participants for " + this.description + " condition");
      progress = 0;
    } else {
      logger.trace("Found " + numAssigned + " assigned participants for " + this.description + " condition");
      progress = numReady/numAssigned*100  
    }
    logger.trace("Progress = " + progress);
    return Math.round(progress);
  },
  assignedParticipants: function() {
    return Participants.find({conditionID: this._id},
      {sort: {exitedEarly: 1, fluencyStarted: -1, fluencyFinished: -1, isReady: -1}});
  },
});

Template.CondParticipant.helpers({
  partUserName: function() {
    var partID = this;
    logger.trace("Participant: " + JSON.stringify(this));
    // logger.debug("Calling partUserName for participant " + partID);
    // var part = Participants.find({"_id": partID}).fetch()[0];
    // logger.trace("Participants: " + JSON.stringify(Participants.find({}).fetch()));
    // logger.trace("Participant for condition: " + JSON.stringify(part));
    // return part.userName;
    return this.userName;
  },
  status: function() {
    if (this.exitedEarly) {
      return "danger";
    } else if (this.isReady) {
      return "success";
    } else if (this.fluencyFinished) {
      return "warning";
    } else {
      return "";
    }
  },
  tutorialStart: function() {
    if (this.tutorialStarted) {
      var msg = "User started a tutorial";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  fluencyStart: function() {
    if (this.fluencyStarted) {
      var msg = "User started fluency measure task";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  fluencyEnd: function() {
    // return this.fluencyFinished;
    if (this.fluencyFinished) {
      var msg = "User finished fluency measure task";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  tutorialEnd: function() {
    // return this.isReady;
    if (this.isReady) {
      var msg = "User finished a tutorial";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  ideationStart: function() {
    // return this.hasStarted;
    if (this.hasStarted) {
      var msg = "User began ideation";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  surveyStart: function() {
    // return this.surveyStarted;
    if (this.surveyStarted) {
      var msg = "User began survey";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  finishedStudy: function() {
    // return this.hasFinished;
    if (this.hasFinished) {
      var msg = "User submitted survey";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
  exitEarly: function() {
    // return this.exitedEarly;
    if (this.exitedEarly) {
      var msg = "User exited study early";
      return parseTime(this.userID, msg);
    } else {
      return "";
    }
  },
});


Template.ExperimentsTab.events({
    'click button.createExp': function () {
      logger.trace("clicked create exp button");
      
      // get the prompt selection
      var promptID = $('input[name=promptRadios]:checked').val();
      logger.trace("Selected prompt id: " + promptID);
      // promptID = promptID.split("-")[1];
      var prompt = Prompts.findOne({'_id': promptID});

      // get other data
      var expTitle = $('input#exp-title').val();
      var numParts = parseInt($("input#num-parts").val());

      if (prompt) {
        logger.trace("found current prompt with id: " + prompt._id);  
      }

      var IV1 = {name: $('input#iv-first-name').val(), 
                 levels: $('input#iv-first-levels').val().split(",")};
      var IV2 = {name: $('input#iv-second-name').val(), 
                 levels: $('input#iv-second-levels').val().split(",")};

      if (IV2.name != "") {
        expID = ExperimentManager.createExp(prompt._id, expTitle, numParts, IV1, IV2);
      } else {
        expID = ExperimentManager.createExp(prompt._id, expTitle, numParts, IV1);  
      }

      logger.trace("Experiment title: " + expTitle);
      logger.trace("Number of participants: " + numParts);
      //Clear textfield values
      $('input[name=promptRadios]').val([]);
      $('input#exp-title').val("");
      $("input#num-parts").val("");

    },

    'click .init-synth': function () {
        logger.debug("clicked init-synth");
        ExperimentManager.initSynthExp(this._id);
    },
});

Template.CrowdExperiment.events({
});
/********************************************************************
 * Data Processing tab helpers and events
 * *****************************************************************/

var parseTime = function(userID, msg) {
  var time = new Date(Events.findOne({userID: userID, description: msg}).time);
  return time.toTimeString().substring(0,9);
} 