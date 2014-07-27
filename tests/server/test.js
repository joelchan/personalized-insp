/********************************************************************
 * Server behavior tests
 *******************************************************************/
// Configure logger for server tests
var logger = new Logger('Test:Server');
// Comment out to use global logging level
Logger.setLevel('Test:Server', 'debug');

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
      for (var i=0; i<numUsers; i++) {
        logger.trace("Creating ideas for user: " + users[i].name);
        var newIdeas = IdeaFactory.createDummy(users[i], prompt, numIdeas);
        ideas = ideas.concat(newIdeas)
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
    it("Simple Cluster create & remove", function() {
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
    it("Idea insertion into clusters with updates to db", function() {
      logger.trace("Testing db updates with cluster idea insertion");
      var cluster = ClusterFactory.create(ideas);
      logger.trace("created cluster with " + cluster.ideas.length + " ideas");
      ideas.forEach(function(idea) {
        //Look at clusterIDs and see if it contains cluster._id
        chai.assert.ok(isInList(cluster._id, idea.clusterIDs));
        //Look if idea is in cluster.ideas
        chai.assert.ok(isInList(idea, cluster.ideas, '_id'));
      });
      logger.trace("ideas and clusters given match ID lists");
      var dbIdeas = Ideas.find({_id: {$in: getIDs(ideas)}});
      dbIdeas.forEach(function(idea) {
        //Look at clusterIDs and see if it contains cluster._id
        logger.trace("matching IDs for cluster with id: " + cluster._id);
        logger.debug(idea.clusterIDs);
        chai.assert.ok(isInList(cluster._id, idea.clusterIDs));
        //Look if idea is in cluster.ideas
        logger.trace("matching IDs for idea with id: " + idea._id);
        logger.debug(getIDs(cluster.ideas));
        chai.assert.ok(isInList(idea, cluster.ideas, '_id'));
      });
      logger.trace("ideas from db and cluster given match ID lists");
      var dbCluster = Clusters.findOne({_id: cluster._id});
      ideas.forEach(function(idea) {
        //Look at clusterIDs and see if it contains cluster._id
        chai.assert.ok(isInList(dbCluster._id, idea.clusterIDs));
        //Look if idea is in cluster.ideas
        chai.assert.ok(isInList(idea, dbCluster.ideas, '_id'));
      });
      logger.trace("ideas given and cluster from db match ID lists");
      var dbIdeas = Ideas.find({_id: {$in: getIDs(ideas)}});
      dbIdeas.forEach(function(idea) {
        //Look at clusterIDs and see if it contains cluster._id
        chai.assert.ok(isInList(dbCluster._id, idea.clusterIDs));
        //Look if idea is in cluster.ideas
        chai.assert.ok(isInList(idea, dbCluster.ideas, '_id'));
      });
      logger.trace("ideas and cluster from db match ID lists");
    });
    it("Idea removal from clusters with updates to db", function() {
      logger.trace("Testing db updates with cluster idea removal");
      var cluster = ClusterFactory.create(ideas);
      var idea = ideas[0];
      var numIdeas = cluster.ideas.length;
      ClusterFactory.removeIdeaFromCluster(idea, cluster);
      chai.assert.equal(cluster.ideas.length, numIdeas - 1);
      
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
    var time = {}
    var prompt;
    beforeEach(function() {
      logger.trace("Setting up for Filter Retrieval test");
      users = UserFactory.getTestUsers(numUsers);
      //Create filters for numUsers-1 users over collection for query
      //by user[0]
      for (var i=1; i<numUsers; i++) {
        FilterManager.create(
            desc, users[0], collection, 'userID', users[i]._id);
      }
      //Create Ideas for dummy cluster
      prompt = new Prompt("Test Prompt");
      prompt._id = Prompts.insert(prompt);
      ideas = [];
      for (var i=1; i<numUsers; i++) {
        var newIdeas = IdeaFactory.createDummy(users[i], prompt, 2);
        ideas = ideas.concat(newIdeas);
      }
      //Create Test Clusters
      clusters = ClusterFactory.createDummy(ideas, 5);
      //Create filters for clusters over collection for query by
      //user[0]
      for (var i=0; i<clusters.length; i++) {
        FilterManager.create(
            desc, users[0], collection, 'clusterIDs', clusters[i]._id);
      }
      //Create filters for time
      var now = new Date();
      var past = new Date(now.getTime() - 5*60*1000);
      time = {begin: past, end: now};
      FilterManager.create(
          desc, users[0], collection, 'time', past, 'gt' );
      FilterManager.create(
          desc, users[0], collection, 'time', now, 'lt' );
    });
    afterEach(function() {
      logger.trace("Cleaning up after Filter Retrieval test");
      FilterManager.reset(
          desc, users[0], collection);
      Prompts.remove({_id: prompt._id});
      ClusterFactory.remove(clusters);
      IdeaFactory.remove(ideas);
      UserFactory.remove(users);
    });
    it("Simple Retrieving raw filter list", function() {
      logger.trace("Testing Raw Filter List retrieval");
      var query = Filters.find({
          name: desc, 
          user: users[0], 
          collection: collection
      });
      logger.debug("Found " + query.count() + " filters with query");
      //Check query has expected count
      chai.assert.equal(query.count(), numUsers - 1 + clusters.length + 2);
      var filters = FilterManager.getFilterList(
          desc, users[0], collection);
      logger.debug("Found " + filters.count() + 
          " filters with getFilterList");
      //Check query and raw list result are equal length
      chai.assert.equal(filters.count(), query.count());
      //Check for filter matches
      var foundMatch = false;
      filters.forEach(function(filt) {
        logger.debug("Looking at filter on field: " + filt.field);
        chai.assert.ok(isInList(filt, query, '_id'));
      });
    });
    it("Retrieving mapped filter objects lists", function() {
      logger.trace("Testing Mapped Filter List retrieval");
      var sessVar = 'testFilts';
      var mappedFilters = FilterManager.createMappedFilterList(
          desc, users[0], collection, sessVar);
      //Check for equal users
      users.slice(1).forEach(function(user) {
        logger.debug(mappedFilters['users']);
        chai.assert.ok(isInList(user, mappedFilters['users'], '_id'));  
      });
      //Check for equal clusters
      clusters.forEach(function(cluster) {
        logger.debug(mappedFilters['clusters']);
        chai.assert.ok(isInList(cluster, mappedFilters['clusters'], '_id'));  
      });
      //Check for equal time
      chai.assert.deepEqual(mappedFilters['time']['begin'], time['begin']);
      chai.assert.deepEqual(mappedFilters['time']['end'], time['end']);
      //Check for no misc filters
      chai.assert.isUndefined(mappedFilters['misc'], 
          "Found misc filters where none should be found");
      //Need to check for misc filters if there are misc filters
    });
  });
});
