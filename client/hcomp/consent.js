// Configure logger for ExperimentManager
var logger = new Logger('Client:Hcomp:Consent');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Consent', 'trace');
//Logger.setLevel('Managers:Experiment', 'debug');
// Logger.setLevel('Managers:Experiment', 'info');
//Logger.setLevel('Managers:Experiment', 'warn');
//Template.TextPage.helper({
//});

Template.HcompConsentPage.events({
    'click button.nextPage': function () {
        var exp = Session.get("currentExp");
        var user = Session.get("currentUser");
        logger.trace("Checking if participant has participated before");
        if (ExperimentManager.canParticipate(exp, user.name)) {
          logger.trace("Participant is ok, randomly assigning to condition in experiment");
          part = ExperimentManager.addExperimentParticipant(exp, user);
          if (part) {
            logger.trace("Successfully created participant with id " + part._id);
            if (part.cond.description == "Treatment") {
                logger.trace("Assigned to treatment condition, sending to treatment tutorial page");
                Session.set("nextPage", "TutorialTreatment");
            } else {
                logger.trace("Assigned to control condition, sending to control tutorial page");
                Session.set("nextPage", "TutorialControl");
            }
          }
        } else {
          logger.trace("Participant has participated before; rejecting participant");
        }
        //console.log("**** clicked continue ****");
        //login user
        //var userName = $('input#name').val().trim();
        //var myUser = new User(userName);
        //loginUser(myUser);

        //Go to next page
        Router.go(Session.get("nextPage"), 
          {expID: exp._id,
            userID: user._id}
        );
    }
});


