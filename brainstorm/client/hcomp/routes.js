// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Routes');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Routes', 'trace');
//Logger.setLevel('Client:Hcomp:Routes', 'debug');
//Logger.setLevel('Client:Hcomp:Routes', 'info');
//Logger.setLevel('Client:Hcomp:Routes', 'warn');

//Maps routes to templates
Router.map(function () {
  /***************************************************************
   * Define custom routes for hcomp pages
   * *************************************************************/
  this.route('CrowdPromptPage', {
      name: 'CrowdPromptPage',
      path: 'crowd/Brainstorms/',
      template: 'CrowdPromptPage',
  });
  this.route('HcompDashboard', {
    path: 'crowd/Dashboard/:promptID',
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
          //Meteor.subscribe('ideas', {userID: {$in: ideatorIDs}}),
          //Meteor.subscribe('clusters', {userID: {$in: synthIDs}}),
          //Meteor.subscribe('events'),
          //Meteor.subscribe('filters'), 
          //Meteor.subscribe('groups')
      ];
    }, 
    onBeforeAction: function() {
      if (!Session.get("currentUser")) {
        //if there is no user currently logged in, then render the login page
        this.render('HcompLoginPage');
        //Pause rendering the given page until the user is set
        pause();
      }
      if (this.ready()) {
        var prompt = Prompts.findOne({_id: this.params.promptID});
        if (prompt) {
          var group = Groups.findOne({_id: prompt.groupIDs[0]})
          console.log("setting current prompt");
          Session.set("currentPrompt", prompt);
          Session.set("currentGroup", group);
          if (prompt.length > 0) {
	          Session.set("sessionLength", prompt.length);	
          } else {
	          Session.set("sessionLength", 10);
          }
        }
      }
    },
    onAfterAction: function() {
      initRolePage();
    }
  });
  this.route('MTurkLoginPage', {
    path: '/crowd/LoginPage/:promptID',
    template: 'MTurkLoginPage',
    waitOn: function() {
      return Meteor.subscribe('prompts', this.params.promptID);
    },
    onBeforeAction: function() {
      console.log("before action");
      if (this.ready()) {
        console.log("Data ready");
        var prompt = Prompts.findOne({_id: this.params.promptID});
        if (prompt) {
          console.log("setting current prompt");
          Session.set("currentPrompt", prompt);
        }
      }
    },
  });
  this.route('MturkIdeation', {
    path: 'crowd/Ideation/:promptID',
  	template: 'MturkIdeationPage',
    waitOn: function() {
      if (Session.get("currentUser")) {
        return Meteor.subscribe('ideas', 
          {userID: Session.get("currentUser")._id});
      } else {
        return Meteor.subscribe('ideas');
      }
    },
    onBeforeAction: function(pause) {
        console.log("before action");
        if (!Session.get("currentUser")) {
          //if there is no user currently logged in, then render the login page
          this.render('MTurkLoginPage', {'promptID': this.params.promptID});
          //Pause rendering the given page until the user is set
          pause();
        }
        if (this.ready()) {
          console.log("Data ready");
          var prompt = Prompts.findOne({_id: this.params._id});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          }
        }
    },
    onAfterAction: function() {
      initRolePage();
    }

  });

  this.route("HcompResultsPage", {
    path: "/results/:promptID", 
    template: "HcompResultsPage",
    waitOn: function() {
      if (Session.get("currentUser")) {
        return Meteor.subscribe('ideas', 
          {userID: Session.get("currentUser")._id});
      } else {
        return Meteor.subscribe('ideas');
      }
    },
    onBeforeAction: function() {
        console.log("before action");
        if (!Session.get("currentUser")) {
          //if there is no user currently logged in, then render the login page
          this.render('MTurkLoginPage', {'promptID': params.promptID});
          //Pause rendering the given page until the user is set
          pause();
        }
        if (this.ready()) {
          console.log("Data ready");
          var prompt = Prompts.findOne({_id: this.params._id});
          if (prompt) {
            Session.set("currentPrompt", prompt);
          }
        }
    },
  });


});

var initRolePage = function() {
  //Add timer
  var prompt = Session.get("currentPrompt");
  if (prompt.length > 0) {
    if ($('.timer').length == 0) {
      Session.set("hasTimer", true);
      var timerTemplate = UI.render(Template.Timer);
      UI.insert(timerTemplate, $('#nav-right')[0]);
      //Setup timer for decrementing onscreen timer with 17 minute timeout
      Session.set("timeLeft", prompt.length + 1);
      $('#time').text(prompt.length);
      Meteor.setTimeout(decrementTimer, 60000);
    }
  }
};

