
Template.ConsentPage.events({
    'click button.nextPage': function () {
        console.log("**** clicked continue ****");
        //login user
        //var userName = $('input#name').val().trim();
        //var myUser = new User(userName);
        //loginUser(myUser);
        var part = Session.get("currentParticipant")
        Consents.insert(new Consent(part));
        logConsent(part);

        //Go to next page
        Router.goToNextPage("MTurkConsentPage");
    }
});
