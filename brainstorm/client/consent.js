
Template.ConsentPage.events({
    'click button.nextPage': function () {
        console.log("**** clicked continue ****");
        //login user
        //var userName = $('input#name').val().trim();
        //var myUser = new User(userName);
        //loginUser(myUser);
        Consents.insert(new Consent(
            Session.get("currentUser"), 
            Session.get("currentExp")
            ));
        //Go to next page
        var role = $.extend(true, new Role(), Session.get("currentRole"));
        Router.go(role.nextFunc("ConsentPage"), 
          {'_id': Session.get("currentExp")._id});
    }
});
