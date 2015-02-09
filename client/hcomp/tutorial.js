// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Tutorial');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Tutorial', 'trace');
//Logger.setLevel('Client:Hcomp:Prompts', 'debug');
//Logger.setLevel('Client:Hcomp:Prompts', 'info');
//Logger.setLevel('Client:Hcomp:Prompts', 'warn');

Template.TutorialControl.rendered = function() {
    // Setup Facilitation push to synthesis listener
    logger.trace("Rendering tutorial control page");
    MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace("oldDoc: " + JSON.stringify(oldDoc));
        logger.trace("newDoc: " + JSON.stringify(newDoc));
        // logger.trace(newDoc.route);
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var partID = Session.get("currentParticipant")._id;
        logger.debug("partID: " + partID);
        Router.go(route, {'partID': partID});
    },
  });    
}

Template.TutorialTreatment.rendered = function() {
    // Setup Facilitation push to synthesis listener
    MyUsers.find({_id: Session.get("currentUser")._id}).observe({
    changed: function(newDoc, oldDoc) {
        logger.info("change to current user detected");
        logger.trace("oldDoc: " + JSON.stringify(oldDoc));
        logger.trace("newDoc: " + JSON.stringify(newDoc));
        var route = newDoc.route;
        logger.debug("Going to page with route: " + route);
        var partID = Session.get("currentParticipant")._id;
        logger.debug("partID: " + partID);
        Router.go(route, {'partID': partID});
    },
  });    
}

Template.TutorialControl.events({
    'click button.nextPage': function () {
        ExperimentManager.logParticipantReady(Session.get("currentParticipant"));
    },
});

Template.TutorialTreatment.events({
    'click button.nextPage': function () {
        ExperimentManager.logParticipantReady(Session.get("currentParticipant"));  
    },
});