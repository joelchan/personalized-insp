
/********************************************************************
 * Convenience function for logging in users
 * *****************************************************************/
loginUser = function loginUser(user) {
  Session.set("currentUser", user);
};

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.LoginPage.events({
    'click button.nextPage': function () {
        console.log("clicked continue");
        //login user
        var userName = $('input#name').val().trim();
        // Quick hack to login to admin interface
        if (userName == "ProtoAdmin") {
            loginUser(Names.findOne({name: "ProtoAdmin"}));
            console.log("logged in admin User");
            Router.go("ExpAdminPage");
        };
        var myUser = new User(userName, "Experiment Participant");
        myUser._id = Names.insert(myUser);
        loginUser(myUser);
        //Perform random assignment
        var exp = $.extend(true, new Experiment(), Session.get("currentExp"));
        var participant = exp.addParticipant(myUser);
        //Go to next page
        var role = $.extend(true, new Role(), participant.role);
        Session.set("currentRole", role);
        console.log("set role");
        Session.set("currentParticipant", participant);
        console.log("set participant and role");
        //Log login event
        logParticipantLogin(participant);
        Router.goToNextPage("LoginPage");
    },
    'keyup input#name': function (evt) {
        $(document).ready(function(){
            $('#name').keypress(function(e){
              if(e.keyCode==13)
              $('#nextPage').click();
            });
        });
    },
});


/********************************************************************
 * Login Page onRender
 * *****************************************************************/
//Template.LoginPage.rendered = function() {
//  Session.get("currentExp");
//};
