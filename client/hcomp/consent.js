//Template.TextPage.helper({
//});

Template.HcompConsentPage.events({
    'click button.nextPage': function () {
        //console.log("**** clicked continue ****");
        //login user
        //var userName = $('input#name').val().trim();
        //var myUser = new User(userName);
        //loginUser(myUser);

        //Go to next page
        Router.go("MturkIdeation", 
          {promptID: Session.get("currentPrompt")._id,
            userID: Session.get("currentUser")._id}
        );
    }
});


