 testFilterFactory = (function() {
   //var filter = FilterFactory.create("Test Filter", user, "ideas");
   return {
     //var user = new User("testUser", "Test User");
     createFilter: function() {
       /**************************************************************
        * Test creation of a filter assuming Filter DB insertion
        *
        * @Params
        *    user - (optional) user associated with the filter
        *    collection - (optional) name of the collection to filter
        ************************************************************/
       var result = false;
       var collection = "ideas";
       var user = TestUserFactory.getTestUsers(1)[0];
       var newFilter = FilterFactory.create(
           "Test Filter", user, collection, 'userID', );
       if (newFilter) {
         //console.log("new filter created");
         var match = Filters.findOne({'name': "Test Filter"});
         if (match) {
           //console.log("filter found in collection");
           result = true;
         }
       }
       // Cleanup created filter and user
       FilterFactory.deleteFilter(newFilter);
       TestUserFactory.removeTestUsers([user]);
       return result;
     },
     basicOpenFilter: function() {
       /**************************************************************
        * Compare filter results from given filter and direct mongo
        * query on ideas collection
        * ***********************************************************/
       var results = false;
       var allIdeas = Ideas.find();
       //console.log("ideas query count: " + allIdeas.length);
       var collection = "ideas";
       var user = TestUserFactory.getTestUsers(1)[0];
       var f = FilterFactory.create(
           "Test Filter", user, collection, );
       filterIdeas = FilterFactory.performQuery(f);
       //For now just check for equal returned counts
       if (filterIdeas.count() == allIdeas.count()) {
         result = true;
       }
       //Cleanup generated users and filters
       TestUserFactory.removeTestUsers([user]);
       FilterFactory.deleteFilter(f);
       return result;
     },
     simpleOneValFilter: function() {
       var results = false;
       var idea1 = Ideas.find().fetch()[0];
       var collection = "ideas";
       var user = TestUserFactory.getTestUsers(1);
       var f = FilterFactory.create(
           "Test Filter", user, collection);
       FilterFactory.addFilter(f, '_id', idea1._id);
       filterIdeas = FilterFactory.performQuery(f);
       //For now just check for equal returned counts
       if (filterIdeas.fetch()[0].content = idea1.content) {
         result = true;
       }
       //Cleanup generated users and filters
       TestUserFactory.removeTestUsers([user]);
       FilterFactory.deleteFilter(f);
       return result;
     },
     inListFilter: function() {
       /**************************************************************
        * Checks use of $in selector in mongo queries.
        *************************************************************/
       var results = false;
       var allIdeas = Ideas.find();//.fetch().slice(0,3);
       if (allIdeas.count() < 4) {
         //Insert 4 test ideas and get all ideas again
       }
       allIdeas = allIdeas.fetch().slice(0,4);
       //Initialize the test filter
       var collection = "ideas";
       var user = TestUserFactory.getTestUsers(1);
       var f = FilterFactory.create(
           "Test Filter", user, collection);
       //Create the list of ID's to filter on
       var ids = []
       for (var i=0; i< allIdeas.length; i++) {
         ids.push(allIdeas[i]._id);
       }
       FilterFactory.addInListFilter(f, '_id', ids);
       filterIdeas = FilterFactory.performQuery(f);
       //Check the results are equal size
       result &= (filterIdeas.count() == allIdeas.length);
       //Match items in each array
       filterIdeas.forEach(function (idea) {
         result &= isInList(idea, allIdeas, '_id');
       });
       //Cleanup generated users and filters
       TestUserFactory.removeTestUsers([user]);
       FilterFactory.deleteFilter(f);
       return result;
     },
     testAll: function() {
         //console.log("test");
       if (this.createFilter()) {
         console.log("filter created test passed");
       } else {
         console.log("filter created test failed");
       }
       if (this.basicOpenFilter()) {
         console.log("Basic filtering with no params test passed");
       } else {
         console.log("Basic filtering with no params test failed");
       }
       if (this.simpleOneValFilter()) {
         console.log("Basic filtering with single value params test passed");
       } else {
         console.log("Basic filtering with single value params test failed");
       }
       if (this.inListFilter()) {
         console.log("Filtering over a list of values test passed");
       } else {
         console.log("Filtering over a list of values test failed");
       }
     }
   };
 }());

UserFactory  = (function() {
   return {
     testusers: [],
     getTestUsers: function(num) {
       users = [];
       for (var i=0; i<num; i++) {
         var user = new User("TestUser" + i, "Test User");
         user._id = MyUsers.insert(user);
         users.push(user)
       }
       return users;
     },
     removeTestUsers: function(users) {
       ids = [];
       for (var i=0; i<users.length; i++) {
         ids.push(users._id);
       } 
       MyUsers.remove({"_id": {$in: ids}}); 
     }, 
   };
 }());

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

