// Initialize state machine to login page
Meteor.startup(function () {
  Session.set("currentState", "LoginPage");
  Session.set("currentUser", null);
});

// Defines a state machine using "currentState"
// Controls the site page flow
Template.Brainstorm1.currentPage = function () {
    var currentState =  Session.get('currentState');
    switch(currentState) {
        case "LoginPage":
            return Template.LoginPage;
        case "PromptPage":
            return Template.PromptPage;
        case "IdeatePage":
            return Template.IdeationPage;
        case "TaggingPage":
            return Template.TaggingPage;
        case "JoinIdeasPage":
            return Template.JoinIdeasPage;
        default:
            return Template.IdeationPage;
    }
};


Template.Brainstorm1.loggedIn = function() {
  if (Session.get("currentUser") === null) {
    console.log('no user is logged in');
    return false;
  }
  console.log('user is now logged in');
  var loginState = Session.get("currentUser");
  return true; 
};

/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.Brainstorm1.currentUserName = function() {
  var user = Session.get("currentUser");
  if (user !== null) {
    console.log("checking user's name is: " + user['name']);
    return user['name'];
  } 
};

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.Brainstorm1.events({
    'click button.submitLogin': function () {
        var user = $('#header input#userLogin').val().trim();
        loginUser(user);
        var pswd = "protolab"; //Everyone has the same default password
        var pswd = $('#header input#userPassword').val().trim();
        console.log("logging in " + user);
        Meteor.loginWithPassword({username: user, password: pswd});
        if(Meteor.user() === null) {
          console.log("could not login " + user);
        }
        var currentUser = Accounts.createUser({username: user, password: pswd});
        if (Meteor.user() === null) {
          console.log("did not create user account for " + user);
        }
    },

    'click button.submitLogout': function () {
        console.log("logging out");
        Session.set("currentUser", null);
        Meteor.logout();
    },


});


