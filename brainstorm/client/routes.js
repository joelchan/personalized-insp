
//Maps routes to templates
Router.map(function () {
  this.route('LoginPage', {
  	path: '/'
  });

  this.route('PromptPage');
  this.route('IdeationPage', {
  	path: 'IdeationPage/:_id',
  	template: 'IdeationPage'
  });
  this.route('TaggingPage', {
    path: 'TaggingPage/:_id',
    template: 'TaggingPage'
  });
  this.route('JoinIdeasPage', {
    path: 'JoinIdeasPage/:_id',
    template: 'JoinIdeasPage'
  });
  this.route('FinalizePage', {
    path: 'FinalizePage/:_id',
    template: 'FinalizePage'
  });
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen'
});
