// Configure logger for Tools
var logger = new Logger('Models:Graphs');
// Comment out to use global logging level
Logger.setLevel('Models:Graphs', 'trace');
//Logger.setLevel('Models:Graphs', 'debug');
//Logger.setLevel('Models:Graphs', 'info');
//Logger.setLevel('Models:Graphs', 'warn');

Graphs = new Mongo.Collection("graphs");
Nodes = new Mongo.Collection("nodes");
Edges = new Mongo.Collection("edges");


/* list of minimum required fields for a given node type */
NODE_TYPES = {
  'ideas': ['ideaID', 'content', 'time', 'vote'],
  'theme': ['name', 'time', 'isTrash', 'isMerged', 
      'position', 'isCollapsed'],
};

/* list of minimum required fields for a given edge type */
EDGE_TYPES = {
  'parent_child': ['sourceID', 'targetID'],
  'merged': ['sourceID', 'targetID'],
  'graph_link': ['sharedNodeID', 'userNodeID'],
};

Graph = function(prompt, group, user) {
  /********************************************************************
  * Graph constructor
  *
  * @return {object} Graph object 
  ********************************************************************/
  this.promptID = prompt._id;
  this.groupID = group._id;
  if (user) {
    this.userID = user._id;
  } else {
    this.userID = null;
  }
  this.nodeIDs = [];
  this.edgeIDs = [];

};

GraphNode = function(graph, type, data) {
  /********************************************************************
  * GraphNode constructor
  *
  * @params
  *   graph - the parent graph of this edge
  *   type - a string that matches a field in the NODE_TYPES enum
  *   data(optional) - a key-value object of additional metadata 
  *       to store as key-value pairs for the edge.
  *
  * @return {object} GraphNode object 
  ********************************************************************/
  this.graphID = graph._id;
  this.type = type;
  if (data) {
    // Add metadata fields if any are given
    var fields = Object.keys(data);
    for (var i=0; i<fields.length; i++) {
      this[fields[i]] = data[fields[i]];
    }
  }
};

GraphEdge = function(type, source, target, data) {
  /********************************************************************
  * GraphEdge constructor
  *
  * @params
  *   graph - the parent graph of this edge
  *   source - the source node of the edge
  *   target - the destination node of the edge
  *   data(optional) - a key-value object of additional metadata 
  *       to store as key-value pairs for the edge.
  *
  * @return {object} GraphEdge object 
  ********************************************************************/
//  this.graphID = graph._id;
  this.type = type;
  this.sourceID = source._id;
  this.targetID = target._id;
  this.nodeIDs = [source._id, target._id];
  if (data) {
    var fields = Object.keys(data);
    for (var i=0; i<fields.length; i++) {
      this[fields[i]] = data[fields[i]];
    }
  }

};


getNodeChildren = function (parent) {
  var edges = Edges.find({type: 'parent_child',
    nodeIDs: parent._id
  });
  var childIDs = [];
  edges.forEach(function(edge) {
    childIDs.push(edge.childID);
  });
  return Nodes.find({_id: {$in: childIDs}});
};
