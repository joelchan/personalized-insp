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

NODE_TYPES = {
  'ideas': ['content', 'time'],
  'theme': ['name', 'time', 'isTrash', 'isMerged'],
};

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
  *   metadata(optional) - a key-value object of additional metadata 
  *       to store as key-value pairs for the edge.
  *
  * @return {object} GraphNode object 
  ********************************************************************/
  this.graphID = graph._id;
  if (data) {
    // Add metadata fields if any are given
    var fields = data.fields;
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
  *   metadata(optional) - a key-value object of additional metadata 
  *       to store as key-value pairs for the edge.
  *
  * @return {object} GraphEdge object 
  ********************************************************************/
  this.graphID = graph._id;
  this.sourceID = source._id;
  this.targetID = target._id;
  if (data) {
    var fields = data.fields;
    for (var i=0; i<fields.length; i++) {
      this[fields[i]] = data[fields[i]];
    }
  }

}
