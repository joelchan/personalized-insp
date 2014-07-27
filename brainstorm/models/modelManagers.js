// Configure logger for Filters
var logger = new Logger('Model:Managers');
// Comment out to use global logging level
Logger.setLevel('Model:Managers', 'info');

UserFactory  = (function() {
   return {
     testusers: [],
     testName: "TestUser",
     testType: "Test User",
     create: function(name, type) {
       if (!type) {
         type = "Anonymous User";
       }
       var user = new User(name, type);
       user._id = MyUsers.insert(user);
       return user;
     },
     getTestUsers: function(num) {
       users = [];
       for (var i=0; i<num; i++) {
         var userName = this.testName + i;
         users.push(this.create(userName, this.testType));
       }
       return users;
     },
     remove: function(users) {
       if (users instanceof Array) {
        ids = [];
        if (Meteor.isServer) {
          for (var i=0; i<users.length; i++) {
            ids.push(users._id);
          } 
          MyUsers.remove({"_id": {$in: ids}}); 
        } else {
          for (var i=0; i<users.length; i++) {
            MyUsers.remove({"_id": users[i]._id}); 
          } 
        }
      } else {
         //users is just a single user object if not an array
         MyUsers.remove({_id: users._id});  
       }
     }, 
   };
 }());

IdeaFactory = (function() {
  return {
    create: function(content, user, prompt) {
      logger.trace("Creating new Idea");
      var idea = new Idea(content, user, prompt);
      idea._id = Ideas.insert(idea);
      return idea;
    },
    createDummy: function(user, prompt, num) {
      if (!num) {
        num = 1;
      }
      logger.trace("Creating Dummy Ideas: #" + num);
      var content = "Test Idea ";
      var ideas = [];
      for (var i=0; i<num; i++) {
        ideas.push(this.create(content, user, prompt));
      }
      return ideas;
    },
    remove: function(ideas) {
      if (ideas instanceof Array) {
        ids = [];
        for (var i=0; i<ideas.length; i++) {
          ids.push(ideas._id);
        } 
        if (Meteor.isServer) {
          Ideas.remove({_id: {$in: ids}});
        } else {
          ideas.forEach(function(idea) {
            Ideas.remove({_id: idea._id});
          });
        }
      } else {
        Ideas.remove({_id: ideas._id});
      }
    }
  };
}());

ClusterFactory = (function() {
  return {
    insertIdeaToCluster: function(idea, cluster) {
      logger.trace("Inserting idea into cluster");
      clusterIdeas = cluster.ideas;
      clusterIdeas.push(idea);
      idea.clusterIDs.push(cluster._id);
      //Update the corresponding db entries for each idea and cluster
      Ideas.update({_id: idea._id}, {$push: {'clusterIDs': cluster._id}});
      Clusters.update({_id: cluster._id}, {$push: {ideas: idea}});
    },
    create: function(ideas) {
      logger.trace("Creating new Cluster");
      var cluster = new Cluster();
      cluster._id = Clusters.insert(cluster);
      var factory = this;
      ideas.forEach(function(idea) {
        logger.trace("Adding idea with id + " + idea._id + " to cluster");
        ClusterFactory.insertIdeaToCluster(idea, cluster);
      });
      return cluster;
    },
    removeIdeaFromCluster: function(idea, cluster) {
      //Not working and tested yet
      logger.trace("Removing idea from cluster");
      logger.debug("Cluster has " + cluster.ideas.length + " ideas");
      removeMember(cluster.ideas, idea);
      logger.debug("Cluster has " + cluster.ideas.length + " ideas after remove");
      //idea.clusterIDs.push(cluster._id);
      //Update the corresponding db entries for each idea and cluster
      //Ideas.update({_id: idea._id}, {$push: {clusterIDs: cluster._id}});
      //Clusters.update({_id: cluster._id}, {$push: {ideas: idea}});
    },
    createDummy: function(ideas, num) {
      if (!num) {
        num = 1;
      }
      logger.trace("Creating Dummy Clusters: #" + num);
      var clusters = [];
      for (var i=0; i<num; i++) {
        clusters.push(this.create(ideas));
      }
      return clusters;
    },
    remove: function(clusters) {
      if (clusters instanceof Array) {
        ids = [];
        for (var i=0; i<clusters.length; i++) {
          ids.push(clusters._id);
        } 
        if (Meteor.isServer) {
          Clusters.remove({_id: {$in: ids}});
        } else {
          clusters.forEach(function(cluster) {
            Clusters.remove({_id: cluster._id});
          });
        }
      } else {
        Clusters.remove({_id: clusters._id});
      }
    }

  };
}());
