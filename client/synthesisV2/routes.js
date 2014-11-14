// Configure logger for Tools
var logger = new Logger('Client:SynthesisV2:Routes');
// Comment out to use global logging level
//Logger.setLevel('Client:SynthesisV2:Routes', 'trace');
//Logger.setLevel('Client:SynthesisV2:Routes', 'debug');
Logger.setLevel('Client:SynthesisV2:Routes', 'info');
//Logger.setLevel('Client:SynthesisV2:Routes', 'warn');


//Maps routes to templates
Router.map(function () {
  /***************************************************************
   * Define custom routes for SynthesisV2 pages
   * *************************************************************/
  this.route('MturkSynthesis', {
    path: 'crowd/Categorize/:promptID/:userID/',
  	template: 'MturkClustering',
    waitOn: function() {
      logger.debug("Waiting on...");
      if (Session.get("currentUser")) {
        // return Meteor.subscribe('ideas');
        logger.debug("has current user...");
        return [
          Meteor.subscribe('groups'),
          Meteor.subscribe('prompts'),
          Meteor.subscribe('myUsers'),
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('graphs'),
          Meteor.subscribe('nodes'),
          Meteor.subscribe('edges'),
          ];
      } else {
        logger.debug("NO current user...");
        return [
          Meteor.subscribe('groups'),
          Meteor.subscribe('prompts'),
          Meteor.subscribe('myUsers'),
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('graphs'),
          Meteor.subscribe('nodes'),
          Meteor.subscribe('edges'),
        ];
      }
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        if (this.ready()) {
          var user = MyUsers.findOne({_id: this.params.userID});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          MyUsers.update({_id: user._id}, {$set: {route: 'MturkSynthesis'}});
          logger.debug("Data ready");
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            logger.debug("setting current Prompt");
            Session.set("currentPrompt", prompt);
            var groupIDs = prompt.groupIDs;
            logger.trace("group IDS of the prompt");
            logger.trace(groupIDs);
            var group = Groups.findOne({_id: prompt.groupIDs[0]});
            logger.trace(group);
            Session.set("currentGroup", group);

            //Get Data and setup listeners
            //Get user graph
            var userGraph = Graphs.findOne({
              'promptID': prompt._id,
              'groupID': group._id,
              'userID': user._id
            });
            logger.trace(userGraph);
            if (!userGraph) {
              logger.info("No user graph found.  Initializing new graph");
              Meteor.call("graphCreate", prompt, group, user,
                function (error, result) {
                  logger.debug("Setting User graph");
                  Session.set("currentGraph", result);
                }
              );
            } else {
              logger.debug("Setting User graph");
              Session.set("currentGraph", userGraph);
            }
           
            //Get shared graph
            var sharedGraph = Graphs.findOne({
              'promptID': prompt._id,
              'groupID': group._id,
              'userID': null,
            });
            logger.trace(sharedGraph);
            if (!sharedGraph) {
              logger.info("No shared graph found.  Initializing new graph");
              Meteor.call("graphCreate", prompt, group, null,
                function (error, result) {
                  logger.debug("Setting shared graph");
                  Session.set("sharedGraph", result);
                }
              );
            } else {
              logger.debug("Setting shared graph");
              Session.set("sharedGraph", sharedGraph);
            }
         
       
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          console.log("Not ready");
        }
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        initRolePage();
      }
    }

  });

});

var insertExitStudy = function() {
  if ($('.exitStudy').length == 0) {
    var exitStudyBtn = UI.render(Template.ExitStudy);
    UI.insert(exitStudyBtn, $('.login')[0]);
  }
  //Add event handler for the exit study button
  $('.exitStudy').click(function() {
    logger.info("exiting study early");
    EventLogger.logExitStudy();
    EventLogger.logEndRole();
    Router.go("LegionFinalPage", {
      'promptID': Session.get("currentPrompt")._id,
      'userID': Session.get("currentUser")._id
    });
  });
};

var initRolePage = function() {
  //Add timer
  var prompt = Session.get("currentPrompt");
  if (prompt.length > 0) {
    if ($('.timer').length == 0 && Session.get("useTimer")) {
      console.log("using a timer");
      Session.set("hasTimer", true);
      var timerTemplate = UI.render(Template.Timer);
      UI.insert(timerTemplate, $('#nav-right')[0]);
      //Setup timer for decrementing onscreen timer with 17 minute timeout
      Session.set("timeLeft", prompt.length + 1);
      $('#time').text(prompt.length);
      if (Session.get("useTimer")) {
        Meteor.setTimeout(decrementTimer, 60000);
      }
    }
  }
};

