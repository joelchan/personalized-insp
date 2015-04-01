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
                          condDesc = Conditions.findOne({_id: part.conditionID}).description;
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
                          if (condDesc == "Treatment") {
                              logger.trace("Assigned to treatment condition, sending to treatment tutorial page");
                              Session.set("nextPage", "TutorialTreatment");
                          } else {
                              logger.trace("Assigned to control condition, sending to control tutorial page");
                              Session.set("nextPage", "TutorialControl");
                          }
                        }
                        EventLogger.logConsent();
                        Router.go(Session.get("nextPage"), {partID: part._id});
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


