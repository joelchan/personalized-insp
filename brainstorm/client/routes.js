
//Maps routes to templates
Router.map(function () {
  this.route('LoginPage', {
  	path: '/'
  });

  this.route('PromptPage');
  this.route('IdeationPage', {
  	path: 'IdeationPage/:_id',
  	template: 'IdeationPage'
  	//data: function() {return Prompts.findOne(this.params._id);}
  });
  this.route('TaggingPage');
  this.route('JoinIdeasPage');
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen'
});
