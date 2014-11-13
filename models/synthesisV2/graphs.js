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

Graph = function() {
  /********************************************************************
  * Graph constructor
  *
  * @return {object} Graph object 
  ********************************************************************/
  this.type;
  this.nodeIDs = [];
  this.edgeIDs = [];

};

GraphNode = function(graph, metadata) {
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
  if (metadata) {
    // Add metadata fields if any are given
    var fields = metadata.fields;
    for (var i=0; i<fields.length; i++) {
      this[fields[i]] = metadata[fields[i]];
    }
  }

};

GraphEdge = function(graph, source, target, metadata) {
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
  if (metadata) {
    var fields = metadata.fields;
    for (var i=0; i<fields.length; i++) {
      this[fields[i]] = metadata[fields[i]];
    }
  }

}
