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
  // this.route('MTurkLoginPage', {
  // 	path: '/MturkLoginPage/:_id',
  //   template: 'MTurkLoginPage',
  //   waitOn: function() {
  //     return Meteor.subscribe('prompts', this.params._id);
  //   },
  //   onBeforeAction: function() {
  //       console.log("before action");
  //       if (this.ready()) {
  //         console.log("Data ready");
  //         var prompt = Prompts.findOne({_id: this.params._id});
  //         if (prompt) {
  //           Session.set("currentPrompt", prompt);
  //         }
  //       }
  //   },
  //   action: function(){
  //     if(this.ready())
  //       this.render();
  //     else
  //       this.render('loading');
  //   }, 
  // });

  this.route("HcompResultsPage", {
    path: "/HCOMPresults/", 
    template: "HcompResultsPage"
  });
});

