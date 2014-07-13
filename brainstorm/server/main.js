Meteor.startup(function() {
  /****************************************************************
  * Ensure each screen is inserted into the database
  ****************************************************************/
  //Define all screens manually
  var allScreens = [
    new Screen("Screens Review Page",
               "Review list of all app views",
               "ScreensReviewPage"),
    new Screen("Experiment Admin Page",
               "Experiment admin",
               "ExpAdminPage"),
    new Screen("Login Page",
               "Generic Login Page",
               "LoginPage")
  ];

  //Add screen to db if not already present
  for (var i=0; i<allScreens.length; i++) {
    if (Screens.find({url: allScreens[i].url}).count() == 0) {
      Screens.insert(allScreens[i]);
    }
  }

});

     
Meteor.startup(function() {
    /****************************************************************
    * Setup a simple experiment with 2 conditions for individual 
    * brainstorming
    ****************************************************************/

    //Initialize roles
    if (Roles.find().count() === 0) {
        var ideator = new Role("Ideator");
        ideator.workflow = ["LoginPage",
          "MTurkConsentPage",
          "IdeationPage",
          "SurveyPage",
          "FinalizePage"];
        Roles.insert(ideator);
        ideator = new Role("Forest Synthesizer");
        ideator.workflow = ["LoginPage",
          "Forest"];
        Roles.insert(ideator);
    }
    //Initialize experiment hardcoded on boot
    if (Experiments.find().count() === 0) {
      var question = "Many people have old iPods or MP3 players that they no longer use. In the next 15 minutes, please brainstorm as many uses as you can for old iPods/MP3 players. Assume that the devices' batteries no longer work, though they can be powered via external power sources. Also be aware that devices may <em>not</em> have displays. Be as specific as possible in your descriptions."
      var exp = new Experiment();
      exp.description = "Replicating the effect of priming with common vs rare ideas in individual brainstorming"; 
      exp._id = Experiments.insert(exp);
      var cond1 = new ExpCondition(1,
          exp._id,
          question,
          "individual brainstorming primed with rare ideas",
          30
          );
      GroupManager.addRole(cond1.groupTemplate,
          Roles.findOne({'title': "Ideator"}), 1);
      cond1._id = Conditions.insert(cond1);
      //cond1.groupTemplate.addRole(
          //Roles.findOne({'title': "Ideator"}), 1)
      var cond2 = new ExpCondition(2, 
          exp._id,
          question,
          "individual brainstorming primed with common ideas",
          30
          );
      GroupManager.addRole(cond2.groupTemplate,
          Roles.findOne({'title': "Ideator"}), 1);
      cond2._id = Conditions.insert(cond2);
      //cond2.groupTemplate.addRole(
          //Roles.findOne({'title': "Ideator"}), 1)
      exp.conditions = [cond1, cond2];
      //Each condition has 30 participants
      exp.setNumGroups(30);
      Experiments.update({_id: exp._id},
          {$set: {conditions: exp.conditions}});
      ExperimentManager.initGroupRefs(exp);
      //console.log(Experiments.find().fetch());
    }

    if (Experiments.find().count() === 1) {
      var question = "Many people have old iPods or MP3 players that they no longer use. Please brainstorm 50 uses for old iPods/MP3 players. Assume that the devices' batteries no longer work, though they can be powered via external power sources. Also be aware that devices may <em>not</em> have displays. Be as specific as possible in your descriptions."
      var exp = new Experiment();
      exp.description = "Testing idea forest synthesis"; 
      exp._id = Experiments.insert(exp);
      var cond1 = new ExpCondition(1,
          exp._id,
          question,
          "Synthesizing",
          30
          );
      GroupManager.addRole(cond1.groupTemplate,
          Roles.findOne({'title': "Forest Synthesizer"}), 1);
      cond1._id = Conditions.insert(cond1);
      exp.conditions = [cond1];
      exp.setNumGroups(1);
      Experiments.update({_id: exp._id},
          {$set: {conditions: exp.conditions}});
      ExperimentManager.initGroupRefs(exp);
      //console.log(Experiments.find().fetch());
    }
    if (Experiments.find().count() == 2) {
      var question = "Many people have old iPods or MP3 players that they no longer use. In the next 15 minutes, please brainstorm as many uses as you can for old iPods/MP3 players. Assume that the devices' batteries no longer work, though they can be powered via external power sources. Also be aware that devices may <em>not</em> have displays. Be as specific as possible in your descriptions."
      var exp = new Experiment();
      exp.description = "Replicating the effect of priming with common vs rare ideas in individual brainstorming with revised interface"; 
      exp._id = Experiments.insert(exp);
      var cond1 = new ExpCondition(1,
          exp._id,
          question,
          "individual brainstorming primed with rare ideas",
          30
          );
      GroupManager.addRole(cond1.groupTemplate,
          Roles.findOne({'title': "Ideator"}), 1)
      cond1._id = Conditions.insert(cond1);
      var cond2 = new ExpCondition(2, 
          exp._id,
          question,
          "individual brainstorming primed with common ideas",
          30
          );
      GroupManager.addRole(cond1.groupTemplate,
          Roles.findOne({'title': "Ideator"}), 1)
      cond2._id = Conditions.insert(cond2);
      exp.conditions = [cond1, cond2];
      //Each condition has 30 participants
      exp.setNumGroups(30);
      Experiments.update({_id: exp._id},
          {$set: {conditions: exp.conditions}});
      ExperimentManager.initGroupRefs(exp);
    }
});


Meteor.startup(function() {
    /****************************************************************
    * Ensure basic admin user is in the database
    ****************************************************************/
    var adminName = "ProtoAdmin";
    var adminUsers = Names.find({name: adminName});
    if (adminUsers.count() > 0) {
      if (adminUsers.count() > 1) {
        Names.remove({name: adminName});
        var admin = new User("ProtoAdmin", "admin");
        Names.insert(admin);
      }
    } else {
      var admin = new User("ProtoAdmin", "admin");
      Names.insert(admin);
    }

    if(Clusters.findOne({_id: "-1"})===undefined){
      Clusters.insert(root);
    }
});

Meteor.startup(function() {
  /*****************************************************************
  * Test group manager
  *****************************************************************/
  //Create groupTemplate
  var template = new GroupTemplate();
  template._id = GroupTemplates.insert(template);
  var role1 = Roles.findOne({'title': "Ideator"});
  var role2 = Roles.findOne({'title': "Forest Synthesizer"});
  GroupManager.addRole(template, role1, 3);
  GroupManager.addRole(template, role2, 1);
  var group = new Group(template);
  Groups.insert(group);
  console.log(GroupManager.numOpenSlots(group));
  var user1 = new User("testUser1", "Test User");
  user1._id = Names.insert(user1);
  console.log(GroupManager.addUser(group, user1));
  console.log(GroupManager.numOpenSlots(group));
  console.log(group.isOpen);
  for (var i=0; i<4; i++) {
    var user = new User("testUser" + i, "Test User");
    user._id = Names.insert(user);
    console.log(GroupManager.addUser(group, user1));
    console.log(GroupManager.numOpenSlots(group));
    }
  console.log(group.isOpen);


});


//Meteor.startup(function () {
    //console.log(CryptoJS.SHA256("test"));
    //var crypto = require('crypto');
    //var hash = crypto.createHash("sha224");
    //hash.update("test");
    //var results = hash.digest("hex");
    //console.log(result);
//});

