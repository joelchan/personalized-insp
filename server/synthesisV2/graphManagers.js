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
  graphCreateNode: function(graph, metadata) {
    /*************************************************************
     * Create a graph
     * **********************************************************/
    logger.debug("Creating new Graph Node");
    var node = new GraphNode(graph, metadata);
    node._id = Nodes.insert(node);
    return node;
  },
  graphCreateEdge: function(graph, source, target, metadata) {
    logger.debug("Creating new Graph edge");
    var edge = new GraphNode(graph, source, target, metadata);
    edge._id = Edges.insert(edge);
    return edge;
  },
    
});
