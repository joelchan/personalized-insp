
/********************************************************************
 * Convenience function for logging in users
 * *****************************************************************/
function loginUser(user) {
  var users = Names.find({'name': user['name']});
  Session.set("currentUser", user);
  if (users == null) {
    Names.insert({"name": username});
  }
};

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.LoginPage.events({
    'click button.nextPage': function () {
        //login user
        var user = {'name': $('input#name').val().trim()};
        loginUser(user);
        //Go to next page
        Session.set("currentState", "PromptPage");
    },
});
