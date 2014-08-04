// Configure logger for Filters
var logger = new Logger('Model:Managers');
// Comment out to use global logging level
//Logger.setLevel('Model:Managers', 'trace');
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
     getTestUser: function() {
       var userName = this.testName;
       return this.create(userName, this.testType);
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
       if (hasForEach(users)) {
        ids = getIDs(users);
        if (Meteor.isServer) {
          MyUsers.remove({"_id": {$in: ids}}); 
        } else {
          ids.forEach(function(id) {
            MyUsers.remove({"_id": id}); 
          });
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
      if (hasForEach(ideas)) {
        ids = getIDs(ideas);
        //for (var i=0; i<ideas.length; i++) {
          //ids.push(ideas._id);
        //} 
        if (Meteor.isServer) {
          Ideas.remove({_id: {$in: ids}});
        } else {
          ids.forEach(function(id) {
            Ideas.remove({_id: id});
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
      cluster.ideaIDs.push(idea._id);
      logger.debug(cluster);
      idea.clusterIDs.push(cluster._id);
      logger.debug(idea);
      //Update the corresponding db entries for each idea and cluster
      Ideas.update({_id: idea._id}, {$push: {'clusterIDs': cluster._id}});
      Clusters.update({_id: cluster._id}, {$push: {'ideaIDs': idea._id}});
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
      logger.debug("Cluster has " + cluster.ideaIDs.length + " ideas");
      removeMember(cluster.ideaIDs, idea._id);
      
      logger.debug("Cluster has " + cluster.ideaIDs.length + " ideas after remove");
      logger.debug("Idea has " + idea.clusterIDs.length + " clusters");
      removeMember(idea.clusterIDs, cluster._id);
      logger.debug("Idea has " + idea.clusterIDs.length + " clusters after remove");
      //Update the corresponding db entries for each idea and cluster
      Ideas.update({_id: idea._id}, 
          {$pull: 
            {clusterIDs: cluster._id}
      });
      Clusters.update({_id: cluster._id},
          {$pull:
            {ideaIDs: idea._id}
      });
    },
    updatePosition: function(cluster, position){
      Clusters.update({_id: cluster._id},
        {$set: {position: position}
      });
      cluster.position = position;
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
      if (hasForEach(clusters)) {
        ids = getIDs(clusters); 
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
