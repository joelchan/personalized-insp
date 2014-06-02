
/********************************************************************
 * Convenience function for logging in users
 * *****************************************************************/
LoginUser = function loginUser(user) {
  var users = Names.find({'name': user.userName});
  Session.set("currentUser", user);
  Session.set("currentPrompt", prelimPrompt);
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
        var userName = $('input#name').val().trim();
        var myUser = new User(userName);
        LoginUser(myUser);
        //Go to next page
        Router.go('IdeationPage', {'_id': prelimPrompt._id});
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
