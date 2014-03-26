
Template.JoinIdeasPage.events({
    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "Page1");
    },
})
