
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
        var myUser = new User(userName);
        myUser._id = Names.insert(myUser);
        console.log(myUser);
        loginUser(myUser);
        //Perform random assignment
        var exp = $.extend(true, new Experiment(), Session.get("currentExp"));
        var participant = exp.addParticipant(myUser);
        //console.log(participant);
        //Session.set("currentRole", par
        //Go to next page
        var role = $.extend(new Role(), participant.role);
        Session.set("currentRole", role);
        Session.set("currentParticipant", participant);
        Router.go(role.nextFunc("LoginPage"), 
          {'_id': Session.get("currentExp")._id});
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
