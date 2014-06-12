Template.IdeaGen.loggedIn = function() {
  if (!Session.get("currentUser")) {
    console.log('no user is logged in');
    return false;
  } else {
    return true; 
  }
};

/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.IdeaGen.currentUserName = function() {
  return Session.get("currentUser").name;
};

/********************************************************************
 * IdeaGen App event listeners for elements in header
 * *****************************************************************/
var user;


Template.IdeaGen.events({
    'click button.submitLogin': function () {
        var user = {'name': $('#header input#userLogin').val().trim()};
        LoginUser(user);
    },

    'keyup input#userLogin': function (evt) {
        $(document).ready(function(){
            $('#userLogin').keypress(function(e){
              if(e.keyCode==13)
                $('#submitLogin').click();
            });
        });
    },

    'click button.submitLogout': function () {
        console.log("logging out");
        Session.set("currentUser", null);
        Meteor.logout();
    },

});
