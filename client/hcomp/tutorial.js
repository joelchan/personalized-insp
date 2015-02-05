// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Ideate');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Ideate', 'trace');
//Logger.setLevel('Client:Hcomp:Ideate', 'debug');
//Logger.setLevel('Client:Hcomp:Ideate', 'info');
//Logger.setLevel('Client:Hcomp:Ideate', 'warn');

Template.ControlTutorialFlow.rendered = function(){
    //SET THE OVERLAY ABSOLUTE POSITIONS
    var offset = $(".ideation-prompt-control").position();
    var width = $(".ideation-prompt-control").width();
    var height = $(".ideation-prompt-control").height();
    var textTop = (offset.top + height + 100);
    $("#control-tutorial-highlight-prompt").css({top:offset.top, left:offset.left, width:width, height:height + 50});
    $(".control-tutorial-prompt-text").css({top:textTop, left:offset.left, width:width});
};
    
    

Template.TutorialControl.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});

Template.TutorialTreatment.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});

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



Template.ControlTutorialFlow.events({
    //Welcome
    'click .control-tutorial-welcome-gotit': function() {
        $("#control-tutorial-welcome").removeClass("visible-tutorial");
        $("#control-tutorial-timer").addClass("visible-tutorial");
    },
    //Timer
    'click .control-tutorial-timer-gotit': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial");
        $("#control-tutorial-exit").addClass("visible-tutorial");
    },
    'click .control-tutorial-timer-goback': function() {
        $("#control-tutorial-timer").removeClass("visible-tutorial");
        $("#control-tutorial-welcome").addClass("visible-tutorial");
    },
    //Exit Early
    'click .control-tutorial-exit-gotit': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial");
        $("#control-tutorial-prompt").addClass("visible-tutorial");
    },
    'click .control-tutorial-exit-goback': function() {
        $("#control-tutorial-exit").removeClass("visible-tutorial");
        $("#control-tutorial-timer").addClass("visible-tutorial");
    },
    //Prompt
    'click .control-tutorial-prompt-gotit': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial");
    },
    'click .control-tutorial-prompt-goback': function() {
        $("#control-tutorial-prompt").removeClass("visible-tutorial");
        $("#control-tutorial-exit").addClass("visible-tutorial");
    },
    //ideaEntry
    'click .control-tutorial-ideaEntry-gotit': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").removeClass("control-tutorial-background");
    },
    'click .control-tutorial-ideaEntry-goback': function() {
        $("#control-tutorial-ideaEntry").removeClass("visible-tutorial");
        $("#control-tutorial-prompt").addClass("visible-tutorial");
    },
    //ideaEntryTry
    'click #control-tutorial-ideaEntryTry-gotit': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#control-tutorial-directions").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
    },
    'click .control-tutorial-ideaEntryTry-goback': function() {
        $("#control-tutorial-ideaEntryTry").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntry").addClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("control-tutorial-background");
    },
    //Directions
    'click .control-tutorial-directions-gotit': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").addClass("visible-tutorial");
        $("#control-tutorial-pleaseWait").removeClass("control-tutorial-background");
    },
    'click .control-tutorial-directions-goback': function() {
        $("#control-tutorial-directions").removeClass("visible-tutorial");
        $("#control-tutorial-ideaEntryTry").addClass("visible-tutorial");
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
    },
});

















