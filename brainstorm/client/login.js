
/********************************************************************
 * Convenience function for logging in users
 * *****************************************************************/
loginUser = function loginUser(userName) {
  var matches = MyUsers.find({name: userName});
  if (matches.count() > 0) {
    var myUser = matches.fetch()[0]
    Session.set("currentUser", myUser)
  } else {
    myUser = new User(userName, "Experiment Participant");
    myUser._id = MyUsers.insert(myUser);
    Session.set("currentUser", myUser);
  }
  return myUser
};

Template.LoginPage.rendered = function() {
  // Ensure scroll to top of window
  window.scrollTo(0,0);
}

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.LoginPage.events({
    'click button.nextPage': function () {
        //console.log("clicked continue");
        //login user
        var userName = $('input#name').val().trim();
        // Quick hack to login to admin interface
        if (userName == "ProtoAdmin") {
            loginUser(MyUsers.findOne({name: "ProtoAdmin"}));
            console.log("logged in admin User");
            Router.go("ExpAdminPage");
        } else {
            var myUser = loginUser(userName);
            //Perform random assignment
            var exp = $.extend(true, new Experiment(), Session.get("currentExp"));
            //Ensure user can participate
            if (!canParticipate(exp, myUser.name)) {
                console.log("Denied participation")
                Router.go("NoParticipation");
            } else {
                var participant = addExperimentParticipant(exp, myUser);
                //Go to next page
                var role = $.extend(true, new Role(), participant.role);
                Session.set("currentRole", role);
                //console.log("set role");
                Session.set("currentParticipant", participant);
                //console.log("set participant and role");
                //Log login event
                logParticipantLogin(participant);
                Router.goToNextPage("LoginPage");
            }
        }
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
