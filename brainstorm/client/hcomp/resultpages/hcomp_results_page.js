 // Configure logger for server tests
 var logger = new Logger('Client:HcompResults');
 // Comment out to use global logging level
 Logger.setLevel('Client:HcompResults', 'trace');
 //Logger.setLevel('Client:Clustering', 'debug');
 //Logger.setLevel('Client:Clustering', 'info');
 //Logger.setLevel('Client:Clustering', 'warn');

/*******************************************************************
 * ***************  HcompResultsPage Template **********************
 * ****************************************************************/
// Name for filters applied to idea list of unclustered ideas
var allIdeasFilterName = "All Ideas"; 

/********************************************************************
* Attaches sortable to idea and cluster lists, new cluster area.
********************************************************************/
Template.HcompResultsPage.rendered = function(){

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
* AllIdeasList template Helpers
********************************************************************/
Template.AllIdeasList.helpers({
  ideas : function(){
    var allIdeasInBrainstorm = FilterManager.performQuery(allIdeasFilterName, 
      Session.get("currentUser"), 
      "ideas").fetch();
    // return filteredIdeas;
    var sortedAllIdeasInBrainstorm = allIdeasInBrainstorm.sort(function(a,b) { 
      return b.time - a.time
    });
    return sortedAllIdeasInBrainstorm;
    //return Ideas.find();
  },
});

/********************************************************************
* AllIdeasItem template Helpers
********************************************************************/
Template.AllIdeasItem.rendered = function() {
  $(this.firstNode).draggable({containment: '.clusterinterface',
    revert: true,
    zIndex: 50,
  });
  $(this.firstNode).droppable({accept: ".allIdea-item",
    tolerance: "pointer",
  });
};

Template.AllIdeasItem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  },
  isNotInCluster: function() {
    return (this.clusterIDs.length === 0) ? true : false;
  },
})


