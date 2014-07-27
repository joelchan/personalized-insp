/********************************************************************
 * Server behavior tests
 *******************************************************************/
// Configure logger for server tests
var logger = new Logger('Test:Server');
// Comment out to use global logging level
Logger.setLevel('Test:Server', 'trace');

describe("Filtering with FilterManager", function() {
  describe("Filter Creation", function () {
    it("Object creation with collection insertion and removal", function() {
      logger.trace("Testing Filter creation");
      var collection = "ideas";
      var users = UserFactory.getTestUsers(2);
      var result = FilterManager.create(
          "Test Filter", users[0], collection, 'userID', users[1]._id);
      logger.debug("Filter create Result is " + result);
      chai.assert.ok(result, "Created new Filter");
      result = FilterManager.create(
          "Test Filter", users[0], collection, 'userID', users[1]._id, 'gt');
      logger.debug("Second Filter create Result is " + result);
      chai.assert.notOk(result, "Didn't create new Filter");
      // Cleanup created filters and users
      var count = Filters.find({
          name: "Test Filter", 
          user: users[0], 
          collection:collection
          }).count();
      logger.debug("Found " + count + " filters created for this test");
      chai.assert.equal(count, 1);
      FilterManager.remove(
          "Test Filter", users[0], collection, 'userID', users[1]._id);
      var count = Filters.find({
          name: "Test Filter", 
          user: users[0], 
          collection:collection
          }).count();
      logger.debug("Found " + count + " filters after remove");
      chai.assert.equal(count, 0);
      UserFactory.remove(users);
    });
    it("Filter reset", function() {
      logger.trace("Testing Filter Reset");
      var collection = "ideas"; //Arbitrary
      var numUsers = 5;
      var users = UserFactory.getTestUsers(numUsers);
      //Create filters for numUsers-1 users over collection for user by
      //user[0]
      for (var i=0; i<numUsers-1; i++) {
        FilterManager.create(
            "Test Filter", users[0], collection, 'userID', users[i]._id);
      }
      var count = Filters.find({
          name: "Test Filter", 
          user: users[0], 
          collection: collection
      }).count();
      logger.debug("Created " + count + " filters");
      chai.assert.equal(count, numUsers - 1);
      FilterManager.reset(
          "Test Filter", users[0], collection);
      //logger.debug("Filter reset result is " + result);
      //chai.assert.ok(result, "Successfully called reset filters");
      //Check filters are actually removed from Filters collection
      Filters.find
      var count = Filters.find({
          name: "Test Filter", 
          user: users[0], 
          collection: collection
      }).count();
      logger.debug("Found " + count + " matching filters after reset");
      chai.assert.equal(count, 0);
      // Cleanup generated users
      UserFactory.remove(users);
    });
  });

  describe("Filter Retrieval", function () {
    var desc = "Test Filter";
    var collection = "ideas"; //Arbitrary
    var numUsers = 5;
    var users;
    var ideas;
    var clusters;
    var prompt;
    beforeEach(function() {
      logger.trace("Setting up for Filter Retrieval test");
      users = UserFactory.getTestUsers(numUsers);
      //Create filters for numUsers-1 users over collection for query
      //by user[0]
      for (var i=0; i<numUsers-1; i++) {
        FilterManager.create(
            desc, users[0], collection, 'userID', users[i]._id);
      }
      //Create Ideas for dummy cluster
      prompt = new Prompt("Test Prompt");
      ideas = [];
      for (var i=1; i<numUsers; i++) {
        ideas.push(IdeaFactory.create(users[i], prompt, 2));
      }
      //Create filters for clusters over collection for query by
      //user[0]
      for (var i=0; i<numUsers-1; i++) {
        FilterManager.create(
            desc, users[0], collection, 'clusterID', users[i]._id);
      }
    });
    afterEach(function() {
      logger.trace("Cleaning up after Filter Retrieval test");
      FilterManager.reset(
          desc, users[0], collection);
      UserFactory.remove(users);
    });
    it("Simple Retrieving raw filter list", function() {
      logger.trace("Testing Raw Filter List retrieval");
      var count = Filters.find({
          name: desc, 
          user: users[0], 
          collection: collection
      }).count();
      var filters = FilterManager.getFilterList(
          desc, users[0], collection);
      logger.debug("Found " + count + " filters with query");
      logger.debug("Found " + filters.count() + 
          " filters with getFilterList");
      chai.assert.equal(filters.count(), count);
    });
    it("Retrieving mapped filter objects lists", function() {
      logger.trace("Testing Mapped Filter List retrieval");
      

    });
  });

});

describe("Testing Data Factories", function() {
  describe("User Factory", function () {
    it("create & remove", function() {
      logger.trace("Testing creation and removal of new users");
      user = UserFactory.create("TestUser", "Test User");
      logger.debug("Created user: ");
      logger.debug(user);
      var userMatches = MyUsers.find({_id: user._id});
      logger.debug("Found " + userMatches.count() + " matching users");
      chai.assert.equal(userMatches.count(), 1);
      chai.assert.deepEqual(userMatches.fetch()[0], user);
      UserFactory.remove(user);
      userMatches = MyUsers.find({_id: user._id});
      logger.debug("Found " + userMatches.count() + 
          " matching users after remove");
      chai.assert.equal(userMatches.count(), 0);
    });
    it("Create and remove Test Users", function() {
      logger.trace("Testing creation and removal of Test users");
      var numUsers = 5;
      // Proxy code until I find where testUsers are being generated
      var matchUsers = MyUsers.find({type: UserFactory.testType});
      logger.debug("Found " + matchUsers.count() + " test users");
      var numMatch = matchUsers.count();
      var result = numMatch + numUsers;
      // end proxy
      var users = UserFactory.getTestUsers(numUsers);
      logger.debug("Created " + users.length + " test users");
      chai.assert.equal(users.length, 5);
      //Ensure the test users were inserted
      var matchUsers = MyUsers.find({type: UserFactory.testType});
      logger.debug("Found " + matchUsers.count() + " test users");
      chai.assert.equal(matchUsers.count(), result);
      UserFactory.remove(users);
    });
  });
  describe("Idea Factory", function () {
    var users;
    var prompt;
    var numUsers = 2;
    beforeEach(function() {
      logger.trace("Setting up for IdeaFactory Test");
      logger.trace("Creating test users: ");
      users = UserFactory.getTestUsers(numUsers);
      logger.trace("Creating test prompt: ");
      prompt = new Prompt("Test Prompt");
      prompt._id = Prompts.insert(prompt);
    });
    afterEach(function() {
      logger.trace("Cleaning up after IdeaFactory Test");
      logger.trace("Removing test users: ");
      UserFactory.remove(users);
      logger.trace("Remove test prompt: ");
      Prompts.remove({_id: prompt._id});
    });
    it("create & remove", function() {
      logger.trace("Testing creation and removal of new idea");
      var idea = IdeaFactory.create("Test Idea", users[0], prompt);
      logger.debug(idea);
      // Testing Idea insertion into db
      var ideaMatches = Ideas.find({_id: idea._id});
      logger.debug("Found " + ideaMatches.count() + " matching ideas");
      chai.assert.equal(ideaMatches.count(), 1);
      chai.assert.deepEqual(ideaMatches.fetch()[0], idea);
      //Cleanup idea
      logger.trace("Testing Idea removal");
      IdeaFactory.remove(idea);
      ideaMatches = Ideas.find({_id: idea._id});
      logger.debug("Found " + ideaMatches.count() + 
          " matching idea after remove");
      chai.assert.equal(ideaMatches.count(), 0);
    });
    it("create dummy ideas", function() {
      logger.trace("Testing creation of dummy ideas");
      //For one user
      var numIdeas = 3;
      var ideas = IdeaFactory.createDummy(
          users[0], prompt, numIdeas);
      logger.debug("Created " + ideas.length + " dummy ideas");
      chai.assert.equal(ideas.length, numIdeas);
      //Ensure ideas were pushed to db
      var matchIdeas = Ideas.find({userID: users[0]._id});
      logger.debug("Found " + matchIdeas.count() + " dummy ideas in db");
      chai.assert.equal(matchIdeas.count(), ideas.length);
      //Cleanup ideas
      IdeaFactory.remove(ideas);
    });
  });
  describe("Cluster Factory", function () {
    var numUsers = 2;
    var numIdeas = 2;
    var users;
    var prompt;
    var ideas;
    beforeEach(function() {
      logger.trace("Setting up for ClusterFactory Test");
      logger.trace("Creating test users: ");
      users = UserFactory.getTestUsers(numUsers);
      logger.trace("Creating test prompt: ");
      prompt = new Prompt("Test Prompt");
      prompt._id = Prompts.insert(prompt);
      logger.trace("Creating test Ideas: ");
      ideas = [];
      for (var i=0; i< numUsers; i++) {
        ideas.concat(IdeaFactory.createDummy(users[0], numIdeas));
      }

    });
    afterEach(function() {
      logger.trace("Cleaning up after ClusterFactory Test");
      logger.trace("Removing test users: ");
      UserFactory.remove(users);
      logger.trace("Remove test prompt: ");
      Prompts.remove({_id: prompt._id});
      logger.trace("Remove test ideas: ");
      IdeaFactory.remove(ideas);
    });
    it("create & remove", function() {
      logger.trace("Testing creation and removal of new cluster");
      var cluster = ClusterFactory.create(ideas);
      logger.debug(cluster);
      // Testing Cluster insertion into db
      var clusterMatches = Clusters.find({_id: cluster._id});
      logger.debug("Found " + clusterMatches.count() + " matching clusters");
      chai.assert.equal(clusterMatches.count(), 1);
      chai.assert.deepEqual(clusterMatches.fetch()[0], cluster);
      //Cleanup cluster
      logger.trace("Testing Cluster removal");
      ClusterFactory.remove(cluster);
      clusterMatches = Clusters.find({_id: cluster._id});
      logger.debug("Found " + clusterMatches.count() + 
          " matching cluster after remove");
      chai.assert.equal(clusterMatches.count(), 0);
    });
    it("create dummy clusters", function() {
      logger.trace("Testing creation of dummy clusters");
      //For one user
      var numClusters = 3;
      var clusters = ClusterFactory.createDummy(ideas, numClusters);
      logger.debug("Created " + clusters.length + " dummy clusters");
      chai.assert.equal(clusters.length, numClusters);
      //Ensure clusters were pushed to db
      ids = getIDs(clusters);
      var matchClusters = Clusters.find({_id: {$in: ids}});
      logger.debug("Found " + matchClusters.count() + " dummy clusters in db");
      chai.assert.equal(matchClusters.count(), clusters.length);
      //Cleanup clusters
      ClusterFactory.remove(clusters);
    });
  });
});
