// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Ideate');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Ideate', 'trace');
//Logger.setLevel('Client:Hcomp:Ideate', 'debug');
//Logger.setLevel('Client:Hcomp:Ideate', 'info');
//Logger.setLevel('Client:Hcomp:Ideate', 'warn');

    
//CONTROL TUTORIAL
Template.TutorialControl.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});

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
        var promptID = Session.get("currentPrompt")._id;
        logger.debug("promptID: " + promptID);
        var userID = Session.get("currentUser")._id;
        logger.debug("userID: " + userID);
        Router.go(route, {'promptID': promptID, 'userID': userID}); 
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
      
    document.getElementById("control-tutorial-ideaEntryTry-gotit").disabled = false;
      
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
      logger.debug("enter pressed")
      var btn = $(target.firstNode).children('.submit-idea')
      btn.click();
    }
  }
});

//Template.ControlTutorialFlow.rendered = function(){
//    //SET THE OVERLAY ABSOLUTE POSITIONS
//    
//    //PROMPT
//    var offsetPrompt = $(".ideation-prompt-control").position();
//    var widthPrompt = $(".ideation-prompt-control").width();
//    var heightPrompt = $(".ideation-prompt-control").height();
//    var textTopPrompt = (offsetPrompt.top + heightPrompt + 100);
//    $(".control-tutorial-prompt-text").css({top:textTopPrompt, left:offsetPrompt.left, width:widthPrompt});
//    
//    //IDEAENTRY
//    var offsetIdeaEntry = $(".idea-input-box").position();
//    var widthIdeaEntry = $(".idea-input-box").width();
//    var heightIdeaEntry = $(".idea-input-box").height();
//    var textTopIdeaEntry = (offsetIdeaEntry.top + heightIdeaEntry + 200);
//    $(".control-tutorial-ideaEntry-text").css({top:textTopIdeaEntry, width:widthIdeaEntry});
//    
//    //DIRECTIONS
//    var offsetDirections = $("#directions-container-control").position();
//    var widthDirections = $("#directions-container-control").width();
//    var heightDirections = $("#directions-container-control").height();
//    var textTopDirections = (offsetDirections.top + heightDirections + 200);
//    $(".control-tutorial-directions-text").css({top:textTopDirections, width:widthDirections});
//     
//}; 

Template.ControlTutorialFlow.events({
    //Welcome
    'click .control-tutorial-welcome-gotit': function() {
        $("#control-tutorial-welcome").removeClass("visible-tutorial");
        $("#control-tutorial-timer").addClass("visible-tutorial");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
    },
    //Timer
    'click .control-tutorial-timer-gotit': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial");
        $("#control-tutorial-exit").addClass("visible-tutorial");
        $(".timer").css({border: "none"});
        $(".exitStudy").css({border: "10px solid #F5A623"});
        $(".ideation-prompt-control").css({"z-index": 100});
    },
    'click .control-tutorial-timer-goback': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial");
        $("#control-tutorial-welcome").addClass("visible-tutorial");
        $(".timer").css({border: "none"});
    },
    //Exit Early
    'click .control-tutorial-exit-gotit': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial");
        $("#control-tutorial-prompt").addClass("visible-tutorial");
        $(".ideation-prompt-control").css({border: "10px solid #F5A623"});
        $(".exitStudy").css({border: "none"});
    },
    'click .control-tutorial-exit-goback': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial");
        $("#control-tutorial-timer").addClass("visible-tutorial");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
        $(".exitStudy").css({border: "none"});
    },
    //Prompt
    'click .control-tutorial-prompt-gotit': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial");
        $(".ideation-prompt-control").css({border:"none"});
        $(".idea-input-box").css({border: "10px solid #F5A623"});
    },
    'click .control-tutorial-prompt-goback': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial");
        $("#control-tutorial-exit").addClass("visible-tutorial");
        $(".ideation-prompt-control").css({border:"none"});
        $(".exitStudy").css({border: "10px solid #F5A623"});
    },
    //ideaEntry
    'click .control-tutorial-ideaEntry-gotit': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").removeClass("control-tutorial-background");
        $(".idea-input-box").css({border: "none"});
    },
    'click .control-tutorial-ideaEntry-goback': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#control-tutorial-prompt").addClass("visible-tutorial");
        $(".ideation-prompt-control").css({border: "10px solid #F5A623"});
        $(".idea-input-box").css({border: "none"});
    },
    //ideaEntryTry
    'click #control-tutorial-ideaEntryTry-gotit': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#control-tutorial-directions").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
        $("#directions-container-control").css({border: "10px solid #F5A623"});
    },
    'click .control-tutorial-ideaEntryTry-goback': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
        $(".idea-input-box").css({border: "10px solid #F5A623"});
    },
    //Directions
    'click .control-tutorial-directions-gotit': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").addClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").removeClass("control-tutorial-background");
        $("#directions-container-control").css({border: "none"});
    },
    'click .control-tutorial-directions-goback': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial");
        $("#directions-container-control").css({border: "none"});
    },
    //Please Wait
    'click .control-tutorial-pleaseWait-gotit': function() {
        $("#control-tutorial-pleaseWait").removeClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").addClass("control-tutorial-background");
    },
    'click .control-tutorial-pleaseWait-goback': function() {
        $("#control-tutorial-pleaseWait").removeClass("visible-tutorial");
        $("#control-tutorial-directions").addClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").addClass("control-tutorial-background");
        $("#directions-container-control").css({border: "10px solid #F5A623"});
    },
});
 

//TREATMENT TUTORIAL

Template.TutorialTreatment.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});


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

Template.MturkTaskListsTreatmentTutorial.events({ 
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


Template.TreatmentTutorialFlow.rendered = function(){
    //SET THE OVERLAY ABSOLUTE POSITIONS
    
    //PROMPT
    var offsetPromptT = $(".ideation-prompt-treatment").position();
    var widthPromptT = $(".ideation-prompt-treatment").width();
    var heightPromptT = $(".ideation-prompt-treatment").height();
    var textTopPromptT = (offsetPromptT.top + heightPromptT + 100);
    $(".treatment-tutorial-prompt-text").css({top:textTopPromptT, left:offsetPromptT.left, width:widthPromptT});
    
    //IDEAENTRY
    var offsetIdeaEntryT = $(".idea-input-box").position();
    var widthIdeaEntryT = $(".idea-input-box").width();
    var heightIdeaEntryT = $(".idea-input-box").height();
    var textTopIdeaEntryT = (offsetIdeaEntryT.top + heightIdeaEntryT + 200);
    $(".treatment-tutorial-ideaEntry-text").css({top:textTopIdeaEntryT, width:widthIdeaEntryT});
    
    //DIRECTIONS
    var offsetDirectionsT = $("#directions-container-treatment").position();
    var widthDirectionsT = $("#directions-container-treatment").width();
    var heightDirectionsT = $("#directions-container-treatment").height();
    var textTopDirectionsT = (offsetDirectionsT.top + heightDirectionsT + 200);
    $(".treatment-tutorial-directions-text").css({top:textTopDirectionsT, width:widthDirectionsT});
     
}; 


Template.TreatmentTutorialFlow.events({
    //Welcome
    'click .treatment-tutorial-welcome-gotit': function() {
        $("#treatment-tutorial-welcome").removeClass("visible-tutorial");
        $("#treatment-tutorial-timer").addClass("visible-tutorial");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
    },
    //Timer
    'click .treatment-tutorial-timer-gotit': function() {
        $("#treatment-tutorial-timer").removeClass("visible-tutorial");
        $("#treatment-tutorial-exit").addClass("visible-tutorial");
        $(".timer").css({border: "none"});
        $(".exitStudy").css({border: "10px solid #F5A623"});
//        $(".ideation-prompt-treatment").css({"z-index": 100});
    },
    'click .treatment-tutorial-timer-goback': function() {
        $("#treatment-tutorial-timer").removeClass("visible-tutorial");
        $("#treatment-tutorial-welcome").addClass("visible-tutorial");
        $(".timer").css({border: "none"});
    },
    //Exit Early
    'click .treatment-tutorial-exit-gotit': function() {
        $("#treatment-tutorial-exit").removeClass("visible-tutorial");
        $("#treatment-tutorial-prompt").addClass("visible-tutorial");
        $(".ideation-prompt-treatment").css({border: "10px solid #F5A623"});
        $(".exitStudy").css({border: "none"});
    },
    'click .treatment-tutorial-exit-goback': function() {
        $("#treatment-tutorial-exit").removeClass("visible-tutorial");
        $("#treatment-tutorial-timer").addClass("visible-tutorial");
        $(".timer").css({border: "10px solid #F5A623",width: 200,float: "right",clear: "right"});
        $(".exitStudy").css({border: "none"});
    },
    //Prompt
    'click .treatment-tutorial-prompt-gotit': function() {
        $("#treatment-tutorial-prompt").removeClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntry").addClass("visible-tutorial");
        $(".ideation-prompt-treatment").css({border:"none"});
        $(".idea-input-box").css({border: "10px solid #F5A623"});
    },
    'click .treatment-tutorial-prompt-goback': function() {
        $("#treatment-tutorial-prompt").removeClass("visible-tutorial");
        $("#treatment-tutorial-exit").addClass("visible-tutorial");
        $(".ideation-prompt-treatment").css({border:"none"});
        $(".exitStudy").css({border: "10px solid #F5A623"});
    },
    //ideaEntry
    'click .treatment-tutorial-ideaEntry-gotit': function() {
        $("#treatment-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntryTry").addClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntryTry").removeClass("treatment-tutorial-background");
        $(".idea-input-box").css({border: "none"});
    },
    'click .treatment-tutorial-ideaEntry-goback': function() {
        $("#treatment-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#treatment-tutorial-prompt").addClass("visible-tutorial");
        $(".ideation-prompt-treatment").css({border: "10px solid #F5A623"});
        $(".idea-input-box").css({border: "none"});
    },
    //ideaEntryTry
    'click #treatment-tutorial-ideaEntryTry-gotit': function() {
        $("#treatment-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#treatment-tutorial-directions").addClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntryTry").addClass("treatment-tutorial-background");
        $("#directions-container-treatment").css({border: "10px solid #F5A623"});
    },
    'click .treatment-tutorial-ideaEntryTry-goback': function() {
        $("#treatment-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntry").addClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntryTry").addClass("treatment-tutorial-background");
        $(".idea-input-box").css({border: "10px solid #F5A623"});
    },
    //Directions
    'click .treatment-tutorial-directions-gotit': function() {
        $("#treatment-tutorial-directions").removeClass("visible-tutorial");
        $("#treatment-tutorial-pleaseWait").addClass("visible-tutorial");
        $("#treatment-tutorial-pleaseWait").removeClass("treatment-tutorial-background");
        $("#directions-container-treatment").css({border: "none"});
    },
    'click .treatment-tutorial-directions-goback': function() {
        $("#treatment-tutorial-directions").removeClass("visible-tutorial");
        $("#treatment-tutorial-ideaEntryTry").addClass("visible-tutorial");
        $("#directions-container-treatment").css({border: "none"});
    },
    //Please Wait
    'click .treatment-tutorial-pleaseWait-gotit': function() {
        $("#treatment-tutorial-pleaseWait").removeClass("visible-tutorial");
        $("#treatment-tutorial-pleaseWait").addClass("treatment-tutorial-background");
    },
    'click .treatment-tutorial-pleaseWait-goback': function() {
        $("#treatment-tutorial-pleaseWait").removeClass("visible-tutorial");
        $("#treatment-tutorial-directions").addClass("visible-tutorial");
        $("#treatment-tutorial-pleaseWait").addClass("treatment-tutorial-background");
        $("#directions-container-treatment").css({border: "10px solid #F5A623"});
    },
});





