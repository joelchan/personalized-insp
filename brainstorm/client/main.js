// Initialize state machine to login page
Meteor.startup(function () {
  /*
  if (!Session.get("currentPrompt")) {
    Session.set("currentState", "PromptPage");
  }
  //Set state if no existing user or app state already is set
  if (!Session.get("currentState")) {
    var user = Session.get("currentUser");
    if (Session.get("currentUser")) {
      Session.set("currentState", "PromptPage");
    } else { 
      Session.set("currentState", "LoginPage");
      Session.set("currentUser", null);
    }
  }*/
      //Session.set("currentState", "LoginPage");
  /*if (!Session.get("currentState")) {
    var user = Session.get("currentUser");
    if (Session.get("currentUser") !== "") {
      Session.set("currentState", "PromptPage");
    } else { 
      Session.set("currentState", "LoginPage");
      Session.set("currentUser", null);
    }
  } */
});

// Defines a state machine using "currentState"
// Controls the site page flow
/*Template.IdeaGen.currentPage = function () {
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
};*/


Template.IdeaGen.loggedIn = function() {
  if (Session.get("currentUser") === null) {
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
  if (Session.get("currentUser")) {
    return Session.get("currentUser").userName;
  }
};

/********************************************************************
 * IdeaGen App event listeners 
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
