(function(){// Configure logger for Tools
var logger = new Logger('Client:SelectRole');
// Comment out to use global logging level
Logger.setLevel('Client:SelectRole', 'trace');
//Logger.setLevel('Client:SelectRole', 'debug');
//Logger.setLevel('Client:SelectRole', 'info');
//Logger.setLevel('Client:SelectRole', 'warn');


Template.BeginBrainstormPage.rendered = function() {
  logger.trace("rendered begin brainstorm");
  window.scrollTo(0,0);
};


Template.BeginBrainstormPage.events({
  'click button#begin-brainstorm': function(event) {
    logger.debug("Pressed button with id: " + 
      $(event.target).attr('id'));
    Router.goToNextPage();
  }
});






})();
