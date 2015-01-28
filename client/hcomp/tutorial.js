Template.TutorialControl.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {partID: Session.get("currentParticipant")._id});
    },
});

Template.TutorialTreatment.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {partID: Session.get("currentParticipant")._id});
    },
});