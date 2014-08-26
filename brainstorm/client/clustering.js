 // Configure logger for server tests
 var logger = new Logger('Client:Clustering');
 // Comment out to use global logging level
 Logger.setLevel('Client:Clustering', 'trace');
 //Logger.setLevel('Client:Clustering', 'debug');
 //Logger.setLevel('Client:Clustering', 'info');
 //Logger.setLevel('Client:Clustering', 'warn');

/*******************************************************************
 * ******************  Clustering Template ************************
 * ****************************************************************/
// Name for filters applied to idea list of unclustered ideas
var ideaFilterName = "Unclustered Ideas"; 
var clusterFilterName = "Clustering droppable";


/********************************************************************
* Attaches sortable to idea and cluster lists, new cluster area.
********************************************************************/
Template.Clustering.rendered = function(){
  //$('.idea-item').draggable({containment: '.clusterinterface',
    //revert: true,
    //zIndex: 50,
  //});
  $('.cluster-idea-list').droppable({accept: ".idea-item",
    tolerance: "pointer",
    drop: function(event, ui) {
      receiveDroppable(event, ui, this);
    }
  });
  $('#new-cluster').droppable({accept: ".idea-item",
    tolerance: "pointer",
    drop: function(event, ui) {
      receiveDroppable(event, ui, this);
    }
  });

  $('.cluster-item').droppable({accept: ".idea-item",
    tolerance: "pointer",
    drop: function(event, ui) {
      receiveDroppable(event, ui, this);
    }
  });

  //Create isInCluster filter
  FilterManager.create(ideaFilterName,
      Session.get("currentUser"),
      "ideas",
      "clusterIDs",
      []
  );
  Session.set("currentIdeators", []);
  Session.set("currentSynthesizers", []);
  //Setup filters for users and filter update listener
  updateFilters();
  //Update filters when current group changes
  Groups.find({_id: Session.get("currentGroup")._id}).observe({
    changed: function(newDoc, oldDoc) {
      //Setup filters for users and filter update listener
      updateFilters();
    } 
  });
};

/********************************************************************
* IdeaList template Helpers
********************************************************************/
Template.IdeaList.helpers({
  ideas : function(){
    var filteredIdeas = FilterManager.performQuery(ideaFilterName, 
      Session.get("currentUser"), 
      "ideas");
    return filteredIdeas;
    //return Ideas.find();
  },
});

/********************************************************************
* ClusterIdeaItem template Helpers
********************************************************************/
Template.ClusterIdeaItem.rendered = function() {
  $(this.firstNode).draggable({containment: '.clusterinterface',
    revert: true,
    zIndex: 50,
  });
  $(this.firstNode).droppable({accept: ".idea-item",
    tolerance: "pointer",
  });
};

Template.ClusterIdeaItem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  },
  isNotInCluster: function() {
    return (this.clusterIDs.length === 0) ? true : false;
  },
})

/********************************************************************
* ClusterList template Helpers
********************************************************************/
Template.ClusterList.helpers({
  clusters : function(){
    var filteredClusters = FilterManager.performQuery(
      clusterFilterName, 
      Session.get("currentUser"), 
      "clusters");
    return filteredClusters;
  },
});

Template.ClusterList.rendered = function() {
  $('.cluster-item').droppable({accept: ".idea-item",
    tolerance: "pointer",
    drop: function(event, ui) {
      receiveDroppable(event, ui, this);
    }
  });
};

/********************************************************************
* Clustering Interface template Helpers
********************************************************************/
Template.Clustering.helpers({

  clustername : function(){
    var clu = Clusters.findOne({_id: this.toString()});
    if(clu === undefined) return false
    return clu.name;
  },
    
  prompt : function(){
    return Session.get("currentPrompt").title;
  },

  numClusters : function(){
    return Clusters.find({isRoot: {$ne: true}}).count();
  },

  numUnnamed : function(){
    var nullNames = ["Not named yet", "", " ", "  ", "   ", undefined];
    return Clusters.find({isRoot: {$ne: true}, name: {$in: nullNames}}).count();
  }
});

/********************************************************************
* Template event functions. Much of the heavy lifting in the interface*
* is done by the mouseover event.
********************************************************************/
Template.Clustering.events({

  //Collapse clusters and makes them unsortable until expanded
  'click .collapser' : function(){
    Clusters.update({_id: this._id}, 
      {$set: {isCollapsed: !this.isCollapsed}}
    );
  },

	'click .gamechangestar' : function(){
		IdeaFactory.toggleGameChanger(this);
	},
});


/*******************************************************************
 * ******************  ClusterArea Template ************************
 * ****************************************************************/
Template.clusterarea.rendered = function(){
     
}

Template.clusterarea.helpers({
  clusters : function(){
    return Clusters.find({isRoot: {$ne: true}});
  },
});



/*******************************************************************
 * ******************  Cluster Template ************************
 * ****************************************************************/
Template.cluster.events({
  //updates name field in cluster as user types
  'keyup .namecluster' : function(event, template){
    logger.debug(this);
    var clusterName = $(event.target).val();
    logger.debug("new cluster name: " + clusterName);
    var cluster =  ClusterFactory.setName(this, clusterName);
  },
});

Template.cluster.rendered = function(){
  $('.cluster').draggable({
    stop: function() {
      logger.debug("dragged object");
      var id = trimFromString($(this).attr("id"), "cluster-");
      var cluster = ClusterFactory.getWithIDs(id);
      var pos = $(this).position();
      ClusterFactory.updatePosition(cluster, pos);
    },
    grid: [5, 5]
  });
  $('.cluster-item').droppable({accept: ".idea-item",
    tolerance: "pointer",
    drop: function(event, ui) {
      receiveDroppable(event, ui, this);
    }
  });
}

Template.cluster.helpers({
  clusterideas : function(){
    // logger.trace("Getting Cluster Ideas");
    var ideaIDs = $(this)[0].ideaIDs;
    var cursor = Ideas.find({_id: {$in: ideaIDs}});
    return cursor
  },

  named : function(){
    if ($(this)[0].name == "Not named yet")
      return 'text-danger';
    else return false
  },


  isCollapsed : function(){
    return $(this)[0].isCollapsed;
  }

});


/********************************************************************
* Creates new cluster, adds it to collection, and updates Ideas list*
********************************************************************/
//function createCluster(item) {
  //var ideaID = item.attr('id');
  //var ideas = [Ideas.findOne({_id: ideaID})];
  //var cluster = new Cluster([ideaID]);//ClusterFactory.create(ideas);
  //var cluster = ClusterFactory.create(ideas);
  ////add jitter to position
  //var jitterTop = 30 + getRandomInt(0, 30);
  //var jitterLeft = getRandomInt(0, 30);
  //cluster.position = {top: jitterTop , left: jitterLeft};
  //var clusterID = Clusters.insert(cluster);
  //updateIdeas(ideaID, true);
  //updateClusterList(ideaID, clusterID, true);
//}


/********************************************************************
* Takes a ui and id of idea being moved. Returns an idea and updates
* the sender.  
********************************************************************/
//function processIdeaSender(ui, ideaID){
  //var myIdea;
  //var senderID = $(ui.sender).attr('id');
  //var sender = Clusters.findOne({_id: senderID});//remove that idea from sending cluster
   // 
  ////find all ideas in clusters idea list with matching id (should be one)>need error check here
  //myIdea = $.grep(sender.ideaIDs, function(idea){
    //return idea === ideaID;
  //})[0];
//
  //Clusters.update({_id: senderID},
    //{$pull:
      //{ideaIDs: ideaID}
  //});
//
  ////if sending cluster now has no ideas, get rid of it
  //var numIdeas = Clusters.findOne({_id: senderID}).ideaIDs.length;
  ////console.log(ideasLength);
  //if(numIdeas === 0){
    //Clusters.remove(senderID);
  //}
  //return senderID;
//}

/********************************************************************
* Convenince function used to update items in the Ideas Collection  *
********************************************************************/
//function updateIdeas(ideaID, inCluster){
  //Ideas.update({_id: ideaID}, 
    //{$set:
      //{inCluster: inCluster}
  //});
//}
//
//function updateClusterList(ideaID, clusterID, adding){
  //if (adding){
    //Ideas.update({_id: ideaID}, 
      //{$addToSet:
        //{clusters: clusterID}
    //});
  //} else {
    //Ideas.update({_id: ideaID}, 
      //{$pull:
        //{clusters: clusterID}
    //});
  //}
//}
var getDroppableSource = function(item) {
  /*****************************************************************
   * Return the Cluster associated with origin of item. Return null 
   * if item is from unsorted list
   *****************************************************************/
  var itemSource = $(item.draggable).parent();
  logger.trace("idea source: ******************************");
  logger.trace(itemSource);
  if (itemSource.hasClass("clusterul")) {
    logger.trace("idea came from cluster");
    var clusterID = trimFromString(itemSource.attr('id'),
        "cluster-list-");
    logger.trace("found cluster with ID: " + clusterID);
    var cluster = ClusterFactory.getWithIDs(clusterID);
    logger.trace(cluster);
    return cluster
  } else {
    return null;
  }
};

getDraggableIdea = function(item) {
  //Called when an unsorted idea is dropped to create a cluster
  logger.trace("Creating new cluster with idea: \n");
  logger.trace(item.draggable[0]);
  var ideaID = trimFromString(item.draggable[0].id,
    "idea-");
  logger.debug("Creating cluster with idea ID: " + ideaID);
  var idea = IdeaFactory.getWithIDs(ideaID);
  logger.debug("Creating cluster with idea: " + 
    JSON.stringify(idea));
  return idea;
};


receiveDroppable = function(event, ui, context) {
  logger.trace("idealist received idea**********************");
  logger.trace(context);
  var idea = getDraggableIdea(ui)
  logger.debug("************* idea *************");
  logger.debug(idea);
  var source = getDroppableSource(ui)
  logger.debug("************* source *************");
  logger.debug(source);
  var target = $(context)
  logger.debug("************* target *************");
  logger.debug(target);
  if (target.hasClass("ideadeck")) {
    logger.info("Removing idea from cluster and unsorting idea");
    ClusterFactory.removeIdeaFromCluster(idea, source);
    target = null;
    ui.item.remove();
  } else if (target.hasClass("clusterul")) {
    logger.info("Moving idea to a cluster");
    var targetID = trimFromString(target.attr('id'), 
        "cluster-list-");
    logger.debug("Adding to cluster with ID: " + targetID);
    target = ClusterFactory.getWithIDs(targetID);
    logger.debug("Cluster: " + JSON.stringify(target));
  } else if (target.hasClass("newcluster")) {
    logger.info("Creating a new cluster for idea");
    target = ClusterFactory.create(null,
      Session.get("currentUser"),
      Session.get("currentPrompt")
    );
  } else if (target.hasClass("cluster-item")) {
    logger.info("Inserting idea into cluster using cluster list");
    var clusterID = trimFromString(context.id, 'ci-');
    target = ClusterFactory.getWithIDs(clusterID);
  }
  if (target !== null) {
    if (source !== null) {
      if (source._id !== target._id) {
        logger.trace("Removing idea from source cluster: " +
          JSON.stringify(source));
        ClusterFactory.removeIdeaFromCluster(idea, source);
        ClusterFactory.insertIdeaToCluster(idea, target);
        //ui.item.remove();
      }
    } else {
      ClusterFactory.insertIdeaToCluster(idea, target);
      //ui.item.remove();
    }
  }
};

updateFilters = function() {
  /***************************************************************
    * Check group ideators and update user filters
    **************************************************************/
  var group = Groups.findOne({_id: Session.get("currentGroup")._id});
  logger.trace("Updating filters for group: " + group);
  var ideators = GroupManager.getUsersInRole(group, 'Ideator');
  logger.trace("current group has ideators: " + 
      JSON.stringify(ideators));
  var prev = Session.get("currentIdeators");
  logger.trace("current ideators stored in session are: " + 
      JSON.stringify(prev));
  var newUsers = [];
  var update = false;
  ideators.forEach(function(user) {
    if (!isInList(user, prev, '_id')) {
      logger.trace("Found new ideator: " + 
        JSON.stringify(user));
      newUsers.push(user);
      update = true;
    }
  });
  var prevCluster = Session.get("currentSynthesizers");
  logger.trace("current synthesizers stored in session are: " + 
      JSON.stringify(prevCluster));
  var newClusterers = [];
  var clusterers = GroupManager.getUsersInRole(group, 'Synthesizer'); 
  clusterers.forEach(function(user) {
    if (!isInList(user, prevCluster, '_id')) {
      logger.trace("Found new clusterer: " + 
        JSON.stringify(user));
      newClusterers.push(user);
      update = true;
    }
  });

  if (update) {
    logger.trace("Updating session variable and filter");
    //Create filter for user
    newUsers.forEach(function(user) {
      logger.debug("Creating new filter for ideator user: " + user.name);
      var newFilter = FilterManager.create(ideaFilterName,
          Session.get("currentUser"),
          "ideas",
          "userID",
          user._id
      );
      prev.push(user);
    });
    newClusterers.forEach(function(user) {
      logger.debug("Creating new filter for cluster user: " + user.name);
      var newFilter = FilterManager.create(clusterFilterName,
          Session.get("currentUser"),
          "clusters",
          "userID",
          user._id
      );
      prevCluster.push(user);
    });
    logger.debug("Setting list of ideators: " + 
        JSON.stringify(prev));
    Session.set("currentIdeators", prev);
    logger.debug("Setting list of synthesizers: " + 
        JSON.stringify(prevCluster));
    Session.set("currentSynthesizers", prevCluster);
 }
};
