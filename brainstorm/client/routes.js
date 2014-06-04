
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
});

//Sets layout for all routes to IdeaGen template
Router.configure({
	layoutTemplate: 'IdeaGen'
});
