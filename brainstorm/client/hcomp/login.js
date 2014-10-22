// Configure logger for Tools
var logger = new Logger('Client:Exp:MturkLogin');
// Comment out to use global logging level
Logger.setLevel('Client:Exp:MturkLogin', 'trace');
//Logger.setLevel('Client:Exp:MturkLogin', 'debug');
//Logger.setLevel('Client:Exp:MturkLogin', 'info');
//Logger.setLevel('Client:Exp:MturkLogin', 'warn');

Template.MTurkLoginPage.rendered = function() {
  // Ensure scroll to top of window
  window.scrollTo(0,0);
}

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.MTurkLoginPage.events({
    'click button.nextPage': function () {
        //console.log("clicked continue");
        //login user
        var prompt = Session.get("currentPrompt");
        var userName = $('input#name').val().trim();
        logger.info("Logging in user with name: " + userName);
        LoginManager.loginUser(userName);
        var group = GroupManager.create(prompt.template);
        PromptManager.addGroups(prompt, [group]);
        Session.set("currentPrompt", prompt);
        var role = RoleManager.defaults['MturkIdeator'];
        Session.set("currentRole", role);
        Router.go("MturkIdeation", {promptID: prompt._id});

    /********************* Disable experiment logic ************/
    },
    'keyup input#name': function (evt) {
      if(evt.keyCode==13) {
        //console.log("enter released, clicking continue");
        $('#nextPage').click();
      }
    },
});

Template.HcompLoginPage.rendered = function() {
  // Ensure scroll to top of window
  window.scrollTo(0,0);
}

/********************************************************************
 * Login Page event listeners 
 * *****************************************************************/
Template.HcompLoginPage.events({
    'click button.nextPage': function () {
        //console.log("clicked continue");
        //login user
        var userName = $('input#name').val().trim();
        logger.info("Logging in user with name: " + userName);
        LoginManager.loginUser(userName);
        var role = RoleManager.defaults['HcompFacilitator'];
        Session.set("currentRole", role);
        Router.go("CrowdPromptPage");

    /********************* Disable experiment logic ************/
    },
    'keyup input#name': function (evt) {
      if(evt.keyCode==13) {
        //console.log("enter released, clicking continue");
        $('#nextPage').click();
      }
    },
});
