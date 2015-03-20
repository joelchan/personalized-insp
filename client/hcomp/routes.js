// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Routes');
// Comment out to use global logging level
 // Logger.setLevel('Client:Hcomp:Routes', 'trace');
//Logger.setLevel('Client:Hcomp:Routes', 'debug');
Logger.setLevel('Client:Hcomp:Routes', 'info');
// Logger.setLevel('Client:Hcomp:Routes', 'warn');

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
          Meteor.subscribe('experiments')
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
  this.route('ExpDashboard', {
    path: 'crowd/DashboardExp/:promptID/:userID/:expID',
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
          
          logger.debug("setting current prompt");
          Session.set("currentPrompt", prompt);
          
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
        var exp = Experiments.findOne({_id: this.params.expID});
        if (exp) {
          logger.debug("setting current exp");
          Session.set("currentExp",exp);
          var group = Groups.findOne({_id: exp.groupID})
          Session.set("currentGroup", group);
          // createDefaultIdeasFilter("Ideas Filter");
          // createDefaultIdeasFilter("IdeaWordCloud Filter");
        } else {
          logger.warn("no exp found with id: " + this.params.expID);
        }
        this.next();
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
      }
    }
  });
  this.route('CrowdLoginPage', {
    path: '/crowd/Ideate/Login/:promptID',
    template: 'MturkLoginPage',
    waitOn: function() {
      return [
        Meteor.subscribe('prompts', this.params.promptID)
      ];

    },
    onBeforeAction: function() {
      console.log("before action");
      Session.set("currentUser", null);
      if (this.ready()) {
        logger.debug("Data ready");
        var prompt = Prompts.findOne({_id: this.params.promptID});
        logger.debug("setting current prompt");
        if (prompt) {
        Session.set("currentPrompt", prompt);
        } else {
           logger.warn("no prompt found with id: " + this.params.promptID);
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
      Session.set("nextPage", "CrowdIdeation");
    },
  });
  this.route('MturkLoginPage', {
    // path: '/crowd/Ideate/Login/:promptID',
    path: '/crowd/Ideate/Login/:expID',
    template: 'MturkLoginPage',
    waitOn: function() {
      return [
        Meteor.subscribe('experiments', this.params.expID),
        Meteor.subscribe('prompts', this.params.promptID)
      ];

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
      
    },
  });

  this.route('TutorialControl', {
      path: 'tutorial/ideate/:partID',
      template: 'TutorialControl',
    waitOn: function() {
      var pID = this.params.promptID;
      if (Session.get("currentUser")) {
        return [ 
          Meteor.subscribe('prompts'),
          ]
      } else {
        return [
          Meteor.subscribe('prompts'),
        ]
      }
    },
    onBeforeAction: function(pause) {
        logger.debug("before action for tutorial control");
        if (this.ready()) {
          logger.debug("Data ready");
          var part = Participants.findOne({_id: this.params.partID});
          logger.trace("participant: " + part.userName);
          Session.set("currentParticipant", part);
          var user = MyUsers.findOne({_id: part.userID});
          logger.trace("user: " + user.name);
          // MyUsers.update({_id: user._id}, {$set: {route: 'TutorialControl'}});
          Session.set("currentUser", user);
          var exp = Experiments.findOne({_id: part.experimentID});
          if (exp) {
            logger.trace("Found exp with id: " + part.experimentID)
            Session.set("currentExp", exp);
          } else {
            logger.warn("no experiment found with id: " + part.experimentID);
          }
          var prompt = Prompts.findOne({_id: exp.promptID});
          if (prompt) {
            logger.trace("Found prompt with id: " + exp.promptID);
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + exp.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        Session.set("isTutorialTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        initRolePage();
        insertExitStudy();
      }
      //Session.set("nextPage", "MturkIdeationControl");
    },
  });

  this.route('TutorialTreatment', {
      path: 'tutorial/ideation/:partID',
      template: 'TutorialTreatment',
    waitOn: function() {
      return [
          Meteor.subscribe('experiments'),
      ];
      
    },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        if (this.ready()) {
          logger.debug("Data ready");
          var part = Participants.findOne({_id: this.params.partID});
          logger.trace("participant: " + part.userName);
          Session.set("currentParticipant", part);
          var user = MyUsers.findOne({_id: part.userID});
          logger.trace("user: " + user.name);
          // MyUsers.update({_id: user._id}, {$set: {route: 'TutorialTreatment'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var exp = Experiments.findOne({_id: part.experimentID});
          if (exp) {
            logger.trace("Found exp with id: " + part.experimentID)
            Session.set("currentExp", exp);
          } else {
            logger.warn("no experiment found with id: " + part.experimentID);
          }
          var prompt = Prompts.findOne({_id: exp.promptID});
          if (prompt) {
            logger.trace("Found prompt with id: " + exp.promptID);
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + exp.promptID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        Session.set("isTutorialTimer", true);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
        //Session.set("nextPage", "MturkIdeation");
        if (this.ready()) {
          initRolePage();
          insertExitStudy();
        }
    },
  });
  
  this.route('MturkIdeationControl', {
      path: 'crowd/Ideate/:promptID/:partID',
      template: 'MturkIdeationPageControl',
      subscriptions: function() {
        logger.debug("Waiting on...");
        this.subscribe('ideas', {promptID: this.params.promptID})
        this.subscribe('prompts').wait();
        this.subscribe('experiments').wait();
        this.subscribe('myUsers').wait();
        this.subscribe('assignments').wait();
        this.subscribe('tasks', {promptID: this.params.promptID});
      },

//    path: 'crowd/Ideation/:promptID/:userID/',
//  	template: 'MturkIdeationPage',
    // subscriptions: function() {
      // logger.debug("Waiting on control page...");
      // return [
        // Meteor.subscribe('ideas', {promptID: this.params.promptID}),
        // Meteor.subscribe('prompts'),
        // Meteor.subscribe('experiments'),
        // Meteor.subscribe('myUsers'),
        // Meteor.subscribe('assignments'),
        // Meteor.subscribe('participants'),
      // ];
    // },
    onBeforeAction: function(pause) {
        logger.debug("before action Ideation Control Page");
        //if (!Session.get("currentUser")) {
          ////if there is no user currently logged in, then render the login page
          //this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          ////Pause rendering the given page until the user is set
          //pause();
        //}
        if (this.ready()) {
          logger.debug("Data ready");
          var part = Participants.findOne({_id: this.params.partID});
          Session.set("currentParticipant", part);
          var exp = Experiments.findOne({_id: part.experimentID});
          Session.set("currentExp", exp);
          var pID = exp.promptID;
          var user = MyUsers.findOne({_id: part.userID});
          logger.trace("user: " + user.name);
          // MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeationControl'}});
          // LoginManager.loginUser(user.name);
          logger.trace("Logging in the user");
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: pID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + pID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
        }
    },
    action: function(){
      if(this.ready()) {
        logger.debug("rendering the page");
        Session.set("useTimer", true);
        Session.set("isTutorialTimer", false);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        logger.debug("After rendering the page");
        initRolePage();
        insertExitStudy();
      }
    }

  });
  
  this.route('MturkIdeationTreatment', {
      path: 'crowd/Ideation/:promptID/:partID',
      template: 'MturkIdeationPage',
      subscriptions: function() {
        logger.debug("Waiting on...");
        this.subscribe('ideas', {promptID: this.params.promptID})
        this.subscribe('prompts').wait();
        this.subscribe('experiments').wait();
        this.subscribe('myUsers').wait();
        this.subscribe('assignments').wait();
        this.subscribe('tasks', {promptID: this.params.promptID});
      },
    // waitOn: function() {
      // logger.debug("Waiting on...");
      // // var part = Participants.findOne({_id: this.params.partID});
      // // logger.trace("Participant is: " + JSON.stringify(part));
      // // Session.set("currentParticipant", part);
      // // var exp = Experiments.findOne({_id: part.experimentID})
      // // var pID = exp.promptID;
      // return [
        // Meteor.subscribe('ideas', {promptID: this.params.promptID}),
        // Meteor.subscribe('prompts'),
        // Meteor.subscribe('experiments'),
        // Meteor.subscribe('myUsers'),
        // Meteor.subscribe('assignments'),
        // Meteor.subscribe('tasks', {promptID: this.params.promptID}),
      // ];
    // },
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
          var part = Participants.findOne({_id: this.params.partID});
          Session.set("currentParticipant", part);
          var exp = Experiments.findOne({_id: part.experimentID});
          Session.set("currentExp",exp);
          var pID = exp.promptID;
          var user = MyUsers.findOne({_id: part.userID});
          logger.trace("user: " + user.name);
          // MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeationTreatment'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: pID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          } else {
            logger.warn("no prompt found with id: " + pID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
          this.next();
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        Session.set("isTutorialTimer", false);
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

  this.route('CrowdIdeation', {
      path: 'crowd/Ideations/:promptID/:userID',
      template: 'MturkIdeationPage',
      subscriptions: function() {
        logger.debug("Waiting on...");
        this.subscribe('ideas', {promptID: this.params.promptID})
        this.subscribe('prompts', {_id: this.params.promptID}).wait();
        this.subscribe('assignments').wait();
        this.subscribe('tasks', {promptID: this.params.promptID});
      },
    onBeforeAction: function(pause) {
        logger.debug("before action");
        if (this.ready()) {
          logger.debug("Data ready");
          var user = MyUsers.findOne({_id: this.params.userID});
          logger.trace("user: " + user.name);
          // MyUsers.update({_id: user._id}, {$set: {route: 'MturkIdeationTreatment'}});
          LoginManager.loginUser(user.name);
          Session.set("currentUser", user);
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
            var group = Groups.findOne({_id: prompt.groupIDs[0]});
            Session.set("currentGroup", group);
          } else {
            logger.warn("no prompt found with id: " + pID);
          }
          this.next();
        } else {
          logger.debug("Not ready");
          this.next();
        }
    },
    action: function(){
      if(this.ready()) {
        Session.set("useTimer", true);
        Session.set("isTutorialTimer", false);
        this.render();
      } else
        this.render('loading');
    },
    onAfterAction: function() {
      if (this.ready()) {
        setNextPage("MturkSynthesis", 
          {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id
          }
        );
        initRolePage();
      }
    }

  });
  this.route('SurveyPage', {
    path: 'crowd/survey/:partID/',
    template: 'SurveyPage',
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
          var part = Participants.findOne({_id: this.params.partID});
          Session.set("currentParticipant", part);
          var exp = Experiments.findOne({_id: part.experimentID});
          Session.set("currentExp", exp);
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

  this.route('LegionFinalPage', {
    path: 'crowd/finished/:partID/',
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
          var part = Participants.findOne({_id: this.params.partID});
          Session.set("currentParticipant", part);
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
    Blaze.render(Template.ExitStudy, $('.login')[0]);
  }
  //Add event handler for the exit study button
  $('.exitStudy').click(function() {
    logger.info("exiting study early");
    EventLogger.logExitStudy();
    EventLogger.logEndRole();
    ExperimentManager.logParticipantCompletion(Session.get("currentParticipant"));
    Router.go("LegionFinalPage", {
      'partID': Session.get("currentParticipant")._id
    });
  });
};

var initRolePage = function() {
  /****************************************************************
   * This has local routes.js scope only
   * *************************************************************/
  logger.debug("Initializing a role page");
  //Add timer
  var prompt = Session.get("currentPrompt");
  if (prompt.length > 0) {
    if ($('.timer').length == 0 && Session.get("useTimer")) {
      logger.info("using a timer");
      Session.set("hasTimer", true);
      Blaze.render(Template.Timer, $('#nav-right')[0]);
      //Setup timer for decrementing onscreen timer with 17 minute timeout
    }
    if (Session.get("useTimer")) {
      logger.debug("Checking to Setting timer length");
      logger.trace(Session.get("isDecrementing"));
      if (!Session.get("isDecrementing")) {
        logger.debug("Setting timer length");
        Session.set("timeLeft", prompt.length);
      }
      $('#time').text(prompt.length);
      logger.debug("checking if setting timer decrement");
      logger.trace("Use Timer: " + JSON.stringify(Session.get("useTimer")));
      logger.trace("Tutorial timer: " + JSON.stringify(Session.get("isTutorialTimer")));
      if (!Session.get("isTutorialTimer") && 
          !Session.get("isDecrementing") ){
        logger.debug("************Setting decrement for timer*************");
        Session.set("isDecrementing", true);
        Meteor.setTimeout(decrementTimer, 60000);
      }
    }
  }
};
