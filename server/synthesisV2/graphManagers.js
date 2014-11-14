// Configure logger for Filters
var logger = new Logger('Server:SynthesisV2:GraphManagers');
// Comment out to use global logging level
Logger.setLevel('Server:SynthesisV2:GraphManagers', 'trace');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'debug');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'info');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'warn');


Meteor.methods({
  /****************************************************************
   * Graph management functions
   * *************************************************************/
  graphCreate: function(prompt, group, user) {
    /*************************************************************
     * Create a graph
     * **********************************************************/
    logger.debug("Creating new Graph");
    var graph = new Graph(prompt, group, user);
    graph._id = Graphs.insert(graph);
    return Graph;
  },
  graphCreateNode: function(graph, type, metadata) {
    /*************************************************************
     * Create a graph node
     * **********************************************************/
    logger.debug("Creating new Graph Node");
    var node = createGraphNode(graph, type, metadata);
    return node;
  },
  graphCreateEdge: function(graph, source, target, metadata) {
    logger.debug("Creating new Graph edge");
    var edge = new GraphNode(graph, source, target, metadata);
    edge._id = Edges.insert(edge);
    return edge;
  },
  graphDuplicateShared: function(node, targetGraph) {
    logger.debug("Duplicate a given node into a graph");
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
      var copy = createGraphNode(targetGraph, node.type, data);
      //Create copy edge
      if (!Edges.findOne({$and: [{nodeIDs: node._id},
          {nodeIDs: copy._id}]})) {
        logger.debug("graph_link edge did not exist");
        var edge = new GraphEdge('graph_link', node, copy);
        edge._id = Edges.insert(edge);
      } else {
        logger.debug("graph_link edge exists already");
      }
      return node;
    } else {
      logger.warn("Node is already in target graph");
    }
  },
  graphRemoveNodes: function(nodes) {
    if (hasForEach(nodes)) {
      nodes.forEach(function(node) {
        Nodes.remove({_id: node._id});
      });
    } else {
      Nodes.remove({_id: nodes._id});
    }
  },
  graphCreateIdeaNode: function(graph, idea, metadata) {
    //Only create node if a node for this idea doesn't exist in this graph
    var result = Nodes.findOne({'graphID': graph._id,'ideaID': idea._id})
    if (!result) {
      logger.debug("Creating a new node with an idea");
      if (!metadata) {
        metadata = {}
      }
      metadata['ideaID'] = idea._id;
      metadata['content'] = idea.content;
      metadata['time'] = idea.time;
      metadata['vote'] = false;
      return createGraphNode(graph, 'idea', metadata);
    } else {
      logger.debug("Node already exists for this idea and graph");
      return result;
    }
  },
  graphCreateThemeNode: function(graph, metadata) {
    if (!metadata) {
      metadata = {}
    }
    logger.debug("Creating a theme node");
    metadata['name'] = "Not named yet";
    metadata['time'] = new Date().getTime();
    metadata['isTrash'] = false;
    metadata['isMerged'] = false;
    var jitterTop = 30 + getRandomInt(0, 30);
    var jitterLeft = getRandomInt(0, 30);
    metadata['position'] = {top: jitterTop , left: jitterLeft};
    metadata['isCollapsed'] = false; //used only for clustering interface
    logger.trace(metadata);
    return createGraphNode(graph, 'theme', metadata);
  },
  graphLinkChild: function(parent, child, metadata) {
    if (!metadata) {
      metadata = {}
    }
    metadata['parentID'] = parent._id;
    metadata['childID'] = child._id;
    var edge = new GraphEdge('parent_child', parent, child, metadata);
    edge._id = Edges.insert(edge);
    return edge;
    
  },
  graphUpdateNodeField: function(node, data) {
    logger.debug("Updated fields for a node");
    var fields = Object.keys(data);
    for (var i=0; i<fields.length; i++) {
      node[fields[i]] = data[fields[i]];
    }
    Nodes.update({_id: node._id}, {$set: data});
    return node;
  },
    
});


/*****************************************************************
 *    Helper Functions
 * ***************************************************************/

createGraphNode = function(graph, type, metadata) {
  var node = new GraphNode(graph, type, metadata);
  node._id = Nodes.insert(node);
  Graphs.update({_id: graph._id}, {$push: {nodeIDs: node._id}});
  return node;
};



