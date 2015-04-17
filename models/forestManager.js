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
      GraphManager.createGraphNode(graphID, 'root', 
          {'child_leaf_ids': []}
      );
    },
    createIdeaNode: function(ideas, label) {
      /**************************************************************
       * Create a idea node which acts as a representation of 
       * semantically equivalent ideas
       *************************************************************/
      logger.debug("Creating a new Idea Node");
      var graphID = ideas[0].graphID;
      var promptID = ideas[0].promptID;
      var type = "forest_leaf";
      //var ideaIDs = [];
      //for (var i=0; i<ideas.length; i++) {
        //ideaIDs.push(ideas[i]['_id']);
      //}
      if (typeof label === undefined) {
        label = "";
      }

      data = {'label': label,
        'idea_node_ids': [],
        'child_leaf_ids': []};
      var idea_node = GraphManager.createGraphNode(graphID, type, data);
      if (ideas) {
        if (!hasForEach(ideas)) {
          ideas = [ideas];
        }
        //Connect idea instance to idea node
        this.groupIdeas(ideas, idea_node);
      }

      return Nodes.findOne({_id: idea_node._id});
    },
    groupIdeas: function(ideas, idea_node) {
      /*************************************************************
       * Connect the idea instances to the idea node in the forest
       ************************************************************/ 
      // var type = "same_ideas";
      if (!hasForEach(ideas)) {
        ideas = [ideas];
      }
      if (ideas.length > 0) { 
        logger.debug("connecting idea instances to idea node with id: " +
            idea_node._id);
        var ideaIDs = [];
        for (var i=0; i<ideas.length; i++) {
          // GraphManager.createEdge(type, idea_node, ideas[i], data);
          ideaIDs.push(ideas[i]['_id']);
        }
        logger.trace("Connecting instances with ids: " + JSON.stringify(ideaIDs));
        logger.trace("Before update: " + 
            JSON.stringify(Nodes.findOne({_id: idea_node._id})));
        Nodes.update({_id: idea_node._id}, 
            {$addToSet: {idea_node_ids: {$each: ideaIDs}}});
        logger.trace("After update: " + 
            JSON.stringify(Nodes.findOne({_id: idea_node._id})));
        // Mark idea nodes as clustered
        if (Meteor.isServer) {
          Nodes.update({_id: {$in: ideaIDs}},{$set: {is_clustered: true}});
        } else {
          for (var i=0; i<ideas.length; i++) {
            Nodes.update({_id: ideas[i]['_id']},{$set: {is_clustered: true}});
          }
        }
      }
    },
    insertToTree: function(parent, child) {
      Nodes.update({_id: parent._id}, 
          {$addToSet: {child_leaf_ids: child._id}});
    },
    getInstanceIdeas: function(node, sorter) {
      /*************************************************************
       * Get children ideas of a given idea node
       *************************************************************/
      // var childEdges = Edges.find({type: "same_ideas",
        // sourceID: node['_id']});
      // logger.trace("Found children edges: " + JSON.stringify(childEdges.fetch()));
      // var childIDs = getValsFromField(childEdges, 'targetID');
      var node = Nodes.findOne({_id: node._id});
      var children = []
      if (node.idea_node_ids.length > 0) {
        if (sorter) {
          children =  Nodes.find({_id: {$in: node.idea_node_ids}}, 
              {sort: sorter}
          ).fetch()
        } else {
          children =  Nodes.find({_id: {$in: node.idea_node_ids}}).fetch()
        }
      }
      logger.trace("Found children nodes: " + JSON.stringify(children));
      return children;
    },
    getNodeChildren: function(node, sorter) {
      /*************************************************************
       * Get children nodes of a given idea node
       *************************************************************/
      // var childEdges = Edges.find({type: "parent_child",
        // sourceID: node['_id']});
      // logger.trace("Found children edges: " + JSON.stringify(childEdges.fetch()));
      // var childIDs = getValsFromField(childEdges, 'targetID');
      var node = Nodes.findOne({_id: node._id});
      var children = [];
      if (node.child_leaf_ids.length > 0) {
        if (sorter) {
          children =  Nodes.find({_id: {$in: node.child_leaf_ids}}, 
                {sort: sorter}
          ).fetch()
        } else {
          children =  Nodes.find({_id: {$in: node.child_leaf_ids}}).fetch()
        }
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
      if (node['label'] != undefined && node['label'] != "") {
        return node['label'];
      } else {
        var instances = this.getInstanceIdeas(node);
        // Use the name of the first idea
        if (instances.length > 0) {
          return instances[0]['content']
        } else {
          //recurse on the first node
          var nodes = this.getNodeChildren(node);
          return this.getNodeName(nodes[0]);
        }
      }

    },
    mergeNodes: function(node1, node2) {
      /*************************************************************
       * Merge the two idea nodes into one node, making the commong
       * result share the set of children leafs and ideas, while
       * keeping the label of node1
       *************************************************************/
      //Merge the nodes
      Nodes.update({_id: node1._id}, 
        {$addToSet: {'child_leaf_ids': {$each: node2.child_leaf_ids}},
          $addToSet: {'idea_node_ids': {$each: node2.idea_node_ids}}})
      //Update parents of node2 to point to node1
      if (Meteor.isServer) {
        Nodes.update({'child_leaf_ids': node2._id}, 
            {$push: {child_leaf_ids: node1._id}});
        Nodes.update({'child_leaf_ids': node2._id}, 
            {$pull: {child_leaf_ids: node2._id}});
      } else {
        var parents = Nodes.find({'child_leaf_ids': node2._id}).fetch();
        var pIDs = getValsFromField(parents, '_id');
        for (var i=0; i<pIDs.length; i++) {
          Nodes.update({_id: pIDs[i]}, 
              {$push: {child_leaf_ids: node1._id}});
          Nodes.update({_id: pIDs[i]}, 
              {$pull: {child_leaf_ids: node2._id}});
        }
        
      }

    },
    swapNodes: function(node1, node2) {
      /*************************************************************
       * Swap the two idea nodes, substituting edges
       * with node2._id with node1._id and vice-versa
       *************************************************************/
       node1Children = node1.child_leaf_ids
       node1Ideas = node1.idea_node_ids
       node1Content = node1.content
       node2Children = node2.child_leaf_ids
       node2Ideas = node2.idea_node_ids
       node2Content = node2.content
       //Swap the children and content of the nodes
       Nodes.update({_id: node1._id}, 
          {$set: {'child_leaf_ids': node2Children, 
              'idea_node_ids': node2Ideas,
              'content': node2Content
       }})
       Nodes.update({_id: node2._id}, 
          {$set: {'child_leaf_ids': node1Children, 
              'idea_node_ids': node1Ideas,
              'content': node1Content
       }})

    },
    createArtificialNode: function(node1, node2, label) {
      /*************************************************************
       * Create a parent node with no instance children with the
       * given nodes as node children
       *************************************************************/
      logger.debug("Creating an artificial Idea Node");
      var graphID = node1.graphID;
      var promptID = node1.promptID;
      var type = "forest_leaf";
      if (typeof label === undefined) {
        label = "";
      }

      data = {'label': label,
        'idea_node_ids': [],
        'child_leaf_ids': [node1._id, node1._id]};
      var an = GraphManager.createGraphNode(graphID, type, data);
      //Update parents of node1 to point to the new node 
      if (Meteor.isServer) {
        Nodes.update({'child_leaf_ids': node1._id}, 
          {$push: {child_leaf_ids: an._id}});
        Nodes.update({'child_leaf_ids': node1._id}, 
          {$pull: {child_leaf_ids: node1._id}});
      } else {
        var parents = Nodes.find({'child_leaf_ids': node1._id}).fetch();
        var pIDs = getValsFromField(parents, '_id');
        for (var i=0; i<pIDs.length; i++) {
          Nodes.update({_id: pIDs[i]}, 
            {$push: {child_leaf_ids: an._id}});
          Nodes.update({_id: pIDs[i]}, 
            {$pull: {child_leaf_ids: node1._id}});
        }

      }

      return Nodes.findOne({_id: an._id});
    },

  };
}());
