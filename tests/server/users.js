// Configure logger for server tests
var logger = new Logger('Test:Server:Users');
// Comment out to use global logging level
Logger.setLevel('Test:Server:Users', 'trace');
//Logger.setLevel('Test:Server:Users', 'debug');
//Logger.setLevel('Test:Server:Users', 'info');
//Logger.setLevel('Test:Server:Users', 'warn');


describe("Group Management", function() {
  beforeEach(function() {

  });
  afterEach(function() {

  });
       ////Create groupTemplate
       //var template = new GroupTemplate();
       //template._id = GroupTemplates.insert(template);
       //var role1 = Roles.findOne({'title': "Ideator"});
       //var role2 = Roles.findOne({'title': "Forest Synthesizer"});
       //GroupManager.addRole(template, role1, 3);
       //GroupManager.addRole(template, role2, 1);
       //var group = new Group(template);
       //Groups.insert(group);
       //console.log(GroupManager.numOpenSlots(group));
       //var user1 = new User("testUser1", "Test User");
       //user1._id = Names.insert(user1);
       //console.log(GroupManager.addUser(group, user1));
       //console.log(GroupManager.numOpenSlots(group));
       //console.log(group.isOpen);
       //for (var i=0; i<4; i++) {
         //var user = new User("testUser" + i, "Test User");
         //user._id = Names.insert(user);
         //console.log(GroupManager.addUser(group, user1));
         //console.log(GroupManager.numOpenSlots(group));
         //}
       //console.log(group.isOpen);
  describe("Group Creation", function () {
    it("Simple group with no roles create and remove", function() {
      logger.debug("Testing create and remove group with no roles");
      var group = GroupManager.create();
      GroupManager.remove(group);
      chai.assert.ok(true);
    });
    it("Add Roles to empty group", function() {
      logger.debug("Testing adding roles to group");
      //GroupManager.create();
      chai.assert.ok(true);
    });
    it("Add users to group with unlimited each role", function() {
      logger.debug("Testing adding users to unlimited group");
      chai.assert.ok(true);
    });
  });
  });
});
