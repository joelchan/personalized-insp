// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Routes');
// Comment out to use global logging level
//Logger.setLevel('Client:Hcomp:Routes', 'trace');
//Logger.setLevel('Client:Hcomp:Routes', 'debug');
Logger.setLevel('Client:Hcomp:Routes', 'info');
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
      return [
          Meteor.subscribe('prompts'),
          Meteor.subscribe('groups'),
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('myUsers'),
          Meteor.subscribe('tasks'),
          Meteor.subscribe('questions'),
          Meteor.subscribe('assignments'),
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
    path: '/crowd/Login/:promptID',
    template: 'MturkLoginPage',
    waitOn: function() {
      return Meteor.subscribe('prompts', this.params.promptID);
    },
    onBeforeAction: function() {
      console.log("before action");
      Session.set("currentUser", null);
      if (this.ready()) {
        logger.debug("Data ready");
        var prompt = Prompts.findOne({_id: this.params.promptID});
        if (prompt) {
          console.log("setting current prompt");
          Session.set("currentPrompt", prompt);
        } else {
          logger.warn("no prompt found with id: " + this.params.promptID);
        }
        this.next();
      }
    },
    action: function() {
      if (this.ready()) {
        var user = Session.get("currentUser");
        UserFactory.setMturkCode(user);
        this.render();
      } else {
        this.render('loading');
      }
    },
  });
  this.route('MturkIdeation', {
    path: 'crowd/Ideation/:promptID/:userID/',
  	template: 'MturkIdeationPage',
    waitOn: function() {
      logger.debug("Waiting on...");
      return [
        Meteor.subscribe('ideas'),
        Meteor.subscribe('prompts'),
        Meteor.subscribe('myUsers'),
        Meteor.subscribe('tasks'),
        Meteor.subscribe('questions'),
        Meteor.subscribe('assignments'),
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
  this.route('MturkSynthesis', {
    path: 'crowd/Categorize/:promptID/:userID/',
  	template: 'MturkClustering',
    waitOn: function() {
      logger.debug("Waiting on...");
      if (Session.get("currentUser")) {
        // return Meteor.subscribe('ideas');
        logger.debug("has current user...");
        return [
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('prompts'),
          Meteor.subscribe('myUsers')
          ];
      } else {
        logger.debug("NO current user...");
        return [
          Meteor.subscribe('ideas'),
          Meteor.subscribe('clusters'),
          Meteor.subscribe('prompts'),
          Meteor.subscribe('myUsers')
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
          console.log("Data ready");
          var prompt = Prompts.findOne({_id: this.params.promptID});
          if (prompt) {
            Session.set("currentPrompt", prompt);
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

