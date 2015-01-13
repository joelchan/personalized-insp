// Configure logger for Filters
var logger = new Logger('Server:SynthesisV2:GraphManagers');
// Comment out to use global logging level
Logger.setLevel('Server:SynthesisV2:GraphManagers', 'trace');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'debug');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'info');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'warn');

Meteor.startup(function() {
  /****************************************************************
   * Setup idea listener to create idea nodes in the shared graph
   * for all ideas in a prompt
   * ************************************************************/
  var ideaNodes = Nodes.find({type: 'idea'});
  var ideaNodeIDs = getValsFromField(ideaNodes, 'ideaID');
  var promptIDs = Pronpts.find({}, {fields: {_id: 1}});
  promptIDs.forEach(function(promptID) {
    var sharedGraph = Graphs.find({'promptID': promptID, userID: ''});
    
    Ideas.find({_id: {$nin: ideaNodeIDs}, 'promptID': promptID}).observe({
      added: function(idea) {
        logger.debug("New Idea added. Adding matching node to graph");
      }
    });
  });

});

Meteor.methods({
  /****************************************************************
   * Graph management functions
   * *************************************************************/
  graphCreate: function(promptID, groupID, userID) {
    /*************************************************************
     * Create a graph
     * **********************************************************/
    console.log("Creating new Graph");
    var graph = new Graph(promptID, groupID, userID);
    graph._id = Graphs.insert(graph);
    return graph._id;
  },
  graphCreateNode: function(graphID, type, metadata) {
    /*************************************************************
     * Create a graph node
     * **********************************************************/
    logger.debug("Creating new Graph Node");
    var node = graphManager.createGraphNode(graphID, type, metadata);
    return node._id;
  },
  graphCreateEdge: function(type, sourceID, targetID, metadata) {
    logger.debug("Creating new Graph edge");
    var g = Graphs.findOne({_id: graphID});
    var edge = new GraphEdge(type, g.promptID, sourceID, targetID, metadata);
    edge._id = Edges.insert(edge);
    return edge._id;
  },
  graphDuplicateShared: function(nodeID, targetGraphID) {
    logger.debug("Duplicate a given node into a graph");
    var targetGraph = Graphs.findOne({_id: targetGraphID});
    var node = Nodes.findOne({_id: nodeID});
    //Check if node is in target graph
    if (!isInList(node._id, targetGraph.nodeIDs)) {
      logger.debug("node was not in graph");
      //Remove fields unique for the node & shared graph
      var fields = removeMember(Object.keys(node), '_id');
      fields = removeMember(fields, 'graphID');
      fields = removeMember(fields, 'type');
      var data = {};
      for (var i=0; i<fields.length; i++) {
        data[fields[i]] = node[fields[i]];
      }
      //Create copy of node in target graph
      var copy = graphManager.createGraphNode(targetGraphID, node.type, data);
      //Create copy edge
      if (!Edges.findOne({$and: [{nodeIDs: node._id},
          {nodeIDs: copy._id}]})) {
        logger.debug("graph_link edge did not exist");
        var g = Graphs.findOne({_id: targetGraphID});
        var metadata = {};
        metadata['sharedNodeID'] = node._id;
        metadata['userNodeID'] = copy._id; 
        var edge = new GraphEdge('graph_link', g.promptID, node._id, copy._id, metadata);
        edge._id = Edges.insert(edge);
      } else {
        logger.debug("graph_link edge exists already");
      }
      return node._id;
    } else {
      logger.warn("Node is already in target graph");
    }
  },
  graphRemoveNodes: function(nodeIDs) {
    var nodes = Nodes.find({_id: {$in: nodeIDs}});
    if (hasForEach(nodes)) {
      nodes.forEach(function(node) {
        Nodes.remove({_id: node._id});
      });
    } else {
      Nodes.remove({_id: nodes._id});
    }
  },
  graphCreateIdeaNode: function(graphID, ideaID, metadata) {
    var idea = Ideas.findOne({_id: ideaID});
    //Only create node if a node for this idea doesn't exist in this graph
    var result = Nodes.findOne({'graphID': graphID,'ideaID': idea._id})
    if (!result) {
      logger.debug("Creating a new node with an idea");
      if (!metadata) {
        metadata = {}
      }
      metadata['ideaID'] = idea._id;
      metadata['content'] = idea.content;
      metadata['time'] = idea.time;
      metadata['vote'] = false;
      metadata['numVotes'] = 0;
      return graphManager.createGraphNode(graphID, 'idea', metadata);
    } else {
      logger.debug("Node already exists for this idea and graph");
      return result._id;
    }
  },
  graphCreateThemeNode: function(graphID, metadata) {
    if (!metadata) {
      metadata = {}
    }
    logger.debug("Creating a theme node");
    if (!metadata['name']) {
      metadata['name'] = "Not named yet";
    }
    metadata['time'] = new Date().getTime();
    metadata['isTrash'] = false;
    metadata['isMerged'] = false;
    var jitterTop = 30 + getRandomInt(0, 30);
    var jitterLeft = getRandomInt(0, 30);
    metadata['position'] = {top: jitterTop , left: jitterLeft};
    metadata['isCollapsed'] = false; //used only for clustering interface
    logger.trace(metadata);
    return graphManager.createGraphNode(graphID, 'theme', metadata);
  },
  graphLinkChild: function(parentGraphID, parentID, childID, metadata) {
    logger.debug("Creating a new parent-child graph edge");
    if (!metadata) {
      metadata = {}
    }
    logger.trace(parentID);
    logger.trace(childID);
    metadata['parentID'] = parentID;
    metadata['childID'] = childID;
    logger.trace(metadata);
    var g = Graphs.findOne({_id: parentGraphID});
    var edge = new GraphEdge('parent_child', g.promptID, parentID, childID, metadata);
    edge._id = Edges.insert(edge);
    return edge._id;
    
  },
  graphUnlinkChild: function(parentID, childID) {
    logger.debug("Deleting parent-child graph edge");
    Edges.remove({type: 'parent_child', 
      'parentID': parentID,
      'childID': childID,
    });
  },
  graphUpdateNodeField: function(nodeID, data) {
    logger.debug("Updated fields for a node");
    var fields = Object.keys(data);
    var node = Nodes.findOne({_id: nodeID});
    for (var i=0; i<fields.length; i++) {
      node[fields[i]] = data[fields[i]];
    }
    Nodes.update({_id: nodeID}, {$set: data});
  },

  graphIdeaListener: function(graphID, userIDs, promptID) {
    //Get user graph
    var userGraph = Graphs.findOne({_id: graphID});
    var nodes = Nodes.find({'graphID': graphID});
    var ideaIDs = getValsFromField(nodes, 'ideaID');
    logger.trace("IdeaIDs already in graph at load time");
    logger.trace(ideaIDs);
    //var currentListener = Session.get("ideaObserver");
    logger.debug("Setting Idea Observer");
    var observer = Ideas.find({$and: [
        {userID: {$in: userIDs}},
        {'promptID': promptID},
        {_id: {$nin: ideaIDs}} ]}).observe({
      added: function(idea) {
        logger.debug("Creating Node for new idea");
        logger.trace("Current graph for node: " + graphID);
        createIdeaNode(idea, userGraph);
      },
    });
  },
  graphNaiveUnion: function(graphID, userID, groupID) {
    logger.debug("Naive Union");
    graphManager.graphUnion(graphID, userID, groupID);
  },
  graphUpdateIdeaVotes: function(nodeID) {
    return graphManager.updateVotes(nodeID);
  }

    
});


/*****************************************************************
 *    Helper Functions
 * ***************************************************************/
graphManager = (function() {
  return {

    createGraphNode: function(graphID, type, metadata) {
      var g = Graphs.findOne({_id: graphID});
      var node = new GraphNode(graphID, g.promptID, type, metadata);
      node._id = Nodes.insert(node);
      Graphs.update({_id: graphID}, {$push: {nodeIDs: node._id}});
      return node;
    },
   
    updateVotes: function (nodeID) {
      logger.debug("Updating votes for node: " + nodeID);
      var ideaNode = Nodes.findOne({_id: nodeID});
      //Quick Hack, needs to eventually match user group
      var count = Nodes.find({type: 'idea', 
        ideaID: ideaNode.ideaID,
        vote: true
      }).count();
      logger.debug("Updating votes on nodes to: " + count);
      Nodes.update({type: 'idea', ideaID: ideaNode.ideaID},
          {$set: {'numVotes': count}},
          {multi: true}
      );
      return count;
    },
   
    getLinkedNodes: function (nodeID) {
      logger.debug("Retrieving list of linked Node IDs");
      //Get shared node
      var shared = Edges.findOne({type: 'graph_link', userNodeID: nodeID});
      if (!shared) {
        logger.debug("Given node is not a user node, looking for shared node");
        shared = Edges.findOne({type: 'graph_link', sharedNodeID: nodeID});
      }
      var links = Edges.find({$and: [{type: 'graph_link'},
          {sharedNodeID: shared.sharedNodeID}
      ]});
      // Filtering edges for nodeIDs
      logger.trace("Num of relevant edges found: " + links.count());
      var linkIDs = getValsFromField(links, 'userNodeID');
      //linkIDs = _.difference(_.uniq(linkIDs), [nodeID]);
      logger.trace("List of linked nodes: " + JSON.stringify(linkIDs));
      return linkIDs;
    },
   
   
    createIdeaNode: function(idea, graph) {
      logger.debug("creating node for idea");
      //Only create node if a node for this idea doesn't exist in this graph
      var result = Nodes.findOne({'graphID': graph._id,'ideaID': idea._id})
      if (!result) {
        logger.debug("Creating a new node with an idea");
        metadata = {};
        metadata['ideaID'] = idea._id;
        metadata['content'] = idea.content;
        metadata['time'] = idea.time;
        metadata['vote'] = false;
        metadata['numVotes'] = 0;
        return createGraphNode(graph._id, 'idea', metadata);
      } else {
        logger.debug("Node already exists for this idea and graph");
        return result._id;
      }
    },
   
    graphUnion: function (graphID, userID, groupID) {
      /******************************************************************
      * Creates a naive union of a given graph using its linked shared 
      * graphs.
      *
      * @params
      *    graphID - The ID of the shared graph
      *    userID - The userID of the user generating the union
      *    groupID - The groupID of the group working on the prompt
      * @return
      *    null
      *****************************************************************/
      var graph = Graphs.findOne({_id: graphID});
      var group = Groups.findOne({_id: groupID});
      var groupUserIDs = getIDs(group.users);
      //Generate Idea Nodes
      logger.debug("Generating Idea Nodes for given graph");
      logger.trace("userIDs: " + JSON.stringify(groupUserIDs));
      var ideaNodes = Nodes.find({type: "idea", 
        promptID: graph.promptID,
        graphID: graphID});
      logger.trace("Num Idea Nodes: " + ideaNodes.count());
      var ideas = Ideas.find({promptID: graph.promptID,
        userID: {$in: groupUserIDs},
        _id: {$nin: getValsFromField(ideaNodes, 'ideaID')}
      });
      logger.trace("Num matching Ideas: " + ideas.count());
      if (ideas) {
        ideas.forEach(function(idea) {
          createIdeaNode(idea, graph);
        });
      }
      //Go through each theme node and attach ideas
      logger.debug("Connect ideas to each node");
      var themeNodes = Nodes.find({type: "theme",
        promptID: graph.promptID,
        graphID: graph._id
      });
      logger.debug("Num of theme nodes graph: " + themeNodes.count());
      themeNodes.forEach(function(theme) {
        logger.debug("Appending linked ideas to theme node id: " + theme._id);
        //Get all linked nodes
        var linkedEdges = Edges.find({type: 'graph_link',
          sharedNodeID: theme._id
        });
        var linkedNodeIDs = getValsFromField(linkedEdges, 'userNodeID');
        //Get all ideas for all linked nodes
        var childEdges = Edges.find({type: 'parent_child',
          parentID: {$in: linkedNodeIDs}
        });
        var ideaNodeIDs = _.uniq(getValsFromField(childEdges, 'childID'));
        var ideaNodes = Nodes.find({_id: {$in: ideaNodeIDs}});
        var ideaIDs = getValsFromField(ideaNodes, 'ideaID');
        //Get matching nodes within current graph for each idea
        var sharedIdeaNodes = Nodes.find({type: "idea",
          graphID: graphID,
          ideaID: {$in: ideaIDs}
        });
        sharedIdeaNodes.forEach(function(ideaNode) {
          logger.debug("Linking ideanode to current theme");
          Meteor.call("graphLinkChild", 
              graphID, theme._id, ideaNode._id, null,
            function(error, newLinkID) {
              logger.debug("Created new Parent/child link");
            }
          );
   
        });
       
      });
    },
  };
}());
   
