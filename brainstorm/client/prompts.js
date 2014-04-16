
Template.PromptPage.events({
    'click button.nextPage': function () {
        //Go to next page
        Session.set("currentState", "IdeationPage");
    },
});
