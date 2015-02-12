// Configure logger for Tools
var logger = new Logger('landingPage:Routes');
// Comment out to use global logging level
Logger.setLevel('landingPage:Routes', 'trace');
//Logger.setLevel('Client:Routes', 'debug');
//Logger.setLevel('Client:Routes', 'info');
//Logger.setLevel('Client:Routes', 'warn');

//Maps routes to templates
Router.map(function () {
  this.route("landingPageHome", {
      path: '/landingPageHome',
      template: 'LandingPage',
  });
});

Router.configure({
  // the default layout
  layoutTemplate: 'LandingPage',
  yieldTemplates: {
                'landingPageHeader': { to: 'header'},
                'footer': { to: 'footer'}
            }
});


