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
  this.route('HcompDashboard', {
    path: 'crowd/Dashboard',
    template: 'HcompDashboard',
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

  this.route("HcompResultsPage", {
    path: "/HCOMPresults/", 
    template: "HcompResultsPage"
  });

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
};

