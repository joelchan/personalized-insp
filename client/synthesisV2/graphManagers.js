// Configure logger for Filters
var logger = new Logger('Client:SynthesisV2:GraphManagers');
// Comment out to use global logging level
Logger.setLevel('Client:SynthesisV2:GraphManagers', 'trace');
//Logger.setLevel('Client:SynthesisV2:GraphManagers', 'debug');
//Logger.setLevel('Client:SynthesisV2:GraphManagers', 'info');
//Logger.setLevel('Client:SynthesisV2:GraphManagers', 'warn');


Meteor.methods({
  /****************************************************************
   * Graph management functions
   * *************************************************************/
  graphCreate: function(prompt, group, user) {
    logger.trace("Creating new temp graph on client");
    var graph = new Graph(prompt, group, user);
    graph._id = Graphs.insert(graph);
    return Graph;
  },
  graphCreateNode: function(graph, metadata) {
    /*************************************************************
     * Client stub for temporary graph node
     * **********************************************************/
    logger.debug("Creating new Graph Node on client");
    return "node";

  },

});
