
//Maps routes to templates
Router.map(function () {
  this.route("Home", {
      path: '/',
      template: 'LoginPage',
  });
  this.route('LoginPage', {
  	path: '/LoginPage/:_id',
    template: 'LoginPage',
    //waitOn: function() {
        //return Meteor.subscribe('experiments', this.params._id);
        //},
    onBeforeAction: function() {
        //console.log("before action");
        //this.subscribe('experiments', this.params._id).wait();
        if (this.data()) {
          //console.log(Experiments.find().fetch().length);
          var x = Experiments.findOne({_id: this.params._id});
          //console.log(x);
          //var role = Roles.findOne({_id: x.groupTemplate.roles[0].role});
          //console.log(role);
          if (x) {
            //console.log("setting experiment session var");
            //x.__proto__ = Experiment.prototype;
            Session.set("currentExp", x);
          }
          //if (role) {
              //role.__proto__ = Role.prototype;
              //console.log("***********************************************");
              //var test = $.extend(true, new Role(), role);
              //console.log("setting role session var");
              //console.log("type of role: " + typeof test);
              //console.log("role: ",  test);
              //test.nextFunc("ConsentPage");
              //Session.set("currentRole", test);
          //}
        }
    },
    data: function() {
      return Experiments.findOne({_id: this.params._id});
    },
  });
  this.route('ScreensPage', {
      path: 'Screens/',
      template: 'ScreensReviewPage'
  });

  this.route('PromptPage');
  this.route('ExpAdminPage', {
      path: 'ExpAdmin/',
      template: 'ExpAdminPage'
  });
  //Defines the beginning of a route for each experiment
  this.route('IdeationPage', {
  	path: 'Ideation/:_id',
  	template: 'IdeationPage',
    data: function() {
      return Experiments.findOne({_id: this.params._id});
    },
    //waitOn: function() {
        //return Meteor.subscribe('ideas');
        //},
    onRun: function() {
      Session.set("currentExp", Experiments.findOne({_id: this.params._id}));
    }
  });
  this.route('CustomConsentPage', {
      path: 'ConsentPage/:_id',
      template: 'ConsentPage'
  });
  this.route('MTurkConsentPage', {
      path: 'ConsentPage/:_id',
      template: 'ConsentPage',
      data: function() {
        return Experiments.findOne({_id: this.params._id});
      }
  });
  this.route('FinalizePage', {
    path: 'FinalizePage/:_id',
    template: 'FinalizePage'
  });
  this.route('SurveyPage', {
    path: 'SurveyPage/:_id',
    template: 'SurveyPage'
  });
  this.route('Clustering', {
    onRun: function(){
      Session.set("currentUser", MyUsers.findOne({_id: "syn"}));
      Session.set("currentFilter",
        Filters.findOne({user: MyUsers.findOne({_id: "syn"})}));
    },
    waitOn: function(){
      return [Meteor.subscribe('notifications'), Meteor.subscribe('filters'), Meteor.subscribe('ideasToProcess')];
    },

    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
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
      Session.set("currentUser", MyUsers.findOne({_id: "db"}));
    },
    waitOn: function() {
        return Meteor.subscribe('events');
    }, 
    action: function(){
      if(this.ready())
        this.render();
      else
        this.render('loading');
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
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen',
  waitOn: function() {
      return [Meteor.subscribe('experiments'), Meteor.subscribe('roles')];
  }
});

Router.goToNextPage = function (currentPage) {
      var role = $.extend(true, new Role(), Session.get("currentRole"));
      Router.go(role.nextFunc(currentPage), 
          {'_id': Session.get("currentExp")._id});
};
