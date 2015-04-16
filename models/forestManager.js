// Configure logger for Filters
var logger = new Logger('Model:Managers:ForestManager');
// Comment out to use global logging level
Logger.setLevel('Model:Managers:ForestManager', 'trace');
// Logger.setLevel('Model:Managers:ForestManager', 'debug');
// Logger.setLevel('Model:Managers:ForestManager', 'info');
// Logger.setLevel('Model:Managers:ForestManager', 'warn');


ForestManager = (function() {
  /******************************************************************
   * Manager to assist with data management of data forest graph
   * where there are 2 types of "nodes", idea nodes & idea instances
   ****************************************************************/
  return {
    initForest: function(prompt) {
      var group = Groups.findOne({_id: prompt.groupIDs[0]});
      var user = Session.get("currentUser");
      var type = "data_forest";
      var data = {is_processed: false};
      graphID = GraphManager.createGraph(
          prompt, group, user, type, data
      );
      Prompts.update(
        {_id: prompt._id}, 
        {$set: {forestGraphID: graphID}}
      );
      //Setup root node of the forest
      GraphManager.createGraphNode(graphID, 'root');
    },
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
      var type = "same_ideas";
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
    insertToTree: function(parent, child) {
      var type = "parent_child";
      GraphManager.createEdge(type, parent, child); 
    },
    getInstanceIdeas: function(node, sorter) {
      /*************************************************************
       * Get children ideas of a given idea node
       *************************************************************/
      var childEdges = Edges.find({type: "same_ideas",
        sourceID: node['_id']});
      logger.trace("Found children edges: " + JSON.stringify(childEdges.fetch()));
      var childIDs = getValsFromField(childEdges, 'targetID');
      var children;
      if (sorter) {
        children =  Nodes.find({_id: {$in: childIDs}}, {sort: sorter}).fetch()
      } else {
        children =  Nodes.find({_id: {$in: childIDs}}).fetch()
      }
      logger.trace("Found children nodes: " + JSON.stringify(children));
      return children;
    },
    getNodeChildren: function(node, sorter) {
      /*************************************************************
       * Get children nodes of a given idea node
       *************************************************************/
      var childEdges = Edges.find({type: "parent_child",
        sourceID: node['_id']});
      logger.trace("Found children edges: " + JSON.stringify(childEdges.fetch()));
      var childIDs = getValsFromField(childEdges, 'targetID');
      var children;
      if (sorter) {
        children =  Nodes.find({_id: {$in: childIDs}}, {sort: sorter}).fetch()
      } else {
        children =  Nodes.find({_id: {$in: childIDs}}).fetch()
      }
      logger.trace("Found children nodes: " + JSON.stringify(children));
      return children;
    },
    getNodeName: function(node) {
      /*************************************************************
       * Get the name of the node from the label, and then from
       * the first child instance in an alphabetical sort search, 
       * and then from the first child node (recursive)
       *************************************************************/
      if (node['label'] != undefined) {
        return node['label'];
      } else {
        var instances = this.getInstanceIdeas(node);
        // Use the name of the first idea
        if (instances.length > 0) {

        }
      }

    },
    mergeNodes: function(node1, node2) {
      /*************************************************************
       * Merge the two idea nodes into one node, substituting edges
       * with node2._id with node1._id
       *************************************************************/


    },
    swapNodes: function(node1, node2) {
      /*************************************************************
       * Swap the two idea nodes, substituting edges
       * with node2._id with node1._id and vice-versa
       *************************************************************/

    },
    createArtificialNode: function(nodes) {
      /*************************************************************
       * Create a parent node with no instance children with the
       * given nodes as node children
       *************************************************************/
      
    },

  };
}());


