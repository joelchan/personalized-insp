 // // Configure logger for server tests
 // var logger = new Logger('Client:HcompResults');
 // // Comment out to use global logging level
 // Logger.setLevel('Client:HcompResults', 'trace');
 // //Logger.setLevel('Client:Clustering', 'debug');
 // //Logger.setLevel('Client:Clustering', 'info');
 // //Logger.setLevel('Client:Clustering', 'warn');

/*******************************************************************
 * ***************  HcompResultsPage Template **********************
 * ****************************************************************/
// Name for filters applied to idea list of unclustered ideas
var allIdeasFilterName = "Ideas Filter"; 
var allClustersFilterName = "All Clusters"

/********************************************************************
* Attaches sortable to idea and cluster lists, new cluster area.
********************************************************************/
Template.HcompResultsPage.rendered = function(){

  //Create isInCluster filter
  // FilterManager.create(allIdeasFilterName,
  //     Session.get("currentUser"),
  //     "ideas",
  //     "clusterIDs",
  //     []
  // );
  
  // start with a fresh set of filters
  FilterManager.reset(allIdeasFilterName,
    Session.get("currentUser"),
    "ideas");
  
  FilterManager.create(allIdeasFilterName, 
    Session.get("currentUser"), 
    "ideas", 
    "prompt._id", 
    Session.get("currentPrompt")._id);
  FilterManager.create(allClustersFilterName, 
    Session.get("currentUser"), 
    "clusters", 
    "promptID", 
    Session.get("currentPrompt")._id);
  FilterManager.create(allClustersFilterName, 
    Session.get("currentUser"), 
    "clusters", 
    "isTrash", 
    false);
  Session.set("currentIdeators", []);
  Session.set("currentSynthesizers", []);
  Session.set("searchQuery","");

  //Setup filters for users and filter update listener
  // updateFilters();
  // //Update filters when current group changes
  // Groups.find({_id: Session.get("currentGroup")._id}).observe({
  //   changed: function(newDoc, oldDoc) {
  //     //Setup filters for users and filter update listener
  //     updateFilters();
  //   } 
  // });
};
/********************************************************************
* HcompResultsPage template Helpers
********************************************************************/
Template.HcompResultsPage.helpers({
  promptQuestion : function() {
    var prompt =  Session.get("currentPrompt");
    return prompt.question;
  },
  Clusters : function() {
    // return Clusters.find();
    return getFilteredClusters(allClustersFilterName);
  },
})

/********************************************************************
* themeIdeasList template Helpers
********************************************************************/
Template.themeIdeasList.helpers({
  themeIdeas : function(cluster) {
    var IDs = cluster.ideaIDs;
    return Ideas.find({_id:{$in: IDs}});
  },
  themeName : function(cluster) {
    return cluster.name;
  },
  clusterID : function(cluster) {
    return cluster._id;
  },
  numThemeIdeas : function(cluster) {
    var arrayOfThemeIdeas = Ideas.find({_id:{$in: cluster.ideaIDs}}).fetch();
    return arrayOfThemeIdeas.length;
  },
})
/********************************************************************
* themeIdeasItem template Helpers
********************************************************************/
Template.themeIdeasItem.rendered = function() {
  $(this.firstNode).draggable({containment: 'body',
    revert: true,
    zIndex: 50,
  });
  $(this.firstNode).droppable({accept: ".themeIdea-item",
    tolerance: "pointer",
  });
};

Template.themeIdeasItem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  },
  isNotInCluster: function() {
    return (this.clusterIDs.length === 0) ? true : false;
  },
})
/********************************************************************
* allIdeasList template Helpers
********************************************************************/
Template.allIdeasList.helpers({
  ideas : function(){
    // var allIdeasInBrainstorm = FilterManager.performQuery(allIdeasFilterName, 
    //   Session.get("currentUser"), 
    //   "ideas").fetch();
    // // return filteredIdeas;
    // var sortedAllIdeasInBrainstorm = allIdeasInBrainstorm.sort(function(a,b) { 
    //   return b.time - a.time
    // });
    // return sortedAllIdeasInBrainstorm;
    //return Ideas.find();
    return getFilteredIdeas(allIdeasFilterName);
  },
  numAllIdeas : function(){
    // var arrayOfIdeas = FilterManager.performQuery(allIdeasFilterName, 
    //   Session.get("currentUser"), 
    //   "ideas").fetch();
    // return arrayOfIdeas.length;
    return getFilteredIdeas(allIdeasFilterName).length;
  },
});

/********************************************************************
* allIdeasItem template Helpers
********************************************************************/
Template.allIdeasItem.rendered = function() {
  $(this.firstNode).draggable({containment: 'body',
    revert: true,
    zIndex: 50,
  });
  $(this.firstNode).droppable({accept: ".allIdea-item",
    tolerance: "pointer",
  });
};

Template.allIdeasItem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  },
  isNotInCluster: function() {
    return (this.clusterIDs.length === 0) ? true : false;
  },
})

