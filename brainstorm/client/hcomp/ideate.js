// Configure logger for Tools
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
  $(".task-list").height(height);
};

Template.MturkMainPrompt.rendered = function(){
  //Setup filters for users and filter update listener
  updateFilters();
  //Update filters when current group changes
  Groups.find({_id: Session.get("currentGroup")._id}).observe({
    changed: function(newDoc, oldDoc) {
      //Setup filters for users and filter update listener
      updateFilters();
    } 
  });

};

Template.MturkMainPrompt.helpers({
  prompt: function() {
    var prompt = Session.get("currentPrompt");
    return prompt.question;
  },
});

Template.MturkIdeaList.helpers({
  ideas: function() {
    return Ideas.find({userID: Session.get("currentUser")._id});
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
    //Scroll window to new idea
    // $("html, body").animate({ scrollTop: $('.ideabox').height() }, "slow");
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

Template.MturkTaskLists.events({ 
  'click .get-task': function(e, t) {
    logger.debug("Retrieving a new task"); 
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


updateFilters = function() {
  /***************************************************************
    * Check group ideators and update user filters
    **************************************************************/
  var prompt = Prompts.findOne({_id: Session.get("currentPrompt")._id});
  //Assume the group is the first group of the prompt
  var group = prompt.groupIDs[0];
  logger.trace("Updating filters for group: " + group);
  var ideators = GroupManager.getUsersInRole(group, 'Ideator');
  logger.trace("current group has ideators: " + 
      JSON.stringify(ideators));
  var prev = Session.get("currentIdeators");
  logger.trace("current ideators stored in session are: " + 
      JSON.stringify(prev));
  var newUsers = [];
  var update = false;
  ideators.forEach(function(user) {
    if (!isInList(user, prev, '_id')) {
      logger.trace("Found new ideator: " + 
        JSON.stringify(user));
      newUsers.push(user);
      update = true;
    }
  });
  var prevCluster = Session.get("currentSynthesizers");
  logger.trace("current synthesizers stored in session are: " + 
      JSON.stringify(prevCluster));
  var newClusterers = [];
  var clusterers = GroupManager.getUsersInRole(group, 'Synthesizer'); 
  clusterers.forEach(function(user) {
    if (!isInList(user, prevCluster, '_id')) {
      logger.trace("Found new clusterer: " + 
        JSON.stringify(user));
      newClusterers.push(user);
      update = true;
    }
  });

  if (update) {
    logger.trace("Updating session variable and filter");
    //Create filter for user
    newUsers.forEach(function(user) {
      logger.debug("Creating new filter for ideator user: " + user.name);
      var newFilter = FilterManager.create(ideaFilterName,
          Session.get("currentUser"),
          "ideas",
          "userID",
          user._id
      );
      prev.push(user);
    });
    newClusterers.forEach(function(user) {
      logger.debug("Creating new filter for cluster user: " + user.name);
      var newFilter = FilterManager.create(clusterFilterName,
          Session.get("currentUser"),
          "clusters",
          "userID",
          user._id
      );
      prevCluster.push(user);
    });
    logger.debug("Setting list of ideators: " + 
        JSON.stringify(prev));
    Session.set("currentIdeators", prev);
    logger.debug("Setting list of synthesizers: " + 
        JSON.stringify(prevCluster));
    Session.set("currentSynthesizers", prevCluster);
 }
};
