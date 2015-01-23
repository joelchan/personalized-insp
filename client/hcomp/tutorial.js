Template.TutorialControl.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});

Template.TutorialTreatment.events({
    'click button.nextPage': function () {
        Router.go(Session.get("nextPage"), 
            {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id});
    },
});