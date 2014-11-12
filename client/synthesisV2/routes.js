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
  this.route('ParallelSynthesis', {
    path: 'crowd/Categorize/:promptID/:userID/',
  	template: 'ParallelClustering',
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

});

