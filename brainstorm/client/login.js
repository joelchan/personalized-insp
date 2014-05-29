
/********************************************************************
 * Convenience function for logging in users
 * *****************************************************************/
LoginUser = function loginUser(user) {
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
        LoginUser(user);
        //Go to next page
        Router.go('PromptPage')
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
