 // Configure logger for server tests
 var logger = new Logger('Client:Clustering');
 // Comment out to use global logging level
 //Logger.setLevel('Client:Clustering', 'trace');
 //Logger.setLevel('Client:Clustering', 'debug');
 Logger.setLevel('Client:Clustering', 'info');
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
Template.MturkClustering.rendered = function(){
  Session.set("searchQuery","");

  //Set height of elements to viewport height
  //Navbar height=50, header up to idealist = 150, clustering interface header=63
  var height = $(window).height() - 113; 
  var idealistHeader = 150;
  logger.debug("window viewport height = " + height.toString());
  $("#left-clustering").height(height);
  $("#middle-clustering").height(height);
  $("#right-clustering").height(height);
  
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

  $('.cluster-trash-can').droppable({accept: ".cluster",
    tolerance: "pointer",
    drop: function(event, ui) {
      trashCluster(event, ui, this);
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

  FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
  FilterManager.reset("Cluster Filter", Session.get("currentUser"), "clusters");

  FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
  FilterManager.create(clusterFilterName, Session.get("currentUser"), "clusters", "promptID", Session.get("currentPrompt")._id);
  FilterManager.create(clusterFilterName, Session.get("currentUser"), "clusters", "isTrash", false);

  //Setup filters for users and filter update listener
  //updateFilters();
  //Update filters when current group changes
  //Groups.find({_id: Session.get("currentGroup")._id}).observe({
    //changed: function(newDoc, oldDoc) {
      //logger.trace("Current Group has changed");
      ////Setup filters for users and filter update listener
      ////updateFilters();
    //} 
  //});
};

/********************************************************************
* IdeaList template Helpers
********************************************************************/
Template.MturkClusteringIdeaList.helpers({
  ideas : function(){
    
    return getFilteredIdeas();
    // var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
    //   Session.get("currentUser"),   
    //   "ideas").fetch();

    // // apply search query, if it exists
    // var query = Session.get("searchQuery");
    // var queriedIdeas = [];
    // if (query != "") {
    //   queryArr = stringToWords(query);
    //   filteredIdeas.forEach(function(idea){
    //     // console.log(idea);
    //     if (searchQueryMatch(idea,queryArr)) {
    //       // console.log("Matched query");
    //       queriedIdeas.push(idea);
    //     } else {
    //       // console.log("Not matching");
    //       // filteredIdeas.splice(filteredIdeas.indexOf(idea),1);
    //     }
    //   });
    //   // create an array from the query
      
    // } else {
    //   queriedIdeas = filteredIdeas.slice();
    // }

    // var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
    // // console.log(sortedIdeas);
    // return sortedIdeas;
  },

  numIdeas : function(){
    // var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
    //   Session.get("currentUser"),   
    //   "ideas").fetch();

    // // apply search query, if it exists
    // var query = Session.get("searchQuery");
    // var queriedIdeas = [];
    // if (query != "") {
    //   queryArr = stringToWords(query);
    //   filteredIdeas.forEach(function(idea){
    //     // console.log(idea);
    //     if (searchQueryMatch(idea,queryArr)) {
    //       // console.log("Matched query");
    //       queriedIdeas.push(idea);
    //     } else {
    //       // console.log("Not matching");
    //       // filteredIdeas.splice(filteredIdeas.indexOf(idea),1);
    //     }
    //   });
    //   // create an array from the query
      
    // } else {
    //   queriedIdeas = filteredIdeas.slice();
    // }

    // var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
    // // console.log(sortedIdeas);
    // return sortedIdeas.length;
    return getFilteredIdeas().length;
  },
});

/********************************************************************
* ClusterIdeaItem template Helpers
********************************************************************/
Template.MturkClusterIdeaItem.rendered = function() {
  $(this.firstNode).draggable({containment: '.mturk-cluster-interface',
    revert: true,
    zIndex: 50,
    helper: 'clone',
    appendTo: ".mturk-cluster-interface",
    refreshPositions: true,
    start: function(e, ui) {
      logger.debug("Began dragging an idea");
      logger.trace(ui.helper[0]);
      var width = $(this).css('width');
      logger.trace(width);
      $(ui.helper[0]).css('width', width);
    },
  });
  $(this.firstNode).droppable({accept: ".idea-item",
    tolerance: "pointer",
  });
};

Template.MturkClusterIdeaItem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  },
  isNotInCluster: function() {
    return (this.clusterIDs.length === 0) ? true : false;
  },
  hasNotVoted: function() {
    if (isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("User has already voted");
      return false;
    } else {
      logger.debug("User has not voted");
      return true;
    }
  },
  voteNum: function() {
    return this.votes.length;
  },
})

Template.MturkClusterIdeaItem.events({
  'click .up-vote': function(e, elm) {
    if (!isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("voting for idea");
      IdeaFactory.upVote(this, Session.get("currentUser"));
    } else {
      logger.debug("undo voting for idea");
      IdeaFactory.downVote(this, Session.get("currentUser"));
    }
  },

});
/********************************************************************
* ClusterList template Helpers
********************************************************************/
Template.MturkClusterList.helpers({
  clusters : function(){
    return getFilteredClusters(clusterFilterName);
  },
});

Template.MturkClusterList.rendered = function() {
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
Template.MturkClustering.helpers({

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
Template.MturkClustering.events({

  //Collapse clusters and makes them unsortable until expanded
  'click .collapser' : function(){
    EventLogger.logClusterCollapse(this);
    Clusters.update({_id: this._id}, 
      {$set: {isCollapsed: !this.isCollapsed}}
    );
  },

	'click .gamechangestar' : function(){
    EventLogger.logToggleGC(this);
		IdeaFactory.toggleGameChanger(this);
	},
});


/*******************************************************************
 * ******************  ClusterArea Template ************************
 * ****************************************************************/
Template.MturkClusterarea.rendered = function(){
     
}

Template.MturkClusterarea.helpers({
  clusters : function(){
    return getFilteredClusters(clusterFilterName);
    // return Clusters.find({isTrash: {$ne: true}});
  },
});



/*******************************************************************
 * ******************  Cluster Template ************************
 * ****************************************************************/
Template.MturkCluster.events({
  //updates name field in cluster as user types
  'keyup .namecluster' : function(event, template){
    logger.debug(this);
    var clusterName = $(event.target).val();
    logger.debug("new cluster name: " + clusterName);
    var cluster =  ClusterFactory.setName(this, clusterName);
    EventLogger.logChangeClusterName(this, clusterName);
  },
});

Template.MturkCluster.rendered = function(){
  $('.cluster').draggable({
    stop: function() {
      logger.debug("dragged object");
      var id = trimFromString($(this).attr("id"), "cluster-");
      var cluster = ClusterFactory.getWithIDs(id);
      var pos = {'top': parseFloat(trimFromString($(this).css('top'),'px')),
        'left': parseFloat(trimFromString($(this).css('left'),'px'))
      };
      ClusterFactory.updatePosition(cluster, pos);
      EventLogger.logMovedCluster(cluster, pos);
    },
    grid: [5, 5]
  });
  $(this.firstNode).find('.cluster-idea-list').droppable({
    accept: ".idea-item",
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
}

Template.MturkCluster.helpers({
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
    if (source) {
      EventLogger.logIdeaUnclustered(idea, source);
      ClusterFactory.removeIdeaFromCluster(idea, source);
    }
    target = null;
    //ui.item.remove();
  } else if (target.hasClass("clusterul")) {
    logger.info("Moving idea to a cluster");
    var targetID = trimFromString(target.attr('id'), 
        "cluster-list-");
    logger.debug("Adding to cluster with ID: " + targetID);
    target = ClusterFactory.getWithIDs(targetID);
    logger.debug("Cluster: " + JSON.stringify(target));
    EventLogger.logIdeaClustered(idea, source, target);
  } else if (target.hasClass("newcluster")) {
    logger.info("Creating a new cluster for idea");
    target = ClusterFactory.create(null,
      Session.get("currentUser"),
      Session.get("currentPrompt")
    );
    EventLogger.logCreateCluster(idea, source, target);
  } else if (target.hasClass("cluster-item")) {
    logger.info("Inserting idea into cluster using cluster list");
    var clusterID = trimFromString(context.id, 'ci-');
    target = ClusterFactory.getWithIDs(clusterID);
    EventLogger.logIdeaClustered(idea, source, target);
  } else if (target.hasClass('cluster-trash-can')) {
    logger.info("Deleting cluster using droppable trash can");
    logger.trace(target);
    logger.trace(target.attr('id'));
    var targetID = trimFromString(target.attr('id'), 
        "cluster-");
    logger.debug("Adding to cluster with ID: " + targetID);
    target = ClusterFactory.getWithIDs(targetID);
    logger.debug("Cluster: " + JSON.stringify(target));
  }
  if (target !== null) {
    if (source !== null) {
      if (source._id !== target._id) {
        logger.trace("Removing idea from source cluster: " +
          JSON.stringify(source));
        EventLogger.logIdeaRemovedFromCluster(idea, source, target);
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
  var ideators = GroupManager.getUsersInRole(group, 'HcompIdeator');
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

function trashCluster (e, obj) {
  logger.debug("Trashing a cluster");
  logger.trace(e);
  logger.trace(obj.draggable[0]);
  var clusterDiv = obj.draggable[0];
  var clusterID = trimFromString($(clusterDiv).attr('id'), 'cluster-');
  logger.debug("Trashing cluster with ID: " + clusterID);
  ClusterFactory.trash(Clusters.findOne({_id: clusterID}));
};

getFilteredClusters = function(clusterFilterName){
/***************************************************************
* Get filtered clusters for cluster list and cluster area
**************************************************************/  

  var filteredClusters = FilterManager.performQuery(
    clusterFilterName, 
    Session.get("currentUser"), 
    "clusters");
  return filteredClusters;
}
