// Configure logger for Tools
var logger = new Logger('Client:Routes');
// Comment out to use global logging level
//Logger.setLevel('Client:Routes', 'trace');
//Logger.setLevel('Client:Routes', 'debug');
Logger.setLevel('Client:Routes', 'info');
//Logger.setLevel('Client:Routes', 'warn');

//Maps routes to templates
Router.map(function () {
  this.route("ChiHome", {
      path: '/Chi',
      template: 'LoginPage',
  });
  this.route("Home", {
      path: '/',
      template: 'HcompLoginPage',

  });
  this.route('PromptPage', {
      path: 'Brainstorms/',
      template: 'PromptPage'
  });
  this.route('GroupPage', {
      path: 'Groups/',
      template: 'GroupPage'
  });
  this.route('RoleSelectPage', {
      path: 'select/',
      template: 'RoleSelectPage'
  });
  this.route('BeginBrainstormPage', {
    path: 'BeginBrainstorm/',
    template: 'BeginBrainstormPage'
  });
  this.route('ExpAdminPage', {
      path: 'ExpAdmin/',
      template: 'ExpAdminPage'
  });
  this.route('Ideation', {
  	path: 'Ideation/',
  	template: 'IdeationPage',
    waitOn: function() {
      if (Session.get("currentUser")) {
        return Meteor.subscribe('ideas', 
          {userID: Session.get("currentUser")._id});
      } else {
        return Meteor.subscribe('ideas');
      }
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },
    onAfterAction: function() {
      initRolePage();
    }

  });
  this.route('CustomConsentPage', {
      //path: 'ConsentPage/:_id',
      path: 'consent/:_id',
      template: 'ConsentPage',
      waitOn: function() {
        return Meteor.subscribe('prompts');
      }
  });
  this.route('MTurkConsentPage', {
      path: 'ConsentPage/:_id',
      template: 'ConsentPage',
  });
  this.route('FinalizePage', {
    path: 'FinalizePage/:_id',
    template: 'FinalizePage'
  });
  this.route('SurveyPage', {
    path: 'SurveyPage/:_id',
    template: 'SurveyPage'
  });
  this.route('IdeationSurvey', {
    path: 'IdeationSurvey/',
    template: 'IdeationSurvey'
  });
  this.route('SynthesisSurvey', {
    path: 'SysnthesisSurvey/',
    template: 'SynthesisSurvey'
  });
  this.route('FacilitatorSurvey', {
    path: 'FacilitatorSurvey/',
    template: 'FacilitatorSurvey'
  });
  this.route('Clustering', {
    onRun: function(){
      //Session.set("currentUser", MyUsers.findOne({_id: "syn"}));
      //Session.set("currentFilter",
        //Filters.findOne({user: MyUsers.findOne({_id: "syn"})}));
    },
    waitOn: function(){
      var group = Session.get("currentGroup");
      console.log(group['assignments']['Ideator']);
      var ideatorIDs = getIDs(group['assignments']['Ideator'])
      var synthIDs = getIDs(group['assignments']['Synthesizer'])
      return [
          Meteor.subscribe('ideas', {userID: {$in: ideatorIDs}}),
          Meteor.subscribe('clusters', {userID: {$in: synthIDs}}),
          Meteor.subscribe('notifications'), 
          Meteor.subscribe('filters'), 
          Meteor.subscribe('groups'),
          ];
    },

    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    }, 
    onAfterAction: function() {
      initRolePage();
    }
  });
  this.route('Forest', {
    path: 'Forest/:_id',
    template: 'Forest',
  });
  this.route('Dashboard', {
    path: 'Dashboard',
    template: 'Dashboard',
    onRun: function() {
      //Session.set("currentUser", MyUsers.findOne({_id: "db"}));
    },
    waitOn: function() {
      var group = Session.get("currentGroup");
      console.log(group['assignments']['Ideator']);
      console.log("************************************************");
      var ideatorIDs = getIDs(group['assignments']['Ideator'])
      var synthIDs = getIDs(group['assignments']['Synthesizer'])
      return [
          Meteor.subscribe('ideas', {userID: {$in: ideatorIDs}}),
          Meteor.subscribe('clusters', {userID: {$in: synthIDs}}),
          Meteor.subscribe('events'),
          Meteor.subscribe('filters'), 
          Meteor.subscribe('groups')
      ];
    }, 
    onBeforeAction: function() {
      var sessionPrompt = Session.get("currentPrompt");
      if (sessionPrompt.length > 0) {
	      Session.set("sessionLength", sessionPrompt.length);	
      } else {
	      Session.set("sessionLength", 30);
      }
      this.next();
    },
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
    },
    onAfterAction: function() {
      initRolePage();
    }
  });
  this.route('filterbox', {
    waitOn: function(){
      return Meteor.subscribe('ideasToProcess');
    }
  });
  this.route('NoParticipation', {
    path: 'participation/', 
    template: 'NoParticipationPage',
  });
  this.route('TestSummary', {
    path: 'test', 
    template: 'TestSummary',
  });
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen',
  waitOn: function() {
      return [Meteor.subscribe('myUsers')];
  },
  onBeforeAction: function(pause) {
    if (!Session.get("currentUser")) {
      //if there is no user currently logged in, then render the login page
      //this.render('LoginPage');
      //Pause rendering the given page until the user is set
      //pause();
      this.next();
    } else {
      this.next();
    }
  },
  action: function(){
    if(this.ready())
      this.render();
    else
      this.render('loading');
  }
});

var initRolePage = function() {
  if ($('.exitStudy').length == 0) {
    var exitStudyBtn = UI.render(Template.ExitStudy);
    UI.insert(exitStudyBtn, $('.login')[0]);
  }
  //Add event handler for the exit study button
  $('.exitStudy').click(function() {
    logger.info("exiting study early");
    EventLogger.logExitStudy();
    EventLogger.logEndRole();
    exitPage();
  });
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
}

Router.goToNextPage = function () {
  var currentPage = Router.current().route.name;
  var role = Session.get("currentRole");
  if (!role) {
    logger.trace("Going to PromptPage");
    Router.go("PromptPage");
  } else {
    logger.trace("Going to: " + JSON.stringify(role.workflow));
    Router.go(RoleManager.getNextFunc(role, currentPage));
  }
};
