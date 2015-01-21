(function(){// Configure logger for Tools
var logger = new Logger('Client:Login');
// Comment out to use global logging level
Logger.setLevel('Client:Login', 'trace');
//Logger.setLevel('Client:Login', 'debug');
//Logger.setLevel('Client:Login', 'info');
//Logger.setLevel('Client:Login', 'warn');

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
        logger.info("Logging in user with name: " + userName);
        LoginManager.loginUser(userName);
        Router.goToNextPage();

        /********************* Disable experiment logic ************/
        // Quick hack to login to admin interface
        //if (LoginManager.loginAdmin(userName)) {
          //Router.go("ExpAdminPage");
        //} else {
          //var myUser = LoginManager.loginUser(userName);
          ////Perform random assignment
          //var exp = Session.get("currentExp");
          ////Ensure user can participate
          //if (!ExperimentManager.canParticipate(exp, myUser.name)) {
              //console.log("Denied participation")
              //Router.go("NoParticipation");
          //} else {
              //var part = 
                  //ExperimentManager.addExperimentParticipant(exp, myUser);
              ////Go to next page
              //Session.set("currentRole", part.role);
              ////console.log("set role");
              //Session.set("currentParticipant", part);
              ////console.log("set participant and role");
              ////Log login event
              //EventLogger.logParticipantLogin(part);
              ////Testing balance of conditions
              //var x = Experiments.findOne({_id: exp._id});
              //console.log("condition1: " + x.groups[1].length +
                  //" condition2: " + x.groups[2].length);
              //Router.goToNextPage("LoginPage");
          //}
        //}
    /********************* Disable experiment logic ************/
    },
    'keyup input#name': function (evt) {
      if(evt.keyCode==13) {
        //console.log("enter released, clicking continue");
        $('#nextPage').click();
      }
        //$(document).ready(function(){
            //$('#name').keypress(function(e){
              //if(e.keyCode==13) {
                //console.log("enter released, clicking continue");
                //$('#nextPage').click();
              //}
            //});
        //});
    },
});

//Template.LoginPage.rendered = function() {
  //$('#name').keypress(function(e){
              //if(e.keyCode==13) {
                //console.log("enter released, clicking continue");
                //$('#nextPage').click();
              //}
            //};
//};

})();
