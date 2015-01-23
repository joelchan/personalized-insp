//Template.TextPage.helper({
//});

Template.HcompConsentPage.events({
    'click button.nextPage': function () {
        logger.trace("Checking if participant has participated before");
        if (ExperimentManager.canParticipate(exp, user.name)) {
          logger.trace("Participant is ok, randomly assigning to condition in experiment");
          part = ExperimentManager.addExperimentParticipant(exp, user);
          if (part.cond == "treatment") {
            logger.trace("Assigned to treatment condition, sending to treatment tutorial page");
            Session.set("nextPage", "TutorialTreatment");
          } else {
            logger.trace("Assigned to control condition, sending to control tutorial page");
            Session.set("nextPage", "TutorialControl");
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
          {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id}
        );
    }
});


