
//Maps routes to templates
Router.map(function () {
  this.route('LoginPage', {
  	path: '/'
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
    onRun: function() {
      var x = Experiments.findOne({_id: this.params._id});
      Session.set("currentExp", x);
    }
  });
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen'
});
