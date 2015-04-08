// Configure logger for Filters
var logger = new Logger('Model:Managers:ForestManager');
// Comment out to use global logging level
Logger.setLevel('Model:Managers:ForestManager', 'trace');
// Logger.setLevel('Model:Managers:ForestManager', 'debug');
// Logger.setLevel('Model:Managers:ForestManager', 'info');
// Logger.setLevel('Model:Managers:ForestManager', 'warn');


ForestManager = (function() {
  return {
    createIdeaNode: function(ideas) {
      /**************************************************************
       * Create a idea node which acts as a representation of 
       * semantically equivalent ideas
       *************************************************************/
      var graphID = ideas[0].graphID;
      var promptID = ideas[0].promptID;
      var type = "forest_leaf";
      var ideaIDs = [];
      for (var i=0; i<ideas.length; i++) {
        ideaIDs.push(ideas[i]['_id']);
      }

      data = {'label': "", 
        'idea_node_ids': ideaIDs};
      var idea_node = GraphManager.createGraphNode(graphID, type, data);
      this.groupIdeas(ideas, idea_node);
      return idea_node;
    },
    groupIdeas: function(ideas, idea_node) {
      /*************************************************************
       * Connect the idea instances to the idea node in the forest
       ************************************************************/ 
      var type = "parent_child";
      var ideaIDs = [];
      for (var i=0; i<ideas.length; i++) {
        GraphManager.createEdge(type, idea_node, ideas[i], data);
        ideaIDs.push(ideas[i]['_id']);
      }
      if (Meteor.isServer) {
        Nodes.update({_id: {$in: ideaIDs}},{$set: {is_clustered: true}});
      } else {
        for (var i=0; i<ideas.length; i++) {
          Nodes.update({_id: ideas[i]['_id']},{$set: {is_clustered: true}});
        }
      }
    },
  };
}());


