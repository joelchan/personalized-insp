// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Tutorial');
// Comment out to use global logging level
//Logger.setLevel('Client:Hcomp:Tutorial', 'trace');
//Logger.setLevel('Client:Hcomp:Tutorial', 'debug');
Logger.setLevel('Client:Hcomp:Tutorial', 'info');
//Logger.setLevel('Client:Hcomp:Tutorial', 'warn');
var myTaskIDs = [];
    
//CONTROL TUTORIAL
Template.TutorialControl.rendered = function() {
    $(".tutorial-page-control").append(
        "<div class='tutorial-backdrop'></div>"
    );
    // Setup Facilitation push to synthesis listener
    logger.trace("Rendering tutorial control page");
    MyUsers.find({_id: Session.get("currentUser")._id}).observe({
      changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace("oldDoc: " + JSON.stringify(oldDoc));
        logger.trace("newDoc: " + JSON.stringify(newDoc));
        // logger.trace(newDoc.route);
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var partID = Session.get("currentParticipant")._id;
        logger.debug("partID: " + partID);
        Router.go(route, {'partID': partID});
      },
    });    
    EventLogger.logTutorialStarted();
}

//Template.TutorialControl.events({
    //'click button.nextPage': function () {
        //ExperimentManager.logParticipantReady(Session.get("currentParticipant"));
    //},
//});

Template.MturkIdeationPageControl.rendered = function(){
  EventLogger.logBeginIdeation(); 
};
Template.MturkIdeationPageControlTutorial.rendered = function(){
  //Hide logout
  $(".btn-login").toggleClass("hidden");
  //Set height of elements to viewport height
  var height = $(window).height() - 50; //Navbar height=50
  logger.debug("window viewport height = " + height.toString());
  $(".main-prompt").height(height);
  $(".task-list-pane").height(height-85);
  //Setup Facilitation push to synthesis listener
  MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace(newDoc.route);
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var partID = Session.get("currentParticipant")._id;
        logger.debug("partID: " + partID);
        Router.go(route, {'partID': partID});
    },
  });
};


Template.MturkIdeationPageControlTutorial.helpers({
    prompt: function() {
    var prompt = Session.get("currentPrompt");
    return prompt.question;
  },
});

Template.MturkIdeaListTutorial.helpers({
  ideas: function() {
    //return Ideas.find({$and: [
      //{userID: Session.get("currentUser")._id},
      //{clusterIDs: []}]});
    var generalIdeas = DummyIdeas.find(
      {userID: Session.get("currentUser")._id,
      'prompt._id': Session.get("currentPrompt")._id},
      {sort: {time: -1}});
    return generalIdeas;
  },
  ideaCount: function() { 
    logger.debug("Counting Ideas"); 
    var generalIdeas = DummyIdeas.find(
      {userID: Session.get("currentUser")._id,
      'prompt._id': Session.get("currentPrompt")._id});
    return generalIdeas.count();
  }, 
});

Template.MturkIdeaboxTutorial.helpers({
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

Template.MturkIdeaboxTutorial.events({
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

Template.MturkIdeaEntryBoxTutorial.rendered = function(){
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

Template.MturkIdeaEntryBoxTutorial.events({
    
    'click .submit-idea': function (e, target) {    
      if ($("#control-tutorial-ideaEntryTry-gotit").length) {
        document.getElementById("control-tutorial-ideaEntryTry-gotit").disabled = false;
      }
      
      if ($("#treatment-tutorial-ideaEntryTry-gotit").length) {
        document.getElementById("treatment-tutorial-ideaEntryTry-gotit").disabled = false;
      }
        if ($("#treatment-tutorial-inspirationCardTry-gotit").length) {
          document.getElementById("treatment-tutorial-inspirationCardTry-gotit").disabled = false;
        }
      
    //console.log("event submitted");
    logger.trace("submitting a new idea");
    logger.debug(e.currentTarget);
    logger.debug(target.firstNode);
    //get the input template
    var inputBox = $(target.firstNode).children('.idea-input')
    var content = inputBox.val();
    //Create dummy idea for tutorial page
    var idea = IdeaFactory.create(content, 
        Session.get("currentUser"),
        Session.get("currentPrompt"),
        true
    );
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
    logger.debug(e);
    logger.debug(target);
    console.log("key pressed")
    if(e.keyCode===13) {
      logger.debug("enter pressed")
      var btn = $(target.firstNode).children('.submit-idea')
      btn.click();
    }
  }
});

Template.ControlTutorialFlow.events({
    //Welcome
    'click .control-tutorial-welcome-gotit': function() {
        $("#control-tutorial-welcome").removeClass("visible-tutorial-control");
        $("#control-tutorial-timer").addClass("visible-tutorial-control");
        $(".timer").css({border: "10px solid #F5A623","min-width": 150,float: "right",clear: "right", padding: "3px"});
        $(".timer").zIndex(100);
        EventLogger.logTutorialStepComplete(1,8);
    },
    //Timer
    'click .control-tutorial-timer-gotit': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial-control");
        $("#control-tutorial-exit").addClass("visible-tutorial-control");
        $(".timer").css({border: "none"});
        $(".timer").zIndex(0);
        $(".exitStudy").css({border: "10px solid #F5A623"});
        $(".exitStudy").zIndex(51);
        EventLogger.logTutorialStepComplete(2,8);
    },
    'click .control-tutorial-timer-goback': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial-control");
        $("#control-tutorial-welcome").addClass("visible-tutorial-control");
        $(".timer").css({border: "none"});
        $(".timer").zIndex(0);
        EventLogger.logTutorialStepRewind(2,8);
    },
    //Exit Early
    'click .control-tutorial-exit-gotit': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial-control");
        $("#control-tutorial-prompt").addClass("visible-tutorial-control");
        $(".tutorial-backdrop").remove();
        $(".hcomp-ideation-pane-control").append(
            "<div class='tutorial-backdrop'></div>");
        $(".ideation-prompt-control").css({
            border: "10px solid #F5A623",
            background: "#FFF",
            "z-index": "60",
        });
        $(".exitStudy").css({border: "none"});
        $(".exitStudy").zIndex(1);
        EventLogger.logTutorialStepComplete(3,8);
    },
    'click .control-tutorial-exit-goback': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial-control");
        $("#control-tutorial-timer").addClass("visible-tutorial-control");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
        $(".exitStudy").css({border: "none"});
        EventLogger.logTutorialStepRewind(3,8);
    },
    //Prompt
    'click .control-tutorial-prompt-gotit': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial-control");
        $(".ideation-prompt-control").css({
            border: "none",
            "z-index": 20
        });
        $(".idea-input-box").css({
            border: "10px solid #F5A623",
        });
        $(".main-prompt").css({
            "z-index": 60
        });
        EventLogger.logTutorialStepComplete(4,8);
    },
    'click .control-tutorial-prompt-goback': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial-control");
        $("#control-tutorial-exit").addClass("visible-tutorial-control");
        $(".ideation-prompt-control").css({
            border:"none",
            "z-index": 20
        });
        $(".tutorial-backdrop").remove();
        $(".tutorial-page-control").append(
            "<div class='tutorial-backdrop'></div>");
        $(".exitStudy").css({
            border: "10px solid #F5A623"});
        EventLogger.logTutorialStepRewind(4,8);
    },
    //ideaEntry
    'click .control-tutorial-ideaEntry-gotit': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntryTry").removeClass("control-tutorial-background");
        $(".idea-input-box").css({border: "none"});
        EventLogger.logTutorialStepComplete(5,8);
    },
    'click .control-tutorial-ideaEntry-goback': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial-control");
        $("#control-tutorial-prompt").addClass("visible-tutorial-control");
        $(".ideation-prompt-control").css({
            border: "10px solid #F5A623",
            "z-index": "60",
        });
        $(".idea-input-box").css({border: "none"});
        $(".main-prompt").css({
            "z-index": 20 
        });
        EventLogger.logTutorialStepRewind(5,8);
    },
    //ideaEntryTry
    'click #control-tutorial-ideaEntryTry-gotit': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial-control");
        $("#control-tutorial-directions").addClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
        $("#ideator-directions-control").css({border: "10px solid #F5A623"});
        $("#directions-content").removeClass("collapse");
        $("#directions-content").addClass("collapse in");
        EventLogger.logTutorialStepComplete(6,8);
    },
    'click .control-tutorial-ideaEntryTry-goback': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
        $(".idea-input-box").css({border: "10px solid #F5A623"});
        EventLogger.logTutorialStepRewind(6,8);
    },
    //Directions
    'click .control-tutorial-directions-gotit': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial-control");
        $("#control-tutorial-pleaseWait").addClass("visible-tutorial-control");
        $("#control-tutorial-pleaseWait").removeClass("control-tutorial-background");
        $("#ideator-directions-control").css({border: "none"});
        // Mark the Particiapant as ready to begin the study
        ExperimentManager.logParticipantReady(Session.get("currentParticipant"));
        EventLogger.logTutorialStepComplete(7,8);
    },
    'click .control-tutorial-directions-goback': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial-control");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial-control");
        $("#ideator-directions-control").css({border: "none"});
        EventLogger.logTutorialStepRewind(7,8);
    },
    //Please Wait
    'click .control-tutorial-pleaseWait-gotit': function() {
        $("#control-tutorial-pleaseWait").removeClass("visible-tutorial-control");
        $("#control-tutorial-pleaseWait").addClass("control-tutorial-background");
        $(".tutorial-backdrop").remove();
        EventLogger.logTutorialStepComplete(8,8);
    },
    'click .control-tutorial-pleaseWait-goback': function() {
        $("#control-tutorial-pleaseWait").removeClass("visible-tutorial-control");
        $("#control-tutorial-directions").addClass("visible-tutorial-control");
        $("#control-tutorial-pleaseWait").addClass("control-tutorial-background");
        $("#ideator-directions-control").css({border: "10px solid #F5A623"});
        EventLogger.logTutorialStepRewind(8,8);
    },
});
 

//TREATMENT TUTORIAL
Template.TutorialTreatment.rendered = function() {
    // Insert greyed out backdrop for tutorial overlay
    $(".tutorial-page-treatment").append(
        "<div class='tutorial-backdrop'></div>"
    );
    // Setup Facilitation push to synthesis listener
    MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace("oldDoc: " + JSON.stringify(oldDoc));
        logger.trace("newDoc: " + JSON.stringify(newDoc));
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var partID = Session.get("currentParticipant")._id;
        logger.debug("partID: " + partID);
        Router.go(route, {'partID': partID});
    },
  });    
}
//Template.TutorialTreatment.events({
    //'click button.nextPage': function () {
        //ExperimentManager.logParticipantReady(Session.get("currentParticipant"));  
    //},
//});


Template.MturkIdeationPageTreatmentTutorial.rendered = function(){
  //Hide logout
  $(".btn-login").toggleClass("hidden");
  //Set height of elements to viewport height
  var height = $(window).height() - 50; //Navbar height=50
  logger.debug("window viewport height = " + height.toString());
  $(".main-prompt").height(height);
  $(".task-list-pane").height(height-85);
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

Template.MturkTaskListsTreatmentTutorial.helpers({
  getMyTasks: function() {
    logger.debug("Getting a list of all tasks assigned to current user");
//    var assignments = 
//      Assignments.find({userID: Session.get("currentUser")._id,
//        promptID: Session.get("currentPrompt")._id}, 
//        {sort: {'assignmentTime': -1}}).fetch();
//    logger.trace(assignments);
//    var taskIDs = getValsFromField(assignments, 'taskID');
//    logger.trace(taskIDs);
      var allMyTasks = DummyTasks.find({
        authorID: Session.get("currentUser")._id,
        promptID: Session.get("currentPrompt")._id,
      }, {sort: {time: -1}});
      
//    var tasks = DummyTasks.find({_id: {$in: myTaskIDs}}).fetch();
//    for (var i=0; i<taskIDs.length; i++) {
//      tasks.push(DummyTasks.findOne({_id: taskIDs[i]}));
//    };
    //var tasks = Tasks.find({_id: {$in: taskIDs}});
    //Sort tasks by assignment time
    return allMyTasks;
  },
  prompt: function() {
    var prompt = Session.get("currentPrompt");
    return prompt.question;
  },
});

Template.MturkTaskListsTreatmentTutorial.events({ 
  'click .get-task': function(e, t) {
    EventLogger.logRequestInspiration(Session.get("currentPrompt"));
    document.getElementById("treatment-tutorial-inspireMeTry-gotit").disabled = false;
      
    var groupID = Session.get("currentUser").groupID;
    var group = Groups.findOne({_id : groupID});

    var dummy1 = new Task(Session.get('currentUser'), Session.get('currentPrompt'), group, "This is an inspiration!", 'open', priority=3, num=50); 
      dummy1._id = DummyTasks.insert(dummy1);
      
    logger.debug("Retrieving a new task"); 
//    var task = DummyTasks.findOne({_id: {$nin: myTaskIDs}});
      
      DummyTasks.update({_id: dummy1._id}, {$push: {assignments: Session.get("currentUser")}});
      
    if (dummy1) {
      logger.info("Got a new task");
      EventLogger.logInspirationRequestSuccess(
        Session.get("currentPrompt"),
        dummy1
      );
      logger.trace(dummy1);
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
    var ideas = DummyIdeas.find(
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


Template.TaskIdeaListTreatmentTutorial.helpers({
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

Template.TreatmentTutorialFlow.events({
    //Welcome
    'click .treatment-tutorial-welcome-gotit': function() {
        $("#treatment-tutorial-welcome").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-timer").addClass("visible-tutorial-treatment");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
        EventLogger.logTutorialStepComplete(1,13);
    },
    //Timer
    'click .treatment-tutorial-timer-gotit': function() {
        $("#treatment-tutorial-timer").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-exit").addClass("visible-tutorial-treatment");
        $(".timer").css({border: "none"});
        $(".exitStudy").css({border: "10px solid #F5A623"});
//        $(".ideation-prompt-treatment").css({"z-index": 100});
        EventLogger.logTutorialStepComplete(2,13);
    },
    'click .treatment-tutorial-timer-goback': function() {
        $("#treatment-tutorial-timer").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-welcome").addClass("visible-tutorial-treatment");
        $(".timer").css({border: "none"});
        EventLogger.logTutorialStepRewind(2,13);
    },
    //Exit Early
    'click .treatment-tutorial-exit-gotit': function() {
        $("#treatment-tutorial-exit").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-prompt").addClass("visible-tutorial-treatment");
        $(".ideation-prompt-treatment").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        $(".exitStudy").css({border: "none"});
        $(".tutorial-backdrop").remove();
        $(".task-list-header").append(
            "<div class='tutorial-backdrop'></div>"
        );
        $(".general-idea-entry").append(
            "<div class='tutorial-backdrop'></div>"
        );
        $(".ideation-prompt-treatment").zIndex(60);
        EventLogger.logTutorialStepComplete(3,13);
    },
    'click .treatment-tutorial-exit-goback': function() {
        $("#treatment-tutorial-exit").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-timer").addClass("visible-tutorial-treatment");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
        $(".exitStudy").css({border: "none"});
        EventLogger.logTutorialStepRewind(3,13);
    },
    //Prompt
    'click .treatment-tutorial-prompt-gotit': function() {
        $("#treatment-tutorial-prompt").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-ideaEntry").addClass("visible-tutorial-treatment");
        $(".ideation-prompt-treatment").css({
            border:"none",
            "z-index": 20
        });
        $(".idea-input-box").css({
          border: "10px solid #F5A623",
          "z-index": "60",
          position: "relative"
        });
        EventLogger.logTutorialStepComplete(4,13);
    },
    'click .treatment-tutorial-prompt-goback': function() {
        $("#treatment-tutorial-prompt").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-exit").addClass("visible-tutorial-treatment");
        $(".ideation-prompt-treatment").css({
            border: "none",
            "z-index": 20 
        });
        $(".tutorial-backdrop").remove();
        $(".tutorial-page-treatment").append(
            "<div class='tutorial-backdrop'></div>"
        );
        $(".exitStudy").css({border: "10px solid #F5A623"});
        EventLogger.logTutorialStepRewind(4,13);
    },
    //ideaEntry
    'click .treatment-tutorial-ideaEntry-gotit': function() {
        $("#treatment-tutorial-ideaEntry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-ideaEntryTry").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-ideaEntryTry").removeClass("treatment-tutorial-background");
        $(".idea-input-box").css({border: "none"});
        $(".general-idea-entry .tutorial-backdrop").remove();
        EventLogger.logTutorialStepComplete(5,13);
    },
    'click .treatment-tutorial-ideaEntry-goback': function() {
        $("#treatment-tutorial-ideaEntry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-prompt").addClass("visible-tutorial-treatment");
        $(".ideation-prompt-treatment").css({border: "10px solid #F5A623"});
        $(".idea-input-box").css({
            border: "none",
            "z-index": 20
        });
        $(".ideation-prompt-treatment").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        EventLogger.logTutorialStepRewind(5,13);
    },
    
    //ideaEntryTry
    'click #treatment-tutorial-ideaEntryTry-gotit': function() {
        $("#treatment-tutorial-ideaEntryTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspireMe").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-ideaEntryTry").addClass("treatment-tutorial-background");
        $(".get-task").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        $(".idea-input-box").css({
            border: "none",
            "z-index": 20
        });
        $(".general-idea-entry").append(
            "<div class='tutorial-backdrop'></div>"
        );
        EventLogger.logTutorialStepComplete(6,13);
    },
    'click .treatment-tutorial-ideaEntryTry-goback': function() {
        $("#treatment-tutorial-ideaEntryTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-ideaEntry").addClass("visible-tutorial-treatment");
        $(".get-task").css({
            border: "none",
            "z-index": 20 
        });
        $(".idea-input-box").css({
            border: "10px solid #F5A623",
            "z-index": 60 
        });
        $(".idea-input-box").css({border: "10px solid #F5A623"});
        $(".general-idea-entry").append(
            "<div class='tutorial-backdrop'></div>"
        );
        logger.trace("IDEA ENTRY TRY");
        EventLogger.logTutorialStepRewind(6,13);
    },
    
    //Inspire Me 
    'click .treatment-tutorial-inspireMe-gotit': function() {
        $("#treatment-tutorial-inspireMe").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspireMeTry").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-inspireMeTry").removeClass("treatment-tutorial-background");
        $(".get-task").css({border: "none"});
        $(".task-list-header .tutorial-backdrop").remove();
        EventLogger.logTutorialStepComplete(7,13);
    },
    'click .treatment-tutorial-inspireMe-goback': function() {
        $("#treatment-tutorial-inspireMe").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-ideaEntryTry").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-ideaEntryTry").removeClass("treatment-tutorial-background");
        $(".get-task").css({
            border: "none",
            "z-index": 20
        });
        $(".general-idea-entry .tutorial-backdrop").remove();
        //$(".task-list-header").append(
            //"<div class='tutorial-backdrop'></div>"
        //);
        EventLogger.logTutorialStepRewind(7,13);
    },
    
    //Inspire Me Try 
    'click #treatment-tutorial-inspireMeTry-gotit': function() {
        $("#treatment-tutorial-inspireMeTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCard").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-inspirationCard").addClass("treatment-tutorial-background");
        logger.trace("*********************Inpire me Try");
        $(".ideate-task").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        $(".get-task").css({
            border: "none",
            "z-index": 20 
        });
        $(".task-list-header").append(
            "<div class='tutorial-backdrop'></div>"
        );
        EventLogger.logTutorialStepComplete(8,13);
    },
    'click .treatment-tutorial-inspireMeTry-goback': function() {
        $("#treatment-tutorial-inspireMeTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspireMe").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-inspireMe").addClass("treatment-tutorial-background");
        $(".get-task").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        $(".task-list-header").append(
            "<div class='tutorial-backdrop'></div>"
        );
        EventLogger.logTutorialStepRewind(8,13);
    },
    
    //Inspiration Card
    'click .treatment-tutorial-inspirationCard-gotit': function() {
        logger.trace("Inspiration card*****************");
        $("#treatment-tutorial-inspirationCard").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCardTry").addClass("visible-tutorial-treatment");
        document.getElementById("treatment-tutorial-inspirationCardTry-gotit").disabled = true;
//        $("#treatment-tutorial-inspirationCardTry").removeClass("treatment-tutorial-background");
        //$(".ideate-task").css({
            //border: "none",
            //"z-index": 20
        //});
        EventLogger.logTutorialStepComplete(9,13);
    },
    'click .treatment-tutorial-inspirationCard-goback': function() {
        $("#treatment-tutorial-inspirationCard").removeClass("visible-tutorial-treatment");
        //$("#treatment-tutorial-inspireMe").addClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspireMeTry").addClass("visible-tutorial-treatment");
        $(".ideate-task").css({
            border: "none",
            "z-index": 20
        });
        $(".task-list-header .tutorial-backdrop").remove();
        EventLogger.logTutorialStepRewind(9,13);
    },
    
    //Inspiration Card Try
    'click #treatment-tutorial-inspirationCardTry-gotit': function() {
        logger.trace("Inspiration card try*****************");
        $("#treatment-tutorial-inspirationCardTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCardMany").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-ideaEntryTry").addClass("treatment-tutorial-background");
//      // Move backdrop to same hierachical level as the task-list-pane
        $(".task-list-header .tutorial-backdrop").remove();
        //$(".task-lists").append(
            //"<div class='tutorial-backdrop'></div>"
        //);
        //$(".task-list-pane").css({
            //border: "10px solid #F5A623", 
            //height: "auto",
            //"z-index": 60
        //});
        //$(".get-task").zIndex(60);
        $(".ideate-task").css({
            border: "none",
            "z-index": 20 
        });
        EventLogger.logTutorialStepComplete(10,13);
    },
    'click .treatment-tutorial-inspirationCardTry-goback': function() {
        $("#treatment-tutorial-inspirationCardTry").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCard").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-ideaEntryTry").addClass("treatment-tutorial-background");
        $(".ideate-task").css({
            border: "10px solid #F5A623",
           "z-index": 60
        });
        EventLogger.logTutorialStepRewind(10,13);
    },
    
    //Inspiration Card Many 
    'click .treatment-tutorial-inspirationCardMany-gotit': function() {
        $("#treatment-tutorial-inspirationCardMany").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-directions").addClass("visible-tutorial-treatment");
//        $("#treatment-tutorial-pleaseWait").removeClass("treatment-tutorial-background");
        $(".task-list-pane").css({
            border: "none",
            "z-index": 20
        });
        $(".get-task").zIndex(20);
        $(".task-list-header").append(
            "<div class='tutorial-backdrop'></div>"
        );
        //$(".general-idea-entry .tutorial-backdrop").remove();
        //$("#directions-container-treatment").css({
            //position: "relative",
            //background: "#F5F5F5",
            //"z-index": 60
        //});
        $(".ideator-directions-treatment").css({
            border: "10px solid #F5A623",
            background: "#FFF",
            position: "relative",
            "z-index": 60
        });
        $(".hcomp-ideation-pane").zIndex(10);
        $("#directions-content").removeClass("collapse");
        $("#directions-content").addClass("collapse in");
        EventLogger.logTutorialStepComplete(11,13);
    },
    'click .treatment-tutorial-inspirationCardMany-goback': function() {
        $("#treatment-tutorial-inspirationCardMany").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCardTry").addClass("visible-tutorial-treatment");
        $(".task-list-header").append(
            "<div class='tutorial-backdrop'></div>"
        );
        $(".ideate-task").css({
            border: "10px solid #F5A623",
            "z-index": 60
        });
        EventLogger.logTutorialStepRewind(11,13);
    },
    
    //Directions
    'click .treatment-tutorial-directions-gotit': function() {
        $("#treatment-tutorial-directions").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-pleaseWait").addClass("visible-tutorial-treatment");
        $("#treatment-tutorial-pleaseWait").removeClass("treatment-tutorial-background");
        //$("#directions-container-treatment").css({
            //border: "none",
            //"z-index": 20
        //});
        $(".ideator-directions-treatment").css({
            border: "none",
            background: "#F5F5F5",
            position: "relative",
            "z-index": 20
        });
        // Mark the Participant as ready to begin
        ExperimentManager.logParticipantReady(Session.get("currentParticipant"));  
        EventLogger.logTutorialStepComplete(12,13);
    },
    'click .treatment-tutorial-directions-goback': function() {
        $("#treatment-tutorial-directions").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-inspirationCardMany").addClass("visible-tutorial-treatment");
        $(".ideator-directions-treatment").css({
            border: "none",
            background: "#F5F5F5",
            position: "relative",
            "z-index": 20
        });
        //$(".task-list-pane").css({border: "10px solid #F5A623", height: "auto"});
        //$(".general-idea-entry").append(
            //"<div class='tutorial-backdrop'></div>"
        //);
        $(".task-list-header .tutorial-backdrop").remove();
        EventLogger.logTutorialStepRewind(12,13);
    },
    //Please Wait
    'click .treatment-tutorial-pleaseWait-gotit': function() {
        $(".tutorial-backdrop").remove();
        $("#treatment-tutorial-pleaseWait").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-pleaseWait").addClass("treatment-tutorial-background");
        EventLogger.logTutorialStepComplete(13,13);
    },
    'click .treatment-tutorial-pleaseWait-goback': function() {
        $("#treatment-tutorial-pleaseWait").removeClass("visible-tutorial-treatment");
        $("#treatment-tutorial-directions").addClass("visible-tutorial-treatment");
        $("#treatment-tutorial-pleaseWait").addClass("treatment-tutorial-background");
        $(".ideator-directions-treatment").css({
            border: "10px solid #F5A623",
            background: "#FFF",
            position: "relative",
            "z-index": 60
        });
        EventLogger.logTutorialStepRewind(13,13);
    },
});





