// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Routes');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Routes', 'trace');
//Logger.setLevel('Client:Hcomp:Routes', 'debug');
// Logger.setLevel('Client:Hcomp:Routes', 'info');
//Logger.setLevel('Client:Hcomp:Routes', 'warn');

//Maps routes to templates
Router.map(function () {
  /***************************************************************
   * Define custom routes for hcomp pages
   * *************************************************************/
  this.route('CrowdPromptPage', {
      name: 'CrowdPromptPage',
      path: 'crowd/Brainstorms/:userID',
      template: 'CrowdPromptPage',
    waitOn: function() {
      //var group = Session.get("currentGroup");
      //console.log(group['assignments']['Ideator']);
      //console.log("************************************************");
      //var ideatorIDs = getIDs(group['assignments']['Ideator'])
      //var synthIDs = getIDs(group['assignments']['Synthesizer'])
      return [
          Meteor.subscribe('prompts'),
          Meteor.subscribe('myUsers'),
          Meteor.subscribe('groups'),
      ];
    }, 
    onBeforeAction: function() {
      if (this.ready()) {
        logger.debug("Data ready");
        if (!Session.get("currentUser")) {
          var user = MyUsers.findOne({_id: this.params.userID});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
        }
        this.next();
      }
    },
  });
  this.route('HcompDashboard', {
    path: 'crowd/Dashboard/:promptID/:userID',
    template: 'HcompDashboard',
    onRun: function() {
      //Session.set("currentUser", MyUsers.findOne({_id: "db"}));
    },
    waitOn: function() {
      //var group = Session.get("currentGroup");
      //console.log(group['assignments']['Ideator']);
      //console.log("************************************************");
      //var ideatorIDs = getIDs(group['assignments']['Ideator'])
      //var synthIDs = getIDs(group['assignments']['Synthesizer'])
      var pID = this.params.promptID;
      return [
          Meteor.subscribe('prompts'),
          Meteor.subscribe('groups'),
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('myUsers'),
          Meteor.subscribe('tasks', {promptID: pID}),
          Meteor.subscribe('questions'),
          Meteor.subscribe('assignments', {promptID: pID}),
      ];
    }, 
    onBeforeAction: function() {
      if (this.ready()) {
        logger.debug("Data ready");
        if (!Session.get("currentUser")) {
          var user = MyUsers.findOne({_id: this.params.userID});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
        }
        var prompt = Prompts.findOne({_id: this.params.promptID});
        if (prompt) {
          var group = Groups.findOne({_id: prompt.groupIDs[0]})
          logger.debug("setting current prompt");
          Session.set("currentPrompt", prompt);
          Session.set("currentGroup", group);
          // FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
          // FilterManager.create("IdeaWordCloud Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
          // FilterManager.create("Tasks Filter", Session.get("currentUser"), "tasks", "promptID", Session.get("currentPrompt")._id);
          if (prompt.length > 0) {
	          Session.set("sessionLength", prompt.length);	
          } else {
	          Session.set("sessionLength", 10);
          }
        } else {
          logger.warn("no prompt found with id: " + this.params.promptID);
        }
        this.next();
      }
    },
    onAfterAction: function() {
      if (this.ready()) {
        initRolePage();
      }
    }
  });
  this.route('MturkLoginPage', {
    // path: '/crowd/Ideate/Login/:promptID',
    path: '/crowd/Ideate/Login/:expID',
    template: 'MturkLoginPage',
    waitOn: function() {
      // Meteor.subscribe('prompts', this.params.promptID);
      return Meteor.subscribe('experiments', this.params.expID);
    },
    onBeforeAction: function() {
      console.log("before action");
      Session.set("currentUser", null);
      if (this.ready()) {
        logger.debug("Data ready");
        var exp = Experiments.findOne({_id: this.params.expID})

        if (exp) {
          logger.debug("setting current experiment");
          Session.set("currentExp", exp);
          var pID = exp.promptID
          var prompt = Prompts.findOne({_id: pID});
          logger.debug("setting current prompt");
          Session.set("currentPrompt", prompt);
        } else {
          // logger.warn("no prompt found with id: " + this.params.promptID);
          logger.warn("no experiment found with id: " + this.params.expID);
        }
        this.next();
      } else {
        logger.warn("Not ready");
      }
    },
    action: function() {
      if (this.ready()) {
        this.render();
      } else {
        this.render('loading');
      }
    },
    onAfterAction: function() {
      Session.set("nextPage", "HcompConsentPage");
    },
  });

  this.route('HcompConsentPage', {
      path: 'consent/:expID/:userID',
      template: 'HcompConsentPage',
    waitOn: function() {
      return Meteor.subscribe('experiments', this.params.expID);
      // var exp = Experiments.findOne({_id: this.params.expID});
      // if (exp) {
      //   logger.trace("found experiment with id: " + this.params.expID);
      //   var pID = exp.promptID;
      // } else {
      //   logger.warn("no experiment found with id: " + this.params.expID);
      // }
      // // var expID = this.params.promptID;
      // if (Session.get("currentUser")) {
      //   return [ 
      //     Meteor.subscribe('ideas', {promptID: pID}),
      //     Meteor.subscribe('clusters', {promptID: pID}),
      //     Meteor.subscribe('prompts'),
      //     ]
      // } else {
      //   return [
      //     Meteor.subscribe('ideas', {promptID: pID}),
      //     Meteor.subscribe('clusters', {promptID: pID}),
      //     Meteor.subscribe('prompts'),
      //   ]
      // }
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'HcompConsentPage'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var exp = Experiments.findOne({_id: this.params.expID});
          if (exp) {
            logger.trace("found experiment with id: " + this.params.expID);
            var pID = exp.promptID;
            var prompt = Prompts.findOne({_id: pID});
            if (prompt) {
              Session.set("currentPrompt", prompt);
            } else {
              logger.warn("no prompt found with id: " + this.params.pID);
            }
          } else {
            logger.warn("no experiment found with id: " + this.params.expID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      // logger.trace("Checking if participant has participated before");
      // if (ExperimentManager.canParticipate(exp, user.name)) {
      //   logger.trace("Participant is ok, randomly assigning to condition in experiment");
      //   part = ExperimentManager.addExperimentParticipant(exp, user);
      //   if (part.cond == "treatment") {
      //     logger.trace("Assigned to treatment condition, sending to treatment tutorial page");
      //     Session.set("nextPage", "TutorialTreatment");
      //   } else {
      //     logger.trace("Assigned to control condition, sending to control tutorial page");
      //     Session.set("nextPage", "TutorialControl");
      //   }
      // } else {
      //   logger.trace("Participant has participated before; rejecting participant");
      // }
    },
  });

  this.route('TutorialControl', {
      path: 'tutorialc/:promptID/:userID',
      template: 'TutorialControl',
    waitOn: function() {
      var pID = this.params.promptID;
      if (Session.get("currentUser")) {
        return [ 
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
          ]
      } else {
        return [
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
        ]
      }
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'TutorialControl'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      Session.set("nextPage", "MturkIdeationControl");
    },
  });

  this.route('TutorialTreatment', {
      path: 'tutorialt/:promptID/:userID',
      template: 'TutorialTreatment',
    waitOn: function() {
      var pID = this.params.promptID;
      if (Session.get("currentUser")) {
        return [ 
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
          ]
      } else {
        return [
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
        ]
      }
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeation'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      Session.set("nextPage", "MturkIdeation");
    },
  });
  
  this.route('MturkIdeationControl', {
      path: 'crowd/IdeationC/:promptID/:userID/',
      template: 'MturkIdeationPageControl',

//    path: 'crowd/Ideation/:promptID/:userID/',
//  	template: 'MturkIdeationPage',
    waitOn: function() {
      logger.debug("Waiting on...");
      var pID = this.params.promptID;
      return [
        Meteor.subscribe('ideas', {promptID: pID}),
        Meteor.subscribe('prompts'),
        Meteor.subscribe('myUsers'),
        Meteor.subscribe('tasks', {promptID: pID}),
        Meteor.subscribe('questions'),
        Meteor.subscribe('assignments', {promptID: pID}),
      ];
      Session.set("useTimer", true);
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeation'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        initRolePage();
        insertExitStudy();
      }
    }

  });
  
  this.route('MturkIdeation', {
      path: 'crowd/IdeationT/:promptID/:userID/',
      template: 'MturkIdeationPage',

    waitOn: function() {
      logger.debug("Waiting on...");
      var pID = this.params.promptID;
      return [
        Meteor.subscribe('ideas', {promptID: pID}),
        Meteor.subscribe('prompts'),
        Meteor.subscribe('myUsers'),
        Meteor.subscribe('tasks', {promptID: pID}),
        Meteor.subscribe('questions'),
        Meteor.subscribe('assignments', {promptID: pID}),
      ];
      Session.set("useTimer", true);
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeation'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        initRolePage();
        insertExitStudy();
      }
    }

  });

  this.route('LegionFinalPage', {
    path: 'crowd/finished/:promptID/:userID/',
  	template: 'LegionFinalPage',
    waitOn: function() {
      logger.debug("Waiting on...");
      return [
        Meteor.subscribe('prompts'),
        Meteor.subscribe('myUsers'),
      ];
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeation'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },

  });

  this.route("HcompResultsPage", {
    path: "/results/:promptID/:userID", 
    template: "HcompResultsPage",
    waitOn: function() {
      var pID = this.params.promptID;
      if (Session.get("currentUser")) {
        return [ 
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
          ]
      } else {
        return [
          Meteor.subscribe('ideas', {promptID: pID}),
          Meteor.subscribe('clusters', {promptID: pID}),
          Meteor.subscribe('prompts'),
        ]
      }
    },
    onBeforeAction: function() {
        console.log("before action");
        // if (!Session.get("currentUser")) {
        //   //if there is no user currently logged in, then render the login page
        //   this.render('MTurkLoginPage', {'promptID': this.params.promptID});
        //   //Pause rendering the given page until the user is set
        //   pause();
        // }
        if (this.ready()) {
          logger.debug("Data ready");
          if (Session.get("currentUser")) {
            var user = MyUsers.findOne({_id: this.params.userID});
            LoginManager.loginUser(user.name);
            Session.set("currentUser", user);
          }
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        }
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },
  });

  this.route("Visualization", {
    path: "/vizualization/:promptID/:userID", 
    template: "Visualization",
    waitOn: function() {
      if (Session.get("currentUser")) {
        return [ 
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('prompts'),
          ]
      } else {
        return [
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('prompts'),
        ]
      }
    },
    onBeforeAction: function() {
        console.log("before action");
        // if (!Session.get("currentUser")) {
        //   //if there is no user currently logged in, then render the login page
        //   this.render('MTurkLoginPage', {'promptID': this.params.promptID});
        //   //Pause rendering the given page until the user is set
        //   pause();
        // }
        if (this.ready()) {
          logger.debug("Data ready");
          if (Session.get("currentUser")) {
            var user = MyUsers.findOne({_id: this.params.userID});
            LoginManager.loginUser(user.name);
            Session.set("currentUser", user);
          }
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + this.params.promptID);
          }
          this.next();
        }
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },
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

