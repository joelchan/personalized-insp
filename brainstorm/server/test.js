 testGroupManager = (function() {
   /*****************************************************************
   * Test group manager
   *****************************************************************/
   return {
     addRole: function() {

     },
     numOpenSlots: function() {

     },
     addUser: function() {

     },
     testAll: function() {
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
     }
   };
 }());


 testExpManager = (function() {
   /*****************************************************************
   * Test Experiment manager
   *****************************************************************/
   return {
     testAll: function () {
       var question = "Test Experiment prompt";
       var exp = new Experiment();
       exp.description = "Testing Experiment Management";
       exp._id = Experiments.insert(exp);
       var cond1 = new ExpCondition(1,
           exp._id,
           question,
           "Test Experiment Condition 1",
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
           "Test Experiment Condition 2",
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
 
       /***** Testing getRandomCondition ******/
       //for (var i=0; i<5; i++) {
         //console.log("************** got condition: *******************");
         //console.log(ExperimentManager.getRandomCondition(exp));
       //}
 
       /***** Testing getExpGroup ******/
       //var cond = ExperimentManager.getRandomCondition(exp);
       //console.log("got assigned condition:" );
       //console.log(cond);
       //console.log("Group IDS:");
       //console.log(exp.groups);
       //console.log(ExperimentManager.getExpGroup(exp, cond));
       //console.log(exp.groups);
       //console.log(ExperimentManager.getExpGroup(exp, cond));
       //console.log(exp.groups);
   
       /***** Testing addExperimentParticipant ******/
       //var user = new User("testUser", "Test User");
       //user._id = Names.insert(user);
       //console.log(ExperimentManager.addExperimentParticipant(exp, user));
       //console.log(ExperimentManager.addExperimentParticipant(exp, user));
   
       /***** Testing canParticipate ******/
       var user = new User("testUser", "Test User");
       user._id = Names.insert(user);
       console.log("can participate?:");
       console.log(ExperimentManager.canParticipate(exp, user.name));
       var part = ExperimentManager.addExperimentParticipant(exp, user);
       console.log(part);
       part.hasFinished = true;
       console.log(part);
       Participants.update({_id: part._id}, {$set: {hasFinished: true}});
       console.log("can participate?:");
       console.log(ExperimentManager.canParticipate(exp, user.name));
     }
   };
 }());

