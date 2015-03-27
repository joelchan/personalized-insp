// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Ideate');
// Comment out to use global logging level
// Logger.setLevel('Client:Hcomp:Ideate', 'trace');
// Logger.setLevel('Client:Hcomp:Ideate', 'debug');
Logger.setLevel('Client:Hcomp:Ideate', 'info');
// Logger.setLevel('Client:Hcomp:Ideate', 'warn');

var timer = new Tock({
    callback: function () {
        $('#clockface').text(timer.msToTime(timer.lap()));
    }
});

var countdown = Tock({
    countdown: true,
    interval: 1000,
    callback: function () {
        // logger.debug(countdown.lap() / 1000);
        $('#countdown_clock').text(timer.msToTimecode(countdown.lap()));
    },
    complete: function () {
        // console.log('end');
        alert("Time's up!");
        
        logger.info("Exitting current page");
        
        Router.go("SurveyPage", {
              'partID': Session.get("currentParticipant")._id
            });
    }
});

Template.MturkIdeationPage.rendered = function(){
  EventLogger.logEnterIdeation(); 
  //Hide logout
  $(".btn-login").toggleClass("hidden");
  //Set height of elements to viewport height
  var height = $(window).height() - 50; //Navbar height=50
  logger.debug("window viewport height = " + height.toString());
  $(".main-prompt").height(height);
  $(".task-list-pane").height(height-85);
  logger.debug("checking to show begin ideation modal");
  if (!Session.get("currentParticipant").hasStarted) {
    logger.debug("showing begin ideation modal");
    // $("#exp-begin-modal").modal('show');  
    alert("The brainstorm has begun!");
    EventLogger.logBeginIdeation();
    // Participants.update({_id: Session.get("currentParticipant")._id}, 
    //   {$set: {hasStarted: true}});
  }
  //Setup Facilitation push to synthesis listener
  //MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    //changed: function(newDoc, oldDoc) {
        //logger.info("change to current user detected");
        //logger.trace(newDoc.route);
        //var route = newDoc.route;
        //logger.debug("Going to page with route: " + route);
        //var promptID = Session.get("currentPrompt")._id;
        //logger.debug("promptID: " + promptID);
        //var userID = Session.get("currentUser")._id;
        //logger.debug("userID: " + userID);
        //Router.go(route, {'promptID': promptID, 'userID': userID}); 
    //},
  //});
  initializeTimer();
};

Template.MturkIdeationPageControl.rendered = function(){
  EventLogger.logEnterIdeation(); 
  logger.debug("checking to show begin ideation modal");
  if (!Session.get("currentParticipant").hasStarted) {
    logger.debug("showing begin ideation modal");
    // $("#exp-begin-modal").modal('show');  
    alert("The brainstorm has begun!");
    EventLogger.logBeginIdeation();
    // Participants.update({_id: Session.get("currentParticipant")._id}, 
    //   {$set: {hasStarted: true}});
  }
  initializeTimer();
};

Template.MturkIdeationPageControl.helpers({
  prompt: function() {
    return Session.get("currentPrompt").question;
  },
});

Template.MturkMainPrompt.rendered = function(){
  //Setup filters for users and filter update listener
  //updateFilters();
  //Update filters when current group changes
  var group = Groups.findOne(
      {_id: Session.get("currentPrompt").groupIDs[0]}
  );
  Groups.find({_id: group._id}).observe({
    changed: function(newDoc, oldDoc) {
      //Setup filters for users and filter update listener
      //updateFilters();
      logger.debug("current group has been changed");
      logger.trace(Session.get("currentGroup"));
    } 
  });

};

Template.MturkMainPrompt.events({ 
  "click .show-hide": function(e, elm) {
    var isHidden = $('.show-hide').hasClass("collapsed"); 
    EventLogger.logShowHideClick(isHidden);
  },
});

Template.MturkMainPromptControl.events({ 
  "click .show-hide": function(e, elm) {
    var isHidden = $('.show-hide').hasClass("collapsed"); 
    logger.debug("Logging show-hide click with isHidden: " + isHidden);
    EventLogger.logShowHideClick(isHidden);
  },
});


Template.MturkIdeaList.helpers({
  ideas: function() {
    //return Ideas.find({$and: [
      //{userID: Session.get("currentUser")._id},
      //{clusterIDs: []}]});
    var generalIdeas = Ideas.find(
      {userID: Session.get("currentUser")._id,
      'prompt._id': Session.get("currentPrompt")._id},
      {sort: {time: -1}});
    return generalIdeas;
  },
  ideaCount: function() { 
    logger.debug("Counting Ideas"); 
    var generalIdeas = Ideas.find(
      {userID: Session.get("currentUser")._id,
      'prompt._id': Session.get("currentPrompt")._id});
    return generalIdeas.count();
  }, 
});

Template.MturkIdeabox.helpers({
  hasNotVoted: function() {
    if (isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("User has already voted");
      return false;
    } else {
      logger.debug("User has not voted");
      return true;
    }
  },
  voteNum: function() {
    return this.votes.length;
  },
});

Template.MturkIdeabox.events({
  'click .up-vote': function(e, elm) {
    if (!isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("voting for idea");
      IdeaFactory.upVote(this, Session.get("currentUser"));
    } else {
      logger.debug("undo voting for idea");
      IdeaFactory.downVote(this, Session.get("currentUser"));
    }
  },

});

Template.MturkIdeaEntryBox.rendered = function(){
    // console.log("**********trace for idea entry box render*********");
    // console.log($(context));
    var parentContainer = $(this.firstNode).parent();
    var ideaEntryField = $(this.firstNode).children('textArea');
    // console.log(ideaEntryField);
    if (parentContainer.hasClass('general-idea-entry')) {
      // console.log("Parent is general idea entry");
      ideaEntryField.attr("placeholder", "Enter ideas for the main prompt here")
    } else {
      ideaEntryField.attr("placeholder", "Enter ideas related to this inspiration here")
    };
    // console.log($(this.firstNode).parent());
};

Template.MturkIdeaEntryBox.events({
  'click .submit-idea': function (e, target) {
    //console.log("event submitted");
    logger.trace("submitting a new idea");
    logger.debug(e.currentTarget);
    logger.debug(target.firstNode);
    //get the input template
    var inputBox = $(target.firstNode).children('.idea-input')
    var content = inputBox.val();
    //Add idea to database
    var idea = IdeaFactory.create(content, 
        Session.get("currentUser"),
        Session.get("currentPrompt")
    );
    //if (idea) {
      //EventLogger.logIdeaSubmission(idea); 
    //}
    // Clear the text field
    inputBox.val('');
    //Adding Idea to list of task ideas if this is a task
    logger.debug("parent of idea entry box");
    logger.trace(target.firstNode);
    var parent = $(target.firstNode).parent();
    if (parent.hasClass('ideate-task')) {
      logger.debug("Adding a new idea to a task");
      logger.trace(this);
      TaskManager.addIdeaToTask(idea, this);
      EventLogger.logIdeaSubmission(idea, this, true); 
    } else {
      EventLogger.logIdeaSubmission(idea, null, true); 
    }
  },
  //waits 3 seconds after user stops typing to change isTyping flag to false
  'keyup textarea' : function(e, target){
    logger.trace(e);
    logger.trace(target);
    //console.log("key pressed")
    if(e.keyCode===13) {
      logger.debug("enter pressed")
      var btn = $(target.firstNode).children('.submit-idea')
      btn.click();
    }
  }
});


Template.MturkTaskLists.helpers({
  getMyTasks: function() {
    logger.debug("Getting a list of all tasks assigned to current user");
    var assignments = 
      Assignments.find({userID: Session.get("currentUser")._id,
        promptID: Session.get("currentPrompt")._id},
        {sort: {'assignmentTime': -1}}).fetch();
    logger.trace(assignments);
    var taskIDs = getValsFromField(assignments, 'taskID');
    logger.trace(taskIDs);
    var tasks = [];
    for (var i=0; i<taskIDs.length; i++) {
      tasks.push(Tasks.findOne({_id: taskIDs[i]}));
      // logger.trace(tasks);
    };
    logger.trace("User's tasks: " + JSON.stringify(tasks));
    //var tasks = Tasks.find({_id: {$in: taskIDs}});
    //Sort tasks by assignment time
    return tasks;
    // Session.set("CurrentTasks",tasks);
  },
  prompt: function() {
    var prompt = Session.get("currentPrompt");
    return prompt.question;
  },
  tasksAvailable: function(){
      var prompt = Session.get("currentPrompt");
      var user = Session.get("currentUser");
      var groupID = Session.get("currentExp").groupID;
      var result = TaskManager.areTasksAvailable(prompt, user, groupID);
      logger.trace("*********RESULT = " + result);
      if (result == false) {
          logger.trace("JS TASK NOT AVAILABLE");
          return false;
      }
      else {
          logger.trace("JS TASK AVAILABLE");
          return true;
      }
  },
});

Template.MturkTaskLists.events({ 
  'click .get-task': function(e, t) {
    logger.debug("Retrieving a new task"); 
    EventLogger.logRequestInspiration(Session.get("currentPrompt"));
    var task = TaskManager.assignTask(
      Session.get("currentPrompt"),
      Session.get("currentUser"),
      Session.get("currentExp").groupID
    );
   if (task) {
      logger.info("Got a new task");
      EventLogger.logInspirationRequestSuccess(
        Session.get("currentPrompt"),
        task
      );
      logger.trace("New task is: " + JSON.stringify(task));
    } else {
      logger.info("No new task was assigned");
      EventLogger.logInspirationRequestFail(
        Session.get("currentPrompt")
      );
      //alert("Sorry, there are no new tasks. Just keep on trying");
      $("#hcomp-new-task-modal").modal('show');
    }
  },
  'click .begin-synthesis': function(e, t) {
    logger.debug("beginning new task"); 
    logger.trace("PromptID: " + Session.get("currentPrompt")._id);
    logger.trace("UserID: " + Session.get("currentUser")._id);
    Router.go("MturkSynthesis", 
      {promptID: Session.get("currentPrompt")._id,
      userID: Session.get("currentUser")._id
    });
  },
});

var getTaskIdeas = function (task) {
  logger.debug("Getting Idea list");
  logger.debug("Cluster ID: "  + task.ideaNodeID);
    var cluster = Clusters.findOne({_id: task.ideaNodeID});
    logger.trace(cluster.ideaIDs)
    logger.trace("Current UserID: " + Session.get("currentUser")._id);
    logger.trace("Current PromptID: " + Session.get("currentPrompt")._id);
    var ideas = Ideas.find(
      {
        _id: {$in: cluster.ideaIDs},
        userID: Session.get("currentUser")._id,
        'prompt._id': Session.get("currentPrompt")._id
      },
      {sort: {time: -1}}
    );
    logger.trace(ideas);
    return ideas;

}

Template.TaskIdeaList.helpers({
  ideas: function() {
    logger.debug("getting idea list for task");
    logger.trace(this);
    return getTaskIdeas(this);
  },
  ideaCount: function() { 
    logger.debug("Counting Ideas"); 
    logger.trace(this); 
    return getTaskIdeas(this).count();
  }, 
});

Template.ExperimentBeginModal.events({
  'click .popup-continue' : function() {
    EventLogger.logBeginIdeation();
    Participants.update({_id: Session.get("currentParticipant")._id}, 
      {$set: {hasStarted: true}});
  },
});

var initializeTimer = function() {
  var prompt = Session.get("currentPrompt");
  if ($('.timer').length == 0 && prompt.length > 0) {
    logger.info("using a timer");
    // Session.set("hasTimer",true);
    Blaze.render(Template.TockTimer, $('#nav-right')[0]);
    var promptLength = prompt.length*60000;
    countdown.start(promptLength);
  } else if (prompt.length > 0) {
    var promptLength = prompt.length*60000;
    countdown.start(promptLength);
  }
}