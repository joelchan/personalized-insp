(function(){// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Ideate');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Ideate', 'trace');
//Logger.setLevel('Client:Hcomp:Ideate', 'debug');
//Logger.setLevel('Client:Hcomp:Ideate', 'info');
//Logger.setLevel('Client:Hcomp:Ideate', 'warn');

Template.MturkIdeationPage.rendered = function(){
  //Set height of elements to viewport height
  var height = $(window).height() - 50; //Navbar height=50
  logger.debug("window viewport height = " + height.toString());
  $(".main-prompt").height(height);
  $(".task-list-pane").height(height-50);
  //Setup Facilitation push to synthesis listener
  MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace(newDoc.route);
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var promptID = Session.get("currentPrompt")._id;
        logger.debug("promptID: " + promptID);
        var userID = Session.get("currentUser")._id;
        logger.debug("userID: " + userID);
        Router.go(route, {'promptID': promptID, 'userID': userID}); 
    },
  });
  
};

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

Template.MturkMainPrompt.helpers({
  // prompt: function() {
  //   var prompt = Session.get("currentPrompt");
  //   return prompt.question;
  // },
});

Template.MturkIdeaList.helpers({
  ideas: function() {
    //return Ideas.find({$and: [
      //{userID: Session.get("currentUser")._id},
      //{clusterIDs: []}]});
    var generalIdeas = Ideas.find({userID: Session.get("currentUser")._id});
    return generalIdeas.fetch().reverse();
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
    if (idea) {
      EventLogger.logIdeaSubmission(idea); 
    }
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
    }
  },
  //waits 3 seconds after user stops typing to change isTyping flag to false
  'keyup textarea' : function(e, target){
    logger.debug(e);
    logger.debug(target);
    console.log("key pressed")
    if(e.keyCode===13) {
      console.log("enter pressed")
      var btn = $(target.firstNode).children('.submit-idea')
      btn.click();
    }
  }
});

Template.MturkTaskLists.rendered = function() {
  
};

Template.MturkTaskLists.helpers({
  getMyTasks: function() {
    logger.debug("Getting a list of all tasks assigned to current user");
    var assignments = 
      Assignments.find({userID: Session.get("currentUser")._id}, 
        {sort: {'assignmentTime': -1}}).fetch();
    logger.trace(assignments);
    var taskIDs = getValsFromField(assignments, 'taskID');
    logger.trace(taskIDs);
    var tasks = [];
    for (var i=0; i<taskIDs.length; i++) {
      tasks.push(Tasks.findOne({_id: taskIDs[i]}));
      logger.trace(tasks);
    };
    //var tasks = Tasks.find({_id: {$in: taskIDs}});
    //Sort tasks by assignment time
    return tasks;
  },
  prompt: function() {
    var prompt = Session.get("currentPrompt");
    return prompt.question;
  },
});

Template.MturkTaskLists.events({ 
  'click .get-task': function(e, t) {
    logger.debug("Retrieving a new task"); 
    var task = TaskManager.assignTask(
      Session.get("currentPrompt"),
      Session.get("currentUser")
    );
    if (task) {
      logger.info("Got a new task");
      logger.trace(task);
    } else {
      logger.info("No new task was assigned");
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

Template.TaskIdeaList.helpers({
  ideas: function() {
    logger.debug("getting idea list for task");
    logger.trace(this);
    var cluster = Clusters.findOne({_id: this.ideaNodeID});
    logger.trace(cluster.ideaIDs)
    var ideasAllInClusterFind = Ideas.find({_id: {$in: cluster.ideaIDs}});
    var ideasAllInCluster = ideasAllInClusterFind.fetch();
    curUserID = Session.get("currentUser")._id;
    logger.debug("CURRENT USER IS = " + curUserID);
    var ideas = [];
    for (var i = 0; i < ideasAllInCluster.length; i++) {
      if (ideasAllInCluster[i].userID == curUserID) {
        ideas.push(ideasAllInCluster[i]);
      }
    }
    logger.trace(ideas);
    return ideas.reverse();
  },
});

})();
