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
        Meteor.call('canParticipate2', exp._id, user.name, 
            function(error, okToParticipate) {
                logger.trace("OK to participate: " + okToParticipate);
                if (okToParticipate) {
                  logger.trace("New participant, randomly assigning to condition in experiment");
                  // part = ExperimentManager.addExperimentParticipant(exp, user);
                  Meteor.call('addParticipant2', exp._id, user._id, 
                    function(error, part) {
                        logger.trace("Result of server addParticipant: " + JSON.stringify(part))
                        if (part) {
                          logger.trace("Successfully created participant with id " + part._id);
                          var group = Groups.findOne({_id: exp.groupID});
                          var role;
                          if (!GroupManager.hasUser(group, user)) {
                            role = RoleManager.defaults['HcompIdeator'];
                            GroupManager.addUser(group, user, role.title);
                          } else {
                            role = GroupManager.getRole(group, user);
                          }
                          Session.set("currentRole", role);
                          Session.set("currentGroup", group);

                          // set the next route based on condition
                          // we grab the first route in the sequence
                          var cond = Conditions.findOne({_id: part.conditionID});
                          Session.set("nextPage", cond.misc.routeSequence[0]);
                          logger.trace("Next page is: " + Session.get("nextPage"));
                          // if (condDesc == "Treatment") {
                          //     logger.trace("Assigned to treatment condition, sending to treatment tutorial page");
                          //     Session.set("nextPage", "TutorialTreatment");
                          // } else {
                          //     logger.trace("Assigned to control condition, sending to control tutorial page");
                          //     Session.set("nextPage", "TutorialControl");
                          // }

                          // assign a subset if it's a synthesis experiment
                          if (exp.isSynthesis) {
                            // need to extend this to deal with cases where the participant has to come back to this page
                            // and hasn't finished the subset. in that case, we want 
                            ExperimentManager.assignSynthSubset(part._id, cond._id);
                          }
                        }
                        EventLogger.logConsent();
                        if (isInList(cond.description, pInspConds)) {
                          Router.go(Session.get("nextPage"), {promptID: cond.promptID, partID: part._id});  
                        } else {
                          Router.go(Session.get("nextPage"), {partID: part._id});  
                        }
                });
              } else {
                logger.trace("Participant has participated before; rejecting participant");
                Router.go('NoParticipation');
              }
          });
          logger.trace("******* After meteor call to canparticipate *******");
          //console.log("**** clicked continue ****");
          //login user
          //var userName = $('input#name').val().trim();
          //var myUser = new User(userName);
          //loginUser(myUser);

          //Go to next page
        
    }
});


